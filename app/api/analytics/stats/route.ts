import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    // 1. Tentukan rentang waktu
    let startDate = new Date();
    if (range === "7d") startDate.setDate(startDate.getDate() - 7);
    else if (range === "30d") startDate.setDate(startDate.getDate() - 30);
    else startDate = new Date(0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 2. AMBIL DATA HISTORIS DARI DAILY STATS (Cepat & Ringan)
    const historicalStats = await prisma.dailyStats.findMany({
      where: {
        userId,
        date: { gte: startDate, lt: startOfToday }
      },
      orderBy: { date: 'asc' }
    });

    // 3. AMBIL DATA HARI INI DARI ANALYTICS MENTAH (Hanya sedikit data)
    const todayLogs = await prisma.analytics.findMany({
      where: {
        userId,
        createdAt: { gte: startOfToday }
      }
    });

    // 4. Hitung Statistik Gabungan
    const historicalViews = historicalStats.reduce((acc, curr) => acc + curr.views, 0);
    const todayViews = todayLogs.filter(l => l.type === 'VIEW').length;
    const totalViews = historicalViews + todayViews;

    if (totalViews === 0) {
      return NextResponse.json({
        stats: { totalViews: 0, uniqueVisitors: 0, avgTime: "0s", bounceRate: "0%" },
        chartData: [],
        sources: []
      });
    }

    // 5. Hitung Unique Visitors (Hari ini + Estimasi Historis)
    const todayUnique = new Set(todayLogs.map(log => log.ipAddress)).size;
    const uniqueVisitors = todayUnique + Math.round(historicalViews * 0.7);

    // 6. Hitung Average Time & Bounce Rate (Hanya dari data hari ini agar akurat & cepat)
    const logsWithDuration = todayLogs.filter(l => l.duration > 0);
    const totalDuration = logsWithDuration.reduce((acc, curr) => acc + curr.duration, 0);
    const avgDurationSeconds = logsWithDuration.length > 0 ? Math.round(totalDuration / logsWithDuration.length) : 0;
    
    const minutes = Math.floor(avgDurationSeconds / 60);
    const seconds = avgDurationSeconds % 60;
    const avgTimeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const totalSessions = new Set(todayLogs.filter(l => l.sessionId).map(l => l.sessionId)).size || todayViews;
    const bouncedSessions = new Set(todayLogs.filter(l => l.duration < 10).map(l => l.sessionId || l.id)).size;
    const bounceRate = totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0;

    // 7. Traffic Sources (Gunakan data hari ini saja untuk performa)
    const sourcesMap: Record<string, number> = {};
    todayLogs.forEach(log => {
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
            try {
                ref = new URL(log.referrer).hostname.replace('www.', '');
            } catch(e) {
                ref = "Other";
            }
        }
      }
      sourcesMap[ref] = (sourcesMap[ref] || 0) + 1;
    });

    const sources = Object.entries(sourcesMap)
      .map(([name, count]) => ({ 
        name, 
        count, 
        percentage: Math.round((count / (todayViews || 1)) * 100) 
      }))
      .sort((a, b) => b.count - a.count);

    // 8. Data Grafik (Gabungkan Historis + Hari Ini)
    const chartDataMap: Record<string, number> = {};
    
    // Isi data historis
    historicalStats.forEach(stat => {
      const label = new Date(stat.date).toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase();
      chartDataMap[label] = stat.views;
    });

    // Tambahkan data hari ini
    const todayLabel = new Date().toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase();
    chartDataMap[todayLabel] = (chartDataMap[todayLabel] || 0) + todayViews;

    // Pastikan urutan hari benar (7 hari terakhir)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase();
        chartData.push({ day: label, views: chartDataMap[label] || 0 });
    }

    return NextResponse.json({
      summary: {
        totalViews,
        uniqueVisitors,
        avgTime: avgTimeStr,
        bounceRate: `${bounceRate}%`,
      },
      dailyStats: chartData,
      stats: {
        totalViews,
        uniqueVisitors,
        avgTime: avgTimeStr,
        bounceRate: `${bounceRate}%`,
      },
      chartData: chartData,
      sources: sources.slice(0, 5),
    });
  } catch (error) {
    console.error("Analytics Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
