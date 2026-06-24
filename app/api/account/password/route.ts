import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { updatePassword } from "@/features/settings/model/accountService";

export async function PATCH(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    await updatePassword(session.user.email, currentPassword, newPassword);

    return NextResponse.json({ message: "Kata sandi berhasil diperbarui." }, { status: 200 });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_PASSWORD_LENGTH") return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
    if (getErrorMessage(error) === "USER_NOT_FOUND") return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
    if (getErrorMessage(error) === "CURRENT_PASSWORD_REQUIRED") return NextResponse.json({ error: "Kata sandi saat ini diperlukan." }, { status: 400 });
    if (getErrorMessage(error) === "CURRENT_PASSWORD_INVALID") return NextResponse.json({ error: "Kata sandi saat ini salah." }, { status: 400 });

    console.error("UPDATE_PASSWORD_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
