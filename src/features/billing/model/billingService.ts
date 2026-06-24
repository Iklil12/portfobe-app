import prisma from '@/shared/lib/prisma';
import { formatPlanExpiry, getRemainingDays, isProActive } from '@/features/billing';

export async function getPricingPlans() {
  const plans = await prisma.pricingPlan.findMany({
    where: { isActive: true },
  });

  const formattedPricing: Record<string, any> = {};

  plans.forEach(plan => {
    formattedPricing[plan.code] = {
      name: plan.name,
      monthly: {
        price: plan.monthlyPrice,
        original: plan.monthlyOriginal,
        total: plan.monthlyPrice
      },
      yearly: {
        price: plan.yearlyPrice,
        original: plan.yearlyOriginal,
        total: plan.yearlyPrice * 12,
        originalTotal: plan.yearlyOriginal * 12
      }
    };
  });

  return formattedPricing;
}

export async function getSubscriptionDetails(userId: string) {
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

  const hasClaimedTrial = transactions.some(t => t.gateway === "trial");
  const canClaimTrial = !hasClaimedTrial;

  return {
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
  };
}

export async function activateTrial(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiredAt: true }
  });

  if (!user) throw new Error("404:User tidak ditemukan");

  if (isProActive({ plan: user.plan, planExpiredAt: user.planExpiredAt })) {
    throw new Error("400:Kamu sudah memiliki langganan aktif. Tidak bisa mengklaim trial.");
  }

  const pastTrial = await prisma.transaction.findFirst({
    where: {
      userId,
      gateway: "trial",
    },
  });

  if (pastTrial) throw new Error("400:Kamu sudah pernah mengklaim trial PRO sebelumnya.");

  const now = new Date();
  const durationDays = 14;
  const expiredAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  await prisma.subscription.updateMany({
    where: { userId, status: "ACTIVE", plan: "PRO" },
    data: { status: "CANCELLED" },
  });

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

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: "PRO",
      planExpiredAt: expiredAt,
    },
  });

  return {
    success: true,
    message: "Trial PRO 14 Hari berhasil diaktifkan!",
    subscription,
  };
}

export async function validateCoupon(email: string | null | undefined, code: string, plan: string, subtotal: number) {
  if (!code) throw new Error("400:Kode kupon diperlukan");

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() }
  });

  if (!coupon) throw new Error("404:Kode kupon tidak ditemukan");
  if (!coupon.isActive) throw new Error("400:Kupon ini sedang dinonaktifkan");

  const now = new Date();
  if (coupon.validFrom && now < coupon.validFrom) throw new Error("400:Kupon ini belum bisa digunakan");
  if (coupon.validUntil && now > coupon.validUntil) throw new Error("400:Kupon ini sudah kedaluwarsa");
  if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) throw new Error("400:Batas penggunaan kupon sudah habis");

  if (coupon.minPurchase !== null && coupon.minPurchase !== undefined) {
    if (subtotal !== undefined && subtotal < coupon.minPurchase) {
      throw new Error(`400:Minimal pembelian untuk menggunakan kupon ini adalah Rp ${coupon.minPurchase.toLocaleString('id-ID')}`);
    }
  }

  if (coupon.allowedPlan && coupon.allowedPlan !== "ALL") {
    if (plan && plan !== coupon.allowedPlan) {
      throw new Error(`400:Kupon ini hanya berlaku untuk pembelian paket ${coupon.allowedPlan.toUpperCase()}`);
    }
  }

  if (coupon.maxUsesPerUser) {
    if (!email) throw new Error("401:Harap masuk terlebih dahulu untuk menggunakan kupon ini");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("404:Pengguna tidak ditemukan");

    const userUsageCount = await prisma.couponUsage.count({
      where: { couponId: coupon.id, userId: user.id }
    });

    if (userUsageCount >= coupon.maxUsesPerUser) {
      throw new Error(`400:Anda sudah menggunakan kupon ini sebanyak batas maksimal (${coupon.maxUsesPerUser} kali)`);
    }
  }

  return {
    success: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase,
      allowedPlan: coupon.allowedPlan
    }
  };
}

export async function getReceiptDetails(userId: string, id: string) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      user: {
        select: {
          email: true,
          profile: {
            select: { fullName: true, location: true },
          },
        },
      },
    },
  });

  if (!transaction) throw new Error("404:Transaksi tidak ditemukan");

  const year = new Date(transaction.createdAt).getFullYear();
  const shortId = transaction.id.replace(/-/g, "").substring(0, 8).toUpperCase();
  const receiptNumber = `PORTFO-${year}-${shortId}`;

  return {
    receiptNumber,
    id: transaction.id,
    plan: transaction.plan,
    status: transaction.status,
    amount: transaction.amount,
    durationDays: transaction.durationDays,
    gateway: transaction.gateway,
    createdAt: transaction.createdAt,
    user: {
      email: transaction.user.email,
      fullName: transaction.user.profile?.fullName || transaction.user.email,
      location: transaction.user.profile?.location || "Indonesia",
    },
  };
}
