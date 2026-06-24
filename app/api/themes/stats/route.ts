import { NextResponse } from "next/server";
import { getThemeStats } from "@/features/themes/model/themeService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const stats = await getThemeStats();
    return NextResponse.json(stats);
  } catch (error: unknown) {
    console.error("GET ThemeStats Error:", error);
    return NextResponse.json({ error: "Failed to fetch theme stats" }, { status: 500 });
  }
}
