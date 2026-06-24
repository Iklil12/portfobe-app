import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { toggleBlockVisibility } from "@/features/blocks/model/blockService";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, isVisible } = await req.json();

    const updatedBlock = await toggleBlockVisibility(session.user.id, id, isVisible);

    return NextResponse.json({ success: true, block: updatedBlock });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_PAYLOAD") return NextResponse.json({ error: "Invalid payload format. Expected { id: string, isVisible: boolean }" }, { status: 400 });

    console.error("Toggle block error:", error);
    return NextResponse.json({ error: getErrorMessage(error) || "Internal Server Error" }, { status: 500 });
  }
}
