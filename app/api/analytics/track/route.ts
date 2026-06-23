import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redis } from "@/lib/redis";

let geoip: any = null;
try {
  geoip = require("geoip-lite");
} catch (e) {
  console.warn("[Analytics Server] geoip-lite running in offline fallback mode (local IP database not found).");
}

function parseUserAgent(ua: string) {
  const uaLower = ua.toLowerCase();
  
  let deviceType = "Desktop";
  if (uaLower.includes("tablet") || uaLower.includes("ipad") || (uaLower.includes("android") && !uaLower.includes("mobile"))) {
    deviceType = "Tablet";
  } else if (uaLower.includes("mobile") || uaLower.includes("android") || uaLower.includes("iphone")) {
    deviceType = "Mobile";
  }

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

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      const text = await req.text();
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    
    const {
      subdomain,
      type,
      pagePath,
      url,
      analyticsId,
      sessionId,
      referrer: clientReferrer,
      action,
      targetId,
      metadata
    } = body;

    // ── 1. HEARTBEAT (REDIS THROTTLED) ────────
    if (type === "HEARTBEAT" && analyticsId) {
      const headersList = await headers();
      const forwardedFor = headersList.get("x-forwarded-for");
      const realIp = headersList.get("x-real-ip");
      const ip = realIp || (forwardedFor ? forwardedFor.split(",").map(i => i.trim()).pop() : "unknown") || "unknown";

      // 1. Live Visitor Tracking (Redis) - Menyimpan siapa yang sedang online selama 60 detik
      if (subdomain && ip !== "unknown") {
        await redis.set(`live_visitor:${subdomain.toLowerCase().trim()}:${ip}`, '1', 'EX', 60);
      }

      // 2. Throttle DB Writes - Hanya update DB maksimal 1x per menit per session
      const throttleKey = `throttle_heartbeat:${analyticsId}`;
      const isThrottled = await redis.get(throttleKey);
      
      if (!isThrottled) {
        const log = await prisma.analytics.findUnique({
          where: { id: analyticsId },
          select: { createdAt: true, sessionId: true }
        });

        if (log) {
          const logDuration = Math.floor((new Date().getTime() - new Date(log.createdAt).getTime()) / 1000);
          await prisma.analytics.update({
            where: { id: analyticsId },
            data: { duration: logDuration }
          });

          if (log.sessionId) {
            const sessionLog = await prisma.visitorSession.findUnique({
              where: { id: log.sessionId },
              select: { createdAt: true }
            });
            if (sessionLog) {
              const sessionDuration = Math.floor((new Date().getTime() - new Date(sessionLog.createdAt).getTime()) / 1000);
              await prisma.visitorSession.update({
                where: { id: log.sessionId },
                data: {
                  duration: sessionDuration,
                  isBounced: sessionDuration < 10
                }
              });
            }
          }
        }
        await redis.set(throttleKey, '1', 'EX', 60); // Kunci write DB untuk 60 detik berikutnya
      }
      return NextResponse.json({ success: true });
    }

    // ── 2. VALIDASI SUBDOMAIN (REDIS CACHED) ────
    if (!subdomain || typeof subdomain !== "string") {
      return NextResponse.json({ error: "Subdomain is required" }, { status: 400 });
    }

    const profileCacheKey = `mapping:subdomain:${subdomain.toLowerCase().trim()}`;
    let profileData: any = null;

    try {
      const cachedProfile = await redis.get(profileCacheKey);
      if (cachedProfile) {
        profileData = JSON.parse(cachedProfile);
      }
    } catch (e) { console.warn("Redis Get Mapping Error", e); }

    if (!profileData) {
      const profile = await prisma.profile.findUnique({
        where: { subdomain: subdomain.toLowerCase().trim() },
        select: {
          userId: true,
          user: { select: { isLive: true } }
        }
      });
      if (profile) {
        profileData = profile;
        await redis.set(profileCacheKey, JSON.stringify(profileData), 'EX', 3600); // Cache 1 Jam
      }
    }

    if (!profileData) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    if (!profileData.user.isLive) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    const userId = profileData.userId;

    // ── 3. IP & Geolocation ────────────────────────────────────────────────────
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
        if (geo) {
          country = geo.country || null;
          city = geo.city || null;
        }
      } catch (err) {}
    }

    const userAgent = headersList.get("user-agent") || "unknown";
    const { deviceType, os, browser } = parseUserAgent(userAgent);

    // ── 4. RATE LIMITING (REDIS TOKEN BUCKET) ──────────────────────────────────
    const trackTypes = ["VIEW", "CLICK", "PROJECT_OPEN"];
    if (trackTypes.includes(type) || !type) {
      const rateLimitKey = `rate_limit:analytics:${userId}:${ip}`;
      
      try {
        const requestCount = await redis.incr(rateLimitKey);
        if (requestCount === 1) {
          await redis.expire(rateLimitKey, 60); // Jendela waktu 1 Menit
        }

        if (requestCount > 15) {
          return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
        }
      } catch (e) { console.warn("Redis Rate Limit Error", e); }
    }

    // ── 5. Referrer & Source Parsing ───────────────────────────────────────────
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

    // ── 6. SESSION MANAGEMENT (REDIS BACKED) ──────────────────────────────────
    let dbSessionId = null;
    if (sessionId) {
      const sessionCacheKey = `session:${userId}:${sessionId}`;
      let sessionRecord: any = null;

      try {
        const cachedSession = await redis.get(sessionCacheKey);
        if (cachedSession) {
          sessionRecord = { id: cachedSession }; // Hanya butuh ID-nya saja untuk Analytics relation
        }
      } catch (e) {}

      if (!sessionRecord) {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        sessionRecord = await prisma.visitorSession.findFirst({
          where: { visitorId: sessionId, userId, createdAt: { gte: twoHoursAgo } },
          orderBy: { createdAt: "desc" }
        });

        if (sessionRecord) {
          await redis.set(sessionCacheKey, sessionRecord.id, 'EX', 7200); // Simpan 2 Jam
        }
      }

      if (!sessionRecord) {
        sessionRecord = await prisma.visitorSession.create({
          data: {
            userId,
            visitorId: sessionId,
            referrer: finalReferrer,
            source,
            country,
            city,
            deviceType,
            os,
            browser,
            ipAddress: ip,
            utmSource,
            utmMedium,
            utmCampaign
          }
        });
        await redis.set(sessionCacheKey, sessionRecord.id, 'EX', 7200);
      } else if (type !== "VIEW") {
        // Jika visitor berinteraksi (CLICK/PROJECT_OPEN dll), update isBounced
        await prisma.visitorSession.update({
          where: { id: sessionRecord.id },
          data: { isBounced: false }
        });
      }

      dbSessionId = sessionRecord.id;
    }

    // ── 7. INSERT LOG ──────────────────────────────────────────────────────────
    const newLog = await prisma.analytics.create({
      data: {
        userId,
        sessionId: dbSessionId,
        type: type || "VIEW",
        action,
        targetId,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        ipAddress: ip,
        userAgent,
        referrer: finalReferrer,
        pagePath: pagePath || "/",
        country,
        city,
        deviceType,
        os,
        browser,
        utmSource,
        utmMedium,
        utmCampaign
      }
    });

    return NextResponse.json({ success: true, id: newLog.id });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
