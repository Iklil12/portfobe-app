import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, pagePath, analyticsId, sessionId } = body;

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
    const ip = headersList.get("x-forwarded-for")?.split(',')[0] || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";
    const referrer = headersList.get("referer") || "Direct";

    const newLog = await prisma.analytics.create({
      data: {
        userId,
        sessionId: sessionId || null,
        type: type || "VIEW",
        ipAddress: ip,
        userAgent,
        referrer,
        pagePath: pagePath || "/",
      },
    });

    return NextResponse.json({ success: true, id: newLog.id });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
