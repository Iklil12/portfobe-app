import prisma from '@/shared/lib/prisma';
import { redis } from '@/shared/lib/redis';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function deleteUserAccount(email: string, emailConfirmation: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  // Verifikasi: user harus mengetik ulang email-nya sebagai konfirmasi
  if (!emailConfirmation || emailConfirmation.toLowerCase() !== user.email.toLowerCase()) {
    throw new Error("EMAIL_MISMATCH");
  }

  // Delete all user related data in a transaction (lengkap semua relasi)
  await prisma.$transaction([
    prisma.analytics.deleteMany({ where: { userId: user.id } }),
    prisma.visitorSession.deleteMany({ where: { userId: user.id } }),
    prisma.dailyStats.deleteMany({ where: { userId: user.id } }),
    prisma.dailyDeviceStats.deleteMany({ where: { userId: user.id } }),
    prisma.dailyReferrerStats.deleteMany({ where: { userId: user.id } }),
    prisma.dailyLocationStats.deleteMany({ where: { userId: user.id } }),
    prisma.hourlyStats.deleteMany({ where: { userId: user.id } }),
    prisma.activity.deleteMany({ where: { userId: user.id } }),
    prisma.adminNote.deleteMany({ where: { userId: user.id } }),
    prisma.canvaProject.deleteMany({ where: { userId: user.id } }),
    prisma.couponUsage.deleteMany({ where: { userId: user.id } }),
    prisma.testimonial.deleteMany({ where: { userId: user.id } }),
    prisma.pageBlock.deleteMany({ where: { userId: user.id } }),
    prisma.themeFavorite.deleteMany({ where: { userId: user.id } }),
    prisma.themeDraft.deleteMany({ where: { userId: user.id } }),
    prisma.subscription.deleteMany({ where: { userId: user.id } }),
    prisma.transaction.deleteMany({ where: { userId: user.id } }),
    prisma.certificate.deleteMany({ where: { userId: user.id } }),
    prisma.project.deleteMany({ where: { userId: user.id } }),
    prisma.link.deleteMany({ where: { userId: user.id } }),
    prisma.integration.deleteMany({ where: { userId: user.id } }),
    prisma.profile.deleteMany({ where: { userId: user.id } }),
    prisma.siteAppearance.deleteMany({ where: { userId: user.id } }),
    prisma.account.deleteMany({ where: { userId: user.id } }),
    prisma.user.delete({ where: { id: user.id } })
  ]);

  return true;
}

export async function requestEmailChange(email: string, newEmail: string, password: string) {
  if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
    throw new Error("INVALID_EMAIL");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  if (user.password === "GOOGLE_LOGIN_NO_PASSWORD") {
    throw new Error("GOOGLE_ACCOUNT");
  }

  // Verifikasi password sebelum mengijinkan perubahan email
  if (!password) throw new Error("PASSWORD_REQUIRED");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("INVALID_PASSWORD");

  const existingEmailUser = await prisma.user.findUnique({ where: { email: newEmail } });
  if (existingEmailUser) {
    throw new Error("EMAIL_TAKEN");
  }

  // Generate unique token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await prisma.user.update({
    where: { id: user.id },
    data: { pendingEmail: newEmail }
  });

  await prisma.verificationToken.create({
    data: {
      identifier: user.email, 
      token: token,
      expires: expiresAt,
    }
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const magicLink = `${baseUrl}/api/account/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'Portfo Security <portfosecure@mail.ritions.com>',
    to: newEmail,
    subject: 'Confirm your new email address',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; border: 1px solid #e2e8f0; border-radius: 24px;">
        <h2 style="color: #0f172a;">Verify New Email</h2>
        <p>Please click the button below to confirm your new email for your Portfo.be account.</p>
        <a href="${magicLink}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Verify Email</a>
        <p>This link is only valid for <strong>15 minutes</strong>.</p>
      </div>
    `,
  });

  return true;
}

export async function verifyEmailChange(token: string) {
  const verification = await prisma.verificationToken.findUnique({
    where: { token }
  });

  if (!verification) {
    throw new Error("INVALID_TOKEN");
  }

  const user = await prisma.user.findUnique({
    where: { email: verification.identifier }
  });

  if (!user || !user.pendingEmail) {
    throw new Error("INVALID_TOKEN");
  }

  if (new Date() > verification.expires) {
    throw new Error("EXPIRED_TOKEN");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      email: user.pendingEmail,
      pendingEmail: null,
    }
  });

  await prisma.verificationToken.delete({
    where: { token }
  });

  return true;
}

export async function updatePassword(email: string, currentPassword: string, newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("INVALID_PASSWORD_LENGTH");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const isGoogleLogin = user.password === "GOOGLE_LOGIN_NO_PASSWORD";

  if (!isGoogleLogin) {
    if (!currentPassword) throw new Error("CURRENT_PASSWORD_REQUIRED");
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) throw new Error("CURRENT_PASSWORD_INVALID");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: user.email },
    data: { password: hashedNewPassword }
  });

  resend.emails.send({
    from: 'Portfo Security <portfosecure@mail.ritions.com>',
    to: user.email,
    subject: 'Security Notice: Password Successfully Changed',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; border: 1px solid #e2e8f0; border-radius: 24px;">
        <h2 style="color: #0f172a;">Password Successfully Updated</h2>
        <p>This message is sent to confirm that the password for your Portfo.be account has just been successfully changed.</p>
        <p>If this was you, then you don't need to do anything. If not, contact our support team immediately.</p>
      </div>
    `,
  }).catch(err => console.error("Failed to send password notification:", err));

  return true;
}

export async function getAccountStatus(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { isLive: true }
  });
  return { isLive: user?.isLive ?? true };
}

export async function updateAccountStatus(email: string, isLive: boolean) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  });

  if (!user) throw new Error("USER_NOT_FOUND");

  if (isLive === true) {
    if (user.emailVerified === null) {
      throw new Error("EMAIL_NOT_VERIFIED");
    }
  }

  await prisma.user.update({
    where: { email },
    data: { isLive },
  });

  // INVALIDATE REDIS CACHE AGAR PERUBAHAN INSTAN
  if (user.profile?.subdomain) {
    try {
      await redis.del(`portfolio_db:${user.profile.subdomain.trim().toLowerCase()}`);
    } catch (err) {
      console.error("Gagal menghapus cache redis saat mengubah status", err);
    }
  }

  // INVALIDATE DASHBOARD SYNC CACHE JUGA BIAR REALTIME
  try {
    const keys = await redis.keys(`dashboard:sync:${user.id}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.error("Gagal menghapus cache dashboard sync redis", err);
  }

  return { isLive };
}
