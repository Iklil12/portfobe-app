import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { updateTestimonial, deleteTestimonial } from "@/features/testimonials/model/testimonialService";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const body = await req.json();

    const testimonial = await updateTestimonial(session.user.email, resolvedParams.id, body);
    return NextResponse.json(testimonial);
  } catch (error: unknown) {
    if (getErrorMessage(error).startsWith("FORBIDDEN:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1] }, { status: 404 });
    if (getErrorMessage(error).startsWith("INVALID_AVATAR:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1] }, { status: 400 });
    if (getErrorMessage(error) === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found" }, { status: 404 });

    console.error("Error updating testimonial:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    await deleteTestimonial(session.user.email, resolvedParams.id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (getErrorMessage(error).startsWith("FORBIDDEN:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1] }, { status: 404 });
    if (getErrorMessage(error) === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found" }, { status: 404 });

    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
