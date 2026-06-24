import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { getFullProfile, checkSubdomainAvailability, updateProfileFull, patchProfilePartial } from "@/features/profile/model/profileService";
import { ProfileUpdateSchema } from "@/shared/lib/validations";

function handleProfileError(error: unknown) {
  if (getErrorMessage(error) === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (getErrorMessage(error) === "MISSING_DATA") return NextResponse.json({ error: "Invalid or missing data" }, { status: 400 });
  if (getErrorMessage(error) === "INVALID_SUBDOMAIN_LENGTH") return NextResponse.json({ error: "Subdomain must be 3-15 characters." }, { status: 400 });
  if (getErrorMessage(error) === "SUBDOMAIN_TAKEN") return NextResponse.json({ error: "This URL is already taken." }, { status: 400 });
  if (getErrorMessage(error).startsWith("FORBIDDEN_NAME:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1], available: false, message: getErrorMessage(error).split(":")[1] }, { status: 400 });
  
  console.error("Profile Service Error:", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await getFullProfile(session.user.email);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleProfileError(error);
  }
}

export async function POST(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit(10, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();

    if (body.action === "check_subdomain") {
      const { subdomain } = body;
      const isAvailable = await checkSubdomainAvailability(subdomain);
      if (!isAvailable) return NextResponse.json({ available: false, message: "This URL is already taken by another creator." });
      return NextResponse.json({ available: true });
    }

    return NextResponse.json({ error: "Unrecognized action" }, { status: 400 });
  } catch (error: unknown) {
    if (getErrorMessage(error).startsWith("FORBIDDEN_NAME:")) {
      return NextResponse.json({ available: false, message: getErrorMessage(error).split(":")[1] });
    }
    return handleProfileError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = ProfileUpdateSchema.parse(await req.json());
    const updatedProfile = await updateProfileFull(session.user.email, body);
    
    return NextResponse.json({ message: "Profile updated", profile: updatedProfile });
  } catch (error: unknown) {
    return handleProfileError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = ProfileUpdateSchema.parse(await req.json());
    const updatedProfile = await patchProfilePartial(session.user.email, body);

    return NextResponse.json({ message: "Profile partially updated", profile: updatedProfile });
  } catch (error: unknown) {
    return handleProfileError(error);
  }
}
