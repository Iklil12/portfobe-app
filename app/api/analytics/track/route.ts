import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // sendBeacon kirim sebagai Blob application/json, tapi kadang text/plain
    // Parsing aman untuk kedua kasus
    let body: any = {};
    try {
      const text = await req.text();
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    const { userId, type, pagePath, url, analyticsId, sessionId, referrer: clientReferrer } = body;

    // 1. LOGIKA HEARTBEAT (Update durasi, sangat ringan)
    if (type === "HEARTBEAT" && analyticsId) {
      // Kita update durasi: Sekarang - Waktu Dibuat
      const log = await prisma.analytics.findUnique({
        where: { id: analyticsId },
        select: { createdAt: true }
      });

      if (log) {
        const duration = Math.floor((new Date().getTime() - new Date(log.createdAt).getTime()) / 1000);
        await prisma.analytics.update({
          where: { id: analyticsId },
          data: { duration }
        });
      }
      return NextResponse.json({ success: true });
    }

    // 2. LOGIKA VIEW BARU (Insert data)
    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const headersList = await headers();
    // Gunakan logika IP yang lebih aman dari spoofing
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    let ip = "unknown";
    if (realIp) {
      ip = realIp;
    } else if (forwardedFor) {
      const ips = forwardedFor.split(",").map(i => i.trim());
      ip = ips[ips.length - 1]; // Ambil IP terakhir dari proxy terluar
    }
    const userAgent = headersList.get("user-agent") || "unknown";

    // --- RATE LIMITING (ANTI SPAM) ---
    // Mencegah penyerang mengirimkan jutaan view/click palsu untuk userId tertentu
    const trackTypes = ["VIEW", "CLICK", "PROJECT_OPEN"];
    if (trackTypes.includes(type) || !type) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const recentViews = await prisma.analytics.count({
        where: {
          userId,
          type: type || "VIEW",
          ipAddress: ip,
          createdAt: { gte: oneMinuteAgo }
        }
      });

      if (recentViews >= 15) {
        console.warn(`[TRACK API] Rate limit hit for IP: ${ip} targeting User: ${userId} Type: ${type}`);
        return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
      }
    }
    // ---------------------------------
    
    // Gunakan document.referrer dari sisi client
    // Jika tidak ada, cek header referer
    // Filter internal domain agar tidak terhitung sebagai source
    let finalReferrer = "Direct";
    
    const isValidReferrer = (ref: string | null) => {
      if (!ref || ref === "") return false;
      const r = ref.toLowerCase();
      if (r.includes("portfo.be") || r.includes("localhost")) return false;
      return true;
    };

    if (isValidReferrer(clientReferrer)) {
      finalReferrer = clientReferrer;
    } else if (isValidReferrer(headersList.get("referer"))) {
      finalReferrer = headersList.get("referer")!;
    }
    
    // Fallback deteksi tingkat lanjut (Advanced Detection)
    // Jika masih "Direct", cek dari User-Agent (In-App Browser) atau URL Parameters
    if (finalReferrer === "Direct") {
      const ua = userAgent.toLowerCase();
      if (ua.includes("instagram")) {
        finalReferrer = "Instagram";
      } else if (ua.includes("fban") || ua.includes("fbav") || ua.includes("facebook")) {
        finalReferrer = "Facebook";
      } else if (ua.includes("whatsapp")) {
        finalReferrer = "WhatsApp";
      } else if (ua.includes("twitter")) {
        finalReferrer = "Twitter / X";
      } else if (ua.includes("tiktok")) {
        finalReferrer = "TikTok";
      } else if (url) {
        // Cek URL parameters (fallback jika dibuka di browser eksternal via link khusus)
        try {
          const urlObj = new URL(url);
          if (urlObj.searchParams.has("igsh") || urlObj.searchParams.has("igshid")) {
            finalReferrer = "Instagram";
          } else if (urlObj.searchParams.has("fbclid")) {
            finalReferrer = "Facebook";
          } else if (urlObj.searchParams.has("gclid")) {
            finalReferrer = "Google";
          } else if (urlObj.searchParams.has("twclid")) {
            finalReferrer = "Twitter / X";
          }
        } catch (e) {
          // Abaikan error parsing URL
        }
      }
    }

    const newLog = await prisma.analytics.create({
      data: {
        userId,
        sessionId: sessionId || null,
        type: type || "VIEW",
        ipAddress: ip,
        userAgent,
        referrer: finalReferrer,
        pagePath: pagePath || "/",
      },
    });

    return NextResponse.json({ success: true, id: newLog.id });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
