import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;
    const body = await req.json();

    const note = await prisma.adminNote.update({
      where: { id },
      data: { isCompleted: body.isCompleted }
    });

    return NextResponse.json(note);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;

    await prisma.adminNote.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
