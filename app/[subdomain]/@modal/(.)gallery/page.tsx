import React from 'react';
import prisma from '@/lib/prisma';
import GalleryModalView from '@/components/features/gallery/GalleryModalView';

export default async function FullGalleryModal({ 
  params 
}: { 
  params: { subdomain: string } 
}) {
  const { subdomain } = await params;

  // Fetch Data dari Prisma di Sisi Server (Lebih Cepat)
  const userData = await prisma.user.findFirst({
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

  return (
    <GalleryModalView 
      projects={projects} 
      subdomain={subdomain} 
    />
  );
}
