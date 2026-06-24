import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import { validateCoupon } from "@/features/billing/model/billingService";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { code, plan, subtotal } = await req.json();

    const result = await validateCoupon(session?.user?.email, code, plan, subtotal);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (getErrorMessage(error).includes(":")) {
      const [status, msg] = getErrorMessage(error).split(":");
      return NextResponse.json({ error: msg }, { status: parseInt(status) });
    }
    console.error("Error validating coupon:", error);
    return NextResponse.json({ error: "Gagal memvalidasi kupon" }, { status: 500 });
  }
}
