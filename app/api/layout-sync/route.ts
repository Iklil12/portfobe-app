import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import { getLayoutSyncData } from "@/features/themes/model/themeService";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(req: Request) { 
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json(null, { status: 401 });

    const data = await getLayoutSyncData(session.user.email);
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (getErrorMessage(error) === "USER_NOT_FOUND") return NextResponse.json(null, { status: 404 });
    return NextResponse.json(null, { status: 500 });
  }
}
