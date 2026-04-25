import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  try {
    // 1. AWAIT PARAMS: Kunci untuk error Next.js terbaru
    const resolvedParams = await params;
    
    // 2. Bersihkan teks
    const userSubdomain = resolvedParams.subdomain.trim().toLowerCase();

    // 3. Cari di database (SEKARANG KITA JADIKAN 'USER' SEBAGAI AKARNYA)
    const userData = await prisma.user.findFirst({
      where: { 
        profile: {
          subdomain: userSubdomain // Cari user berdasarkan subdomain di dalam profilnya
        }
      },
      include: {
        profile: true,
        siteAppearance: true, // <--- INI DIA BINTANG UTAMANYA!
        links: { 
          where: { isActive: true }, 
          orderBy: { order: 'asc' } 
        },
        projects: { 
          orderBy: { createdAt: 'desc' } 
        },
        certificates: { 
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // 4. Jika tidak ketemu
    if (!userData || !userData.profile) {
      return NextResponse.json({ error: "Portfolio tidak ditemukan" }, { status: 404 });
    }

    // 5. Susun Ulang Data (Biar frontend tinggal pakai tanpa ribet)
    // Karena userData sudah jadi akar, isLive, email, dll otomatis ada di luar.
    const responseData = {
      ...userData,
      name: userData.profile.fullName || userSubdomain,
      subdomain: userData.profile.subdomain
    };

    // 6. Jika sukses, kirimkan data utuh
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("🔥 CRITICAL API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}