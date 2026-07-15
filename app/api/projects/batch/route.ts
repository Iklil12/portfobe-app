import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { batchCreateProjects } from '@/features/projects/model/projectService';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid data format or empty items" }, { status: 400 });
    }

    if (items.length > 10) {
      return NextResponse.json({ error: "Maximum 10 items per batch upload allowed" }, { status: 400 });
    }

    const newProjects = await batchCreateProjects(token.email, items);
    
    return NextResponse.json({ success: true, count: newProjects.length, data: newProjects });
  } catch (error: any) {
    console.error('Batch Upload API Error:', error);
    
    if (error.message === "QUOTA_EXCEEDED") {
      return NextResponse.json({ error: "Kamu telah mencapai batas maksimal 4 proyek untuk akun Free. Silakan upgrade ke Pro." }, { status: 403 });
    }
    
    return NextResponse.json({ error: error.message || "Failed to process batch upload" }, { status: 500 });
  }
}
