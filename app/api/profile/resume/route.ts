import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/shared/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { resumeData } = body;
    
    if (!resumeData) {
      return NextResponse.json({ error: "No resume data provided" }, { status: 400 });
    }
    
    const profile = await prisma.profile.update({
      where: {
        userId: token.sub
      },
      data: {
        // @ts-ignore - Prisma client needs regeneration to recognize resumeData
        resumeData
      }
    });
    
    return NextResponse.json({ success: true, message: "Resume saved" }, { status: 200 });
    
  } catch (error) {
    console.error("[RESUME_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
