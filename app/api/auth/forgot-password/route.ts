import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Rate limit ketat: maks 3 request per menit (mencegah email flooding)
    const rateLimitResponse = await checkRateLimit(3, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const { email } = await req.json();

    // 1. Cari user di database
    const user = await prisma.user.findUnique({ where: { email } });

    // Keamanan Tingkat Tinggi: Jangan pernah beritahu hacker apakah email terdaftar atau tidak.
    // Jika user tidak ada atau dia daftar pakai Google, kita tetap balas "Sukses" di frontend, 
    // tapi TIDAK MENGIRIM email apa-apa di backend.
    if (!user || user.password === "GOOGLE_LOGIN_NO_PASSWORD") {
      return NextResponse.json({ message: "If the email is registered, a reset link will be sent." });
    }

    // 2. Buat Token unik & set kadaluarsa (1 jam dari sekarang)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    // 3. Hapus token lama (jika user minta berkali-kali) lalu simpan yang baru
    await prisma.passwordResetToken.deleteMany({ where: { email } });
    await prisma.passwordResetToken.create({
      data: { email, token, expires }
    });

    // 4. Buat URL Reset (Pastikan NEXTAUTH_URL sudah ada di .env Anda)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // 5. Kirim Email via Resend
    await resend.emails.send({
      from: 'Portfo Security <hellocreator@mail.ritions.com>',
      to: email,
      subject: '🔑 Reset Your Portfobe Password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <h2>Password Reset Request</h2>
          <p>Someone (hopefully you) recently requested a password reset for your Portfobe account.</p>
          <p>Please click the button below to create a new password:</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #64748b;">
            This link will expire in 1 hour. If you did not request a password reset, please ignore this email.
          </p>
        </div>
      `
    });

    return NextResponse.json({ message: "If the email is registered, a reset link will be sent." });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}