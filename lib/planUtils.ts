// lib/planUtils.ts
// Helper untuk pengecekan status plan yang akurat

/**
 * Cek apakah user memiliki PRO yang masih aktif.
 * - plan=PRO + expiredAt=null → lifetime, selalu aktif
 * - plan=PRO + expiredAt > now → aktif
 * - plan=PRO + expiredAt <= now → sudah expired, treat as FREE
 * - plan=FREE → tidak aktif
 */
export function isProActive(user: { plan: string; planExpiredAt: Date | null }): boolean {
  if (user.plan !== "PRO") return false;
  if (!user.planExpiredAt) return true; // Lifetime PRO (admin grant tanpa expiry)
  return user.planExpiredAt > new Date();
}

/**
 * Ambil plan efektif berdasarkan kondisi real-time.
 * Ini yang seharusnya dipakai untuk enforcement, bukan langsung user.plan
 */
export function getEffectivePlan(user: {
  plan: string;
  planExpiredAt: Date | null;
}): "FREE" | "PRO" {
  return isProActive(user) ? "PRO" : "FREE";
}

/**
 * Hitung sisa hari PRO.
 * Return null jika bukan PRO, 0 jika sudah expired, -1 jika lifetime
 */
export function getRemainingDays(user: {
  plan: string;
  planExpiredAt: Date | null;
}): number | null {
  if (user.plan !== "PRO") return null;
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
  if (remaining <= 0) return "Sudah berakhir";
  if (remaining === 1) return "Berakhir besok";
  return `${remaining} hari lagi`;
}
