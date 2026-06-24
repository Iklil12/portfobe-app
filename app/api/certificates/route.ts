// File: app/api/certificates/route.ts
import { NextResponse } from "next/server";
import { invalidatePortfolioCache } from '@/shared/lib/redis';
import prisma from '@/shared/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/entities/user/api/auth';
import { logActivity } from '@/shared/lib/activity';
import { checkRateLimit } from '@/shared/lib/rate-limit';
import { getEffectivePlan } from '@/features/billing';
import { ProjectSchema } from '@/shared/lib/validations';
import { handleApiError } from '@/shared/lib/apiError';
import { getErrorMessage } from '@/shared/lib/errorHelper';


// MENGAMBIL SERTIFIKAT USER DENGAN PAGINATION
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where: { userId: user.id, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
      }),
      prisma.certificate.count({
        where: { userId: user.id, deletedAt: null },
      })
    ]);

    return NextResponse.json({
      data: certificates,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// MENAMBAH SERTIFIKAT BARU
export async function POST(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // --- PLAN ENFORCEMENT: CEK KUOTA FREE ---
    if (getEffectivePlan(user) === 'FREE') {
      const certCount = await prisma.certificate.count({ where: { userId: user.id, deletedAt: null } });
      if (certCount >= 1) {
        return NextResponse.json({ 
          error: "Kuota FREE maksimal 1 sertifikat. Silakan upgrade ke PRO.",
          code: "QUOTA_EXCEEDED"
        }, { status: 403 });
      }
    }

    const body = ProjectSchema.parse(await req.json());
    const { title, description, mediaUrl, issuer, year, status } = body;

    if (!title || !mediaUrl || !issuer || !year) {
      return NextResponse.json({ error: "Kolom wajib harus diisi." }, { status: 400 });
    }

    if (mediaUrl && !mediaUrl.startsWith("http://") && !mediaUrl.startsWith("https://")) {
      return NextResponse.json({ error: "Format URL media tidak valid" }, { status: 400 });
    }

    const newCertificate = await prisma.certificate.create({
      data: {
        title,
        description,
        mediaUrl,
        issuer,
        year,
        status: status || "VERIFIED",
        userId: user.id,
      }
    });

    // REKAM AKTIVITAS KE HISTORY
    await logActivity(user.id, "CREATE_CERTIFICATE", `Added certificate/achievement: "${title}"`);

    await invalidatePortfolioCache(user.id);

    

    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// MENGEDIT SERTIFIKAT YANG ADA
export async function PATCH(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = ProjectSchema.parse(await req.json());
    const { id, title, description, mediaUrl, issuer, year, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID Sertifikat tidak ditemukan." }, { status: 400 });
    }

    if (mediaUrl && !mediaUrl.startsWith("http://") && !mediaUrl.startsWith("https://")) {
      return NextResponse.json({ error: "Format URL media tidak valid" }, { status: 400 });
    }

    const existingCert = await prisma.certificate.findUnique({ where: { id } });
    if (!existingCert) return NextResponse.json({ error: "Certificate not found." }, { status: 404 });

    // --- IDOR PROTECTION ---
    if (existingCert.userId !== user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const updatedCertificate = await prisma.certificate.update({
      where: { id },
      data: {
        title,
        description,
        mediaUrl,
        issuer,
        year,
        status
      }
    });

    // REKAM AKTIVITAS KE HISTORY
    await logActivity(user.id, "UPDATE_CERTIFICATE", `Updated achievement data: "${title}"`);

    await invalidatePortfolioCache(user.id);

    

    return NextResponse.json(updatedCertificate);
  } catch (error) {
    return handleApiError(error);
  }
}

// MENGHAPUS SERTIFIKAT
export async function DELETE(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID Sertifikat wajib disertakan." }, { status: 400 });
    }

    const existingCert = await prisma.certificate.findUnique({ where: { id } });
    if (!existingCert) return NextResponse.json({ error: "Certificate not found." }, { status: 404 });

    // --- IDOR PROTECTION ---
    if (existingCert.userId !== user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    await prisma.certificate.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    // REKAM AKTIVITAS KE HISTORY
    await logActivity(user.id, "DELETE_CERTIFICATE", `Moved to trash: "${existingCert.title}"`);

    await invalidatePortfolioCache(user.id);

    

    return NextResponse.json({ message: "Certificate moved to trash." });
  } catch (error) {
    return handleApiError(error);
  }
}

