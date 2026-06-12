import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

// In-memory rate limit store for persistent VPS/PM2 hosting
const rateLimitMap = new Map<string, RateLimitRecord>();

// Garbage collection ringan tiap 5 menit agar RAM tidak penuh dengan IP usang
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (record.resetAt < now) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ── Helper: Ambil IP dari request ────────────────────────────────────────────
function getClientIp(req: NextRequest): string {
  return req.headers.get("x-real-ip")
    || req.headers.get("x-forwarded-for")?.split(",").pop()?.trim()
    || "unknown";
}

// ── Helper: Rate limiter ─────────────────────────────────────────────────────
function checkRate(ip: string, limit: number, windowMs: number): boolean {
  if (ip === "unknown") return false; // tidak bisa identifikasi IP → loloskan

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (record && record.resetAt < now) {
    rateLimitMap.delete(ip);
  }

  const current = rateLimitMap.get(ip);

  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false; // lolos
  }

  if (current.count >= limit) return true; // BLOCKED

  current.count += 1;
  return false; // lolos
}

// ── API Routes yang TIDAK butuh autentikasi (publik) ─────────────────────────
const PUBLIC_API_ROUTES = [
  "/api/auth",           // NextAuth endpoints (login, callback, session, dll.)
  "/api/portfolio",      // Halaman portofolio publik
  "/api/analytics/track",// Tracking visitor (tanpa login)
  "/api/pricing",        // Info harga publik
  "/api/search",         // Pencarian publik
  "/api/support",        // Form kontak publik
];

// ── API Routes khusus ADMIN ──────────────────────────────────────────────────
const ADMIN_API_ROUTES = [
  "/api/admin",
  "/api/cron",
];

// ══════════════════════════════════════════════════════════════════════════════
// PROXY FUNCTION — Named export sesuai konvensi Next.js 16
// ══════════════════════════════════════════════════════════════════════════════
export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const ip = getClientIp(req);

  // ── 1. PROTEKSI DASHBOARD — Redirect ke login jika belum auth ──────────
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Dashboard admin — hanya role ADMIN
    if (pathname.startsWith("/dashboard/admin") && token.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/not-found", req.url));
    }

    return NextResponse.next();
  }

  // ── 2. PROTEKSI API ROUTES ─────────────────────────────────────────────
  if (pathname.startsWith("/api")) {

    // 2a. API publik → loloskan langsung (tanpa cek auth)
    const isPublic = PUBLIC_API_ROUTES.some(route => pathname.startsWith(route));
    if (isPublic) {
      return NextResponse.next();
    }

    // 2b. API admin/cron → cek role ADMIN atau CRON_SECRET
    const isAdminRoute = ADMIN_API_ROUTES.some(route => pathname.startsWith(route));
    if (isAdminRoute) {
      // Cron jobs menggunakan ?key= atau Bearer token, bukan session
      if (pathname.startsWith("/api/cron")) {
        const key = req.nextUrl.searchParams.get("key");
        const bearer = req.headers.get("authorization")?.replace("Bearer ", "");
        const secret = process.env.CRON_SECRET;

        if (secret && (key === secret || bearer === secret)) {
          return NextResponse.next();
        }
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Admin API → cek session + role
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!token || token.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.next();
    }

    // 2c. API privat (projects, profile, appearance, dll.) → cek session
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit API privat: 150 request/menit/IP (Lebih ketat, tapi tetap aman untuk editor)
    if (checkRate(ip, 150, 60 * 1000)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Silakan tunggu sebentar." },
        { status: 429 }
      );
    }

    return NextResponse.next();
  }

  // ── 3. RATE LIMITER HALAMAN PUBLIK (500 req/menit/IP - Cukup untuk prefetching Next.js) ───────────────────
  if (checkRate(ip, 500, 60 * 1000)) {
    return NextResponse.rewrite(new URL("/rate-limited", req.url));
  }

  return NextResponse.next();
}

// ══════════════════════════════════════════════════════════════════════════════
// MATCHER — Sekarang mencakup SEMUA routes (halaman + API)
// Hanya mengecualikan: static files, image optimization, dan assets statis
// ══════════════════════════════════════════════════════════════════════════════
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|portfo\\.be\\.png|portfo\\.be2\\.png).*)",
  ],
};
