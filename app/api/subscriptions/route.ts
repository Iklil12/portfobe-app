import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { formatPlanExpiry, getRemainingDays } from "@/lib/planUtils";

/**
 * GET /api/subscriptions
 * Ambil subscription aktif + riwayat lengkap untuk halaman Billing
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [user, activeSub, allSubscriptions, transactions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true, planExpiredAt: true, createdAt: true },
      }),
      prisma.subscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
          plan: { in: ["PRO", "SUPREME"] },
          OR: [
            { expiredAt: null },
            { expiredAt: { gt: new Date() } },
          ],
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.subscription.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const remainingDays = user ? getRemainingDays({ plan: user.plan, planExpiredAt: user.planExpiredAt ?? null }) : null;

    // Cek kelayakan trial: User belum pernah mengklaim trial sebelumnya
    const hasClaimedTrial = transactions.some(t => t.gateway === "trial");
    const canClaimTrial = !hasClaimedTrial;

    return NextResponse.json({
      plan: user?.plan || "FREE",
      planExpiredAt: user?.planExpiredAt || null,
      memberSince: user?.createdAt || null,
      remainingDays,
      canClaimTrial,
      subscription: activeSub
        ? {
            id: activeSub.id,
            status: activeSub.status,
            startedAt: activeSub.startedAt,
            expiredAt: activeSub.expiredAt,
            isLifetime: activeSub.expiredAt === null,
            expiryText: formatPlanExpiry(activeSub.expiredAt),
            grantedBy: activeSub.grantedBy,
            notes: activeSub.notes,
          }
        : null,
      subscriptionHistory: allSubscriptions.map(s => ({
        id: s.id,
        plan: s.plan,
        status: s.status,
        startedAt: s.startedAt,
        expiredAt: s.expiredAt,
        isLifetime: s.expiredAt === null,
        grantedBy: s.grantedBy,
        notes: s.notes,
        createdAt: s.createdAt,
      })),
      transactions: transactions.map(t => ({
        id: t.id,
        plan: t.plan,
        status: t.status,
        amount: t.amount,
        durationDays: t.durationDays,
        gateway: t.gateway,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/subscriptions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
