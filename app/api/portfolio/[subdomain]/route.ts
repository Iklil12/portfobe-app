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

    // 3. Cari di database
    const profile = await prisma.profile.findFirst({
      where: { 
        subdomain: userSubdomain 
      },
      include: {
        user: {
          include: {
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
        }
      }
    });

    // 4. Jika tidak ketemu
    if (!profile) {
      return NextResponse.json({ error: "Portfolio tidak ditemukan" }, { status: 404 });
    }

    // --- 5. FIX: KELUARKAN STATUS ISLIVE KE DEPAN ---
    // Kita gunakan "as any" agar TypeScript tidak protes saat proses Build
    const userData = profile.user as any;
    const profileData = profile as any;

    const responseData = {
      ...profile,
      isLive: userData?.isLive ?? true, // Ambil isLive dari dalam user (default true)
      // Coba ambil fullName dari profile, atau dari user, atau gunakan subdomain
      name: profileData?.fullName || userData?.fullName || userData?.name || userSubdomain 
    };

    // 6. Jika sukses, kirimkan data yang sudah dirapikan
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("🔥 CRITICAL API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}