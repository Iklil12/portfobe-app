// app/api/cron/cleanup-unverified/route.ts
// Menghapus permanen pengguna yang belum verifikasi email selama > 7 hari
import prisma from "@/shared/lib/prisma";

const GRACE_PERIOD_DAYS = 7;

export async function cleanupUnverified() {
  // Otorisasi melalui ?key= 
  

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

    return {
      message: `Pembersihan selesai: ${deletedUsers.count} akun dihapus permanen`,
      deletedCount: deletedUsers.count,
      cutoffDate: cutoffDate.toISOString(),
    };
  } catch (error) {
    console.error("Cron cleanup-unverified error:", error);
    return { error: "Failed to run unverified account cleanup" };
  }
}

