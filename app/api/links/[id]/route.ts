import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

// PATCH: Mengupdate informasi link (Nama Platform, URL, atau Status Active)
export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; 
    const body = await req.json();

    const updatedLink = await prisma.link.update({
      where: { id: id },
      data: { ...body }
    });

    // RECORD ACTIVITY
    await logActivity(
      updatedLink.userId, 
      "UPDATE_LINK", 
      `Memperbarui tautan "${updatedLink.platform}"`
    );

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

// DELETE: Menghapus link secara permanen
export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Cari dulu data link sebelum dihapus untuk mendapatkan informasi userId dan platform
    const link = await prisma.link.findUnique({ where: { id: id } });
    if (!link) return NextResponse.json({ error: "Link tidak ditemukan" }, { status: 404 });

    await prisma.link.delete({ where: { id: id } });

    // RECORD ACTIVITY
    await logActivity(
      link.userId, 
      "DELETE_LINK", 
      `Menghapus tautan "${link.platform}" dari profil`
    );

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}