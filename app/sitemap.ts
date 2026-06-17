import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://portfo.be';

  const staticRoutes = [
    { url: baseUrl },
    { url: `${baseUrl}/register` },
    { url: `${baseUrl}/pricing` },
    { url: `${baseUrl}/support` },
    { url: `${baseUrl}/terms` },
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/blog` },
    { url: `${baseUrl}/blog/stealth-sitemap` },
    { url: `${baseUrl}/blog/matinya-website-builder-tradisional` },
    { url: `${baseUrl}/blog/mengapa-profil-linkedin-saja-tidak-cukup-untuk-bersaing-di-tahun-2026` },
    { url: `${baseUrl}/blog/membangun-portofolio-digital-yang-menonjol-panduan-untuk-kreator-modern` },
  ];

  try {
    // Hanya ambil user yang sudah isLive dan punya subdomain
    const activeProfiles = await prisma.user.findMany({
      where: { 
        isLive: true,
      },
      select: {
        profile: {
          select: { subdomain: true }
        }
      }
    });

    const dynamicRoutes = activeProfiles
      .filter((user) => user.profile?.subdomain) // Pastikan subdomain tidak kosong
      .map((user) => ({
        url: `${baseUrl}/${user.profile?.subdomain}`,
      }));

    return [...staticRoutes, ...dynamicRoutes];

  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    return staticRoutes; 
  }
}