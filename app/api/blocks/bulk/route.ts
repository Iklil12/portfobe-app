import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { blocks } = await req.json();

    if (!Array.isArray(blocks)) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    // Eksekusi update secara bulk menggunakan transaksi
    const updatePromises = blocks.map((block: any) => {
      return prisma.pageBlock.updateMany({
        where: { 
          id: block.id,
          userId: session.user.id // Pastikan hanya milik user ini
        },
        data: { 
          orderIndex: block.orderIndex,
          isVisible: block.isVisible
        }
      });
    });

    await prisma.$transaction(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BLOCKS_BULK_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
