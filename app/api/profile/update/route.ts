import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { updateProfileAvatarAndBio } from "@/features/profile/model/profileService";

export async function PATCH(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const updatedUser = await updateProfileAvatarAndBio(session.user.email, body);

    return NextResponse.json({ message: "Profile saved successfully", user: updatedUser });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_AVATAR") return NextResponse.json({ error: "Invalid or untrusted image URL" }, { status: 400 });
    if (getErrorMessage(error) === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (getErrorMessage(error) === "SUBDOMAIN_COOLDOWN") return NextResponse.json({ error: "You can only change subdomain once every 14 days." }, { status: 400 });
    if (getErrorMessage(error).startsWith("FORBIDDEN_NAME:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1] }, { status: 400 });
    if (getErrorMessage(error) === "SUBDOMAIN_TAKEN") return NextResponse.json({ error: "Subdomain is already taken." }, { status: 400 });

    console.error("Error Simpan Profil:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
