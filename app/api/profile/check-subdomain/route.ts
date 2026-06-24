import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { checkSubdomainAvailability } from "@/features/profile/model/profileService";

export async function GET(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit(10, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) return NextResponse.json({ error: "Subdomain wajib diisi" }, { status: 400 });

    const isAvailable = await checkSubdomainAvailability(subdomain);
    return NextResponse.json({ available: isAvailable });
  } catch (error: unknown) {
    if (getErrorMessage(error).startsWith("FORBIDDEN_NAME:")) {
      return NextResponse.json({ available: false, error: getErrorMessage(error).split(":")[1] });
    }
    console.error("Check Subdomain Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
