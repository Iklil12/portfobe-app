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
        return { error: "Harap selesaikan verifikasi reCAPTCHA terlebih dahulu." };
      }

      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        console.error("CAPTCHA Validation Failed:", verifyData);
        return { error: "Validasi CAPTCHA gagal. Sistem mendeteksi aktivitas mencurigakan." };
      }
    }
    // -----------------------------------------

    // 1. Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar." };
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

    console.log("✅ User berhasil dibuat:", newUser.email);

    // ==============================================================
    // 4. KIRIM WELCOME EMAIL SETELAH USER SUKSES DIBUAT
    // ==============================================================
    resend.emails.send({
      from: 'Portfobe <hellocreator@mail.ritions.com>',
      to: email,
      replyTo: 'ikliluluyun@ritions.com', // User bisa balas langsung ke Anda
      subject: 'Welcome to Portfobe!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <p style="font-size: 16px;">Hey,</p>
          <p style="font-size: 16px;">My name is <strong>IKLIL</strong> — I'm the founder and CEO of <strong>portfobe</strong>.</p>
          <p style="font-size: 16px;">Saya ingin mengucapkan terima kasih secara personal karena kamu telah memilih portfobe sebagai tempat untuk memamerkan karya terbaikmu. Kami membangun platform ini dengan satu misi: membantu kreator seperti kamu memiliki 'rumah digital' yang profesional, elegan, dan selesai dalam hitungan menit.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff9e00;">
            <p style="font-size: 16px; margin-top: 0; font-weight: bold;">Verifikasi Akun Anda</p>
            <p style="font-size: 14px; margin-bottom: 20px;">Masukkan 6 digit kode keamanan di bawah ini untuk menyelesaikan pendaftaran Anda.</p>
            <div style="background-color: #0f172a; color: #ffffff; padding: 16px 24px; border-radius: 6px; font-weight: bold; font-size: 24px; letter-spacing: 0.2em; text-align: center;">${verificationToken}</div>
            <p style="font-size: 12px; margin-top: 15px; color: #64748b;">Kode ini hanya berlaku selama 15 menit.</p>
          </div>

          <p style="font-size: 16px;">Saya sangat tidak sabar melihat portofolio yang akan kamu bangun. Jika kamu punya masukan, ide fitur, atau sekadar ingin menyapa, jangan ragu untuk membalas email ini.</p>
          <p style="font-size: 16px;">Selamat berkarya!</p>
          <br />
          <p style="font-size: 16px; margin-bottom: 5px;">Best,</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 2px;">IKLIL</p>
          <p style="font-size: 14px; color: #64748b; margin-top: 0;">Founder, portfobe</p>
        </div>
      `,
    }).catch((err) => console.error("🚨 Gagal mengirim Welcome Email:", err));
    // ==============================================================

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

    if (!user) return { error: "Pengguna tidak ditemukan." };
    if (user.emailVerified !== null) return { error: "Email sudah terverifikasi." };

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
        return { error: "Tunggu sekitar 2 menit sebelum Anda dapat mengirim ulang email verifikasi." };
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

    const fullName = user.profile?.fullName || "Kreator";

    await resend.emails.send({
      from: 'Portfobe <hellocreator@mail.ritions.com>',
      to: email,
      replyTo: 'ikliluluyun@ritions.com',
      subject: 'Verifikasi Ulang Akun Portfobe Anda',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <p style="font-size: 16px;">Halo ${fullName},</p>
          <p style="font-size: 16px;">Kami menerima permintaan untuk mengirimkan ulang tautan verifikasi email Anda.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff9e00;">
            <p style="font-size: 16px; margin-top: 0; font-weight: bold;">Verifikasi Akun Anda</p>
            <p style="font-size: 14px; margin-bottom: 20px;">Masukkan 6 digit kode keamanan di bawah ini untuk memverifikasi alamat email Anda.</p>
            <div style="background-color: #0f172a; color: #ffffff; padding: 16px 24px; border-radius: 6px; font-weight: bold; font-size: 24px; letter-spacing: 0.2em; text-align: center;">${verificationToken}</div>
            <p style="font-size: 12px; margin-top: 15px; color: #64748b;">Kode ini hanya berlaku selama 15 menit.</p>
          </div>

          <p style="font-size: 14px; color: #64748b;">Jika Anda tidak meminta email ini, abaikan saja.</p>
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
      return { error: "Kode OTP tidak valid atau salah." };
    }

    if (new Date() > tokenRecord.expires) {
      return { error: "Kode OTP sudah kedaluwarsa. Silakan minta kode baru." };
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
    return { error: "Terjadi kesalahan sistem saat memverifikasi kode." };
  }
}

