import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { bulkUpdateBlocks } from "@/features/blocks/model/blockService";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { blocks } = await req.json();

    await bulkUpdateBlocks(session.user.id, blocks);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "RATE_LIMIT_EXCEEDED") return new NextResponse("Too Many Requests. Please slow down.", { status: 429 });
    if (getErrorMessage(error) === "INVALID_PAYLOAD") return new NextResponse("Invalid payload", { status: 400 });
    if (getErrorMessage(error) === "PAYLOAD_TOO_LARGE") return new NextResponse("Payload terlalu besar. Maksimal 50 blok.", { status: 400 });

    console.error("[BLOCKS_BULK_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
