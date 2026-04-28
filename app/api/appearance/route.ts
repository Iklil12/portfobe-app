//app/api/appearance/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

// MENGAMBIL TEMA & PROFIL YANG SEDANG DIPAKAI (UNTUK PREVIEW)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Tarik data dari User sebagai induknya, lalu include semua relasinya
    const userData = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        siteAppearance: true, // <--- Panggil tabel baru di sini
        links: { orderBy: { order: 'asc' } },
        projects: { orderBy: { createdAt: 'desc' } },
        certificates: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!userData) return NextResponse.json({});

    // Kirim semua data secara utuh untuk dirender di halaman preview
    return NextResponse.json(userData);
  } catch (error) {
    console.error("GET Appearance Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// MENYIMPAN PERUBAHAN TEMA
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    
    // TANGKAP DATA DARI FRONTEND
    const { 
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen
    } = body;

    // --- PLAN ENFORCEMENT: PRO FEATURES ---
    const proThemes = ['brutalism', 'cinematic', 'acid'];
    const isProTheme = proThemes.includes(themeTemplate);
    const isProSplash = splashScreen === true;

    if ((isProTheme || isProSplash) && user.plan === 'FREE') {
      return NextResponse.json({ 
        error: isProTheme 
          ? "Tema ini eksklusif untuk PRO Creator." 
          : "Fitur Cinematic Intro eksklusif untuk PRO Creator.",
        code: "FEATURE_LOCKED" // Ubah jadi lebih umum
      }, { status: 403 });
    }
    // ------------------------------------

    // UPDATE ATAU CREATE KE TABEL SITE_APPEARANCE
    const updatedAppearance = await prisma.siteAppearance.upsert({
      where: { userId: user.id },
      update: { 
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen
      },
      create: {
        userId: user.id, // Sambungkan ke User yang sedang login
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen
      }
    });

    await logActivity(user.id, "UPDATE_THEME", `Memperbarui tema portofolio ke ${themeTemplate}`);

    return NextResponse.json(updatedAppearance);
  } catch (error) {
    console.error("PATCH Appearance Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan tema" }, { status: 500 });
  }
}