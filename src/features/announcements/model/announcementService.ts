import prisma from "@/shared/lib/prisma";

export async function getActiveAnnouncements() {
  const announcements: any[] = await prisma.$queryRaw`
    SELECT id, title, message, type, channel, targetPlan, isActive, createdAt 
    FROM Announcement 
    WHERE isActive = true 
    ORDER BY createdAt DESC
  `;
  
  return announcements.map((a: any) => ({
    ...a,
    isActive: Boolean(a.isActive),
  }));
}
