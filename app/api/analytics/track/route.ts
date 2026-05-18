import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

function parseUserAgent(ua: string) {
  const uaLower = ua.toLowerCase();
  
  let deviceType = "Desktop";
  if (uaLower.includes("mobile") || uaLower.includes("android") || uaLower.includes("iphone")) {
    deviceType = "Mobile";
  } else if (uaLower.includes("tablet") || uaLower.includes("ipad")) {
    deviceType = "Tablet";
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
    
    // action, targetId, metadata added for custom tracking (clicks, etc.)
    const { userId, type, pagePath, url, analyticsId, sessionId, referrer: clientReferrer, action, targetId, metadata } = body;

    // 1. LOGIKA HEARTBEAT (Update durasi session & log)
    if (type === "HEARTBEAT" && analyticsId) {
      const log = await prisma.analytics.findUnique({
        where: { id: analyticsId },
        select: { createdAt: true, sessionId: true } // sessionId ini adalah VisitorSession.id (Database FK)
      });

      if (log) {
        const logDuration = Math.floor((new Date().getTime() - new Date(log.createdAt).getTime()) / 1000);
        
        await prisma.analytics.update({
          where: { id: analyticsId },
          data: { duration: logDuration }
        });

        // Update VisitorSession
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
                isBounced: sessionDuration < 10 ? true : false
              }
            });
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    if (!userId) return NextResponse.json({ error: "UserId is required" }, { status: 400 });

    const headersList = await headers();
    
    // -- Geolocation & IP Extraction --
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    let ip = "unknown";
    if (realIp) ip = realIp;
    else if (forwardedFor) ip = forwardedFor.split(",").map(i => i.trim()).pop() || "unknown";

    const country = headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry") || null;
    const city = headersList.get("x-vercel-ip-city") || headersList.get("cf-ipcity") || null;

    const userAgent = headersList.get("user-agent") || "unknown";
    const { deviceType, os, browser } = parseUserAgent(userAgent);

    // --- RATE LIMITING (ANTI SPAM) ---
    const trackTypes = ["VIEW", "CLICK", "PROJECT_OPEN"];
    if (trackTypes.includes(type) || !type) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const recentViews = await prisma.analytics.count({
        where: { userId, type: type || "VIEW", ipAddress: ip, createdAt: { gte: oneMinuteAgo } }
      });
      if (recentViews >= 15) {
        return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
      }
    }
    
    // -- Referrer & Source Parsing --
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
      } catch (e) {}
    }

    if (source === "Direct") {
      const ua = userAgent.toLowerCase();
      if (ua.includes("instagram")) source = "Instagram";
      else if (ua.includes("fban") || ua.includes("fbav") || ua.includes("facebook")) source = "Facebook";
      else if (ua.includes("whatsapp")) source = "WhatsApp";
      else if (ua.includes("twitter")) source = "Twitter / X";
      else if (ua.includes("tiktok")) source = "TikTok";
    }

    // -- SESSION MANAGEMENT --
    let dbSessionId = null;
    if (sessionId) { // client cookie/localStorage visitor ID
      // Coba cari session aktif berdasarkan visitorId untuk userId ini
      // Hanya cari yang 2 jam terakhir (agar tidak attach ke session bulan lalu)
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      
      let sessionRecord = await prisma.visitorSession.findFirst({
        where: { visitorId: sessionId, userId, createdAt: { gte: twoHoursAgo } },
        orderBy: { createdAt: 'desc' }
      });

      if (!sessionRecord) {
        // Buat sesi baru
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
      } else if (type !== "VIEW") {
        // Jika interaksi (klik/scroll), artinya bukan bounce
        await prisma.visitorSession.update({
          where: { id: sessionRecord.id },
          data: { isBounced: false }
        });
      }
      
      dbSessionId = sessionRecord.id;
    }

    // -- INSERT LOG --
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
      },
    });

    return NextResponse.json({ success: true, id: newLog.id });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

