import React from 'react';
import prisma from '@/lib/prisma';
import GalleryPageView from '@/components/features/gallery/GalleryPageView';
import { redirect } from 'next/navigation';

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
        profile: true,
        links: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
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
    throw new Error("Failed to connect to database. Please check your internet connection, or make sure your current IP address is whitelisted in the database.");
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

  // Cek apakah plan free atau jumlah projek foto/video <= 4
  const galleryProjectsCount = finalProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
  const userPlan = userData?.plan || 'FREE';
  if (userPlan === 'FREE' || galleryProjectsCount <= 4) {
    redirect(`/${subdomain}`);
  }

  // Filter 3D jika diperlukan agar tidak rusak di LazyImage
  const filteredProjects = finalProjects.filter((p: any) => p.projectType !== '3d');

  // Sign Bunny URL
  const tokenKey = process.env.BUNNY_API_KEY || 'default_secret';
  const { signBunnyUrl } = require("@/lib/bunnySign");
  const projects = filteredProjects.map((proj: any) => {
    if (proj.projectType === 'video') {
      return {
        ...proj,
        mediaUrl: signBunnyUrl(proj.mediaUrl, tokenKey)
      };
    }
    return proj;
  });

  let galleryTemplate = 'editorial';
  let galleryDesign = 'classic';
  let customTextsObj: any = {};
  if (userData?.siteAppearance?.customTexts) {
    try {
      customTextsObj = JSON.parse(userData.siteAppearance.customTexts as string);
      if (customTextsObj.galleryTemplate) {
        galleryTemplate = customTextsObj.galleryTemplate;
      }
      if (customTextsObj.galleryDesign) {
        galleryDesign = customTextsObj.galleryDesign;
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
      galleryDesign={galleryDesign}
      customTexts={customTextsObj}
      profile={userData?.profile}
      links={userData?.links}
      email={userData?.email}
    />
  );
}
