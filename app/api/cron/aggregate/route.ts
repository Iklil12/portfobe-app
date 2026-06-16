import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function parseUserAgent(ua: string) {
  const uaLower = ua.toLowerCase();
  if (uaLower.includes("tablet") || uaLower.includes("ipad") || (uaLower.includes("android") && !uaLower.includes("mobile"))) return "Tablet";
  if (uaLower.includes("mobile") || uaLower.includes("android") || uaLower.includes("iphone")) return "Mobile";
  return "Desktop";
}

export async function GET(req: Request) {
  try {
    // 1. Verifikasi Keamanan
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const secret = process.env.CRON_SECRET;

    if (!secret) {
      return NextResponse.json({ error: "Unauthorized: CRON_SECRET not set in server environment" }, { status: 401 });
    }

    if (key !== secret && bearerToken !== secret) {
      return NextResponse.json({ error: "Unauthorized: Key mismatch" }, { status: 401 });
    }

    // 2. Tentukan Tanggal Agregasi (Kemarin)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Ambil semua User ID yang aktif kemarin
    const activeUserIds = await prisma.analytics.findMany({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today
        }
      },
      select: { userId: true },
      distinct: ['userId']
    });

    console.log(`Starting aggregation for ${activeUserIds.length} users...`);

    const results = [];

    // 4. Proses Agregasi per User
    for (const { userId } of activeUserIds) {
      // a. Hitung View & Click Harian
      const views = await prisma.analytics.count({
        where: {
          userId,
          type: 'VIEW',
          createdAt: { gte: yesterday, lt: today }
        }
      });

      const clicks = await prisma.analytics.count({
        where: {
          userId,
          type: { in: ['CLICK', 'PROJECT_OPEN'] },
          createdAt: { gte: yesterday, lt: today }
        }
      });

      // Upsert ke DailyStats
      const stat = await prisma.dailyStats.upsert({
        where: {
          userId_date: {
            userId,
            date: yesterday
          }
        },
        update: { views, clicks },
        create: { userId, date: yesterday, views, clicks }
      });

      // b. Agregasi Perangkat (Device Stats)
      const deviceGroups = await prisma.analytics.groupBy({
        by: ['deviceType', 'userAgent'],
        where: {
          userId,
          type: 'VIEW',
          createdAt: { gte: yesterday, lt: today }
        },
        _count: { _all: true }
      });

      const deviceCountMap: Record<string, number> = {};
      deviceGroups.forEach(g => {
        const dev = g.deviceType || parseUserAgent(g.userAgent || "");
        deviceCountMap[dev] = (deviceCountMap[dev] || 0) + g._count._all;
      });

      for (const [deviceType, count] of Object.entries(deviceCountMap)) {
        await prisma.dailyDeviceStats.upsert({
          where: {
            userId_date_deviceType: {
              userId,
              date: yesterday,
              deviceType
            }
          },
          update: { views: count },
          create: { userId, date: yesterday, deviceType, views: count }
        });
      }

      // c. Agregasi Referrer (Referrer Stats)
      const referrerGroups = await prisma.analytics.groupBy({
        by: ['referrer'],
        where: {
          userId,
          type: 'VIEW',
          createdAt: { gte: yesterday, lt: today }
        },
        _count: { _all: true }
      });

      const referrerCountMap: Record<string, number> = {};
      referrerGroups.forEach(g => {
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
        referrerCountMap[ref] = (referrerCountMap[ref] || 0) + g._count._all;
      });

      for (const [referrer, count] of Object.entries(referrerCountMap)) {
        await prisma.dailyReferrerStats.upsert({
          where: {
            userId_date_referrer: {
              userId,
              date: yesterday,
              referrer
            }
          },
          update: { views: count },
          create: { userId, date: yesterday, referrer, views: count }
        });
      }

      // d. Agregasi Lokasi (Location Stats)
      const locationGroups = await prisma.analytics.groupBy({
        by: ['country', 'city'],
        where: {
          userId,
          type: 'VIEW',
          createdAt: { gte: yesterday, lt: today }
        },
        _count: { _all: true }
      });

      for (const g of locationGroups) {
        const country = g.country || "Unknown";
        const city = g.city || "Unknown";
        const count = g._count._all;

        await prisma.dailyLocationStats.upsert({
          where: {
            userId_date_country_city: {
              userId,
              date: yesterday,
              country,
              city
            }
          },
          update: { views: count },
          create: { userId, date: yesterday, country, city, views: count }
        });
      }

      results.push(stat);
    }

    // 5. AUTO-CLEANUP: Hapus data mentah yang sudah lewat 7 hari
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Hapus log mentah Analytics
    await prisma.analytics.deleteMany({
      where: {
        createdAt: { lt: sevenDaysAgo }
      }
    });

    // Hapus log mentah VisitorSession (30 hari untuk data unique visitors di chart)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await prisma.visitorSession.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo }
      }
    });

    // Hapus log aktivitas Activity (30 hari)
    await prisma.activity.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully aggregated ${activeUserIds.length} users and cleaned up old analytics, visitor session, and activity logs.`,
      count: results.length
    });

  } catch (error) {
    console.error("Aggregation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
