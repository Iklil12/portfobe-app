import React from 'react';
import prisma from '@/lib/prisma';
import GalleryPageView from '@/components/features/gallery/GalleryPageView';

export default async function FullGalleryPage({ 
  params 
}: { 
  params: { subdomain: string } 
}) {
  const { subdomain } = await params;

  // Fetch Data dari Prisma di Sisi Server (Lebih Cepat)
  let userData: any = null;
  try {
    userData = await prisma.user.findFirst({
      where: { 
        profile: { subdomain: subdomain } 
      },
      include: {
        siteAppearance: {
          include: {
            projects: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        },
        projects: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  } catch (error) {
    console.error("🔥 DATABASE CONNECTION ERROR IN GALLERY:", error);
    throw new Error("Gagal terhubung ke database Hostinger. Silakan periksa koneksi jaringan internet Anda, atau pastikan alamat IP Anda saat ini sudah di-whitelist di panel Hostinger (srv1786.hstgr.io).");
  }

  let finalProjects = userData?.projects || [];
  if (userData?.siteAppearance?.projects && userData.siteAppearance.projects.length > 0) {
    const projectMap = new Map();
    userData.projects.forEach((p: any) => projectMap.set(p.id, p));
    
    const curatedProjects = userData.siteAppearance.projects
      .map((pivot: any) => projectMap.get(pivot.projectId))
      .filter(Boolean);
      
    finalProjects = curatedProjects;
  }

  // Filter 3D jika diperlukan agar tidak rusak di LazyImage
  const projects = finalProjects.filter((p: any) => p.projectType !== '3d');

  let galleryTemplate = 'editorial';
  if (userData?.siteAppearance?.customTexts) {
    try {
      const parsed = JSON.parse(userData.siteAppearance.customTexts as string);
      if (parsed.galleryTemplate) {
        galleryTemplate = parsed.galleryTemplate;
      }
    } catch (e) {
      console.error("Failed to parse customTexts in gallery", e);
    }
  }

  return (
    <GalleryPageView 
      projects={projects} 
      subdomain={subdomain} 
      galleryTemplate={galleryTemplate}
    />
  );
}
