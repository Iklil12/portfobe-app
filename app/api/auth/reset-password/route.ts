import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Rate limit: maks 5 request per menit (mencegah brute-force token)
    const rateLimitResponse = await checkRateLimit(5, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const { token, password } = await req.json();

    if (!token || !password || password.length < 6) {
      return NextResponse.json({ error: "Data tidak valid atau sandi minimal 6 karakter." }, { status: 400 });
    }

    // 1. Cari token di database
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetRecord) {
      return NextResponse.json({ error: "Link reset tidak valid atau sudah digunakan." }, { status: 400 });
    }

    // 2. Cek masa kadaluarsa (1 jam)
    if (new Date() > resetRecord.expires) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json({ error: "Link reset sudah kadaluarsa. Silakan minta ulang." }, { status: 400 });
    }

    // 3. Hash sandi baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Update sandi user di database
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword }
    });

    // 5. Hapus token agar tidak bisa dipakai dua kali (PENTING!)
    await prisma.passwordResetToken.delete({ where: { token } });

    // 6. Kirim notifikasi keamanan bahwa sandi berhasil diubah
    resend.emails.send({
      from: 'Portfo Security <portfosecure@mail.ritions.com>',
      to: resetRecord.email,
      subject: '🛡️ Password Successfully Reset',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; color: #334155;">
          <h2 style="color: #0f172a;">Password Successfully Updated</h2>
          <p>Hello,</p>
          <p>This is an automated notification that the password for your Portfo.be account has just been successfully changed via the "Forgot Password" feature.</p>
          <p>You can now log in using your new password.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">If you did not make this change, please contact our team immediately.</p>
        </div>
      `
    }).catch(e => console.error("Failed to send reset notification:", e));

    return NextResponse.json({ message: "Kata sandi berhasil diubah." }, { status: 200 });

  } catch (error) {
    console.error("RESET_PW_ERROR:", error);
    return NextResponse.json({ error: "A server error occurred." }, { status: 500 });
  }
}
