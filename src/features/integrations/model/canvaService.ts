import prisma from '@/shared/lib/prisma';

export async function getCanvaProjects(targetUserId: string) {
  if (!targetUserId) return [];

  const projects = await prisma.canvaProject.findMany({
    where: { userId: targetUserId },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}


export interface ExternalProjectDTO {
  title?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  externalUrl?: string;
  projectType?: string;
  itemType?: string;
  source?: string;
  [key: string]: unknown;
}
export async function saveCanvaProjects(userId: string, projects: any[], isBulk: boolean) {
  if (isBulk && Array.isArray(projects)) {
    if (projects.length > 10) throw new Error("400:Maximum 10 projects allowed");

    for (const p of projects) {
      if (p.title?.length > 100) throw new Error("400:Judul terlalu panjang");
      if (p.embedLink?.length > 1000) throw new Error("400:Link terlalu panjang");
      if (p.embedLink && !p.embedLink.startsWith('<iframe') && !p.embedLink.startsWith('<div') && !p.embedLink.startsWith('https://')) {
        throw new Error("400:Format link tidak valid");
      }
    }

    await prisma.$transaction([
      prisma.canvaProject.deleteMany({ where: { userId } }),
      prisma.canvaProject.createMany({
        data: projects.map((p: any) => ({
          userId,
          title: p.title || "Untitled",
          embedLink: p.embedLink || "",
        })),
      }),
    ]);
    return { success: true };
  }

  // Fallback for single create
  const { title, embedLink } = projects[0] || {};
  if (!title || !embedLink) throw new Error("400:Judul dan Link Embed wajib diisi");

  await prisma.canvaProject.create({
    data: { userId, title, embedLink },
  });

  return { success: true };
}

export async function deleteCanvaProject(userId: string, id: string) {
  await prisma.canvaProject.delete({
    where: {
      id,
      userId,
    },
  });
  return { success: true };
}
