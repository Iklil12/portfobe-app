import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";
import crypto from "crypto";
import prisma from "@/shared/lib/prisma";
import { getPricingPlans, validateCoupon } from "@/features/billing/model/billingService";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, duration, coupon } = await req.json();

    if (!['pro', 'supreme'].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const pricing = await getPricingPlans();
    if (!pricing[plan]) {
      return NextResponse.json({ error: "Plan not active" }, { status: 400 });
    }

    const selectedPricing = pricing[plan][duration];
    if (!selectedPricing) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    let baseTotal = selectedPricing.total;
    let discountAmount = 0;

    if (coupon) {
      try {
        const couponResult = await validateCoupon(session.user.email, coupon, plan, baseTotal);
        if (couponResult.success && couponResult.coupon) {
          if (couponResult.coupon.discountType === 'PERCENTAGE') {
            discountAmount = (baseTotal * couponResult.coupon.discountValue) / 100;
          } else {
            discountAmount = couponResult.coupon.discountValue;
          }
        }
      } catch (err: any) {
        // Jika kupon gagal divalidasi, abaikan saja atau bisa dilempar error
        return NextResponse.json({ error: err.message.split(":")[1] || "Invalid coupon" }, { status: 400 });
      }
    }

    const finalAmount = Math.max(0, baseTotal - discountAmount);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Buat transaksi di database dengan status PENDING
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: finalAmount,
        status: "PENDING",
        plan: plan.toUpperCase() as any,
        durationDays: duration === 'yearly' ? 365 : 30,
        gateway: "duitku",
      }
    });

    const merchantOrderId = transaction.id;

    // Jika final amount adalah 0, tidak perlu lewat Duitku
    if (finalAmount === 0) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "SUCCESS" }
      });
      // Di sistem utuh, harusnya aktifkan langganan di sini
      return NextResponse.json({ 
        paymentUrl: "/checkout/success" 
      });
    }

    const finalAmountInt = Math.floor(finalAmount);

    // Integrasi Duitku
    const merchantCode = process.env.DUITKU_MERCHANT_CODE?.trim();
    const apiKey = process.env.DUITKU_API_KEY?.trim();

    if (!merchantCode || !apiKey) {
      throw new Error("Duitku credentials not configured in environment");
    }

    // Signature MD5(merchantCode + merchantOrderId + paymentAmount + apiKey)
    const signatureStr = `${merchantCode}${merchantOrderId}${finalAmountInt}${apiKey}`;
    const signature = crypto.createHash('md5').update(signatureStr).digest('hex');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://portfo.be";

    const payload = {
      merchantCode,
      paymentAmount: finalAmountInt,
      merchantOrderId,
      productDetails: `Portfobe ${plan.toUpperCase()} - ${duration}`,
      email: user.email,
      customerVaName: user.profile?.fullName || user.email.split('@')[0],
      callbackUrl: `${appUrl}/api/callbacks/duitku`,
      returnUrl: `${appUrl}/checkout/success`,
      signature
    };

    const isSandbox = process.env.DUITKU_ENV !== 'production';
    // Gunakan URL Sandbox secara default (dengan huruf I kapital sesuai spesifikasi API baru)
    const apiUrl = isSandbox 
      ? 'https://api-sandbox.duitku.com/api/merchant/createInvoice'
      : 'https://api-prod.duitku.com/api/merchant/createInvoice';

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Portfobe/1.0',
      },
      body: JSON.stringify(payload)
    });

    const responseText = await res.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Duitku returned non-JSON:", responseText);
      return NextResponse.json({ error: `Duitku API Error: ${res.status} - ${responseText}` }, { status: 500 });
    }
    
    console.log("Duitku response:", data);

    if (data.statusCode === "00" && data.paymentUrl) {
      return NextResponse.json({ paymentUrl: data.paymentUrl });
    } else {
      console.error("Duitku Create Invoice Error:", data);
      return NextResponse.json({ error: data.statusMessage || "Gagal membuat tagihan pembayaran." }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan internal" }, { status: 500 });
  }
}
