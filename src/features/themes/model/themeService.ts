import prisma from '@/shared/lib/prisma';
import { logActivity } from '@/shared/lib/activity';
import { safeStringifyJson, safeParseJson } from '@/shared/lib/safeJson';
import { ensureUniversalBlocks } from '@/shared/lib/blockSeeder';
import { getEffectivePlan } from '@/features/billing';
import { invalidatePortfolioCache } from '@/shared/lib/redis';
import { THEMES_DATA } from '@/features/themes';

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
function isRateLimited(userId: string) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 30;

  let record = rateLimitMap.get(userId);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(userId, record);
    return false;
  }
  record.count++;
  return record.count > maxRequests;
}

export async function getAppearance(email: string, mode?: string | null) {
  if (mode === 'lite') {
    const liteData = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        plan: true,
        planExpiredAt: true,
        profile: { select: { subdomain: true, fullName: true } },
        siteAppearance: { select: { themeTemplate: true, favoriteThemes: true, designTokens: true } }
      }
    });
    return liteData;
  }

  const userData = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
      siteAppearance: {
        include: { projects: { orderBy: { orderIndex: 'asc' } } }
      },
      links: { orderBy: { order: 'asc' } },
      projects: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
      certificates: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
      testimonials: { orderBy: { order: 'asc' } },
      pageBlocks: { orderBy: { orderIndex: 'asc' } }
    }
  });

  if (!userData) return null;

  if (userData.pageBlocks.length < 13) {
    await ensureUniversalBlocks(userData.id);
    userData.pageBlocks = await prisma.pageBlock.findMany({
      where: { userId: userData.id },
      orderBy: { orderIndex: 'asc' }
    });
  }

  const tokenKey = process.env.BUNNY_API_KEY || 'default_secret';
  const { signBunnyUrl } = require('@/shared/lib/bunnySign');

  if (userData.projects && userData.projects.length > 0) {
    (userData as any).projects = userData.projects.map((proj: any) => {
      if (proj.projectType === 'video' && proj.mediaUrl) {
        return { ...proj, mediaUrl: signBunnyUrl(proj.mediaUrl, tokenKey) };
      }
      return proj;
    });
  }

  return userData;
}


export interface AppearanceDTO {
  themeTemplate?: string;
  themeColor?: string;
  fontHeading?: string;
  fontBody?: string;
  buttonShape?: string;
  cardStyle?: string;
  splashScreen?: boolean;
  publishedDraftId?: string | null;
  customTexts?: Record<string, unknown> | string;
  selectedProjects?: string[];
  favoriteThemes?: string[];
  designTokens?: Record<string, unknown> | string;
}

export interface DraftDTO extends AppearanceDTO {
  id?: string;
  name?: string;
  description?: string;
  projects?: string[];
}

export async function updateAppearance(email: string, data: AppearanceDTO) {
  const user = await prisma.user.findUnique({ 
    where: { email },
    include: { profile: true }
  });
  if (!user) throw new Error("USER_NOT_FOUND");
  if (isRateLimited(user.id)) throw new Error("RATE_LIMIT_EXCEEDED");

  const { themeTemplate, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen, favoriteThemes, customTexts, publishedDraftId, selectedProjects } = data;
  const isOnlyFavorites = favoriteThemes !== undefined && themeTemplate === undefined;

  let stringifiedCustomTexts: string | undefined = undefined;
  if (customTexts !== undefined) {
    stringifiedCustomTexts = safeStringifyJson(customTexts);
    if (stringifiedCustomTexts.length > 5000) throw new Error("PAYLOAD_TOO_LARGE");
  }

  if (!isOnlyFavorites) {
    const selectedThemeData = THEMES_DATA.find(t => t.id === themeTemplate);
    const isProTheme = selectedThemeData ? selectedThemeData.isPro : false;
    const isProSplash = splashScreen === true;
    const isProSmoothScroll = (typeof customTexts === 'object' && customTexts !== null) ? (customTexts as Record<string, unknown>).smooth_scroll === 'true' : false;

    if ((isProTheme || isProSplash || isProSmoothScroll) && getEffectivePlan(user) === 'FREE') {
      const lockReason = isProTheme ? "Tema ini eksklusif untuk PRO Creator." : isProSplash ? "Fitur Cinematic Intro eksklusif untuk PRO Creator." : "Fitur Smooth Scroll eksklusif untuk PRO Creator.";
      throw new Error(`FEATURE_LOCKED:${lockReason}`);
    }
  }

  const currentAppearance = await prisma.siteAppearance.findUnique({ where: { userId: user.id } });

  let finalSelectedProjects = selectedProjects;
  if (Array.isArray(selectedProjects) && selectedProjects.length > 0) {
    const validProjects = await prisma.project.findMany({
      where: { userId: user.id, id: { in: selectedProjects }, deletedAt: null },
      select: { id: true }
    });
    const validIds = validProjects.map(p => p.id);
    finalSelectedProjects = selectedProjects.filter((id: string) => validIds.includes(id));
  }

  let currentTokens: Record<string, unknown> = {};
  if (currentAppearance?.designTokens) {
    currentTokens = safeParseJson(currentAppearance.designTokens, {});
  }

  const designTokens = {
    themeColor: themeColor !== undefined ? themeColor : currentTokens.themeColor,
    fontHeading: fontHeading !== undefined ? fontHeading : currentTokens.fontHeading,
    fontBody: fontBody !== undefined ? fontBody : currentTokens.fontBody,
    buttonShape: buttonShape !== undefined ? buttonShape : currentTokens.buttonShape,
    cardStyle: cardStyle !== undefined ? cardStyle : currentTokens.cardStyle,
  };
  const stringifiedTokens = JSON.stringify(designTokens);

  const updatedAppearance = await prisma.siteAppearance.upsert({
    where: { userId: user.id },
    update: { 
      ...(themeTemplate !== undefined && { themeTemplate }), 
      ...(splashScreen !== undefined && { splashScreen }),
      ...(favoriteThemes !== undefined && { favoriteThemes: safeStringifyJson(favoriteThemes) }),
      ...(stringifiedCustomTexts !== undefined && { customTexts: stringifiedCustomTexts }),
      ...(publishedDraftId !== undefined && { publishedDraftId }),
      designTokens: stringifiedTokens,
      ...(Array.isArray(finalSelectedProjects) && {
        projects: {
          deleteMany: {},
          create: finalSelectedProjects.map((projectId: string, index: number) => ({
            projectId: projectId, orderIndex: index
          }))
        }
      })
    },
    create: {
      userId: user.id,
      themeTemplate, 
      splashScreen,
      favoriteThemes: favoriteThemes !== undefined ? safeStringifyJson(favoriteThemes) : "[]",
      customTexts: stringifiedCustomTexts !== undefined ? stringifiedCustomTexts : "{}",
      publishedDraftId: publishedDraftId !== undefined ? publishedDraftId : null,
      designTokens: stringifiedTokens,
      projects: Array.isArray(finalSelectedProjects) && finalSelectedProjects.length > 0 ? {
        create: finalSelectedProjects.map((projectId: string, index: number) => ({
          projectId: projectId, orderIndex: index
        }))
      } : undefined
    }
  });

  if (!isOnlyFavorites) {
    await logActivity(user.id, "UPDATE_THEME", `Updated portfolio theme to ${themeTemplate || 'latest'}`);
    await invalidatePortfolioCache(user.id);
  }

  return updatedAppearance;
}

export async function getDrafts(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");
  return prisma.themeDraft.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    include: { projects: { orderBy: { orderIndex: 'asc' } } }
  });
}

export async function createDraft(email: string, data: DraftDTO) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const draftCount = await prisma.themeDraft.count({ where: { userId: user.id } });
  if (getEffectivePlan(user) === 'FREE') {
    if (draftCount >= 1) throw new Error("FEATURE_LOCKED:Kuota FREE maksimal 1 draft. Silakan upgrade ke PRO.");
  } else if (getEffectivePlan(user) === 'PRO') {
    if (draftCount >= 5) throw new Error("MAXIMUM_DRAFTS_REACHED:Batas maksimal draft untuk versi PRO adalah 5.");
  }

  const { name, description, themeTemplate, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen, customTexts, selectedProjects } = data;
  const safeName = name?.substring(0, 50) || "Untitled Draft";
  const safeDescription = description?.substring(0, 200) || "";
  const stringifiedCustomTexts = customTexts ? safeStringifyJson(customTexts) : "{}";
  const designTokens = JSON.stringify({ themeColor, fontHeading, fontBody, buttonShape, cardStyle });

  let finalSelectedProjects = selectedProjects;
  if (Array.isArray(selectedProjects) && selectedProjects.length > 0) {
    const validProjects = await prisma.project.findMany({
      where: { userId: user.id, id: { in: selectedProjects }, deletedAt: null },
      select: { id: true }
    });
    const validIds = validProjects.map(p => p.id);
    finalSelectedProjects = selectedProjects.filter((id: string) => validIds.includes(id));
  }

  return prisma.themeDraft.create({
    data: {
      userId: user.id,
      name: safeName, description: safeDescription,
      themeTemplate: themeTemplate || 'minimalist',
      splashScreen: splashScreen ?? false,
      customTexts: stringifiedCustomTexts, designTokens,
      ...(Array.isArray(finalSelectedProjects) && {
        projects: {
          create: finalSelectedProjects.map((projectId: string, index: number) => ({
            projectId: projectId, orderIndex: index
          }))
        }
      })
    }
  });
}

export async function updateDraft(email: string, data: DraftDTO) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const { id, name, description, themeTemplate, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen, customTexts, selectedProjects } = data;
  if (!id) throw new Error("INVALID_DATA");

  const existingDraft = await prisma.themeDraft.findUnique({ where: { id } });
  if (!existingDraft || existingDraft.userId !== user.id) throw new Error("FORBIDDEN");

  const safeName = name !== undefined ? name.substring(0, 50) : undefined;
  const safeDescription = description !== undefined ? description.substring(0, 200) : undefined;
  const stringifiedCustomTexts = customTexts ? safeStringifyJson(customTexts) : existingDraft.customTexts;

  let finalSelectedProjects = selectedProjects;
  if (Array.isArray(selectedProjects) && selectedProjects.length > 0) {
    const validProjects = await prisma.project.findMany({
      where: { userId: user.id, id: { in: selectedProjects }, deletedAt: null },
      select: { id: true }
    });
    const validIds = validProjects.map(p => p.id);
    finalSelectedProjects = selectedProjects.filter((id: string) => validIds.includes(id));
  }

  const existingTokens: Record<string, unknown> = safeParseJson(existingDraft.designTokens, {});
  const designTokens = {
    themeColor: themeColor !== undefined ? themeColor : existingTokens.themeColor,
    fontHeading: fontHeading !== undefined ? fontHeading : existingTokens.fontHeading,
    fontBody: fontBody !== undefined ? fontBody : existingTokens.fontBody,
    buttonShape: buttonShape !== undefined ? buttonShape : existingTokens.buttonShape,
    cardStyle: cardStyle !== undefined ? cardStyle : existingTokens.cardStyle
  };

  return prisma.themeDraft.update({
    where: { id },
    data: {
      ...(safeName !== undefined && { name: safeName }),
      ...(safeDescription !== undefined && { description: safeDescription }),
      ...(themeTemplate !== undefined && { themeTemplate }),
      ...(splashScreen !== undefined && { splashScreen }),
      customTexts: stringifiedCustomTexts,
      designTokens: JSON.stringify(designTokens),
      ...(Array.isArray(finalSelectedProjects) && {
        projects: {
          deleteMany: {},
          create: finalSelectedProjects.map((projectId: string, index: number) => ({
            projectId: projectId, orderIndex: index
          }))
        }
      })
    }
  });
}

export async function deleteDraft(email: string, id: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const existingDraft = await prisma.themeDraft.findUnique({ where: { id } });
  if (!existingDraft || existingDraft.userId !== user.id) throw new Error("FORBIDDEN");

  await prisma.themeDraft.delete({ where: { id } });

  const appearance = await prisma.siteAppearance.findUnique({ where: { userId: user.id } });
  if (appearance && appearance.publishedDraftId === id) {
    await prisma.siteAppearance.update({
      where: { userId: user.id },
      data: { publishedDraftId: null }
    });
  }
  return true;
}

export async function getFavoriteThemes(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const favorites = await prisma.themeFavorite.findMany({
    where: { userId: user.id },
    select: { themeId: true },
    orderBy: { createdAt: "desc" },
  });
  return favorites.map((f) => f.themeId);
}

export async function toggleFavoriteTheme(email: string, themeId: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");
  if (!themeId || typeof themeId !== "string") throw new Error("INVALID_DATA");

  const existing = await prisma.themeFavorite.findUnique({
    where: { userId_themeId: { userId: user.id, themeId } },
  });

  if (existing) {
    await prisma.themeFavorite.delete({ where: { id: existing.id } });
    return false;
  } else {
    await prisma.themeFavorite.create({ data: { userId: user.id, themeId } });
    return true;
  }
}

export async function getThemeStats() {
  const grouped = await prisma.themeFavorite.groupBy({
    by: ["themeId"],
    _count: { themeId: true },
    orderBy: { _count: { themeId: "desc" } },
  });
  const stats: Record<string, number> = {};
  grouped.forEach((g) => { stats[g.themeId] = g._count.themeId; });
  return stats;
}

export async function getLayoutSyncData(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true , siteAppearance: true}
  });
  if (!user) throw new Error("USER_NOT_FOUND");

  return {
    isLive: user.isLive,
    subdomain: user.profile?.subdomain || null,
    profession: user.profile?.profession || null,
    bio: user.profile?.bio || null,
    avatar: user.profile?.avatarUrl || user.avatar || null,
    plan: user.plan || "FREE",
    fullName: user.profile?.fullName,
    email: user.email,
  };
}
