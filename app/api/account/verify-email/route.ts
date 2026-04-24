import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// API ini menggunakan GET karena dipicu dari klik URL di email
export async function GET(req: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const settingsUrl = `${baseUrl}/dashboard/settings`;

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(`${settingsUrl}?error=Token tidak valid`);
    }

    // 1. Cari user yang punya token ini
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (!user || !user.pendingEmail || !user.tokenExpires) {
      return NextResponse.redirect(`${settingsUrl}?error=Tautan tidak valid atau sudah digunakan`);
    }

    // 2. Cek apakah waktunya sudah lewat 15 menit
    if (new Date() > user.tokenExpires) {
      return NextResponse.redirect(`${settingsUrl}?error=Tautan kadaluarsa, silakan ajukan ulang`);
    }

    // 3. LULUS! Pindahkan pendingEmail ke email utama, dan hapus sisa token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.pendingEmail,
        pendingEmail: null,
        emailVerificationToken: null,
        tokenExpires: null
      }
    });

    // 4. Arahkan kembali ke Settings dengan indikator sukses
    return NextResponse.redirect(`${settingsUrl}?success=Email berhasil diperbarui!`);

  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR:", error);
    return NextResponse.redirect(`${settingsUrl}?error=Terjadi kesalahan internal`);
  }
}