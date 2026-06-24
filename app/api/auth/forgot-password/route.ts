import { NextResponse } from "next/server";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { processForgotPassword } from "@/features/auth/model/authService";

export async function POST(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit(3, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const { email } = await req.json();

    await processForgotPassword(email);

    return NextResponse.json({ message: "If the email is registered, a reset link will be sent." });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
