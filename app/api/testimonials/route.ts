import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { checkRateLimit } from "@/lib/rate-limit";
import { getEffectivePlan } from "@/lib/planUtils";
import sanitizeHtml from 'sanitize-html';


// GET ALL TESTIMONIALS FOR USER
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const testimonials = await prisma.testimonial.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json(testimonials);
}

// CREATE NEW TESTIMONIAL
export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit();
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // --- PLAN ENFORCEMENT: CEK KUOTA FREE ---
  if (getEffectivePlan(user) === 'FREE') {
    const testimonialCount = await prisma.testimonial.count({ where: { userId: user.id } });
    if (testimonialCount >= 2) {
      return NextResponse.json({ 
        error: "Kuota FREE maksimal 2 testimoni. Silakan upgrade ke PRO.",
        code: "QUOTA_EXCEEDED"
      }, { status: 403 });
    }
  }
  // -----------------------------------------

  try {
    const body = await req.json();
    let { clientName, company, content, rating, avatarUrl } = body;

    if (!clientName || !content) {
      return NextResponse.json({ error: "Nama dan isi testimoni wajib diisi" }, { status: 400 });
    }

    // Validate image URL source for security
    if (avatarUrl && !avatarUrl.startsWith('https://res.cloudinary.com/') && !avatarUrl.startsWith('https://ui-avatars.com/')) {
      return NextResponse.json({ error: "URL gambar tidak valid atau tidak tepercaya" }, { status: 400 });
    }

    // Sanitize input strings to prevent XSS
    const sanitizeConfig = { allowedTags: [], allowedAttributes: {} };
    clientName = sanitizeHtml(clientName || "", sanitizeConfig).trim();
    company = sanitizeHtml(company || "", sanitizeConfig).trim();
    content = sanitizeHtml(content || "", sanitizeConfig).trim();

    const newTestimonial = await prisma.testimonial.create({
      data: {
        userId: user.id,
        clientName,
        company: company || null,
        content,
        rating: rating ? parseInt(rating) : 5,
        avatarUrl: avatarUrl || null,
        isVisible: true,
        order: 0
      }
    });

    await logActivity(user.id, "ADD_TESTIMONIAL", `Menambahkan testimoni dari ${clientName}`);

    return NextResponse.json(newTestimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Gagal membuat testimoni" }, { status: 500 });
  }
}
