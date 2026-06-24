import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getGithubStats } from "@/features/integrations/model/githubService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const bustCache = searchParams.get("bust") === "1";

    if (!userId) return NextResponse.json({ error: "UserId is required" }, { status: 400 });

    const result = await getGithubStats(userId, bustCache);

    return NextResponse.json(result.data, {
      headers: { "Cache-Control": result.cached ? "public, s-maxage=60, stale-while-revalidate=300" : "public, s-maxage=60" }
    });
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("GitHub API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
