import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { processVideoUploadTicket } from "@/features/projects/model/uploadService";

export async function POST(req: Request) {
  try {
    const rateLimitRes = await checkRateLimit(5, 5 * 60 * 1000, "upload_video");
    if (rateLimitRes) return rateLimitRes;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const title = body.title || "Untitled Video";

    const ticket = await processVideoUploadTicket((session.user as any).id, title);
    return NextResponse.json(ticket);
  } catch (error: unknown) {
    if (getErrorMessage(error) === "FEATURE_LOCKED") return NextResponse.json({ error: "Upgrade ke PRO untuk mengunggah video." }, { status: 403 });
    if (getErrorMessage(error) === "BUNNY_NOT_CONFIGURED") return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    if (getErrorMessage(error) === "BUNNY_CREATE_FAILED") return NextResponse.json({ error: "Failed to create video object in Bunny" }, { status: 500 });
    if (getErrorMessage(error) === "BUNNY_GUID_FAILED") return NextResponse.json({ error: "Failed to get video reference" }, { status: 500 });

    console.error("Upload Video Ticket Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem", details: getErrorMessage(error), stack: error instanceof Error ? error.stack : undefined }, { status: 500 });
  }
}
