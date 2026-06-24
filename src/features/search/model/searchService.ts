import prisma from "@/shared/lib/prisma";
import { redis } from "@/shared/lib/redis";

export async function globalSearch(userId: string, query: string) {
  const cacheKey = `search:${userId}:${query.trim().toLowerCase()}`;

  try {
    const cachedSearch = await redis.get(cacheKey);
    if (cachedSearch) {
      return JSON.parse(cachedSearch);
    }
  } catch(e) {}

  const [projects, links, certificates, activities] = await Promise.all([
    prisma.project.findMany({ where: { userId, title: { contains: query} }, take: 3 }),
    prisma.link.findMany({ where: { userId, platform: { contains: query} }, take: 3 }),
    prisma.certificate.findMany({ where: { userId, title: { contains: query} }, take: 2 }),
    prisma.activity.findMany({ where: { userId, details: { contains: query} }, take: 2 })
  ]);

  const results = [
    ...projects.map(p => ({ id: `prj-${p.id}`, title: p.title, group: "Hasil: Proyek & Karya", icon: "fa-paint-roller", link: `/dashboard/projects?highlight=${p.id}`, type: "link" })),
    ...links.map(l => ({ id: `lnk-${l.id}`, title: l.platform, group: "Hasil: Tautan Sosial", icon: "fa-link", link: `/dashboard/links?edit=${l.id}`, type: "link" })),
    ...certificates.map(c => ({ id: `cert-${c.id}`, title: c.title, group: "Hasil: Sertifikat", icon: "fa-certificate", link: `/dashboard/certificates?edit=${c.id}`, type: "link" })),
    ...activities.map(a => ({ id: `actlog-${a.id}`, title: a.details, group: "Hasil: Riwayat Aktivitas", icon: "fa-history", link: `/dashboard/analytics?tab=history`, type: "link" }))
  ];

  try {
    await redis.set(cacheKey, JSON.stringify(results), "EX", 180);
  } catch(e) {}

  return results;
}
