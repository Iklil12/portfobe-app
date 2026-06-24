import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { deleteUserAccount } from "@/features/settings/model/accountService";

export async function DELETE(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { emailInput } = await req.json();

    await deleteUserAccount(session.user.email, emailInput);

    return NextResponse.json({ message: "Account permanently deleted." }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? getErrorMessage(error) : "Unknown error";
    if (message === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found." }, { status: 404 });
    if (message === "EMAIL_MISMATCH") return NextResponse.json({ error: "Email confirmation does not match." }, { status: 400 });

    console.error("DELETE_ACCOUNT_ERROR:", error);
    return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
  }
}
