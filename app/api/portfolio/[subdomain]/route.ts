import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Hilangkan revalidate route level yang gagal, kita gunakan Data-Level Caching
// export const revalidate = 60;

export const dynamic = 'force-dynamic'; // WAJIB agar Token Keamanan tidak di-cache sampai kedaluwarsa

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  try {
    // 1. AWAIT PARAMS: Kunci untuk error Next.js terbaru
    const resolvedParams = await params;
    
    // 2. Bersihkan teks
    const userSubdomain = resolvedParams.subdomain.trim().toLowerCase();

    // 3. Data-Level Caching
    const getCachedUserData = unstable_cache(
      async () => {
        return await prisma.user.findFirst({
          where: { 
            profile: {
              subdomain: userSubdomain
            }
          },
          include: {
            profile: {
              select: {
                fullName: true,
                profession: true,
                bio: true,
                location: true,
                avatarUrl: true,
                subdomain: true
              }
            },
            siteAppearance: {
              select: {
                id: true,
                themeTemplate: true,
                splashScreen: true,
                favoriteThemes: true,
                customTexts: true,
                designTokens: true,
                projects: {
                  orderBy: { orderIndex: 'asc' },
                  select: { projectId: true, orderIndex: true }
                }
              }
            },
            links: { 
              where: { isActive: true }, 
              orderBy: { order: 'asc' },
              select: { id: true, platform: true, url: true }
            },
            projects: { 
              where: { deletedAt: null },
              orderBy: { createdAt: 'desc' },
              select: { id: true, title: true, description: true, mediaUrl: true, projectType: true, tags: true }
            },
            certificates: { 
              where: { deletedAt: null },
              orderBy: { createdAt: 'desc' },
              select: { id: true, title: true, issuer: true, year: true, description: true, mediaUrl: true }
            },
            testimonials: {
              where: { isVisible: true },
              orderBy: { order: 'asc' },
              select: { id: true, clientName: true, company: true, content: true, rating: true, avatarUrl: true, isVisible: true }
            },
            pageBlocks: {
              where: { isVisible: true },
              orderBy: { orderIndex: 'asc' },
              select: { id: true, blockType: true, orderIndex: true, isVisible: true, configJson: true }
            }
          }
        });
      },
      [`portfolio-db-${userSubdomain}`], // Kunci cache unik per subdomain
      { revalidate: 60, tags: [`portfolio-${userSubdomain}`] }
    );

    const userData = await getCachedUserData();

    // 4. Jika tidak ketemu
    if (!userData || !userData.profile) {
      return NextResponse.json({ error: "Portfolio tidak ditemukan" }, { status: 404 });
    }

    // 5. KURASI PROJECT: Filter & Urutkan berdasarkan LiveThemeProject jika ada
    let finalProjects = userData.projects;
    if (userData.siteAppearance?.projects && userData.siteAppearance.projects.length > 0) {
      const projectMap = new Map();
      userData.projects.forEach((p: any) => projectMap.set(p.id, p));
      
      const curatedProjects = userData.siteAppearance.projects
        .map((pivot: any) => projectMap.get(pivot.projectId))
        .filter(Boolean);
        
      // WAJIB: Pastikan tipe 3D tetap lolos karena blok 3D butuh datanya dan sengaja disembunyikan dari Kurasi
      const nonCurated3D = userData.projects.filter((p: any) => p.projectType === '3d' && !curatedProjects.some((cp: any) => cp.id === p.id));
      
      finalProjects = [...curatedProjects, ...nonCurated3D];
    }
    userData.projects = finalProjects;

    // 6. SOFT LOCK: Batasi data berdasarkan plan untuk halaman publik
    const isFree = userData.plan === 'FREE';
    const publicProjects     = isFree ? userData.projects.slice(0, 5)     : userData.projects;
    const publicLinks        = isFree ? userData.links.slice(0, 1)        : userData.links;
    const publicCertificates = isFree ? userData.certificates.slice(0, 2) : userData.certificates;
    const publicTestimonials = isFree ? userData.testimonials.slice(0, 2) : userData.testimonials;

    // 6. Susun Ulang Data & Tanda Tangani (Sign) URL Aset Bunny CDN untuk Keamanan
    const tokenKey = process.env.BUNNY_API_KEY || 'default_secret';
    const { signBunnyUrl } = require("@/lib/bunnySign");
    
    const signedProjects = publicProjects.map((proj: any) => {
      // HANYA Video yang ditandatangani untuk Bunny Stream (Melindungi Video dari pembajakan)
      // File 3D (glb/gltf) dibiarkan murni karena model-viewer membutuhkan akses CORS murni
      if (proj.projectType === 'video') {
        return {
          ...proj,
          mediaUrl: signBunnyUrl(proj.mediaUrl, tokenKey)
        };
      }
      return proj;
    });

    const responseData = {
      ...userData,
      projects:     signedProjects,
      links:        publicLinks,
      certificates: publicCertificates,
      testimonials: publicTestimonials,
      name:      userData.profile.fullName || userSubdomain,
      subdomain: userData.profile.subdomain
    };

    // 7. Jika sukses, kirimkan data
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("🔥 CRITICAL API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}