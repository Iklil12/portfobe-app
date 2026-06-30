import prisma from "@/shared/lib/prisma";

function parseUserAgent(ua: string) {
  const uaLower = ua.toLowerCase();
  if (uaLower.includes("tablet") || uaLower.includes("ipad") || (uaLower.includes("android") && !uaLower.includes("mobile"))) return "Tablet";
  if (uaLower.includes("mobile") || uaLower.includes("android") || uaLower.includes("iphone")) return "Mobile";
  return "Desktop";
}

export async function aggregateDailyStats(req: Request) {
  try {
    // 2. Tentukan Tanggal Hari Ini (Tengah Malam)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Cari tanggal paling lama yang ada di Analytics (maksimal 7 hari ke belakang)
    const oldestLog = await prisma.analytics.findFirst({
      where: {
        createdAt: { gte: sevenDaysAgo, lt: today }
      },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true }
    });

    if (!oldestLog) {
      console.log("No raw analytics logs to aggregate.");
      return { success: true, message: "No data to aggregate." };
    }

    let currentDate = new Date(oldestLog.createdAt);
    currentDate.setHours(0, 0, 0, 0);

    let totalAggregatedUsers = 0;

    // Loop dari tanggal paling lama (maks H-7) sampai H-1
    while (currentDate < today) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);

      // Ambil user yang aktif pada hari tersebut
      const activeUserIds = await prisma.analytics.findMany({
        where: {
          createdAt: { gte: currentDate, lt: nextDate }
        },
        select: { userId: true },
        distinct: ['userId']
      });

      console.log(`[${currentDate.toISOString().split('T')[0]}] Aggregating ${activeUserIds.length} users...`);

      for (const { userId } of activeUserIds) {
        // a. Hitung View & Click Harian
        const views = await prisma.analytics.count({
          where: {
            userId,
            type: 'VIEW',
            createdAt: { gte: currentDate, lt: nextDate }
          }
        });

        const clicks = await prisma.analytics.count({
          where: {
            userId,
            type: { in: ['CLICK', 'PROJECT_OPEN'] },
            createdAt: { gte: currentDate, lt: nextDate }
          }
        });

        // Upsert ke DailyStats
        await prisma.dailyStats.upsert({
          where: { userId_date: { userId, date: currentDate } },
          update: { views, clicks },
          create: { userId, date: currentDate, views, clicks }
        });

        // b. Agregasi Perangkat
        const deviceGroups = await prisma.analytics.groupBy({
          by: ['deviceType', 'userAgent'],
          where: { userId, type: 'VIEW', createdAt: { gte: currentDate, lt: nextDate } },
          _count: { _all: true }
        });

        const deviceCountMap: Record<string, number> = {};
        deviceGroups.forEach((g: any) => {
          const dev = g.deviceType || parseUserAgent(g.userAgent || "");
          deviceCountMap[dev] = (deviceCountMap[dev] || 0) + g._count._all;
        });

        for (const [deviceType, count] of Object.entries(deviceCountMap)) {
          await prisma.dailyDeviceStats.upsert({
            where: { userId_date_deviceType: { userId, date: currentDate, deviceType } },
            update: { views: count },
            create: { userId, date: currentDate, deviceType, views: count }
          });
        }

        // c. Agregasi Referrer
        const referrerGroups = await prisma.analytics.groupBy({
          by: ['referrer'],
          where: { userId, type: 'VIEW', createdAt: { gte: currentDate, lt: nextDate } },
          _count: { _all: true }
        });

        const referrerCountMap: Record<string, number> = {};
        referrerGroups.forEach((g: any) => {
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
              } catch { }
            }
          }
          referrerCountMap[ref] = (referrerCountMap[ref] || 0) + g._count._all;
        });

        for (const [referrer, count] of Object.entries(referrerCountMap)) {
          await prisma.dailyReferrerStats.upsert({
            where: { userId_date_referrer: { userId, date: currentDate, referrer } },
            update: { views: count },
            create: { userId, date: currentDate, referrer, views: count }
          });
        }

        // d. Agregasi Lokasi
        const locationGroups = await prisma.analytics.groupBy({
          by: ['country', 'city'],
          where: { userId, type: 'VIEW', createdAt: { gte: currentDate, lt: nextDate } },
          _count: { _all: true }
        });

        for (const g of locationGroups) {
          const country = g.country || "Unknown";
          const city = g.city || "Unknown";
          const count = g._count._all;

          await prisma.dailyLocationStats.upsert({
            where: { userId_date_country_city: { userId, date: currentDate, country, city } },
            update: { views: count },
            create: { userId, date: currentDate, country, city, views: count }
          });
        }
        totalAggregatedUsers++;
      }
      
      // Maju 1 hari
      currentDate = nextDate;
    }

    // 5. AUTO-CLEANUP: Hapus data mentah yang sudah lewat 7 hari
    await prisma.analytics.deleteMany({
      where: { createdAt: { lt: sevenDaysAgo } }
    });

    // Hapus log mentah VisitorSession (30 hari)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await prisma.visitorSession.deleteMany({
      where: { createdAt: { lt: thirtyDaysAgo } }
    });

    // Hapus log aktivitas Activity (30 hari)
    await prisma.activity.deleteMany({
      where: { createdAt: { lt: thirtyDaysAgo } }
    });

    return {
      success: true,
      message: `Successfully aggregated historical data up to 7 days and cleaned up old logs. Processed ${totalAggregatedUsers} user-day records.`
    };

  } catch (error) {
    console.error("Aggregation Error:", error);
    return { error: "Internal Server Error" };
  }
}
