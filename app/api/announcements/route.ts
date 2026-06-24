import { NextResponse } from "next/server";
import { getActiveAnnouncements } from "@/features/announcements/model/announcementService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const announcements = await getActiveAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Announcements API error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
