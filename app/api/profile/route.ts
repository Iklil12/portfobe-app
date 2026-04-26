// app/api/profile/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        profile: true,
        siteAppearance: true 
      } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      ...user.profile 
    });

  } catch (error) {
    console.error("Error Fetch Profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// ... (Kodingan GET dan PUT yang sudah ada biarkan saja) ...

// --- 3. FUNGSI POST (UNTUK VALIDASI SUBDOMAIN SECARA REAL-TIME) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Kalau request-nya minta tolong cek subdomain
    if (body.action === 'check_subdomain') {
      const { subdomain } = body;

      if (!subdomain) {
        return NextResponse.json({ error: "Subdomain kosong" }, { status: 400 });
      }

      // Cek di database apakah subdomain ini sudah ada yang punya
      const existingProfile = await prisma.profile.findUnique({
        where: { subdomain: subdomain.toLowerCase() }
      });

      // Kalau sudah ada yang punya, tolak!
      if (existingProfile) {
        return NextResponse.json({ available: false, message: "URL ini sudah dipakai kreator lain." });
      }

      // Kalau kosong, berarti aman!
      return NextResponse.json({ available: true });
    }

    return NextResponse.json({ error: "Aksi tidak dikenali" }, { status: 400 });

  } catch (error) {
    console.error("Check Subdomain Error:", error);
    return NextResponse.json({ error: "Gagal mengecek ke server." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subdomain, fullName, profession } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (subdomain) {
      if (subdomain.length < 3 || subdomain.length > 15) {
        return NextResponse.json({ error: "Subdomain harus antara 3 hingga 15 karakter." }, { status: 400 });
      }
      if (!/^[a-zA-Z0-9]+$/.test(subdomain)) {
        return NextResponse.json({ error: "Format subdomain tidak valid." }, { status: 400 });
      }
      
      const existingProfile = await prisma.profile.findUnique({
        where: { subdomain: subdomain.toLowerCase() }
      });

      if (existingProfile && existingProfile.userId !== user.id) {
        return NextResponse.json({ error: "URL ini sudah dipakai oleh kreator lain." }, { status: 400 });
      }
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        ...(subdomain !== undefined && { subdomain: subdomain.toLowerCase() }),
        ...(fullName !== undefined && { fullName }),
        ...(profession !== undefined && { profession })
      },
      create: {
        userId: user.id,
        fullName: fullName || session.user.name || "Creator",
        subdomain: subdomain ? subdomain.toLowerCase() : null,
        profession: profession || null
      }
    });

    if (subdomain) {
      await prisma.activity.create({
        data: {
          userId: user.id,
          actionType: 'UPDATE_PROFILE',
          details: `Klaim URL portofolio baru: "${subdomain}"`
        }
      });
    }

    return NextResponse.json({ 
      message: "Profil berhasil diperbarui", 
      profile: updatedProfile 
    });

  } catch (error) {
    console.error("Error Update Profile:", error);
    return NextResponse.json({ error: "Gagal memproses data di server." }, { status: 500 });
  }
}