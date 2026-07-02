import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/shared/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.text(); // Parse as text first to handle URL-encoded form data if Duitku sends it that way
    
    // Duitku callback can be application/x-www-form-urlencoded
    let data: Record<string, string> = {};
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      data = JSON.parse(body);
    } else {
      const searchParams = new URLSearchParams(body);
      for (const [key, value] of searchParams.entries()) {
        data[key] = value;
      }
    }

    const {
      merchantCode,
      amount,
      merchantOrderId,
      signature,
      reference,
      resultCode
    } = data;

    console.log("Duitku Callback Data:", data);

    const envMerchantCode = process.env.DUITKU_MERCHANT_CODE;
    const apiKey = process.env.DUITKU_API_KEY;

    if (!envMerchantCode || !apiKey) {
      console.error("Duitku credentials not found in ENV");
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    // Verify signature: md5(merchantCode + amount + merchantOrderId + apiKey)
    const expectedSignatureStr = `${merchantCode}${amount}${merchantOrderId}${apiKey}`;
    const expectedSignature = crypto.createHash('md5').update(expectedSignatureStr).digest('hex');

    if (signature !== expectedSignature) {
      console.error("Duitku Callback Signature Mismatch");
      return NextResponse.json({ error: "Bad Signature" }, { status: 400 });
    }

    // Process Transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: merchantOrderId }
    });

    if (!transaction) {
      console.error("Transaction not found for ID:", merchantOrderId);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (transaction.status === "SUCCESS") {
      // Already processed
      return NextResponse.json({ status: "OK" });
    }

    if (resultCode === "00") {
      // Payment Success!
      // Update transaction status
      await prisma.transaction.update({
        where: { id: merchantOrderId },
        data: { 
          status: "SUCCESS",
          gateway: "duitku",
        }
      });

      // Activate or extend subscription
      const durationDays = transaction.durationDays;
      const now = new Date();
      
      const user = await prisma.user.findUnique({
        where: { id: transaction.userId },
        select: { id: true, planExpiredAt: true, plan: true }
      });

      if (user) {
        let expiredAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
        
        // If user already has the same active plan, extend it
        if (user.plan === transaction.plan && user.planExpiredAt && user.planExpiredAt > now) {
          expiredAt = new Date(user.planExpiredAt.getTime() + durationDays * 24 * 60 * 60 * 1000);
        }

        // Deactivate old active subscriptions for this user
        await prisma.subscription.updateMany({
          where: { userId: user.id, status: "ACTIVE" },
          data: { status: "CANCELLED" }
        });

        // Create new subscription record
        await prisma.subscription.create({
          data: {
            userId: user.id,
            plan: transaction.plan,
            status: "ACTIVE",
            startedAt: now,
            expiredAt,
            grantedBy: "Duitku Integration",
            notes: `Purchased via Duitku. Ref: ${reference}`,
          }
        });

        // Update user
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: transaction.plan,
            planExpiredAt: expiredAt,
          }
        });

        // Hapus cache dashboard agar UI langsung update ke PRO/SUPREME
        const { redis } = await import("@/shared/lib/redis");
        await redis.del(`dashboard:sync:${user.id}:7d`);
        await redis.del(`dashboard:sync:${user.id}:30d`);
        await redis.del(`dashboard:sync:${user.id}:1d`);
        await redis.del(`dashboard:sync:${user.id}:all`);
      }
      
    } else {
      // Payment Failed or Expired
      await prisma.transaction.update({
        where: { id: merchantOrderId },
        data: { 
          status: "FAILED",
          gateway: "duitku" 
        }
      });
    }

    return NextResponse.json({ status: "OK" });
  } catch (error: any) {
    console.error("Duitku Callback Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
