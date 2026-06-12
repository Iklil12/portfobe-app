import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

// In-memory rate limit store for persistent VPS/Hosting (Sangat stabil di Node.js runtime Next 16)
const rateLimitMap = new Map<string, RateLimitRecord>();

// Garbage collection ringan tiap 5 menit
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (record.resetAt < now) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ── PERBAIKAN: Ambil IP asli dari balik Cloudflare ─────────────────────────
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") || // Prioritas utama: Header Cloudflare
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // Ambil IP pertama (pengunjung asli)
    req.headers.get("x-real-ip") ||
    "unknown"
  );
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
  "/api/auth",
  "/api/portfolio",
  "/api/analytics/track",
  "/api/pricing",
  "/api/search",
  "/api/support",
];

// ── API Routes khusus ADMIN ──────────────────────────────────────────────────
const ADMIN_API_ROUTES = [
  "/api/admin",
  "/api/cron",
];

// ══════════════════════════════════════════════════════════════════════════════
// NAMA FUNGSI TETAP PROXY (Sesuai Aturan Next.js 16)
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

    if (pathname.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/not-found", req.url));
    }

    return NextResponse.next();
  }

  // ── 2. PROTEKSI API ROUTES ─────────────────────────────────────────────
  if (pathname.startsWith("/api")) {
    const isPublic = PUBLIC_API_ROUTES.some(route => pathname.startsWith(route));
    if (isPublic) return NextResponse.next();

    const isAdminRoute = ADMIN_API_ROUTES.some(route => pathname.startsWith(route));
    if (isAdminRoute) {
      if (pathname.startsWith("/api/cron")) {
        const key = req.nextUrl.searchParams.get("key");
        const bearer = req.headers.get("authorization")?.replace("Bearer ", "");
        const secret = process.env.CRON_SECRET;

        if (secret && (key === secret || bearer === secret)) {
          return NextResponse.next();
        }
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!token || token.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit API privat: 150 request/menit/IP
    if (checkRate(ip, 150, 60 * 1000)) {
      // PERBAIKAN: Tambah Cache-Control agar blokir tidak nyangkut
      const response = NextResponse.json(
        { error: "Terlalu banyak permintaan. Silakan tunggu sebentar." },
        { status: 429 }
      );
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }

    return NextResponse.next();
  }

  // ── 3. RATE LIMITER HALAMAN PUBLIK (500 req/menit/IP) ───────────────────
  if (checkRate(ip, 500, 60 * 1000)) {
    // PERBAIKAN: Tambah Cache-Control agar blokir tidak nyangkut
    const response = NextResponse.rewrite(new URL("/rate-limited", req.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|portfo\\.be\\.png|portfo\\.be2\\.png).*)",
  ],
};