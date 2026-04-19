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

    // CARI USER BESERTA PROFILNYA
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        profile: true // KUNCI UTAMA: Wajib 'true' agar data subdomain ditarik dari database
      } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Menggabungkan data user dan profil agar frontend bisa langsung membacanya
    return NextResponse.json({
      ...user,
      ...user.profile 
    });

  } catch (error) {
    console.error("Error Fetch Profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}