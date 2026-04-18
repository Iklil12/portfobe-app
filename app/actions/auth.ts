"use server"

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

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

    // 3. Simpan data ke MySQL Hostinger dengan Skema Baru (Terpisah)
    const newUser = await prisma.user.create({
      data: {
        // Data khusus tabel User
        email: email,
        password: hashedPassword,
        plan: "FREE",
        
        // Data khusus tabel Profile (Prisma akan otomatis membuatkannya)
        profile: {
          create: {
            fullName: fullName,
          }
        }
      }
    });

    console.log("✅ User berhasil dibuat:", newUser.email);
    return { success: true };
    
  } catch (e) {
    // Jika ada error (koneksi database, dll), akan muncul di terminal
    console.error("🚨 DATABASE ERROR:", e);
    return { error: "Terjadi kesalahan pada koneksi database." };
  }
}