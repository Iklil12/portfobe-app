import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getGithubActivity } from "@/features/integrations/model/githubService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "UserId is required" }, { status: 400 });

    const activities = await getGithubActivity(userId);
    return NextResponse.json({ activities });
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("GitHub Activity Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
