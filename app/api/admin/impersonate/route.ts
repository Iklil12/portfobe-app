import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { generateImpersonateToken } from "@/features/admin/model/adminService";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Tidak diizinkan. Silakan login." }, { status: 401 });

    const body = await req.json();
    const result = await generateImpersonateToken(session.user.email, body.userId);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("Error generating impersonate token:", error);
    return NextResponse.json({ error: "A server error occurred." }, { status: 500 });
  }
}
