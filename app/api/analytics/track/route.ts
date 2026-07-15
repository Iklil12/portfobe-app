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
    const errorMsg = getErrorMessage(error);
    
    // Pastikan error message benar-benar memiliki format "KodeStatus:PesanError" (contoh "400:Invalid body")
    const customErrorMatch = errorMsg.match(/^(\d{3}):(.*)/);
    if (customErrorMatch) {
      const status = parseInt(customErrorMatch[1]);
      const msg = customErrorMatch[2];
      
      // Jika status valid HTTP code, kita kembalikan.
      if (!isNaN(status) && status >= 400 && status <= 599) {
        return NextResponse.json({ error: msg }, { status });
      }
    }

    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
