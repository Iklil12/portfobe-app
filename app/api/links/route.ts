import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { getUserLinks, createNewLink } from "@/features/links/model/linkService";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    const result = await getUserLinks(session.user.email, page, limit);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST() {
  const rateLimitResponse = await checkRateLimit(15, 60 * 1000, "create_link");
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const newLink = await createNewLink(session.user.email);
    return NextResponse.json(newLink);
  } catch (error: unknown) {
    if (getErrorMessage(error) === "QUOTA_EXCEEDED") {
      return NextResponse.json({ 
        error: "Kuota FREE maksimal 1 tautan. Silakan upgrade ke PRO.",
        code: "QUOTA_EXCEEDED"
      }, { status: 403 });
    }
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
