import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { getTrashItems, processTrashAction } from "@/features/trash/model/trashService";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const result = await getTrashItems(session.user.email, searchParams.get("page"), searchParams.get("limit"));

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("GET Trash Error:", error);
    return NextResponse.json({ error: "Failed to fetch trash data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action, id, type } = body;

    const result = await processTrashAction(session.user.email, action, id, type);

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("POST Trash Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
