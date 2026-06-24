import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { reorderTestimonials } from "@/features/testimonials/model/testimonialService";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderedIds } = await req.json();
    await reorderTestimonials(session.user.email, orderedIds);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (getErrorMessage(error).startsWith("INVALID_DATA:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1] }, { status: 400 });
    if (getErrorMessage(error) === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found" }, { status: 404 });

    console.error("Error reordering testimonials:", error);
    return NextResponse.json({ error: "Failed to reorder testimonials" }, { status: 500 });
  }
}
