import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// In-memory rate limiter untuk proteksi DoS (Berfungsi per-instance container)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

function isRateLimited(userId: string) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 menit
  const maxRequests = 30; // Maksimal 30 request per menit

  let record = rateLimitMap.get(userId);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(userId, record);
    return false;
  }

  record.count++;
  return record.count > maxRequests;
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isRateLimited(session.user.id)) {
      return new NextResponse("Too Many Requests. Please slow down.", { status: 429 });
    }

    const { blocks } = await req.json();

    if (!Array.isArray(blocks)) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    if (blocks.length > 50) {
      return new NextResponse("Payload terlalu besar. Maksimal 50 blok.", { status: 400 });
    }

    // Hapus blok yang sudah tidak ada di payload (dihapus oleh pengguna di editor atau karena pindah tema)
    const payloadIds = blocks.map((b: any) => b.id).filter(Boolean);
    const deletePromise = prisma.pageBlock.deleteMany({
      where: {
        userId: session.user.id,
        id: { notIn: payloadIds }
      }
    });

    // Eksekusi update secara bulk menggunakan transaksi
    const updatePromises = blocks.map((block: any) => {
      return prisma.pageBlock.upsert({
        where: { 
          id: block.id,
        },
        create: {
          id: block.id,
          userId: session.user.id,
          blockType: block.blockType || 'UNKNOWN',
          orderIndex: block.orderIndex,
          isVisible: block.isVisible
        },
        update: { 
          orderIndex: block.orderIndex,
          isVisible: block.isVisible
        }
      });
    });

    await prisma.$transaction([deletePromise, ...updatePromises]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BLOCKS_BULK_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
