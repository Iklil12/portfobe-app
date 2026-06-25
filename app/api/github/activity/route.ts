import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getGithubActivity } from "@/features/integrations/model/githubService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "UserId is required" }, { status: 400 });

    if (userId === 'demo') {
      return NextResponse.json({
        activities: [
          { id: '1', type: 'PushEvent', repo: 'auraspatial/webgl-experiments', description: 'Pushed 1 commit to', createdAt: new Date().toISOString(), link: 'https://github.com/auraspatial/webgl-experiments' },
          { id: '2', type: 'CreateEvent', repo: 'auraspatial/open-source-ui', description: 'Created repository', createdAt: new Date(Date.now() - 86400000).toISOString(), link: 'https://github.com/auraspatial/open-source-ui' },
          { id: '3', type: 'WatchEvent', repo: 'facebook/react', description: 'Starred repository', createdAt: new Date(Date.now() - 172800000).toISOString(), link: 'https://github.com/facebook/react' }
        ]
      }, {
        headers: { "Cache-Control": "public, s-maxage=3600" }
      });
    }

    const activities = await getGithubActivity(userId);
    return NextResponse.json({ activities }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
      }
    });
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("GitHub Activity Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
