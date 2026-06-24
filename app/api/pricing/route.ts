import { NextResponse } from "next/server";
import { getPricingPlans } from "@/features/billing/model/billingService";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const formattedPricing = await getPricingPlans();
    return NextResponse.json(formattedPricing);
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}
