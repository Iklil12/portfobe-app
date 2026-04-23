import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(null, { status: 401 });
    }

    // Tarik semua data yang dibutuhkan oleh Layout dari Database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    if (!user) return NextResponse.json(null, { status: 404 });

    // Kembalikan versi paling segar (fresh) dari database
    return NextResponse.json({
      isLive: user.isLive,
      subdomain: user.profile?.subdomain || null,
      profession: user.profile?.profession || null,
      bio: user.profile?.bio || null,
      avatar: user.profile?.avatarUrl || user.avatar || null,
      plan: user.plan || "FREE"
    });
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}