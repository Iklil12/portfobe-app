import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
    }

    // Cari data user beserta profilnya
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true } 
    });

    if (!user) {
      return NextResponse.json(null);
    }

    // PENTING: Gabungkan data profil dengan kolom 'avatar' dari tabel User
    const responseData = {
      fullName: user.profile?.fullName || "",
      profession: user.profile?.profession || "",
      bio: user.profile?.bio || "",
      avatar: user.avatar || "" // <--- Tambahan agar foto ikut terkirim
    };

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("Error Mengambil Profil:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}