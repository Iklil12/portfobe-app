import { invalidatePortfolioCache } from '@/lib/redis';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, isVisible } = await req.json();

    if (typeof id !== "string" || typeof isVisible !== "boolean") {
      return NextResponse.json({ error: "Invalid payload format. Expected { id: string, isVisible: boolean }" }, { status: 400 });
    }

    const updatedBlock = await prisma.pageBlock.update({
      where: { 
        id,
        // Keamanan: Pastikan user hanya bisa mengubah block miliknya sendiri
        userId: session.user.id
      },
      data: { 
        isVisible 
      },
    });

    await invalidatePortfolioCache(session.user.id);

    

    return NextResponse.json({ success: true, block: updatedBlock });
  } catch (error: any) {
    console.error("Toggle block error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
