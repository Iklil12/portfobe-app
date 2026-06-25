import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getGithubStats } from "@/features/integrations/model/githubService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const bustCache = searchParams.get("bust") === "1";

    if (!userId) return NextResponse.json({ error: "UserId is required" }, { status: 400 });

    if (userId === 'demo') {
      return NextResponse.json({
        username: 'shadcn',
        topRepos: [
          { name: 'open-source-ui', url: '#', description: 'A futuristic open source library for React.', stars: 12500, watchers: 340, forks: 1200, language: 'TypeScript', languageColor: '#3178c6' },
          { name: 'webgl-experiments', url: '#', description: 'Collection of WebGL shaders and 3D kinetic text.', stars: 8900, watchers: 210, forks: 450, language: 'GLSL', languageColor: '#563d7c' },
          { name: 'react-framer-components', url: '#', description: 'Highly accessible, animated UI components.', stars: 5400, watchers: 120, forks: 300, language: 'TypeScript', languageColor: '#3178c6' }
        ],
        languages: [
          { name: 'TypeScript', percent: 65, color: '#3178c6' },
          { name: 'GLSL', percent: 25, color: '#563d7c' },
          { name: 'JavaScript', percent: 10, color: '#f1e05a' }
        ]
      }, {
        headers: { "Cache-Control": "public, s-maxage=3600" }
      });
    }

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
