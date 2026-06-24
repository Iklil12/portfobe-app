import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { verifyEmailChange } from "@/features/settings/model/accountService";

export async function GET(req: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const settingsUrl = `${baseUrl}/dashboard/settings`;

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) return NextResponse.redirect(`${settingsUrl}?error=Token tidak valid`);

    await verifyEmailChange(token);

    return NextResponse.redirect(`${settingsUrl}?success=Email berhasil diperbarui!`);
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_TOKEN") return NextResponse.redirect(`${settingsUrl}?error=Tautan tidak valid atau sudah digunakan`);
    if (getErrorMessage(error) === "EXPIRED_TOKEN") return NextResponse.redirect(`${settingsUrl}?error=Tautan kadaluarsa, silakan ajukan ulang`);
    
    console.error("VERIFY_EMAIL_ERROR:", error);
    return NextResponse.redirect(`${settingsUrl}?error=Terjadi kesalahan internal`);
  }
}
