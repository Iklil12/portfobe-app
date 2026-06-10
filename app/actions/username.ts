"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isForbiddenUsername } from "@/lib/constants/reserved-usernames";
import { revalidatePath } from "next/cache";

export async function updateUsername(newUsername: string) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "Anda harus login terlebih dahulu." };
    }

    // Clean input
    const username = newUsername.trim().toLowerCase();

    if (!username) {
      return { error: "Subdomain tidak boleh kosong." };
    }

    // 2. Validate newUsername formatting (must be alphanumeric, no spaces, hyphens ok)
    if (!/^[a-z0-9-]+$/.test(username)) {
      return { error: "Subdomain hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)." };
    }

    if (username.length < 3 || username.length > 15) {
      return { error: "Subdomain harus berukuran antara 3-15 karakter." };
    }

    // 3. Check forbidden/reserved words
    const forbiddenCheck = isForbiddenUsername(username);
    if (forbiddenCheck.forbidden) {
      return { error: forbiddenCheck.reason || "Username ini tidak dapat digunakan." };
    }

    // 4. Fetch current user info
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    if (!user) {
      return { error: "Pengguna tidak ditemukan." };
    }

    // 5. Cek apakah pengguna sudah pernah mengganti username dalam 14 hari terakhir
    if (user.lastUsernameChange) {
      const lastChange = new Date(user.lastUsernameChange);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastChange.getTime());
      
      if (diffTime < 14 * 24 * 60 * 60 * 1000) {
        const remainingDays = 14 - Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return { error: `Anda hanya dapat mengganti subdomain sekali dalam 14 hari. Silakan coba lagi dalam ${remainingDays} hari.` };
      }
    }

    // 6. Cek apakah subdomain sudah digunakan oleh user lain
    const existingSubdomain = await prisma.profile.findUnique({
      where: { subdomain: username }
    });

    if (existingSubdomain && existingSubdomain.userId !== user.id) {
      return { error: `Subdomain "${username}" sudah dipakai oleh pengguna lain.` };
    }

    // 7. Update user's subdomain and lastUsernameChange timestamp
    await prisma.$transaction([
      prisma.profile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          fullName: user.email.split('@')[0],
          subdomain: username
        },
        update: {
          subdomain: username
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          lastUsernameChange: new Date()
        }
      })
    ]);

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/profile");

    return { success: true, subdomain: username };

  } catch (error) {
    console.error("Error in updateUsername action:", error);
    return { error: "Terjadi kesalahan sistem saat memperbarui subdomain." };
  }
}
