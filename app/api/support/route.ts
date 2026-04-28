import { NextResponse } from "next/server";
import { sendSupportEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Mohon lengkapi semua field." }, { status: 400 });
    }

    const result = await sendSupportEmail(name, email, message);

    if (result.success) {
      return NextResponse.json({ message: "Pesan berhasil dikirim. Kami akan segera menghubungi Anda." });
    } else {
      return NextResponse.json({ error: "Gagal mengirim pesan. Silakan coba lagi nanti." }, { status: 500 });
    }
  } catch (error) {
    console.error("Support API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
