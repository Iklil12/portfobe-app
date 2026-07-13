import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { getFavoriteThemes, toggleFavoriteTheme } from "@/features/themes/model/themeService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const result = await getFavoriteThemes(session.user.email);
    return NextResponse.json({ favorites: result });
  } catch (error: unknown) {
    console.error("GET ThemeFavorite Error:", error);
    return NextResponse.json({ error: "Failed to fetch favorite data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const liked = await toggleFavoriteTheme(session.user.email, body.themeId);
    return NextResponse.json({ liked });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_DATA") return NextResponse.json({ error: "Invalid themeId" }, { status: 400 });
    console.error("POST ThemeFavorite Error:", error);
    return NextResponse.json({ error: "Failed to save favorite" }, { status: 500 });
  }
}
