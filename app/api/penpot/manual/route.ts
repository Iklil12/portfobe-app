import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { getPenpotManualProjects, savePenpotManualProjects } from "@/features/integrations/model/penpotService";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get("userId");

    if (!userId && session?.user?.id) userId = session.user.id;
    if (!userId) return NextResponse.json({ projects: [] });

    const projects = await getPenpotManualProjects(userId);
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { projects } = await req.json();
    const result = await savePenpotManualProjects(session.user.id, projects);

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("Save Manual Penpot Error:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
