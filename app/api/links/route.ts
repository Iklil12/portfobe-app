import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// AMBIL SEMUA LINK USER
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await prisma.link.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { order: 'asc' }
  });

  return NextResponse.json(links);
}

// TAMBAH LINK BARU
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const newLink = await prisma.link.create({
    data: {
      userId: user.id,
      platform: "Baru",
      url: "https://",
      isActive: true,
      order: 0
    }
  });

  return NextResponse.json(newLink);
}