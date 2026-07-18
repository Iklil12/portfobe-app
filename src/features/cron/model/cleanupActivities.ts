import prisma from "@/shared/lib/prisma";

const RETENTION_DAYS = 90;

export async function cleanupActivities() {
  try {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

    const activities = await prisma.activity.deleteMany({
      where: {
        createdAt: {
          lt: cutoff,
        },
      },
    });

    console.log(`[cleanup-activities] Deleted: ${activities.count} old activity logs.`);

    return {
      message: `Activity cleanup complete: ${activities.count} items deleted`,
      deletedCount: activities.count,
      cutoffDate: cutoff.toISOString(),
    };
  } catch (error) {
    console.error("Cron cleanup-activities error:", error);
    return { error: "Failed to run activity cleanup" };
  }
}
