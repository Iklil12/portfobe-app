// app/api/cron/purge-trash/route.ts
// Hapus permanen semua item trash yang sudah > 30 hari
// Dipanggil harian via Vercel Cron atau layanan eksternal
import prisma from "@/shared/lib/prisma";

const RETENTION_DAYS = 30;

export async function purgeTrash() {
  // Auth via ?key= — konsisten dengan cron aggregate & check-plan-expiry di Hostinger
  

  try {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

    const [projects, certificates] = await Promise.all([
      prisma.project.deleteMany({
        where: { deletedAt: { not: null, lte: cutoff } },
      }),
      prisma.certificate.deleteMany({
        where: { deletedAt: { not: null, lte: cutoff } },
      }),
    ]);

    const total = projects.count + certificates.count;
    console.log(`[purge-trash] Permanently deleted: ${projects.count} projects, ${certificates.count} certificates`);

    return {
      message: `Purge complete: ${total} items permanently deleted`,
      projects: projects.count,
      certificates: certificates.count,
      cutoffDate: cutoff.toISOString(),
    };
  } catch (error) {
    console.error("Cron purge-trash error:", error);
    return { error: "Failed to run purge" };
  }
}

