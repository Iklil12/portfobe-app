import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { reorderBlocks } from "@/features/blocks/model/blockService";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { blocks } = await req.json();

    await reorderBlocks(session.user.id, blocks);

    return NextResponse.json({ success: true, message: "Blocks reordered successfully" });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_PAYLOAD") return NextResponse.json({ error: "Invalid payload format. Expected an array of blocks." }, { status: 400 });

    console.error("Reorder blocks error:", error);
    return NextResponse.json({ error: getErrorMessage(error) || "Internal Server Error" }, { status: 500 });
  }
}
