import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getRecentActivity } from "@/features/activity/model/activityService";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const activities = await getRecentActivity(session.user.email);
    return NextResponse.json(activities);
  } catch (error: unknown) {
    if (getErrorMessage(error) === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
