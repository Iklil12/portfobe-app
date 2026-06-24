import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { getUserProjects, createProject, updateProject, deleteProject } from "@/features/projects/model/projectService";
import { ProjectSchema } from "@/shared/lib/validations";

import { handleApiError } from "@/shared/lib/apiError";
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getUserProjects(session.user.email, page, limit);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = ProjectSchema.parse(await req.json());
    const newProject = await createProject(session.user.email, body);
    
    return NextResponse.json({ message: "Project successfully added", project: newProject }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = ProjectSchema.parse(await req.json());
    const updatedProject = await updateProject(session.user.email, body);

    return NextResponse.json({ message: "Project successfully updated", project: updatedProject }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Project ID is required" }, { status: 400 });

    await deleteProject(session.user.email, id);

    return NextResponse.json({ message: "Project successfully deleted" }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
