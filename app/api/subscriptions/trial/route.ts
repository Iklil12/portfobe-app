import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * POST /api/subscriptions/trial
 * Mengaktifkan trial PRO 14 Hari untuk user yang belum pernah klaim.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 0. Ambil data user untuk cek plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, planExpiredAt: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const { isProActive } = require("@/lib/planUtils");
    if (isProActive({ plan: user.plan, planExpiredAt: user.planExpiredAt })) {
      return NextResponse.json(
        { error: "Kamu sudah memiliki langganan aktif. Tidak bisa mengklaim trial." },
        { status: 400 }
      );
    }

    // 1. Cek apakah user sudah pernah klaim trial
    const pastTrial = await prisma.transaction.findFirst({
      where: {
        userId,
        gateway: "trial",
      },
    });

    if (pastTrial) {
      return NextResponse.json(
        { error: "Kamu sudah pernah mengklaim trial PRO sebelumnya." },
        { status: 400 }
      );
    }

    // 2. Kalkulasi masa aktif (14 Hari dari sekarang)
    const now = new Date();
    const durationDays = 14;
    const expiredAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // 3. Matikan subscription PRO aktif lainnya jika ada (walaupun harusnya tidak ada jika dia FREE)
    await prisma.subscription.updateMany({
      where: { userId, status: "ACTIVE", plan: "PRO" },
      data: { status: "CANCELLED" },
    });

    // 4. Buat Subscription baru
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        plan: "PRO",
        status: "ACTIVE",
        startedAt: now,
        expiredAt,
        grantedBy: "System (Trial)",
        notes: "14-Day Free Trial",
      },
    });

    // 5. Buat Record Transaksi untuk audit trail
    await prisma.transaction.create({
      data: {
        userId,
        amount: 0,
        status: "SUCCESS",
        plan: "PRO",
        durationDays,
        gateway: "trial",
        subscriptionId: subscription.id,
      },
    });

    // 6. Update User profile plan & expiry
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "PRO",
        planExpiredAt: expiredAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Trial PRO 14 Hari berhasil diaktifkan!",
      subscription,
    });
  } catch (error) {
    console.error("POST /api/subscriptions/trial error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem saat mengaktifkan trial." },
      { status: 500 }
    );
  }
}
