import prisma from "@/shared/lib/prisma";
import { redis } from "@/shared/lib/redis";
import { signBunnyUrl } from "@/shared/lib/bunnySign";
import { cache } from "react";

export const getPortfolioData = cache(async (subdomain: string) => {
  const userSubdomain = subdomain.trim().toLowerCase();
  const cacheKey = `portfolio_db:${userSubdomain}`;
  let userData: any = null;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) userData = JSON.parse(cachedData);
  } catch (err) {}

  if (!userData) {
    userData = await prisma.user.findFirst({
      where: { profile: { subdomain: userSubdomain } },
      include: {
        profile: { select: { fullName: true, profession: true, bio: true, location: true, avatarUrl: true, subdomain: true } },
        siteAppearance: {
          select: {
            id: true, themeTemplate: true, splashScreen: true, favoriteThemes: true, customTexts: true, designTokens: true,
            projects: { orderBy: { orderIndex: "asc" }, select: { projectId: true, orderIndex: true } }
          }
        },
        links: { where: { isActive: true }, orderBy: { order: "asc" }, select: { id: true, platform: true, url: true } },
        projects: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, select: { id: true, title: true, description: true, mediaUrl: true, projectType: true, tags: true } },
        certificates: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, select: { id: true, title: true, issuer: true, year: true, description: true, mediaUrl: true } },
        testimonials: { where: { isVisible: true }, orderBy: { order: "asc" }, select: { id: true, clientName: true, company: true, content: true, rating: true, avatarUrl: true, isVisible: true } },
        pageBlocks: { where: { isVisible: true }, orderBy: { orderIndex: "asc" }, select: { id: true, blockType: true, orderIndex: true, isVisible: true, configJson: true } }
      }
    });

    if (userData) {
      try { await redis.set(cacheKey, JSON.stringify(userData), "EX", 3600); } catch (err) {}
    }
  }

  if (!userData || !userData.profile) throw new Error("404:Portfolio tidak ditemukan");

  let finalProjects = userData.projects;
  if (userData.siteAppearance?.projects && userData.siteAppearance.projects.length > 0) {
    const projectMap = new Map();
    userData.projects.forEach((p: any) => projectMap.set(p.id, p));
    
    const curatedProjects = userData.siteAppearance.projects
      .map((pivot: any) => projectMap.get(pivot.projectId))
      .filter(Boolean);
      
    const nonCurated3D = userData.projects.filter((p: any) => p.projectType === "3d" && !curatedProjects.some((cp: any) => cp.id === p.id));
    
    finalProjects = [...curatedProjects, ...nonCurated3D];
  }
  userData.projects = finalProjects;

  const isFree = userData.plan === "FREE";
  const publicProjects     = isFree ? userData.projects.slice(0, 5)     : userData.projects;
  const publicLinks        = isFree ? userData.links.slice(0, 1)        : userData.links;
  const publicCertificates = isFree ? userData.certificates.slice(0, 2) : userData.certificates;
  const publicTestimonials = isFree ? userData.testimonials.slice(0, 2) : userData.testimonials;

  const tokenKey = process.env.BUNNY_API_KEY || "default_secret";
  
  const signedProjects = publicProjects.map((proj: any) => {
    if (proj.projectType === "video") {
      return { ...proj, mediaUrl: signBunnyUrl(proj.mediaUrl, tokenKey) };
    }
    return proj;
  });

  return {
    ...userData,
    projects: signedProjects,
    links: publicLinks,
    certificates: publicCertificates,
    testimonials: publicTestimonials,
    name: userData.profile.fullName || userSubdomain,
    subdomain: userData.profile.subdomain
  };
});
