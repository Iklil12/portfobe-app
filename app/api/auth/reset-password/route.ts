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

    return NextResponse.json({ message: "Password successfully changed." }, { status: 200 });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_DATA") return NextResponse.json({ error: "Invalid data or password must be at least 6 characters." }, { status: 400 });
    if (getErrorMessage(error) === "INVALID_TOKEN") return NextResponse.json({ error: "Reset link is invalid or already used." }, { status: 400 });
    if (getErrorMessage(error) === "EXPIRED_TOKEN") return NextResponse.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 });

    console.error("RESET_PW_ERROR:", error);
    return NextResponse.json({ error: "A server error occurred." }, { status: 500 });
  }
}
