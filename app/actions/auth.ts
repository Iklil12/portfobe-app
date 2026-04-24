"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend"; // <-- 1. IMPORT RESEND DI SINI

// <-- 2. INISIALISASI RESEND (Di luar function agar hemat memori server)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerUser(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
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
        }
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
          <p style="font-size: 16px;">Saya sangat tidak sabar melihat portofolio yang akan kamu bangun. Jika kamu punya masukan, ide fitur, atau sekadar ingin menyapa, jangan ragu untuk membalas email ini. Saya membaca semua pesan yang masuk.</p>
          <p style="font-size: 16px;">Selamat berkarya dan selamat membangun <em>brand</em> personalmu!</p>
          <br />
          <p style="font-size: 16px; margin-bottom: 5px;">Best,</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 2px;">IKLIL</p>
          <p style="font-size: 14px; color: #64748b; margin-top: 0;">Founder, portfobe</p>
        </div>
      `,
    }).catch((err) => console.error("🚨 Gagal mengirim Welcome Email:", err));
    // ==============================================================

    return { success: true };
    
  } catch (e) {
    // Jika ada error (koneksi database, dll), akan muncul di terminal
    console.error("🚨 DATABASE ERROR:", e);
    return { error: "Terjadi kesalahan pada koneksi database." };
  }
}