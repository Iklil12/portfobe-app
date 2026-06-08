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
    // Shift current time to User's time in UTC, set UTC hours to 0, then shift back to real absolute time
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

    // ── 4. Ambil raw Analytics dalam range (untuk hari ini + metrik) ────────
    const rawLogs = await prisma.analytics.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        sessionId: true,
        duration: true,
        type: true,
        referrer: true,
        ipAddress: true,
        createdAt: true,
        userAgent: true,
        deviceType: true,
      },
    });

    // ── 5. Hitung Total Views ────────────────────────────────────────────────
    const historicalViews = historicalStats.reduce((s, d) => s + d.views, 0);
    const rawViewLogs = rawLogs.filter((l) => l.type === "VIEW");
    const todayViews = rawViewLogs.filter((l) => l.createdAt >= startOfToday).length;
    const totalViews = historicalViews + todayViews;

    // Unique Visitors
    const uniqueIPs = new Set(rawLogs.map((l) => l.ipAddress).filter(Boolean));
    const estimatedHistoric = Math.round(historicalViews * 0.7);
    const uniqueVisitors = uniqueIPs.size + estimatedHistoric;

    // ── 6. Avg. Time ─────────────────────────────────────────────────────────
    const logsWithDuration = rawLogs.filter((l) => l.duration > 0);
    const totalDuration = logsWithDuration.reduce((s, l) => s + l.duration, 0);
    const avgSec =
      logsWithDuration.length > 0
        ? Math.round(totalDuration / logsWithDuration.length)
        : 0;
    const avgTimeStr =
      avgSec >= 60 ? `${Math.floor(avgSec / 60)}m ${avgSec % 60}s` : `${avgSec}s`;

    // ── 7. Bounce Rate ────────────────────────────────────────────────────────
    // Definisi: kunjungan dianggap "bounce" jika durasi < 10 detik
    // Ini lebih reliable daripada sessionId yang bisa fresh tiap load
    const viewsWithDuration = rawLogs.filter((l) => l.duration > 0 || l.type === 'VIEW');
    const bouncedViews = rawLogs.filter((l) => (l.duration >= 0 && l.duration < 10) || l.duration === 0).length;
    const bounceRatePct =
      viewsWithDuration.length > 0
        ? Math.round((bouncedViews / viewsWithDuration.length) * 100)
        : 0;

    // ── 7.5 Devices ────────────────────────────────────────────────────────
    let desktop = 0, mobile = 0, tablet = 0;
    rawViewLogs.forEach(l => {
      const dev = parseUserAgent(l.userAgent || "");
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

    // ── 8. Traffic Sources ────────────────────────────────────────────────────
    const sourcesMap: Record<string, number> = {};
    rawViewLogs.forEach((log) => {
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
        else if (r.includes("tiktok")) ref = "TikTok";
        else if (r.includes("youtube") || r.includes("youtu.be")) ref = "YouTube";
        else {
          try {
            const host = new URL(log.referrer).hostname.replace("www.", "");
            ref =
              host.includes("portfo.be") || host.includes("localhost")
                ? "Direct"
                : host;
          } catch {
            /* tetap Direct */
          }
        }
      }
      sourcesMap[ref] = (sourcesMap[ref] || 0) + 1;
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
      // Tampilkan per JAM (0-23) untuk hari ini (User Time)
      const hourlyMap: Record<number, number> = {};
      const hourlyIpMap: Record<number, Set<string>> = {};
      
      rawViewLogs
        .filter((l) => l.createdAt >= startOfToday)
        .forEach((l) => {
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
      // Per hari dari startDate → hari ini
      const dailyMap: Record<string, number> = {};
      const visitorsMap: Record<string, number> = {};

      // Dari DailyStats (hari-hari sebelum hari ini)
      historicalStats.forEach((stat) => {
        const key = toDateKey(stat.date, userOffsetMinutes);
        dailyMap[key] = (dailyMap[key] || 0) + stat.views;
        // visitorsMap dari DailyStats tidak dipakai — kita hitung dari IP address di rawLogs
      });

      const dailyIpMap: Record<string, Set<string>> = {};
      // Dari rawLogs (Semua hari dalam range untuk menghitung VISITORS dari IP address yang riil!)
      rawViewLogs.forEach((l) => {
        const key = toDateKey(l.createdAt, userOffsetMinutes);
        
        // Kita hanya tambahkan views ke dailyMap jika hari ini (karena hari sebelumnya sudah di-cover oleh DailyStats)
        if (l.createdAt >= startOfToday) {
          dailyMap[key] = (dailyMap[key] || 0) + 1;
        }

        // TAPI untuk visitors, kita hitung dari IP address riil di rawLogs untuk semua hari!
        // (Ini untuk mengatasi data DailyStats lama yang kolom visitors-nya default 0)
        if (!dailyIpMap[key]) dailyIpMap[key] = new Set();
        if (l.ipAddress) dailyIpMap[key].add(l.ipAddress);
      });
      Object.keys(dailyIpMap).forEach(key => {
         visitorsMap[key] = Math.max(visitorsMap[key] || 0, dailyIpMap[key].size);
      });

      chartData = [];
      const cursor = new Date(startDate);
      const endDay = new Date(startOfToday);
      let count = 0;

      while (cursor <= endDay && count < 90) {
        const key = toDateKey(cursor, userOffsetMinutes);
        chartData.push({
          day: toDisplayLabel(cursor, userOffsetMinutes, range === "7d"),
          date: key,
          views: dailyMap[key] || 0,
          visitors: visitorsMap[key] || 0,
        });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
        count++;
      }
    }

    // ── 9. Hitung "Today Only" Stats (Khusus untuk card 'Hari Ini' di Dashboard) ──
    const todayRawLogs = rawLogs.filter(l => l.createdAt >= startOfToday);
    
    // Today Avg Time
    const todayLogsWithDuration = todayRawLogs.filter(l => l.duration > 0);
    const todayTotalDuration = todayLogsWithDuration.reduce((s, l) => s + l.duration, 0);
    const todayAvgSec = todayLogsWithDuration.length > 0 ? Math.round(todayTotalDuration / todayLogsWithDuration.length) : 0;
    const todayAvgTimeStr = todayAvgSec >= 60 ? `${Math.floor(todayAvgSec / 60)}m ${todayAvgSec % 60}s` : `${todayAvgSec}s`;

    // Today Bounce Rate
    const todayViewsWithDuration = todayRawLogs.filter(l => l.duration > 0 || l.type === 'VIEW');
    const todayBouncedViews = todayRawLogs.filter(l => (l.duration >= 0 && l.duration < 10) || l.duration === 0).length;
    const todayBounceRatePct = todayViewsWithDuration.length > 0 ? Math.round((todayBouncedViews / todayViewsWithDuration.length) * 100) : 0;

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
