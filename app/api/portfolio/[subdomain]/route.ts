import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  try {
    // 1. AWAIT PARAMS: Ini adalah kunci untuk mengatasi error Next.js terbaru
    const resolvedParams = await params;
    
    // 2. Bersihkan teks: Hilangkan spasi tidak sengaja dan ubah ke huruf kecil
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

    // 5. Jika sukses
    return NextResponse.json(profile);
    
  } catch (error) {
    console.error("🔥 CRITICAL API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}