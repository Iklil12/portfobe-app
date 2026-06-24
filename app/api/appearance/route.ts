import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { getAppearance, updateAppearance } from "@/features/themes/model/themeService";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");

    const result = await getAppearance(session.user.email, mode);
    if (!result) return NextResponse.json({});
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("GET Appearance Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const result = await updateAppearance(session.user.email, body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (getErrorMessage(error) === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (getErrorMessage(error) === "RATE_LIMIT_EXCEEDED") return NextResponse.json({ error: "Terlalu banyak permintaan (Spam Detected). Harap tunggu beberapa saat." }, { status: 429 });
    if (getErrorMessage(error) === "PAYLOAD_TOO_LARGE") return NextResponse.json({ error: "Payload customTexts terlalu besar. Maksimal 5000 karakter." }, { status: 400 });
    if (getErrorMessage(error).startsWith("FEATURE_LOCKED:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1], code: "FEATURE_LOCKED" }, { status: 403 });
    
    console.error("PATCH Appearance Error:", error);
    return NextResponse.json({ error: "Failed to save theme" }, { status: 500 });
  }
}
