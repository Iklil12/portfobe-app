import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blocks } = await req.json();

    if (!Array.isArray(blocks)) {
      return NextResponse.json({ error: "Invalid payload format. Expected an array of blocks." }, { status: 400 });
    }

    // Menggunakan Prisma transaction untuk memastikan semua update berhasil secara bersamaan
    const transactions = blocks.map((block: { id: string, orderIndex: number }) => {
      return prisma.pageBlock.update({
        where: { 
          id: block.id,
          // Keamanan: Pastikan user hanya bisa mengubah block miliknya sendiri
          userId: session.user.id 
        },
        data: { 
          orderIndex: block.orderIndex 
        },
      });
    });

    await prisma.$transaction(transactions);

    return NextResponse.json({ success: true, message: "Blocks reordered successfully" });
  } catch (error: any) {
    console.error("Reorder blocks error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
