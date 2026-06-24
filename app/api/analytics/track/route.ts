import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { trackAnalytics } from "@/features/analytics/model/analyticsService";

export async function POST(req: Request) {
  try {
    const result = await trackAnalytics(req);
    
    if (!result?.success && (result as any)?.error) {
      return NextResponse.json({ error: (result as any).error || "Internal Error" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
