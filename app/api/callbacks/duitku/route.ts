import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/shared/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        select: { 
          id: true, 
          planExpiredAt: true, 
          plan: true,
          email: true,
          profile: { select: { fullName: true } }
        }
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

        // Send Success / Upgrade Email Notification
        if (user.email) {
          const userName = user.profile?.fullName || "Creator";
          const planName = transaction.plan === "SUPREME" ? "Supreme VIP" : "Pro Creator";
          const formattedAmount = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(transaction.amount);
          
          resend.emails.send({
            from: "Portfobe <hellocreator@mail.ritions.com>",
            to: user.email,
            replyTo: "ikliluluyun@ritions.com",
            subject: `Payment Successful: Welcome to ${planName} 🎉`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
              <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
              </div>
              <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; margin-top: 0;">Hi <strong>${userName}</strong>,</p>
                <p style="font-size: 16px;">Thank you for your payment! Your transaction has been successfully processed and your account is now upgraded to the <strong>${planName}</strong> plan.</p>
                
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Payment Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Invoice No:</td>
                      <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-family: monospace;">${merchantOrderId}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Total Paid:</td>
                      <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: bold;">${formattedAmount}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Package:</td>
                      <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right;">${durationDays} Days Access</td>
                    </tr>
                  </table>
                </div>

                <p style="font-size: 16px;">You can view and download your official receipt directly from your Billing Dashboard.</p>
                <div style="text-align: center; margin-top: 32px;">
                  <a href="https://portfo.be/dashboard/billing" style="background-color: #ff9e00; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Go To Dashboard</a>
                </div>
              </div>
            </div>
            `,
          }).catch(err => console.error(`Failed to send upgrade email to ${user.email}:`, err));
        }
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
