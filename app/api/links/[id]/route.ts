import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Perhatikan: params sekarang dibungkus dalam Promise
export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 1. UNWRAP params-nya dulu
    const { id } = await params; 
    const body = await req.json();

    const updatedLink = await prisma.link.update({
      where: { id: id }, // Sekarang id sudah terdefinisi
      data: { ...body }
    });

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. UNWRAP params-nya dulu
    const { id } = await params;

    await prisma.link.delete({
      where: { id: id } // Sekarang id sudah terdefinisi
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}