import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getPenpotThumbnail } from "@/features/integrations/model/penpotService";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    if (!fileId) return new Response("Missing fileId", { status: 400 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return new Response("Missing userId", { status: 400 });

    const { buffer, contentType } = await getPenpotThumbnail(userId, fileId);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return new Response(msg, { status: parseInt(status) });
    }
    console.error("Thumbnail Proxy Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
