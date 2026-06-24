import { NextRequest } from "next/server";
import prisma from "@/shared/lib/prisma";
import { redis } from "@/shared/lib/redis";
import { headers } from "next/headers";

let geoip: any = null;
try {
  geoip = require("geoip-lite");
} catch (e) {
  console.warn("[Analytics Server] geoip-lite running in offline fallback mode (local IP database not found).");
}

function parseUserAgent(ua: string) {
  const uaLower = ua.toLowerCase();
  let deviceType = "Desktop";
  if (uaLower.includes("tablet") || uaLower.includes("ipad") || (uaLower.includes("android") && !uaLower.includes("mobile"))) deviceType = "Tablet";
  else if (uaLower.includes("mobile") || uaLower.includes("android") || uaLower.includes("iphone")) deviceType = "Mobile";

  let os = "Unknown";
  if (uaLower.includes("win")) os = "Windows";
  else if (uaLower.includes("mac")) os = "MacOS";
  else if (uaLower.includes("x11") || uaLower.includes("linux")) os = "Linux";
  else if (uaLower.includes("android")) os = "Android";
  else if (uaLower.includes("iphone") || uaLower.includes("ipad")) os = "iOS";

  let browser = "Unknown";
  if (uaLower.includes("chrome") && !uaLower.includes("edg") && !uaLower.includes("opr")) browser = "Chrome";
  else if (uaLower.includes("safari") && !uaLower.includes("chrome")) browser = "Safari";
  else if (uaLower.includes("firefox")) browser = "Firefox";
  else if (uaLower.includes("edg")) browser = "Edge";
  else if (uaLower.includes("opr")) browser = "Opera";
  else if (uaLower.includes("instagram")) browser = "Instagram App";

  return { deviceType, os, browser };
}

function shiftToUserTime(d: Date, userOffsetMinutes: number): Date {
  return new Date(d.getTime() - userOffsetMinutes * 60000);
}

function toDateKey(d: Date, userOffsetMinutes: number): string {
  const userTime = shiftToUserTime(d, userOffsetMinutes);
  const yyyy = userTime.getUTCFullYear();
  const mm = String(userTime.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(userTime.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toDisplayLabel(d: Date, userOffsetMinutes: number, showWeekday = false): string {
  const userTime = shiftToUserTime(d, userOffsetMinutes);
  const dateStr = userTime.toUTCString(); 
  const parts = dateStr.split(" ");
  const dayName = parts[0].replace(",", "");
  const day = parts[1];
  const month = parts[2];
  if (showWeekday) return `${dayName}, ${day}`;
  return `${day} ${month}`;
}

export async function trackAnalytics(req: Request) {
  let body: any = {};
  try {
    const text = await req.text();
    body = JSON.parse(text);
  } catch {
    throw new Error("400:Invalid body");
  }
  
  const { subdomain, type, pagePath, url, analyticsId, sessionId, referrer: clientReferrer, action, targetId, metadata } = body;

  if (type === "HEARTBEAT" && analyticsId) {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ip = realIp || (forwardedFor ? forwardedFor.split(",").map(i => i.trim()).pop() : "unknown") || "unknown";

    if (subdomain && ip !== "unknown") await redis.set(`live_visitor:${subdomain.toLowerCase().trim()}:${ip}`, "1", "EX", 60);

    const throttleKey = `throttle_heartbeat:${analyticsId}`;
    const isThrottled = await redis.get(throttleKey);
    
    if (!isThrottled) {
      const log = await prisma.analytics.findUnique({ where: { id: analyticsId }, select: { createdAt: true, sessionId: true } });
      if (log) {
        const logDuration = Math.floor((new Date().getTime() - new Date(log.createdAt).getTime()) / 1000);
        await prisma.analytics.update({ where: { id: analyticsId }, data: { duration: logDuration } });

        if (log.sessionId) {
          const sessionLog = await prisma.visitorSession.findUnique({ where: { id: log.sessionId }, select: { createdAt: true } });
          if (sessionLog) {
            const sessionDuration = Math.floor((new Date().getTime() - new Date(sessionLog.createdAt).getTime()) / 1000);
            await prisma.visitorSession.update({ where: { id: log.sessionId }, data: { duration: sessionDuration, isBounced: sessionDuration < 10 } });
          }
        }
      }
      await redis.set(throttleKey, "1", "EX", 60);
    }
    return { success: true };
  }

  if (!subdomain || typeof subdomain !== "string") throw new Error("400:Subdomain is required");

  const profileCacheKey = `mapping:subdomain:${subdomain.toLowerCase().trim()}`;
  let profileData: any = null;
  try {
    const cachedProfile = await redis.get(profileCacheKey);
    if (cachedProfile) profileData = JSON.parse(cachedProfile);
  } catch (e) {}

  if (!profileData) {
    const profile = await prisma.profile.findUnique({ where: { subdomain: subdomain.toLowerCase().trim() }, select: { userId: true, user: { select: { isLive: true } } } });
    if (profile) {
      profileData = profile;
      await redis.set(profileCacheKey, JSON.stringify(profileData), "EX", 3600);
    }
  }

  if (!profileData) throw new Error("404:Portfolio not found");
  if (!profileData.user.isLive) return { success: false };

  const userId = profileData.userId;
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  let ip = "unknown";
  if (realIp) ip = realIp;
  else if (forwardedFor) ip = forwardedFor.split(",").map(i => i.trim()).pop() || "unknown";

  let country = headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry") || null;
  let city = headersList.get("x-vercel-ip-city") || headersList.get("cf-ipcity") || null;

  if (geoip && !country && ip && ip !== "unknown" && ip !== "127.0.0.1" && ip !== "::1") {
    try {
      const geo = geoip.lookup(ip);
      if (geo) { country = geo.country || null; city = geo.city || null; }
    } catch (err) {}
  }

  const userAgent = headersList.get("user-agent") || "unknown";
  const { deviceType, os, browser } = parseUserAgent(userAgent);

  const trackTypes = ["VIEW", "CLICK", "PROJECT_OPEN"];
  if (trackTypes.includes(type) || !type) {
    const rateLimitKey = `rate_limit:analytics:${userId}:${ip}`;
    try {
      const requestCount = await redis.incr(rateLimitKey);
      if (requestCount === 1) await redis.expire(rateLimitKey, 60);
      if (requestCount > 15) throw new Error("429:Too many requests");
    } catch (e) {}
  }

  let finalReferrer = "Direct";
  const isValidReferrer = (ref: string | null) => {
    if (!ref || ref === "") return false;
    const r = ref.toLowerCase();
    if (r.includes("portfo.be") || r.includes("localhost")) return false;
    return true;
  };

  if (isValidReferrer(clientReferrer)) finalReferrer = clientReferrer;
  else if (isValidReferrer(headersList.get("referer"))) finalReferrer = headersList.get("referer")!;

  let source = finalReferrer;
  let utmSource = null, utmMedium = null, utmCampaign = null;

  if (url) {
    try {
      const urlObj = new URL(url);
      utmSource = urlObj.searchParams.get("utm_source");
      utmMedium = urlObj.searchParams.get("utm_medium");
      utmCampaign = urlObj.searchParams.get("utm_campaign");

      if (urlObj.searchParams.has("igsh") || urlObj.searchParams.has("igshid")) source = "Instagram";
      else if (urlObj.searchParams.has("fbclid")) source = "Facebook";
      else if (urlObj.searchParams.has("gclid")) source = "Google";
      else if (urlObj.searchParams.has("twclid") || utmSource === "twitter") source = "Twitter / X";
    } catch (_) {}
  }

  if (source === "Direct") {
    const ua = userAgent.toLowerCase();
    if (ua.includes("instagram")) source = "Instagram";
    else if (ua.includes("fban") || ua.includes("fbav") || ua.includes("facebook")) source = "Facebook";
    else if (ua.includes("whatsapp")) source = "WhatsApp";
    else if (ua.includes("twitter")) source = "Twitter / X";
    else if (ua.includes("tiktok")) source = "TikTok";
  }

  let dbSessionId = null;
  if (sessionId) {
    const sessionCacheKey = `session:${userId}:${sessionId}`;
    let sessionRecord: any = null;

    try {
      const cachedSession = await redis.get(sessionCacheKey);
      if (cachedSession) sessionRecord = { id: cachedSession };
    } catch (e) {}

    if (!sessionRecord) {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      sessionRecord = await prisma.visitorSession.findFirst({
        where: { visitorId: sessionId, userId, createdAt: { gte: twoHoursAgo } },
        orderBy: { createdAt: "desc" }
      });
      if (sessionRecord) await redis.set(sessionCacheKey, sessionRecord.id, "EX", 7200);
    }

    if (!sessionRecord) {
      sessionRecord = await prisma.visitorSession.create({
        data: { userId, visitorId: sessionId, referrer: finalReferrer, source, country, city, deviceType, os, browser, ipAddress: ip, utmSource, utmMedium, utmCampaign }
      });
      await redis.set(sessionCacheKey, sessionRecord.id, "EX", 7200);
    } else if (type !== "VIEW") {
      await prisma.visitorSession.update({ where: { id: sessionRecord.id }, data: { isBounced: false } });
    }

    dbSessionId = sessionRecord.id;
  }

  const newLog = await prisma.analytics.create({
    data: { userId, sessionId: dbSessionId, type: type || "VIEW", action, targetId, metadata: metadata ? JSON.stringify(metadata) : undefined, ipAddress: ip, userAgent, referrer: finalReferrer, pagePath: pagePath || "/", country, city, deviceType, os, browser, utmSource, utmMedium, utmCampaign }
  });

  return { success: true, id: newLog.id };
}


export async function getAnalyticsStats(userId: string, range: string = "7d", tzOffsetStr: string | null = null) {

    

    const now = new Date();
    
    const userOffsetMinutes = tzOffsetStr ? parseInt(tzOffsetStr) : now.getTimezoneOffset();

    // Awal hari ini berdasarkan WAKTU LOKAL USER
    const userNow = shiftToUserTime(now, userOffsetMinutes);
    userNow.setUTCHours(0, 0, 0, 0);
    const startOfToday = new Date(userNow.getTime() + userOffsetMinutes * 60000);

    // ── 1. Tentukan startDate berdasarkan range ────────────────────────────
    let startDate: Date;

    if (range === "1d") {
      startDate = new Date(startOfToday); // mulai dari tengah malam hari ini
    } else if (range === "7d") {
      startDate = new Date(startOfToday);
      startDate.setUTCDate(startDate.getUTCDate() - 6); // 7 hari termasuk hari ini
    } else if (range === "30d") {
      startDate = new Date(startOfToday);
      startDate.setUTCDate(startDate.getUTCDate() - 29); // 30 hari termasuk hari ini
    } else {
      // "all" — akan ditentukan dari data aktual di bawah
      startDate = new Date(startOfToday);
      startDate.setUTCDate(startDate.getUTCDate() - 29); // default fallback
    }

    // ── 2. Untuk "all", cari tanggal DailyStats paling awal ──────────────
    if (range === "all") {
      const earliest = await prisma.dailyStats.findFirst({
        where: { userId },
        orderBy: { date: "asc" },
        select: { date: true },
      });
      if (earliest) {
        const userEarliest = shiftToUserTime(new Date(earliest.date), userOffsetMinutes);
        userEarliest.setUTCHours(0, 0, 0, 0);
        startDate = new Date(userEarliest.getTime() + userOffsetMinutes * 60000);
      }
    }

    // ── 3. Ambil DailyStats (tidak termasuk hari ini karena masih berjalan) ─
    const historicalStats = await prisma.dailyStats.findMany({
      where: {
        userId,
        date: { gte: startDate, lt: startOfToday },
      },
      orderBy: { date: "asc" },
    });

    // ── 4. AGREGASI LANGSUNG DARI DB (Mencegah Memory Bloat OOM) ────────────

    // a. Total Views (Historical + Today)
    const historicalViews = historicalStats.reduce((s, d) => s + d.views, 0);
    const todayViewsCount = await prisma.analytics.count({
      where: { userId, createdAt: { gte: startOfToday }, type: "VIEW" }
    });
    const totalViews = historicalViews + todayViewsCount;

    // b. Unique Visitors (Today's unique IPs + Historical sessions)
    const todayUniqueIPsResult: any = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT ipAddress) as count 
      FROM Analytics 
      WHERE userId = ${userId} 
        AND createdAt >= ${startOfToday} 
        AND type = 'VIEW'
    `;
    const todayUniqueIPsCount = Number(todayUniqueIPsResult[0]?.count || 0);

    const historicalSessionCount = await prisma.visitorSession.count({
      where: {
        userId,
        createdAt: { gte: startDate, lt: startOfToday }
      }
    });

    // Cari session tertua untuk mengevaluasi apakah ada data sebelum retention 30 hari
    const oldestSession = await prisma.visitorSession.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true }
    });

    let estimatedHistoric = 0;
    if (oldestSession && startDate < oldestSession.createdAt) {
      const olderStats = await prisma.dailyStats.findMany({
        where: {
          userId,
          date: { gte: startDate, lt: oldestSession.createdAt }
        },
        select: { views: true }
      });
      const olderViews = olderStats.reduce((s, d) => s + d.views, 0);
      estimatedHistoric = Math.round(olderViews * 0.7);
    } else if (!oldestSession) {
      estimatedHistoric = Math.round(historicalViews * 0.7);
    }

    const uniqueVisitors = todayUniqueIPsCount + historicalSessionCount + estimatedHistoric;

    // c. Avg Time (Menggunakan data VisitorSession yang bertahan 30 hari)
    const avgDurationObj = await prisma.visitorSession.aggregate({
      where: { 
        userId, 
        createdAt: { gte: startDate }, 
        duration: { gt: 0 } 
      },
      _avg: { duration: true }
    });
    const avgSec = Math.round(avgDurationObj._avg.duration || 0);
    const avgTimeStr = avgSec >= 60 ? `${Math.floor(avgSec / 60)}m ${avgSec % 60}s` : `${avgSec}s`;

    // d. Bounce Rate (Kunjungan dengan isBounced: true dari VisitorSession)
    const totalSessions = await prisma.visitorSession.count({
      where: { userId, createdAt: { gte: startDate } }
    });
    const bouncedSessions = await prisma.visitorSession.count({
      where: { userId, createdAt: { gte: startDate }, isBounced: true }
    });
    const bounceRatePct = totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0;

    // e. Devices (Historical DailyDeviceStats + Today's Analytics)
    const historicalDeviceStats = await prisma.dailyDeviceStats.findMany({
      where: {
        userId,
        date: { gte: startDate, lt: startOfToday }
      },
      select: { deviceType: true, views: true }
    });

    const todayDeviceLogs = await prisma.analytics.findMany({
      where: {
        userId,
        createdAt: { gte: startOfToday },
        type: "VIEW"
      },
      select: { userAgent: true, deviceType: true }
    });

    let desktop = 0, mobile = 0, tablet = 0;

    historicalDeviceStats.forEach(stat => {
      if (stat.deviceType === "Mobile") mobile += stat.views;
      else if (stat.deviceType === "Tablet") tablet += stat.views;
      else desktop += stat.views;
    });

    todayDeviceLogs.forEach(l => {
      const dev = l.deviceType || parseUserAgent(l.userAgent || "");
      if (dev === "Mobile") mobile++;
      else if (dev === "Tablet") tablet++;
      else desktop++;
    });

    const totalDevices = desktop + mobile + tablet || 1;
    const devices = {
      desktop: Math.round((desktop / totalDevices) * 100),
      mobile: Math.round((mobile / totalDevices) * 100),
      tablet: Math.round((tablet / totalDevices) * 100),
    };

    // f. Traffic Sources (Historical DailyReferrerStats + Today's Analytics)
    const historicalReferrerStats = await prisma.dailyReferrerStats.findMany({
      where: {
        userId,
        date: { gte: startDate, lt: startOfToday }
      },
      select: { referrer: true, views: true }
    });

    const todayReferrerGroups = await prisma.analytics.groupBy({
      by: ['referrer'],
      where: {
        userId,
        createdAt: { gte: startOfToday },
        type: "VIEW"
      },
      _count: { _all: true }
    });

    const sourcesMap: Record<string, number> = {};

    historicalReferrerStats.forEach(stat => {
      const ref = stat.referrer;
      sourcesMap[ref] = (sourcesMap[ref] || 0) + stat.views;
    });

    todayReferrerGroups.forEach((g) => {
      let ref = "Direct";
      if (g.referrer && g.referrer !== "Direct") {
        const r = g.referrer.toLowerCase();
        if (r.includes("portfo.be") || r.includes("localhost")) ref = "Direct";
        else if (r.includes("instagram")) ref = "Instagram";
        else if (r.includes("t.co") || r.includes("twitter")) ref = "Twitter / X";
        else if (r.includes("facebook")) ref = "Facebook";
        else if (r.includes("google")) ref = "Google";
        else if (r.includes("whatsapp") || r.includes("wa.me")) ref = "WhatsApp";
        else if (r.includes("linkedin")) ref = "LinkedIn";
        else if (r.includes("tiktok")) ref = "TikTok";
        else if (r.includes("youtube") || r.includes("youtu.be")) ref = "YouTube";
        else {
          try {
            const host = new URL(g.referrer).hostname.replace("www.", "");
            ref = host.includes("portfo.be") || host.includes("localhost") ? "Direct" : host;
          } catch {
            // tetap Direct
          }
        }
      }
      sourcesMap[ref] = (sourcesMap[ref] || 0) + g._count._all;
    });

    const totalRefViews = Object.values(sourcesMap).reduce((s, v) => s + v, 0);
    const sources = Object.entries(sourcesMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / (totalRefViews || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // ── 8. Geo-Location Aggregation ───────────────────────────────────────────
    const historicalGeoStats = await prisma.dailyLocationStats.findMany({
      where: {
        userId,
        date: { gte: startDate, lt: startOfToday }
      },
      select: { country: true, city: true, views: true }
    });

    const todayGeoLogs = await prisma.analytics.groupBy({
      by: ['country', 'city'],
      where: {
        userId,
        createdAt: { gte: startOfToday },
        type: "VIEW"
      },
      _count: { _all: true }
    });

    const countryMap: Record<string, number> = {};
    const cityMap: Record<string, number> = {};

    historicalGeoStats.forEach(stat => {
      const countryName = stat.country || "Unknown";
      const cityName = stat.city || "Unknown";
      countryMap[countryName] = (countryMap[countryName] || 0) + stat.views;
      cityMap[cityName] = (cityMap[cityName] || 0) + stat.views;
    });

    todayGeoLogs.forEach(g => {
      const countryName = g.country || "Unknown";
      const cityName = g.city || "Unknown";
      const count = g._count._all;
      countryMap[countryName] = (countryMap[countryName] || 0) + count;
      cityMap[cityName] = (cityMap[cityName] || 0) + count;
    });

    const totalGeoViews = Object.values(countryMap).reduce((s, v) => s + v, 0) || 1;

    const countries = Object.entries(countryMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalGeoViews) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const cities = Object.entries(cityMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalGeoViews) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // ── 8.5 Top Projects Aggregation (Project Popularity) ──────────────────────
    const projectClicks = await prisma.analytics.groupBy({
      by: ['targetId'],
      where: {
        userId,
        createdAt: { gte: startDate },
        type: "PROJECT_CLICK",
        targetId: { not: null }
      },
      _count: { _all: true }
    });

    const targetProjectIds = projectClicks
      .map(p => p.targetId)
      .filter((id): id is string => typeof id === "string");

    const projectsData = await prisma.project.findMany({
      where: { 
        id: { in: targetProjectIds },
        deletedAt: null
      },
      select: { id: true, title: true }
    });

    const projectTitleMap = new Map<string, string>();
    projectsData.forEach(p => projectTitleMap.set(p.id, p.title));

    const topProjectsRaw = projectClicks
      .filter(p => projectTitleMap.has(p.targetId as string))
      .map(p => {
        const title = projectTitleMap.get(p.targetId as string)!;
        return {
          id: p.targetId,
          title,
          count: p._count._all
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const totalProjectClicks = topProjectsRaw.reduce((s, p) => s + p.count, 0) || 1;
    const topProjects = topProjectsRaw.map(p => ({
      ...p,
      percentage: Math.round((p.count / totalProjectClicks) * 100)
    }));

    // Ambil link sosmed aktif milik user
    const activeLinks = await prisma.link.findMany({
      where: { userId, isActive: true },
      select: { platform: true }
    });
    const activePlatforms = new Set(activeLinks.map(l => l.platform.toLowerCase()));

    // ── 8.6 Sosial Media & Kontak Clicks Aggregation ──────────────────────────
    const socialAndContactLogs = await prisma.analytics.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
        type: { in: ["SOCIAL_CLICK", "CONTACT_CLICK"] }
      },
      select: { type: true, metadata: true }
    });

    const socialClicksMap: Record<string, number> = {};
    const contactClicksMap: Record<string, number> = {};

    socialAndContactLogs.forEach(log => {
      if (!log.metadata) return;
      try {
        let meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata;
        if (typeof meta === 'string') {
          meta = JSON.parse(meta);
        }
        if (log.type === "SOCIAL_CLICK" && meta && meta.platform) {
          const platLower = meta.platform.toLowerCase();
          const isExternal = platLower === "external link";
          const isTwitterX = platLower.includes("twitter") || platLower.includes("x");
          const hasTwitterXActive = Array.from(activePlatforms).some(p => p.includes("twitter") || p === "x");
          
          const isMatch = isExternal || activePlatforms.has(platLower) || (isTwitterX && hasTwitterXActive);

          if (isMatch) {
            socialClicksMap[meta.platform] = (socialClicksMap[meta.platform] || 0) + 1;
          }
        } else if (log.type === "CONTACT_CLICK" && meta && meta.platform) {
          if (meta.platform === "WhatsApp" && !activePlatforms.has("whatsapp")) {
            return;
          }
          contactClicksMap[meta.platform] = (contactClicksMap[meta.platform] || 0) + 1;
        }
      } catch (e) {
        // Ignore parse error
      }
    });

    const totalSocialClicks = Object.values(socialClicksMap).reduce((s, v) => s + v, 0) || 1;
    const socialStats = Object.entries(socialClicksMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalSocialClicks) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    const totalContactClicks = Object.values(contactClicksMap).reduce((s, v) => s + v, 0) || 1;
    const contactStats = Object.entries(contactClicksMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalContactClicks) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // ── 9. Chart Data ─────────────────────────────────────────────────────────
    let chartData: { day: string; date: string; views: number; visitors: number }[];

    if (range === "1d") {
      const hourlyMap: Record<number, number> = {};
      const hourlyIpMap: Record<number, Set<string>> = {};
      
      const todayLogs = await prisma.analytics.findMany({
        where: { userId, createdAt: { gte: startOfToday }, type: "VIEW" },
        select: { createdAt: true, ipAddress: true }
      });

      todayLogs.forEach((l) => {
        const userLogTime = shiftToUserTime(l.createdAt, userOffsetMinutes);
        const hour = userLogTime.getUTCHours();
        hourlyMap[hour] = (hourlyMap[hour] || 0) + 1;
        if (!hourlyIpMap[hour]) hourlyIpMap[hour] = new Set();
        if (l.ipAddress) hourlyIpMap[hour].add(l.ipAddress);
      });

      const userCurrentTime = shiftToUserTime(now, userOffsetMinutes);
      const currentHour = userCurrentTime.getUTCHours();
      chartData = Array.from({ length: currentHour + 1 }, (_, h) => ({
        day: `${h.toString().padStart(2, "0")}:00`,
        date: `${toDateKey(startOfToday, userOffsetMinutes)}-h${h}`,
        views: hourlyMap[h] || 0,
        visitors: hourlyIpMap[h] ? hourlyIpMap[h].size : 0,
      }));
    } else {
      const dailyViewsMap: Record<string, number> = {};
      const dailyVisitorsMap: Record<string, number> = {};

      // Ringkasan Views dari DailyStats
      historicalStats.forEach((stat) => {
        const key = toDateKey(stat.date, userOffsetMinutes);
        dailyViewsMap[key] = (dailyViewsMap[key] || 0) + stat.views;
      });

      // Views Hari Ini dari Analytics
      const todayViews = await prisma.analytics.count({
        where: { userId, createdAt: { gte: startOfToday }, type: "VIEW" }
      });
      const todayKey = toDateKey(startOfToday, userOffsetMinutes);
      dailyViewsMap[todayKey] = (dailyViewsMap[todayKey] || 0) + todayViews;

      // Visitors Hari Ini dari Analytics (Unique IPs)
      const todayUniqueIPsResult: any = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT ipAddress) as count 
        FROM Analytics 
        WHERE userId = ${userId} 
          AND createdAt >= ${startOfToday} 
          AND type = 'VIEW'
      `;
      dailyVisitorsMap[todayKey] = Number(todayUniqueIPsResult[0]?.count || 0);

      // Visitors Historis dari VisitorSession (30 hari terakhir)
      const historicalSessions = await prisma.visitorSession.findMany({
        where: {
          userId,
          createdAt: { gte: startDate, lt: startOfToday }
        },
        select: { createdAt: true }
      });

      historicalSessions.forEach((sess) => {
        const key = toDateKey(sess.createdAt, userOffsetMinutes);
        dailyVisitorsMap[key] = (dailyVisitorsMap[key] || 0) + 1;
      });

      chartData = [];
      const cursor = new Date(startDate);
      const endDay = new Date(startOfToday);
      let count = 0;

      while (cursor <= endDay && count < 90) {
        const key = toDateKey(cursor, userOffsetMinutes);
        const views = dailyViewsMap[key] || 0;
        
        let visitors = dailyVisitorsMap[key] || 0;
        // Jika data VisitorSession sudah terhapus (> 30 hari), estimasikan unique visitors
        if (visitors === 0 && views > 0 && cursor < startOfToday) {
          visitors = Math.round(views * 0.7);
        }

        chartData.push({
          day: toDisplayLabel(cursor, userOffsetMinutes, range === "7d"),
          date: key,
          views,
          visitors,
        });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
        count++;
      }
    }

    // ── 10. Hitung "Today Only" Stats (Khusus untuk card 'Hari Ini' di Dashboard) ──
    const todayAvgObj = await prisma.analytics.aggregate({
      where: { userId, createdAt: { gte: startOfToday }, duration: { gt: 0 } },
      _avg: { duration: true }
    });
    const todayAvgSec = Math.round(todayAvgObj._avg.duration || 0);
    const todayAvgTimeStr = todayAvgSec >= 60 ? `${Math.floor(todayAvgSec / 60)}m ${todayAvgSec % 60}s` : `${todayAvgSec}s`;

    const todayAllEvents = await prisma.analytics.count({
      where: { userId, createdAt: { gte: startOfToday }, type: { in: ['VIEW', 'CLICK', 'PROJECT_OPEN'] } }
    });
    const todayBouncedViews = await prisma.analytics.count({
      where: { userId, createdAt: { gte: startOfToday }, duration: { lt: 10 } }
    });
    const todayBounceRatePct = todayAllEvents > 0 ? Math.round((todayBouncedViews / todayAllEvents) * 100) : 0;

    const galleryClicks = await prisma.analytics.count({
      where: {
        userId,
        createdAt: { gte: startDate },
        type: "GALLERY_CLICK"
      }
    });

    // Hitung Returning Visitors Rate (RVR)
    const periodViews = await prisma.analytics.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
        type: "VIEW",
        ipAddress: { not: null }
      },
      select: { ipAddress: true }
    });

    const uniqueIpsInPeriod = Array.from(new Set(periodViews.map(v => v.ipAddress).filter(Boolean))) as string[];
    const totalUniquePeriod = uniqueIpsInPeriod.length;

    let returningCount = 0;
    if (totalUniquePeriod > 0) {
      const olderLogs = await prisma.analytics.findMany({
        where: {
          userId,
          createdAt: { lt: startDate },
          type: "VIEW",
          ipAddress: { in: uniqueIpsInPeriod }
        },
        select: { ipAddress: true }
      });
      const olderIps = new Set(olderLogs.map(l => l.ipAddress).filter(Boolean));
      returningCount = olderIps.size;
    }

    const returningRate = totalUniquePeriod > 0 ? Math.round((returningCount / totalUniquePeriod) * 100) : 0;

    return ({
      stats: {
        totalViews,
        uniqueVisitors,
        avgTime: avgTimeStr,
        bounceRate: `${bounceRatePct}%`,
        devices,
        returningRate: `${returningRate}%`
      },
      todayStats: {
        avgTime: todayAvgTimeStr,
        bounceRate: `${todayBounceRatePct}%`,
      },
      chartData,
      sources,
      geo: {
        countries,
        cities,
      },
      topProjects,
      socialStats,
      contactStats,
      galleryClicks
    });
}
