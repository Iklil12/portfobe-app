import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import { globalSearch } from "@/features/search/model/searchService";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!session || query.length < 2) return NextResponse.json([]);

    const userId = (session.user as any)?.id;
    if (!userId) return NextResponse.json([]);

    const results = await globalSearch(userId, query);
    return NextResponse.json(results);
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
