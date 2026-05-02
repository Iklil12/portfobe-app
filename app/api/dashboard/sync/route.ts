// app/api/dashboard/sync/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    let startDate = new Date();
    if (range === "7d") startDate.setDate(startDate.getDate() - 7);
    else if (range === "30d") startDate.setDate(startDate.getDate() - 30);
    else startDate = new Date(0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 2. PARALLEL EXECUTION: OPTIMASI SUPER RINGAN
    const [user, announcements, historicalStats, todayLogs, projectsCount, certificatesCount, linksCount, activities] = await Promise.all([
      // A. Layout & Appearance
      prisma.user.findUnique({
        where: { email: userEmail },
        include: { profile: true, siteAppearance: true }
      }),
      // B. Announcements
      prisma.$queryRaw`
        SELECT id, title, message, type, channel, targetPlan, isActive, createdAt 
        FROM Announcement 
        WHERE isActive = true 
        ORDER BY createdAt DESC
      `,
      // C. Historical Stats
      prisma.dailyStats.findMany({
        where: { userId, date: { gte: startDate, lt: startOfToday } },
        orderBy: { date: 'asc' }
      }),
      // D. Today Logs
      prisma.analytics.findMany({
        where: { userId, createdAt: { gte: startOfToday } },
        select: { id: true, type: true, ipAddress: true, duration: true, sessionId: true, referrer: true }
      }),
      // E. Projects (OPTIMASI: Gunakan count, hasilkan 1 angka integer)
      prisma.project.count({ where: { userId } }),
      // F. Certificates (OPTIMASI: Gunakan count, hasilkan 1 angka integer)
      prisma.certificate.count({ where: { userId } }),
      // G. Links (OPTIMASI: Gunakan count, hasilkan 1 angka integer)
      prisma.link.count({ where: { userId } }),
      // H. Activities (Tetap dibatasi take: 10)
      prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, actionType: true, details: true, createdAt: true }
      })
    ]);

    if (!user) return NextResponse.json(null, { status: 404 });

    // --- 3. Format Data Layout & Appearance ---
    const layout = {
      isLive: user.isLive,
      subdomain: user.profile?.subdomain || null,
      profession: user.profile?.profession || null,
      bio: user.profile?.bio || null,
      avatar: user.profile?.avatarUrl || user.avatar || null,
      plan: user.plan || "FREE",
      fullName: user.profile?.fullName,
      email: user.email,
      siteAppearance: user.siteAppearance,
    };

    // --- 4. Format Data Announcements ---
    const formattedAnnouncements = Array.isArray(announcements) ? announcements.map((a: any) => ({
      ...a, isActive: Boolean(a.isActive),
    })) : [];

    // --- 5. Format Data Stats Analytics ---
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
      const todayUnique = new Set(todayLogs.map((log: any) => log.ipAddress)).size;
      const uniqueVisitors = todayUnique + Math.round(historicalViews * 0.7);

      const logsWithDuration = todayLogs.filter((l: any) => l.duration > 0);
      const totalDuration = logsWithDuration.reduce((acc: number, curr: any) => acc + curr.duration, 0);
      const avgDurationSeconds = logsWithDuration.length > 0 ? Math.round(totalDuration / logsWithDuration.length) : 0;
      
      const minutes = Math.floor(avgDurationSeconds / 60);
      const seconds = avgDurationSeconds % 60;
      const avgTimeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

      const totalSessions = new Set(todayLogs.filter((l: any) => l.sessionId).map((l: any) => l.sessionId)).size || todayViews;
      const bouncedSessions = new Set(todayLogs.filter((l: any) => l.duration < 10).map((l: any) => l.sessionId || l.id)).size;
      const bounceRate = totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0;

      const sourcesMap: Record<string, number> = {};
      todayLogs.forEach((log: any) => {
        let ref = "Direct";
        if (log.referrer && log.referrer !== "Direct") {
          const r = log.referrer.toLowerCase();
          if (r.includes("instagram")) ref = "Instagram";
          else if (r.includes("t.co") || r.includes("twitter")) ref = "Twitter / X";
          else if (r.includes("facebook")) ref = "Facebook";
          else if (r.includes("google")) ref = "Google";
          else if (r.includes("whatsapp") || r.includes("wa.me")) ref = "WhatsApp";
          else if (r.includes("linkedin")) ref = "LinkedIn";
          else {
              try { ref = new URL(log.referrer).hostname.replace('www.', ''); } 
              catch(e) { ref = "Other"; }
          }
        }
        sourcesMap[ref] = (sourcesMap[ref] || 0) + 1;
      });

      const sources = Object.entries(sourcesMap)
        .map(([name, count]) => ({ 
          name, count, percentage: Math.round((count / (todayViews || 1)) * 100) 
        }))
        .sort((a, b) => b.count - a.count);

      const chartDataMap: Record<string, number> = {};
      historicalStats.forEach((stat: any) => {
        const label = new Date(stat.date).toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase();
        chartDataMap[label] = stat.views;
      });
      const todayLabel = new Date().toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase();
      chartDataMap[todayLabel] = (chartDataMap[todayLabel] || 0) + todayViews;

      const chartData: any[] = [];
      for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const label = d.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase();
          chartData.push({ day: label, views: chartDataMap[label] || 0 });
      }

      statsResult = {
        summary: { totalViews, uniqueVisitors, avgTime: avgTimeStr, bounceRate: `${bounceRate}%` },
        dailyStats: chartData,
        stats: { totalViews, uniqueVisitors, avgTime: avgTimeStr, bounceRate: `${bounceRate}%` },
        chartData: chartData,
        sources: sources.slice(0, 5),
      };
    }

    return NextResponse.json({
      layout,
      announcements: formattedAnnouncements,
      stats: statsResult,
      overview: {
        projectsCount: projectsCount, // LANGSUNG MENGGUNAKAN HASIL COUNT (Angka murni)
        certificatesCount: certificatesCount, // LANGSUNG MENGGUNAKAN HASIL COUNT
        linksCount: linksCount, // LANGSUNG MENGGUNAKAN HASIL COUNT
        activities
      }
    });
  } catch (error) {
    console.error("Dashboard Sync API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}