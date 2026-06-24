import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getPortfolioData } from "@/features/portfolio/model/portfolioService";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  try {
    const resolvedParams = await params;
    const responseData = await getPortfolioData(resolvedParams.subdomain);
    return NextResponse.json(responseData);
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("?? CRITICAL API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
