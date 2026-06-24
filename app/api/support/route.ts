import { NextResponse } from "next/server";
import { sendSupportEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // --- IP RATE LIMITING UNTUK MENCEGAH SPAM ---
    // Menggunakan in-memory rate limiter khusus agar tidak bertabrakan dengan RegisterAttempt
    // Batas: 5 pesan per 1 jam (60 * 60 * 1000 ms)
    const rateLimitRes = await checkRateLimit(5, 60 * 60 * 1000);
    if (rateLimitRes) {
      return NextResponse.json({ error: "Terlalu banyak pesan terkirim. Silakan coba lagi dalam 1 jam." }, { status: 429 });
    }
    // --------------------------------------------

    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Mohon lengkapi semua field." }, { status: 400 });
    }

    const result = await sendSupportEmail(name, email, message);

    if (result.success) {
      return NextResponse.json({ message: "Message sent successfully. We will contact you shortly." });
    } else {
      return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 500 });
    }
  } catch (error) {
    console.error("Support API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


