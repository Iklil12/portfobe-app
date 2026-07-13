import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { getAccountStatus, updateAccountStatus } from "@/features/settings/model/accountService";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await getAccountStatus(session.user.email);
  return NextResponse.json(result);
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { isLive } = await req.json();
    const result = await updateAccountStatus(session.user.email, isLive);

    return NextResponse.json({ success: true, isLive: result.isLive });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "EMAIL_NOT_VERIFIED") {
      return NextResponse.json({ error: "FORBIDDEN", message: "Please verify your email first to activate your portfolio." }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
