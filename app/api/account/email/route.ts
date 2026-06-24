import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { requestEmailChange } from "@/features/settings/model/accountService";

export async function PATCH(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit(3, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { newEmail, password } = await req.json();

    await requestEmailChange(session.user.email, newEmail, password);

    return NextResponse.json({ message: "Verification link sent" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? getErrorMessage(error) : "Unknown error";
    if (message === "INVALID_EMAIL") return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    if (message === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found." }, { status: 404 });
    if (message === "GOOGLE_ACCOUNT") return NextResponse.json({ error: "Google accounts cannot change email via this form." }, { status: 400 });
    if (message === "EMAIL_TAKEN") return NextResponse.json({ error: "This email is already registered." }, { status: 400 });
    if (message === "PASSWORD_REQUIRED") return NextResponse.json({ error: "Password is required." }, { status: 400 });
    if (message === "INVALID_PASSWORD") return NextResponse.json({ error: "Incorrect password." }, { status: 400 });

    console.error("EMAIL_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
