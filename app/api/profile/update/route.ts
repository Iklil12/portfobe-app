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
    const { firstName, lastName, profession, bio } = body;
    
    // Siapkan nama lengkap, pastikan tidak kosong
    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || "User Baru";

    // Simpan ke tabel Profile melalui relasi User
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        profile: {
          upsert: {
            // Jika user baru pertama kali simpan profil, gunakan ini (Create)
            create: {
              fullName: fullName,
              profession: profession,
              bio: bio,
            },
            // Jika user sudah punya profil dan ingin mengubahnya, gunakan ini (Update)
            update: {
              fullName: fullName,
              profession: profession,
              bio: bio,
            }
          }
        }
      },
      include: { profile: true } // Kembalikan data profil agar bisa dibaca frontend
    });

    return NextResponse.json({ message: "Profil berhasil disimpan", user: updatedUser });
  } catch (error) {
    console.error("Error Simpan Profil:", error);
    return NextResponse.json({ error: "Gagal menyimpan profil" }, { status: 500 });
  }
}