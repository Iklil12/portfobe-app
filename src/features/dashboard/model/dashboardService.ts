import prisma from "@/shared/lib/prisma";
import { redis } from "@/shared/lib/redis";

export async function getDashboardSyncData(userId: string, userEmail: string, range: string = "7d") {

  
    

    

    

    // ── REDIS MICRO-CACHING ──────────────────────────────────────────────────
    const cacheKey = `dashboard:sync:${userId}:${range}`;
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData); // SUPER CEPAT (<10ms)
      }
    } catch (e) {
      console.warn("⚠️ Redis Dashboard Sync Cache Error:", e);
    }

    // ── DATABASE QUERY & KOMPUTASI BERAT ──────────────────────────────────────
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setUTCHours(0, 0, 0, 0);

    let startDate = new Date(startOfToday);
    if (range === "7d") startDate.setUTCDate(startDate.getUTCDate() - 6);      
    else if (range === "30d") startDate.setUTCDate(startDate.getUTCDate() - 29); 
    else if (range === "1d") { /* startDate = startOfToday, sudah benar */ }
    else startDate = new Date(0); 

    const [user, announcements, historicalStats, todayLogs, projectsCount, certificatesCount, linksCount, testimonialsCount, activities] = await Promise.all([
      // A. Layout & Appearance
      prisma.user.findUnique({
        where: { email: userEmail },
        include: { 
          profile: true, 
          siteAppearance: true,
          transactions: {
            where: { gateway: 'trial' },
            take: 1,
            select: { id: true }
          }
        }
      }),
      // B. Announcements
      prisma.$queryRaw`
        SELECT id, title, message, type, channel, targetPlan, isActive, createdAt 
        FROM Announcement 
        WHERE isActive = true 
        ORDER BY createdAt DESC
      `,
      // C. Historical Stats (hari sebelum hari ini)
      prisma.dailyStats.findMany({
        where: { userId, date: { gte: startDate, lt: startOfToday } },
        orderBy: { date: 'asc' }
      }),
      // D. Raw logs dalam FULL RANGE (bukan hanya hari ini)
      prisma.analytics.findMany({
        where: { userId, createdAt: { gte: startDate } },
        select: { id: true, type: true, ipAddress: true, duration: true, sessionId: true, referrer: true, createdAt: true }
      }),
      // E. Projects 
      prisma.project.count({ where: { userId, deletedAt: null } }),
      // F. Certificates 
      prisma.certificate.count({ where: { userId, deletedAt: null } }),
      // G. Links 
      prisma.link.count({ where: { userId } }),
      // H. Testimonials 
      prisma.testimonial.count({ where: { userId } }),
      // I. Activities
      prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, actionType: true, details: true, createdAt: true }
      })
    ]);

    if (!user) throw new Error("404:User not found");

    const layout = {
      isLive: user.isLive,
      subdomain: user.profile?.subdomain || null,
      profession: user.profile?.profession || null,
      bio: user.profile?.bio || null,
      avatar: user.profile?.avatarUrl || user.avatar || null,
      plan: user.plan || "FREE",
      planExpiredAt: user.planExpiredAt,
      fullName: user.profile?.fullName,
      email: user.email,
      role: user.role,
      siteAppearance: user.siteAppearance,
      canClaimTrial: user.plan === "FREE" && user.transactions && user.transactions.length === 0,
    };

    const formattedAnnouncements = Array.isArray(announcements) ? announcements.map((a: any) => ({
      ...a, isActive: Boolean(a.isActive),
    })) : [];

    const historicalViews = historicalStats.reduce((acc: number, curr: any) => acc + curr.views, 0);
    const todayViews = todayLogs.filter((l: any) => l.type === 'VIEW').length;
    const totalViews = historicalViews + todayViews;

    let statsResult = {
      summary: { totalViews: 0, uniqueVisitors: 0, avgTime: "0s", bounceRate: "0%" },
      dailyStats: [] as any[],
      stats: { totalViews: 0, uniqueVisitors: 0, avgTime: "0s", bounceRate: "0%" },
      chartData: [] as any[],
      sources: [] as any[]
    };

    if (totalViews > 0) {
      const uniqueIPs = new Set(todayLogs.map((log: any) => log.ipAddress).filter(Boolean));
      const uniqueVisitors = uniqueIPs.size + Math.round(historicalViews * 0.7);

      const logsWithDuration = todayLogs.filter((l: any) => l.duration > 0);
      const totalDuration = logsWithDuration.reduce((acc: number, curr: any) => acc + curr.duration, 0);
      const avgSec = logsWithDuration.length > 0 ? Math.round(totalDuration / logsWithDuration.length) : 0;
      const avgTimeStr = avgSec >= 60 ? `${Math.floor(avgSec / 60)}m ${avgSec % 60}s` : `${avgSec}s`;

      const sessionsMap: Record<string, number> = {};
      todayLogs.filter((l: any) => l.type === 'VIEW' && l.sessionId).forEach((l: any) => {
        sessionsMap[l.sessionId] = (sessionsMap[l.sessionId] || 0) + 1;
      });
      const totalSessions = Object.keys(sessionsMap).length;
      const bouncedSessions = Object.values(sessionsMap).filter((v: number) => v === 1).length;
      const rawViewCount = todayLogs.filter((l: any) => l.type === 'VIEW').length;
      const bounceRate = totalSessions > 0
        ? Math.round((bouncedSessions / totalSessions) * 100)
        : rawViewCount > 0
        ? Math.round((todayLogs.filter((l: any) => l.duration > 0 && l.duration < 10).length / rawViewCount) * 100)
        : 0;

      const sourcesMap: Record<string, number> = {};
      todayLogs.filter((l: any) => l.type === 'VIEW').forEach((log: any) => {
        let ref = "Direct";
        if (log.referrer && log.referrer !== "Direct") {
          const r = log.referrer.toLowerCase();
          if (r.includes("portfo.be") || r.includes("localhost")) ref = "Direct";
          else if (r.includes("instagram")) ref = "Instagram";
          else if (r.includes("t.co") || r.includes("twitter")) ref = "Twitter / X";
          else if (r.includes("facebook")) ref = "Facebook";
          else if (r.includes("google")) ref = "Google";
          else if (r.includes("whatsapp") || r.includes("wa.me")) ref = "WhatsApp";
          else if (r.includes("linkedin")) ref = "LinkedIn";
          else {
            try { ref = new URL(log.referrer).hostname.replace('www.', ''); }
            catch { ref = "Other"; }
          }
        }
        sourcesMap[ref] = (sourcesMap[ref] || 0) + 1;
      });

      const totalRefViews = Object.values(sourcesMap).reduce((s: number, v: number) => s + v, 0);
      const sources = Object.entries(sourcesMap)
        .map(([name, count]) => ({ name, count, percentage: Math.round((count / (totalRefViews || 1)) * 100) }))
        .sort((a, b) => b.count - a.count);

      const dailyMap: Record<string, number> = {};
      historicalStats.forEach((stat: any) => {
        const key = stat.date.toISOString().split('T')[0];
        dailyMap[key] = (dailyMap[key] || 0) + stat.views;
      });
      todayLogs.filter((l: any) => l.type === 'VIEW').forEach((l: any) => {
        const key = l.createdAt.toISOString().split('T')[0];
        dailyMap[key] = (dailyMap[key] || 0) + 1;
      });

      const chartData: any[] = [];
      const cursor = new Date(startDate);
      cursor.setUTCHours(0, 0, 0, 0);
      const endDay = new Date(startOfToday);
      let count = 0;
      while (cursor <= endDay && count < 90) {
        const key = cursor.toISOString().split('T')[0];
        const label = range === '7d'
          ? cursor.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
          : cursor.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        chartData.push({ day: label, date: key, views: dailyMap[key] || 0 });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
        count++;
      }

      statsResult = {
        summary: { totalViews, uniqueVisitors, avgTime: avgTimeStr, bounceRate: `${bounceRate}%` },
        dailyStats: chartData,
        stats: { totalViews, uniqueVisitors, avgTime: avgTimeStr, bounceRate: `${bounceRate}%` },
        chartData: chartData,
        sources: sources.slice(0, 5),
      };
    }

    const responseData = {
      layout,
      announcements: formattedAnnouncements,
      stats: statsResult,
      overview: {
        projectsCount,
        certificatesCount,
        linksCount,
        testimonialsCount,
        activities
      }
    };

    // ── SIMPAN KE REDIS (TTL: 60 DETIK) ───────────────────────────────────────
    try {
      await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 60);
    } catch (e) {
      console.warn("⚠️ Redis Dashboard Sync Cache Set Error:", e);
    }

    return responseData;
}
