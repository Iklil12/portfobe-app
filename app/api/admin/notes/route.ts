import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const notes = await prisma.adminNote.findMany({
      where: {
        userId: session.user.id,
        ...(type ? { type } : {})
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(notes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
    }

    const body = await req.json();
    const { content, type } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const note = await prisma.adminNote.create({
      data: {
        content,
        type: type || "IDEA",
        userId: session.user.id
      }
    });

    return NextResponse.json(note);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
