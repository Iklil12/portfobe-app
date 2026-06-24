import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { getTestimonials, createTestimonial } from "@/features/testimonials/model/testimonialService";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const testimonials = await getTestimonials(session.user.email);
    return NextResponse.json(testimonials);
  } catch (error: unknown) {
    console.error("GET Testimonials Error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const testimonial = await createTestimonial(session.user.email, body);
    return NextResponse.json(testimonial);
  } catch (error: unknown) {
    if (getErrorMessage(error).startsWith("QUOTA_EXCEEDED:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1], code: "QUOTA_EXCEEDED" }, { status: 403 });
    if (getErrorMessage(error).startsWith("INVALID_DATA:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1] }, { status: 400 });
    if (getErrorMessage(error).startsWith("INVALID_AVATAR:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1] }, { status: 400 });
    if (getErrorMessage(error) === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found" }, { status: 404 });

    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
