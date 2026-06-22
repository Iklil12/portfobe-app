//app/api/appearance/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { safeStringifyJson, safeParseJson } from "@/lib/safeJson";
import { revalidateTag } from "next/cache";

import { THEMES_DATA } from "@/lib/themes";
import { ensureUniversalBlocks } from "@/lib/blockSeeder";
import { getEffectivePlan } from "@/lib/planUtils";


export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// MENGAMBIL TEMA & PROFIL YANG SEDANG DIPAKAI (UNTUK PREVIEW)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    // MODE LITE: Hanya ambil data dasar untuk performa tinggi (digunakan di Themes Page)
    if (mode === 'lite') {
      const liteData = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          plan: true,
          planExpiredAt: true,
          profile: { select: { subdomain: true, fullName: true } },
          siteAppearance: { select: { themeTemplate: true, favoriteThemes: true, designTokens: true } }
        }
      });
      return NextResponse.json(liteData);
    }

    // MODE FULL: Tarik data lengkap untuk Editor / Preview
    const userData = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        siteAppearance: {
          include: {
            projects: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        },
        links: { orderBy: { order: 'asc' } },
        projects: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
        certificates: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
        testimonials: { orderBy: { order: 'asc' } },
        pageBlocks: { orderBy: { orderIndex: 'asc' } }
      }
    });

    if (!userData) return NextResponse.json({});

    // CEK DAN PASTIKAN BLOK UNIVERSAL ADA
    // Jika user belum memiliki set lengkap blok (misal sebelumnya hanya 11, sekarang ada 13), kita seeder.
    if (userData.pageBlocks.length < 13) {
      await ensureUniversalBlocks(userData.id);
      // Ambil ulang blok setelah dibuat
      userData.pageBlocks = await prisma.pageBlock.findMany({
        where: { userId: userData.id },
        orderBy: { orderIndex: 'asc' }
      });
    }

    // TANDA TANGANI URL VIDEO UNTUK PREVIEW EDITOR
    const tokenKey = process.env.BUNNY_API_KEY || 'default_secret';
    const { signBunnyUrl } = require("@/lib/bunnySign");

    if (userData.projects && userData.projects.length > 0) {
      userData.projects = userData.projects.map((proj: any) => {
        if (proj.projectType === 'video' && proj.mediaUrl) {
          return {
            ...proj,
            mediaUrl: signBunnyUrl(proj.mediaUrl, tokenKey)
          };
        }
        return proj;
      });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("GET Appearance Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// In-memory rate limiter untuk proteksi DoS (Berfungsi per-instance container)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

function isRateLimited(userId: string) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 menit
  const maxRequests = 30; // Maksimal 30 request per menit

  let record = rateLimitMap.get(userId);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(userId, record);
    return false;
  }

  record.count++;
  return record.count > maxRequests;
}

// MENYIMPAN PERUBAHAN TEMA
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email },
      include: { profile: true }
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (isRateLimited(user.id)) {
      return NextResponse.json({ error: "Terlalu banyak permintaan (Spam Detected). Harap tunggu beberapa saat." }, { status: 429 });
    }

    const body = await req.json();
    
    // TANGKAP DATA DARI FRONTEND
    const { 
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape,
        cardStyle,
        splashScreen,
        favoriteThemes,
        customTexts,
        publishedDraftId,
        selectedProjects
    } = body;

    // OPTIMASI: Jika hanya update favorit, lewati pengecekan plan dan logging
    const isOnlyFavorites = favoriteThemes !== undefined && themeTemplate === undefined;

    // VALIDASI KEAMANAN: Batasi ukuran customTexts untuk mencegah serangan Payload Bloat
    let stringifiedCustomTexts: string | undefined = undefined;
    if (customTexts !== undefined) {
      stringifiedCustomTexts = safeStringifyJson(customTexts);
      if (stringifiedCustomTexts.length > 5000) {
        return NextResponse.json({ error: "Payload customTexts terlalu besar. Maksimal 5000 karakter." }, { status: 400 });
      }
    }

    if (!isOnlyFavorites) {
      // --- PLAN ENFORCEMENT: PRO FEATURES ---
      const selectedThemeData = THEMES_DATA.find(t => t.id === themeTemplate);
      const isProTheme = selectedThemeData ? selectedThemeData.isPro : false;
      const isProSplash = splashScreen === true;
      const isProSmoothScroll = customTexts?.smooth_scroll === 'true';

      if ((isProTheme || isProSplash || isProSmoothScroll) && getEffectivePlan(user) === 'FREE') {
        return NextResponse.json({ 
          error: isProTheme 
            ? "Tema ini eksklusif untuk PRO Creator." 
            : isProSplash 
              ? "Fitur Cinematic Intro eksklusif untuk PRO Creator."
              : "Fitur Smooth Scroll eksklusif untuk PRO Creator.",
          code: "FEATURE_LOCKED"
        }, { status: 403 });
      }
    }

    const currentAppearance = await prisma.siteAppearance.findUnique({ where: { userId: user.id } });
    const isThemeChanged = themeTemplate && currentAppearance?.themeTemplate !== themeTemplate;

    // VALIDASI INTEGRITAS: Pastikan project yang akan disimpan benar-benar masih ada (untuk menghindari FK Error jika dihapus dari tab lain)
    let finalSelectedProjects = selectedProjects;
    if (Array.isArray(selectedProjects) && selectedProjects.length > 0) {
      const validProjects = await prisma.project.findMany({
        where: { userId: user.id, id: { in: selectedProjects }, deletedAt: null },
        select: { id: true }
      });
      const validIds = validProjects.map(p => p.id);
      finalSelectedProjects = selectedProjects.filter((id: string) => validIds.includes(id));
    }

    let currentTokens: any = {};
    if (currentAppearance?.designTokens) {
      currentTokens = safeParseJson(currentAppearance.designTokens, {});
    }

    // BUNGKUS KE DESIGN TOKENS
    const designTokens = {
      themeColor: themeColor !== undefined ? themeColor : currentTokens.themeColor,
      fontHeading: fontHeading !== undefined ? fontHeading : currentTokens.fontHeading,
      fontBody: fontBody !== undefined ? fontBody : currentTokens.fontBody,
      buttonShape: buttonShape !== undefined ? buttonShape : currentTokens.buttonShape,
      cardStyle: cardStyle !== undefined ? cardStyle : currentTokens.cardStyle,
    };
    const stringifiedTokens = JSON.stringify(designTokens);

    // UPDATE ATAU CREATE KE TABEL SITE_APPEARANCE
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
              projectId: projectId,
              orderIndex: index
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
            projectId: projectId,
            orderIndex: index
          }))
        } : undefined
      }
    });

    if (!isOnlyFavorites) {
      await logActivity(user.id, "UPDATE_THEME", `Memperbarui tema portofolio ke ${themeTemplate || 'terbaru'}`);
      
      // FIRE THE MISSILE: Hancurkan cache 60-detik untuk pengunjung publik
      if (user.profile?.subdomain) {
        // @ts-expect-error: Next.js 16.2.4 requires a second 'profile' argument for revalidateTag but we only need to invalidate the tag.
        revalidateTag(`portfolio-${user.profile.subdomain.trim().toLowerCase()}`);
      }
    }

    return NextResponse.json(updatedAppearance);
  } catch (error) {
    console.error("PATCH Appearance Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan tema" }, { status: 500 });
  }
}
