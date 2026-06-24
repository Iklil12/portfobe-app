import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { getDrafts, createDraft, updateDraft, deleteDraft } from "@/features/themes/model/themeService";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const drafts = await getDrafts(session.user.email);
    return NextResponse.json(drafts);
  } catch (error: unknown) {
    console.error("GET Drafts Error:", error);
    return NextResponse.json({ error: "Failed to fetch drafts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const draft = await createDraft(session.user.email, body);
    return NextResponse.json(draft, { status: 201 });
  } catch (error: unknown) {
    if (getErrorMessage(error).startsWith("FEATURE_LOCKED:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1], code: "FEATURE_LOCKED" }, { status: 403 });
    if (getErrorMessage(error).startsWith("MAXIMUM_DRAFTS_REACHED:")) return NextResponse.json({ error: getErrorMessage(error).split(":")[1], code: "MAXIMUM_DRAFTS_REACHED" }, { status: 403 });
    console.error("POST Draft Error:", error);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const draft = await updateDraft(session.user.email, body);
    return NextResponse.json(draft);
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_DATA") return NextResponse.json({ error: "ID draft diperlukan" }, { status: 400 });
    if (getErrorMessage(error) === "FORBIDDEN") return NextResponse.json({ error: "Draft tidak ditemukan" }, { status: 404 });
    console.error("PUT Draft Error:", error);
    return NextResponse.json({ error: "Failed to update draft" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Draft ID is required" }, { status: 400 });

    await deleteDraft(session.user.email, id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "FORBIDDEN") return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    console.error("DELETE Draft Error:", error);
    return NextResponse.json({ error: "Failed to delete draft" }, { status: 500 });
  }
}
