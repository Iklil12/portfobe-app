import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { processResetPassword } from "@/features/auth/model/authService";

export async function POST(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit(5, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const { token, password } = await req.json();

    await processResetPassword(token, password);

    return NextResponse.json({ message: "Kata sandi berhasil diubah." }, { status: 200 });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_DATA") return NextResponse.json({ error: "Data tidak valid atau sandi minimal 6 karakter." }, { status: 400 });
    if (getErrorMessage(error) === "INVALID_TOKEN") return NextResponse.json({ error: "Link reset tidak valid atau sudah digunakan." }, { status: 400 });
    if (getErrorMessage(error) === "EXPIRED_TOKEN") return NextResponse.json({ error: "Link reset sudah kadaluarsa. Silakan minta ulang." }, { status: 400 });

    console.error("RESET_PW_ERROR:", error);
    return NextResponse.json({ error: "A server error occurred." }, { status: 500 });
  }
}
