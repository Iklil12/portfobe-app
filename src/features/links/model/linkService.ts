import prisma from '@/shared/lib/prisma';
import { logActivity } from '@/shared/lib/activity';
import { invalidatePortfolioCache } from '@/shared/lib/redis';
import { getEffectivePlan } from '@/features/billing';


export interface LinkDTO {
  platform?: string;
  url?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export async function getUserLinks(email: string, page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  const [links, total] = await Promise.all([
    prisma.link.findMany({
      where: { user: { email } },
      orderBy: { order: 'asc' },
      take: limit,
      skip: skip,
    }),
    prisma.link.count({
      where: { user: { email } }
    })
  ]);

  return {
    data: links,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit)
    }
  };
}

export async function createNewLink(userEmail: string) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error("User not found");

  if (getEffectivePlan(user) === 'FREE') {
    const linkCount = await prisma.link.count({ where: { userId: user.id } });
    if (linkCount >= 1) {
      throw new Error("QUOTA_EXCEEDED");
    }
  }

  const activeCount = await prisma.link.count({ 
    where: { userId: user.id, isActive: true } 
  });
  const shouldBeActive = activeCount < 4;

  const newLink = await prisma.link.create({
    data: {
      userId: user.id,
      platform: "custom",
      url: "https://",
      isActive: shouldBeActive,
      order: 0
    }
  });

  await logActivity(user.id, "ADD_LINK", `Added a new link to profile`);
  await invalidatePortfolioCache(user.id);

  return newLink;
}

export async function updateLink(id: string, userId: string, data: LinkDTO) {
  const { platform, url, isActive } = data;

  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("URL wajib diawali dengan http:// atau https://");
  }

  const currentLink = await prisma.link.findUnique({ where: { id: id } });
  if (!currentLink) throw new Error("NOT_FOUND");
  if (currentLink.userId !== userId) throw new Error("FORBIDDEN");

  if (isActive === true && currentLink.isActive === false) {
    const activeCount = await prisma.link.count({
      where: { userId: currentLink.userId, isActive: true }
    });
    if (activeCount >= 4) throw new Error("MAX_ACTIVE");
  }

  const updatedLink = await prisma.link.update({
    where: { id: id },
    data: {
      ...(platform !== undefined && { platform }),
      ...(url !== undefined && { url }),
      ...(isActive !== undefined && { isActive }),
    }
  });

  await logActivity(updatedLink.userId, "UPDATE_LINK", `Updated link "${updatedLink.platform}"`);
  await invalidatePortfolioCache(currentLink.userId);

  return updatedLink;
}

export async function deleteLink(id: string, userId: string) {
  const link = await prisma.link.findUnique({ where: { id: id } });
  if (!link) throw new Error("NOT_FOUND");
  if (link.userId !== userId) throw new Error("FORBIDDEN");

  await prisma.link.delete({ where: { id: id } });
  await logActivity(link.userId, "DELETE_LINK", `Deleted link "${link.platform}" from profile`);
  await invalidatePortfolioCache(link.userId);

  return true;
}
