import prisma from '@/shared/lib/prisma';
import bcrypt from "bcrypt";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function processForgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Keamanan Tingkat Tinggi: Jangan pernah beritahu hacker apakah email terdaftar atau tidak.
  // Jika user tidak ada atau dia daftar pakai Google, kita tetap balas "Sukses" di frontend, 
  // tapi TIDAK MENGIRIM email apa-apa di backend.
  if (!user || user.password === "GOOGLE_LOGIN_NO_PASSWORD") {
    return true;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1 jam

  await prisma.passwordResetToken.deleteMany({ where: { email } });
  await prisma.passwordResetToken.create({
    data: { email, token, expires }
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'Portfo Security <hellocreator@mail.ritions.com>',
    to: email,
    subject: 'Reset Your Portfobe Password',
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

  return true;
}

export async function processResetPassword(token: string, password: string) {
  if (!token || !password || password.length < 6) {
    throw new Error("INVALID_DATA");
  }

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { token }
  });

  if (!resetRecord) {
    throw new Error("INVALID_TOKEN");
  }

  if (new Date() > resetRecord.expires) {
    await prisma.passwordResetToken.delete({ where: { token } });
    throw new Error("EXPIRED_TOKEN");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: resetRecord.email },
    data: { password: hashedPassword }
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  resend.emails.send({
    from: 'Portfo Security <portfosecure@mail.ritions.com>',
    to: resetRecord.email,
    subject: 'Password Successfully Reset',
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

  return true;
}
