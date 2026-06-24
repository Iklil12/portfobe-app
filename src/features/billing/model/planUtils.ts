// lib/planUtils.ts
// Helper untuk pengecekan status plan yang akurat

/**
 * Cek apakah user memiliki plan premium (PRO/SUPREME) yang masih aktif.
 * - plan=PRO/SUPREME + expiredAt=null → lifetime, selalu aktif
 * - plan=PRO/SUPREME + expiredAt > now → aktif
 * - plan=PRO/SUPREME + expiredAt <= now → sudah expired, treat as FREE
 * - plan=FREE → tidak aktif
 */
export function isProActive(user: { plan: string; planExpiredAt: Date | null }): boolean {
  if (user.plan === "FREE") return false;
  if (!user.planExpiredAt) return true; // Lifetime (admin grant tanpa expiry)
  
  // Tambahkan Grace Period 3 hari agar sinkron dengan cron job
  const gracePeriodMs = 3 * 24 * 60 * 60 * 1000;
  const actualExpiry = new Date(user.planExpiredAt.getTime() + gracePeriodMs);
  
  return actualExpiry > new Date();
}

/**
 * Ambil plan efektif berdasarkan kondisi real-time.
 * Ini yang seharusnya dipakai untuk enforcement, bukan langsung user.plan
 */
export function getEffectivePlan(user: {
  plan: string;
  planExpiredAt: Date | null;
}): "FREE" | "PRO" | "SUPREME" {
  if (!isProActive(user)) return "FREE";
  return user.plan as "PRO" | "SUPREME";
}

/**
 * Hitung sisa hari plan premium.
 * Return null jika FREE, 0 jika sudah expired, -1 jika lifetime
 */
export function getRemainingDays(user: {
  plan: string;
  planExpiredAt: Date | null;
}): number | null {
  if (user.plan === "FREE") return null;
  if (!user.planExpiredAt) return -1; // -1 = lifetime
  const msLeft = user.planExpiredAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}

/**
 * Format sisa waktu PRO untuk ditampilkan ke user
 */
export function formatPlanExpiry(planExpiredAt: Date | null): string {
  if (!planExpiredAt) return "Seumur Hidup";
  const remaining = Math.ceil(
    (planExpiredAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  
  if (remaining <= 0) {
    // Cek apakah masuk grace period (maksimal 3 hari lewat)
    const gracePeriodRemaining = remaining + 3;
    if (gracePeriodRemaining > 0) {
      return `Masa Tenggang (${gracePeriodRemaining} hari)`;
    }
    return "Sudah berakhir";
  }
  
  if (remaining === 1) return "Berakhir besok";
  return `${remaining} hari lagi`;
}
