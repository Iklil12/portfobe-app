// lib/rate-limit.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { redis } from "@/lib/redis";

/**
 * Global Rate Limiter menggunakan Redis (Distributed & Serverless Safe)
 * @param limit Batas jumlah request (default 60)
 * @param windowMs Jendela waktu dalam milidetik (default 1 menit / 60000ms)
 * @returns NextResponse (jika diblokir) atau null (jika lolos)
 */
export async function checkRateLimit(
  limit: number = 60,
  windowMs: number = 60 * 1000,
  identifier: string = "global"
) {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    
    let ip = "unknown";
    if (realIp) {
      ip = realIp;
    } else if (forwardedFor) {
      const ips = forwardedFor.split(",").map(i => i.trim());
      ip = ips[ips.length - 1];
    }

    if (ip === "unknown" || ip === "127.0.0.1" || ip === "::1") return null;

    const rateLimitKey = `rate_limit:${identifier}:${ip}`;
    
    const requestCount = await redis.incr(rateLimitKey);
    
    if (requestCount === 1) {
      // Set TTL hanya pada request pertama dalam window ini
      await redis.pexpire(rateLimitKey, windowMs);
    }

    if (requestCount > limit) {
      return NextResponse.json(
        { error: "Sistem mendeteksi aktivitas tidak wajar (terlalu banyak permintaan). Silakan tunggu sebentar." }, 
        { status: 429 }
      );
    }

    return null; // Lolos
  } catch (error) {
    console.warn("⚠️ Redis Global Rate Limit Error:", error);
    // Fail-open: Jika redis mati, biarkan request lewat agar aplikasi tidak down total
    return null;
  }
}
