import prisma from '@/shared/lib/prisma';
import { logActivity } from '@/shared/lib/activity';
import { invalidatePortfolioCache } from '@/shared/lib/redis';
import { getEffectivePlan } from '@/features/billing';

export interface ProjectDTO {
  id?: string;
  projectType?: string;
  itemType?: string;
  title?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  model3dUrl?: string;
  videoUrl?: string;
  externalUrl?: string;
  description?: string;
  clientName?: string;
  completionDate?: string;
  technologies?: string;
  credentialId?: string;
  credentialUrl?: string;
  issuer?: string;
  issueDate?: string;
  tags?: string;
  isVisible?: boolean;
  [key: string]: unknown;
}

export async function getUserProjects(email: string, page: number = 1, limit: number = 20) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { userId: user.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
    }),
    prisma.project.count({
      where: { userId: user.id, deletedAt: null },
    })
  ]);

  return {
    data: projects,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit)
    }
  };
}

export async function createProject(email: string, data: ProjectDTO) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  if (getEffectivePlan(user) === 'FREE') {
    const projectCount = await prisma.project.count({ where: { userId: user.id, deletedAt: null } });
    if (projectCount >= 4) {
      throw new Error("QUOTA_EXCEEDED");
    }
  }

  const { title, description, mediaUrl, projectType, tags } = data;

  if (!title || !mediaUrl) {
    throw new Error("MISSING_DATA");
  }

  if (mediaUrl && !mediaUrl.startsWith("http://") && !mediaUrl.startsWith("https://")) {
    const isBunnyGuid = projectType === 'video' && mediaUrl.length === 36 && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(mediaUrl);
    if (!isBunnyGuid) {
      throw new Error("INVALID_URL");
    }
  }

  const newProject = await prisma.project.create({
    data: {
      title,
      description: description || null,
      mediaUrl,
      projectType: projectType || "photo",
      tags: Array.isArray(tags) ? JSON.stringify(tags) : "[]",
      userId: user.id
    }
  });

  let actionLabel = "Uploading new project";
  if (projectType === 'video') actionLabel = "Added video portfolio";
  await logActivity(user.id, "UPLOAD_PROJECT", `${actionLabel}: "${title}"`);
  await invalidatePortfolioCache(user.id);

  return newProject;
}

export async function updateProject(email: string, data: ProjectDTO) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const { id, title, description, mediaUrl, projectType, tags } = data;

  if (!id || !title || !mediaUrl) {
    throw new Error("MISSING_DATA");
  }

  if (mediaUrl && !mediaUrl.startsWith("http://") && !mediaUrl.startsWith("https://")) {
    const isBunnyGuid = projectType === 'video' && mediaUrl.length === 36 && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(mediaUrl);
    if (!isBunnyGuid) {
      throw new Error("INVALID_URL");
    }
  }

  const existingProject = await prisma.project.findUnique({ where: { id } });
  if (!existingProject || existingProject.userId !== user.id) {
    throw new Error("FORBIDDEN");
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      title,
      description: description || null,
      mediaUrl,
      projectType,
      tags: Array.isArray(tags) ? JSON.stringify(tags) : (existingProject.tags ?? "[]")
    }
  });

  await logActivity(user.id, "UPDATE_PROJECT", `Updated work: "${title}"`);
  await invalidatePortfolioCache(user.id);

  return updatedProject;
}

export async function deleteProject(email: string, id: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  if (!id) throw new Error("MISSING_DATA");

  const existingProject = await prisma.project.findUnique({ where: { id } });
  if (!existingProject || existingProject.userId !== user.id) {
    throw new Error("FORBIDDEN");
  }

  await prisma.project.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
  
  await logActivity(user.id, "DELETE_PROJECT", `Moved to trash: "${existingProject.title}"`);
  await invalidatePortfolioCache(user.id);

  return true;
}
