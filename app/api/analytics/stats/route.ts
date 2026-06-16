import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

function parseUserAgent(ua: string) {
  const uaLower = ua.toLowerCase();
  if (uaLower.includes("tablet") || uaLower.includes("ipad") || (uaLower.includes("android") && !uaLower.includes("mobile"))) return "Tablet";
  if (uaLower.includes("mobile") || uaLower.includes("android") || uaLower.includes("iphone")) return "Mobile";
  return "Desktop";
}

/** Utility function to shift a Date to User's Timezone for safe UTC extraction */
function shiftToUserTime(d: Date, userOffsetMinutes: number): Date {
  return new Date(d.getTime() - userOffsetMinutes * 60000);
}

/** Buat date key "YYYY-MM-DD" dari Date object secara konsisten (User Time) */
function toDateKey(d: Date, userOffsetMinutes: number): string {
  const userTime = shiftToUserTime(d, userOffsetMinutes);
  const yyyy = userTime.getUTCFullYear();
  const mm = String(userTime.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(userTime.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Format label tampil: DD Mon (id-ID) (User Time) */
function toDisplayLabel(d: Date, userOffsetMinutes: number, showWeekday = false): string {
  const userTime = shiftToUserTime(d, userOffsetMinutes);
  const dateStr = userTime.toUTCString(); 
  const parts = dateStr.split(' ');
  const dayName = parts[0].replace(',', '');
  const day = parts[1];
  const month = parts[2];
  
  if (showWeekday) {
    return `${dayName}, ${day}`;
  }
  return `${day} ${month}`;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const range = req.nextUrl.searchParams.get("range") || "7d";

    const now = new Date();
    const tzOffsetStr = req.nextUrl.searchParams.get("tzOffset");
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

    return NextResponse.json({
      stats: {
        totalViews,
        uniqueVisitors,
        avgTime: avgTimeStr,
        bounceRate: `${bounceRatePct}%`,
        devices,
      },
      todayStats: {
        avgTime: todayAvgTimeStr,
        bounceRate: `${todayBounceRatePct}%`,
      },
      chartData,
      sources,
    });
  } catch (error) {
    console.error("Analytics Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

