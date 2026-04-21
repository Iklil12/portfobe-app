import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

// MENGAMBIL TEMA & PROFIL YANG SEDANG DIPAKAI
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findFirst({
      where: { user: { email: session.user.email } },
      include: {
        user: {
          include: {
            links: { orderBy: { order: 'asc' } },
            projects: { orderBy: { createdAt: 'desc' } },
            certificates: { orderBy: { createdAt: 'desc' } }
          }
        }
      }
    });

    if (!profile) return NextResponse.json({});

    // Kirim semua data termasuk links dan projects untuk preview 100% mirip
    return NextResponse.json(profile);
  } catch (error) {
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
    
    // 1. TANGKAP splashScreen DARI FRONTEND
    const { 
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen // <--- Tambahkan ini
    } = body;

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: { 
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen // <--- 2. UPDATE KE DATABASE
      },
      create: {
        userId: user.id,
        fullName: session.user.name || session.user.email.split('@')[0], 
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen // <--- 3. INSERT KE DATABASE (JIKA PROFIL BARU)
      }
    });

    await logActivity(user.id, "UPDATE_THEME", `Memperbarui tema portofolio ke ${themeTemplate}`);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("PATCH Appearance Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan tema" }, { status: 500 });
  }
}