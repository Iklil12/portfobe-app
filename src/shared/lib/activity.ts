import prisma from '@/shared/lib/prisma';
import { headers } from "next/headers";

// Fungsi pembantu untuk melacak lokasi berdasarkan IP (opsional & non-blocking)
async function getLocationFromIP(ip: string): Promise<string> {
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.")) return "Localhost";
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, {
      next: { revalidate: 3600 } // Cache hasil request selama 1 jam
    });
    const data = await res.json();
    return data.status === "success" ? `${data.city}, ${data.country}` : "Lokasi Tidak Diketahui";
  } catch {
    return "Gagal Melacak Lokasi";
  }
}

export async function logActivity(
  userId: string, 
  actionType: string, 
  details: string,
  meta?: { ip?: string; ua?: string }
) {
  try {
    let ipAddress: string | null = meta?.ip || null;
    let userAgent: string | null = meta?.ua || null;
    let location: string | null = null;

    // Jika dipanggil dalam request context, deteksi headers secara otomatis
    try {
      const headersList = await headers();
      if (!userAgent) {
        userAgent = headersList.get("user-agent");
      }
      if (!ipAddress) {
        ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || 
                    headersList.get("x-real-ip") || 
                    null;
      }
    } catch {
      // Dipanggil di luar request context (misal: script/cron), abaikan error headers()
    }

    // Ambil info lokasi geografis jika IP terdeteksi
    if (ipAddress) {
      location = await getLocationFromIP(ipAddress);
    }

    await prisma.activity.create({
      data: {
        userId,
        actionType,
        details,
        ipAddress,
        userAgent,
        location,
      }
    });
  } catch (error) {
    console.error("Gagal mencatat aktivitas:", error);
  }
}