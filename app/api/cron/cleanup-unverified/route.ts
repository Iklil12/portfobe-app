// app/api/cron/cleanup-unverified/route.ts
// Menghapus permanen pengguna yang belum verifikasi email selama > 7 hari
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GRACE_PERIOD_DAYS = 7;

export async function GET(req: Request) {
  // Otorisasi melalui ?key= 
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key || key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cutoffDate = new Date(Date.now() - GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);

    // Cari dan hapus semua user yang emailVerified-nya null dan dibuat sebelum cutoffDate
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        emailVerified: null,
        createdAt: {
          lte: cutoffDate
        }
      }
    });

    console.log(`[cleanup-unverified] Dihapus permanen: ${deletedUsers.count} akun yang belum diverifikasi selama > 7 hari`);

    return NextResponse.json({
      message: `Pembersihan selesai: ${deletedUsers.count} akun dihapus permanen`,
      deletedCount: deletedUsers.count,
      cutoffDate: cutoffDate.toISOString(),
    });
  } catch (error) {
    console.error("Cron cleanup-unverified error:", error);
    return NextResponse.json({ error: "Failed to run unverified account cleanup" }, { status: 500 });
  }
}

