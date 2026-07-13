import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { verifyEmailChange } from "@/features/settings/model/accountService";

export async function GET(req: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const settingsUrl = `${baseUrl}/dashboard/settings`;

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) return NextResponse.redirect(`${settingsUrl}?error=Invalid token`);

    await verifyEmailChange(token);

    return NextResponse.redirect(`${settingsUrl}?success=Email successfully updated!`);
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_TOKEN") return NextResponse.redirect(`${settingsUrl}?error=Link is invalid or already used`);
    if (getErrorMessage(error) === "EXPIRED_TOKEN") return NextResponse.redirect(`${settingsUrl}?error=Link expired, please request again`);
    
    console.error("VERIFY_EMAIL_ERROR:", error);
    return NextResponse.redirect(`${settingsUrl}?error=An internal error occurred`);
  }
}
