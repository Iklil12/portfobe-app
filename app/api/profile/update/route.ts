import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
    }

    const body = await req.json();
    
    // Pastikan kita menangkap 'avatar' dari frontend
    const { firstName, lastName, profession, bio, avatar } = body; 
    
    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || "User Baru";

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        // PENTING: Paksa Prisma untuk menyimpan avatar ke database Hostinger
        avatar: avatar, 
        profile: {
          upsert: {
            create: { fullName, profession, bio },
            update: { fullName, profession, bio }
          }
        }
      },
      include: { profile: true } 
    });

    return NextResponse.json({ message: "Profil berhasil disimpan", user: updatedUser });
  } catch (error) {
    console.error("Error Simpan Profil:", error);
    return NextResponse.json({ error: "Gagal menyimpan profil" }, { status: 500 });
  }
}