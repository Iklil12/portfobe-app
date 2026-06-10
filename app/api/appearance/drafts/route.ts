import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { safeStringifyJson } from "@/lib/safeJson";
import { getEffectivePlan } from "@/lib/planUtils";


export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const drafts = await prisma.themeDraft.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(drafts);
  } catch (error) {
    console.error("GET Drafts Error:", error);
    return NextResponse.json({ error: "Gagal mengambil draft" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Cek Batasan Plan
    const effectivePlan = getEffectivePlan(user);
    if (effectivePlan === 'FREE') {
      return NextResponse.json({ error: "Fitur Draft eksklusif untuk PRO/SUPREME.", code: "FEATURE_LOCKED" }, { status: 403 });
    }

    const draftCount = await prisma.themeDraft.count({ where: { userId: user.id } });
    const maxDrafts = effectivePlan === 'SUPREME' ? 5 : 2;

    if (draftCount >= maxDrafts) {
      return NextResponse.json({ error: `Batas maksimal draft (${maxDrafts}) telah tercapai untuk paket ${effectivePlan}.` }, { status: 400 });
    }

    const body = await req.json();
    const { 
        name,
        description,
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen,
        customTexts
    } = body;

    // === SANITASI INPUT ===
    const sanitize = (str: string, maxLen: number) => 
      str.replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, '').trim().slice(0, maxLen);

    const safeName = name ? sanitize(String(name), 50) : `Draft ${new Date().toLocaleDateString()}`;
    const safeDescription = description ? sanitize(String(description), 200) : null;

    if (safeName.length < 1) {
      return NextResponse.json({ error: "Nama draft tidak boleh kosong." }, { status: 400 });
    }

    let stringifiedCustomTexts = "{}";
    if (customTexts !== undefined) {
      stringifiedCustomTexts = safeStringifyJson(customTexts);
      if (stringifiedCustomTexts.length > 5000) {
        return NextResponse.json({ error: "Payload customTexts terlalu besar." }, { status: 400 });
      }
    }

    const newDraft = await prisma.themeDraft.create({
      data: {
        userId: user.id,
        name: safeName,
        description: safeDescription,
        themeTemplate: themeTemplate || 'minimalist',
        themeColor: themeColor || '#000000',
        fontHeading: fontHeading || 'Inter',
        fontBody: fontBody || 'Inter',
        buttonShape: buttonShape || 'rounded',
        cardStyle: cardStyle || 'flat',
        splashScreen: splashScreen || false,
        customTexts: stringifiedCustomTexts
      }
    });

    return NextResponse.json(newDraft);
  } catch (error) {
    console.error("POST Draft Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan draft" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { 
        id,
        name,
        description,
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen,
        customTexts
    } = body;

    if (!id) return NextResponse.json({ error: "ID Draft diperlukan" }, { status: 400 });

    // Verifikasi kepemilikan
    const existingDraft = await prisma.themeDraft.findUnique({ where: { id } });
    if (!existingDraft || existingDraft.userId !== user.id) {
      return NextResponse.json({ error: "Draft tidak ditemukan" }, { status: 404 });
    }

    let stringifiedCustomTexts = existingDraft.customTexts;
    if (customTexts !== undefined) {
      stringifiedCustomTexts = safeStringifyJson(customTexts);
      if (stringifiedCustomTexts.length > 5000) {
        return NextResponse.json({ error: "Payload customTexts terlalu besar." }, { status: 400 });
      }
    }

    // === SANITASI INPUT ===
    const sanitize = (str: string, maxLen: number) => 
      str.replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, '').trim().slice(0, maxLen);

    const safeName = name !== undefined ? sanitize(String(name), 50) : undefined;
    const safeDescription = description !== undefined ? sanitize(String(description), 200) : undefined;

    const updatedDraft = await prisma.themeDraft.update({
      where: { id },
      data: {
        ...(safeName !== undefined && { name: safeName }),
        ...(safeDescription !== undefined && { description: safeDescription }),
        ...(themeTemplate !== undefined && { themeTemplate }),
        ...(themeColor !== undefined && { themeColor }),
        ...(fontHeading !== undefined && { fontHeading }),
        ...(fontBody !== undefined && { fontBody }),
        ...(buttonShape !== undefined && { buttonShape }),
        ...(cardStyle !== undefined && { cardStyle }),
        ...(splashScreen !== undefined && { splashScreen }),
        customTexts: stringifiedCustomTexts
      }
    });

    return NextResponse.json(updatedDraft);
  } catch (error) {
    console.error("PUT Draft Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui draft" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID Draft diperlukan" }, { status: 400 });

    const existingDraft = await prisma.themeDraft.findUnique({ where: { id } });
    if (!existingDraft || existingDraft.userId !== user.id) {
      return NextResponse.json({ error: "Draft tidak ditemukan" }, { status: 404 });
    }

    await prisma.themeDraft.delete({ where: { id } });

    // Jika draft yang dihapus adalah draft yang sedang live, reset publishedDraftId di SiteAppearance
    const appearance = await prisma.siteAppearance.findUnique({ where: { userId: user.id } });
    if (appearance && appearance.publishedDraftId === id) {
      await prisma.siteAppearance.update({
        where: { userId: user.id },
        data: { publishedDraftId: null }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Draft Error:", error);
    return NextResponse.json({ error: "Gagal menghapus draft" }, { status: 500 });
  }
}
