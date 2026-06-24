import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 
import { checkRateLimit } from "@/lib/rate-limit";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
    }

    const rateLimitResponse = await checkRateLimit(5, 15 * 60 * 1000);
    if (rateLimitResponse) return rateLimitResponse;

    const { emailInput } = await req.json();
    if (!emailInput || emailInput.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json({ error: "Email konfirmasi yang Anda masukkan tidak cocok." }, { status: 400 });
    }

    // Perintah sakti untuk menghapus User dari Database MySQL Hostinger
    // Catatan: Pastikan di schema.prisma Anda, relasi tabel Profile memiliki opsi onDelete: Cascade
    // agar data profil ikut terhapus otomatis saat user dihapus.
    await prisma.user.delete({
      where: { email: session.user.email }
    });

    return NextResponse.json({ message: "Akun berhasil dihapus selamanya" });
  } catch (error) {
    console.error("Error Hapus Akun:", error);
    return NextResponse.json({ error: "Failed to delete account. Check database relations." }, { status: 500 });
  }
}
