"use server";

import prisma from '@/shared/lib/prisma';
import bcrypt from "bcrypt";
import { Resend } from "resend"; // <-- 1. IMPORT RESEND DI SINI
import { headers } from "next/headers";
import crypto from "crypto";
import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name is too short").max(100, "Name is too long"),
  email: z.string().email("Invalid email format").max(100, "Email is too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password is too long"),
});

// <-- 2. INISIALISASI RESEND (Di luar function agar hemat memori server)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerUser(formData: FormData) {
  // --- -1. INPUT VALIDATION (ZOD) ---
  const parsedData = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0].message };
  }

  const { fullName, email, password } = parsedData.data;

  try {
    // --- 0. RATE LIMITING (IP-BASED) ---
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    
    // Mencegah IP Spoofing dengan memprioritaskan x-real-ip (diset oleh server) 
    // atau mengambil elemen pertama dari x-forwarded-for (Client IP yang sesungguhnya)
    let ip = "unknown";
    if (realIp) {
      ip = realIp;
    } else if (forwardedFor) {
      const ips = forwardedFor.split(",").map(i => i.trim());
      ip = ips[0];
    }

    // Cek berapa banyak akun yang dibuat IP ini dalam 1 jam terakhir
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRegistrations = await prisma.registerAttempt.findFirst({
      where: { ip },
      orderBy: { updatedAt: 'desc' }
    });

    if (recentRegistrations && recentRegistrations.count >= 5 && recentRegistrations.updatedAt >= oneHourAgo) {
      return { error: "Too many requests from your network. Please try again in 1 hour." };
    }

    // --- CATAT ATTEMPT RATE LIMITER LEBIH AWAL ---
    // Mencatat semua upaya (attempt), bukan hanya keberhasilan, untuk mencegah brute force & enumerasi
    if (recentRegistrations) {
      const newCount = recentRegistrations.updatedAt < oneHourAgo ? 1 : recentRegistrations.count + 1;
      await prisma.registerAttempt.update({
        where: { id: recentRegistrations.id },
        data: { count: newCount, updatedAt: new Date() }
      });
    } else {
      await prisma.registerAttempt.create({
        data: { ip, count: 1 }
      });
    }
    // ----------------------------------

    // --- 0.5 VERIFIKASI CAPTCHA KE GOOGLE ---
    const captchaToken = formData.get("captchaToken") as string;

    // Hanya lakukan validasi jika admin sudah menyetel Secret Key
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!captchaToken) {
        return { error: "Please complete the reCAPTCHA verification first." };
      }

      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        console.error("CAPTCHA Validation Failed:", verifyData);
        return { error: "CAPTCHA validation failed. System detected suspicious activity." };
      }
    }
    // -----------------------------------------

    // 1. Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return { error: "Email is already registered." };
    }

    // 2. Enkripsi Password agar aman di Hostinger
    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || "User")}&background=random`;

    // --- 2.5 GENERATE 6-DIGIT OTP ---
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    // 3. Simpan data ke MySQL Hostinger dengan Skema Baru (Terpisah)
    const newUser = await prisma.user.create({
      data: {
        // Data khusus tabel User
        email: email,
        password: hashedPassword,
        plan: "FREE",
        avatar: defaultAvatar,

        // Data khusus tabel Profile (Prisma akan otomatis membuatkannya)
        profile: {
          create: {
            fullName: fullName,
          }
        },
        siteAppearance: {
          create: {}
        }
      }
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: tokenExpires
      }
    });

    console.log("✅ User successfully created:", newUser.email);

    // ==============================================================
    // 4. KIRIM WELCOME EMAIL SETELAH USER SUKSES DIBUAT
    // ==============================================================
    resend.emails.send({
      from: 'Portfobe <hellocreator@mail.ritions.com>',
      to: email,
      replyTo: 'ikliluluyun@ritions.com', // User bisa balas langsung ke Anda
      subject: 'Welcome to Portfobe!',      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <p style="font-size: 16px;">Hey,</p>
          <p style="font-size: 16px;">My name is <strong>IKLIL</strong> — I'm the founder and CEO of <strong>portfobe</strong>.</p>
          <p style="font-size: 16px;">I want to personally thank you for choosing portfobe as the place to showcase your best work. We built this platform with one mission: to help creators like you have a professional, elegant 'digital home' ready in minutes.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff9e00;">
            <p style="font-size: 16px; margin-top: 0; font-weight: bold;">Verify Your Account</p>
            <p style="font-size: 14px; margin-bottom: 20px;">Enter the 6-digit security code below to complete your registration.</p>
            <div style="background-color: #0f172a; color: #ffffff; padding: 16px 24px; border-radius: 6px; font-weight: bold; font-size: 24px; letter-spacing: 0.2em; text-align: center;">\${verificationToken}</div>
            <p style="font-size: 12px; margin-top: 15px; color: #64748b;">This code is only valid for 15 minutes.</p>
          </div>

          <p style="font-size: 16px;">I can't wait to see the portfolio you will build. If you have any feedback, feature ideas, or just want to say hi, feel free to reply to this email.</p>
          <p style="font-size: 16px;">Happy creating!</p>
          <br />
          <p style="font-size: 16px; margin-bottom: 5px;">Best,</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 2px;">IKLIL</p>
          <p style="font-size: 14px; color: #64748b; margin-top: 0;">Founder, portfobe</p>
        </div>
      `,
    }).catch((err) => console.error("🚨 Failed to send Welcome Email:", err));
    // =====================================================================

    // Rate limiter sudah diupdate di atas untuk mencatat setiap attempt.

    return { success: true };

  } catch (e) {
    // Jika ada error (koneksi database, dll), akan muncul di terminal
    console.error("🚨 DATABASE ERROR:", e);
    return { error: "A database connection error occurred." };
  }
}

// ============================================================================
// FUNGSI UNTUK MENGIRIM ULANG EMAIL VERIFIKASI
// ============================================================================
export async function resendVerificationEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) return { error: "User not found." };
    if (user.emailVerified !== null) return { error: "Email is already verified." };

    // --- RATE LIMITING (5 MENIT) ---
    const existingToken = await prisma.verificationToken.findFirst({
      where: { identifier: email },
      orderBy: { expires: 'desc' }
    });

    if (existingToken) {
      const timeRemainingMs = existingToken.expires.getTime() - Date.now();
      const fifteenMinutesMs = 15 * 60 * 1000;
      const twoMinutesMs = 2 * 60 * 1000;

      // Jika token baru dibuat kurang dari 2 menit lalu, jangan izinkan kirim ulang
      if (timeRemainingMs > (fifteenMinutesMs - twoMinutesMs)) {
        return { error: "Please wait about 2 minutes before you can resend the verification email." };
      }
    }
    // -------------------------------

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: tokenExpires
      }
    });

    const fullName = user.profile?.fullName || "Creator";

    await resend.emails.send({
      from: 'Portfobe <hellocreator@mail.ritions.com>',
      to: email,
      replyTo: 'ikliluluyun@ritions.com',
      subject: 'Verify Your Portfobe Account',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <p style="font-size: 16px;">Hi ${fullName},</p>
          <p style="font-size: 16px;">We received a request to resend your email verification link.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff9e00;">
            <p style="font-size: 16px; margin-top: 0; font-weight: bold;">Verify Your Account</p>
            <p style="font-size: 14px; margin-bottom: 20px;">Enter the 6-digit security code below to verify your email address.</p>
            <div style="background-color: #0f172a; color: #ffffff; padding: 16px 24px; border-radius: 6px; font-weight: bold; font-size: 24px; letter-spacing: 0.2em; text-align: center;">${verificationToken}</div>
            <p style="font-size: 12px; margin-top: 15px; color: #64748b;">This code is only valid for 15 minutes.</p>
          </div>

          <p style="font-size: 14px; color: #64748b;">If you didn't request this email, please ignore it.</p>
          <br />
          <p style="font-size: 16px; margin-bottom: 5px;">Best,</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 2px;">IKLIL</p>
          <p style="font-size: 14px; color: #64748b; margin-top: 0;">Founder, portfobe</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to resend email:", error);
    return { error: "A system error occurred while sending email." };
  }
}

// ============================================================================
// FUNGSI UNTUK MEMVERIFIKASI OTP SAAT PENDAFTARAN
// ============================================================================
export async function verifyRegistrationOtp(email: string, otp: string) {
  try {
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: { identifier: email, token: otp },
    });

    if (!tokenRecord) {
      return { error: "Invalid or incorrect OTP code." };
    }

    if (new Date() > tokenRecord.expires) {
      return { error: "OTP code has expired. Please request a new one." };
    }

    // Update status emailVerified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Hapus token agar tidak bisa digunakan lagi
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token: otp } },
    });

    return { success: true };
  } catch (e) {
    console.error("Error verifying OTP:", e);
    return { error: "A system error occurred while verifying the code." };
  }
}

