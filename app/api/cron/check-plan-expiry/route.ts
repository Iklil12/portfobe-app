import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getEffectivePlan } from "@/lib/planUtils";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  try {
    // 1. Verifikasi Keamanan (sama seperti cron/aggregate)
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    const secret = process.env.CRON_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: "Unauthorized: CRON_SECRET not set" },
        { status: 401 }
      );
    }

    if (key !== secret && bearerToken !== secret) {
      return NextResponse.json(
        { error: "Unauthorized: Key mismatch" },
        { status: 401 }
      );
    }

    const now = new Date();

    // 2. Cari semua Subscription PRO yang ACTIVE tapi sudah expired
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        plan: { in: ["PRO", "SUPREME"] },
        expiredAt: { lt: now }, // expiredAt < sekarang
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    console.log(
      `[Cron] Menemukan ${expiredSubscriptions.length} subscription yang expired.`
    );

    if (expiredSubscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscriptions expired today.",
        downgraded: 0,
      });
    }

    const downgradedUsers: string[] = [];

    // 3. Proses setiap subscription yang expired
    for (const sub of expiredSubscriptions) {
      const userId = sub.userId;
      const userEmail = sub.user.email;
      const userName = sub.user.profile?.fullName || "Pengguna";
      
      const daysSinceExpiry = Math.floor((now.getTime() - sub.expiredAt!.getTime()) / (1000 * 60 * 60 * 24));

      // Jika sudah melewati masa grace period (>= 3 hari)
      if (daysSinceExpiry >= 3) {
        // Update subscription status → EXPIRED
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "EXPIRED" },
        });

        // Downgrade user: plan=FREE, planExpiredAt=null
        const otherActiveProSub = await prisma.subscription.findFirst({
          where: {
            userId,
            status: "ACTIVE",
            plan: { in: ["PRO", "SUPREME"] },
            id: { not: sub.id },
            OR: [
              { expiredAt: null },
              { expiredAt: { gt: now } },
            ],
          },
        });

        if (!otherActiveProSub) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: "FREE", planExpiredAt: null },
          });

          downgradedUsers.push(userEmail);

          if (userEmail) {
            resend.emails.send({
              from: "Portfobe <hellocreator@mail.ritions.com>",
              to: userEmail,
              replyTo: "ikliluluyun@ritions.com",
              subject: "Your PRO Plan Has Expired (Grace Period Ended) — Portfobe",
              html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
                <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
                </div>
                <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                  <p style="font-size: 16px; margin-top: 0;">Hey, <strong>${userName}</strong>!</p>
                  <p style="font-size: 16px;">The additional grace period for your PRO Plan on <strong>Portfobe</strong> has ended. Your account has now reverted to the <strong>Starter (Free)</strong> plan.</p>
                  <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">⚠️ PRO features like advanced analytics, custom themes, and the 4-project limit are no longer available. Your old data remains safe.</p>
                  </div>
                  <p style="font-size: 16px;">Contact us to renew your PRO plan anytime.</p>
                  <br/>
                  <p style="font-size: 14px; color: #64748b;">Portfobe Team</p>
                </div>
              </div>
              `,
            }).catch(err => console.error(`Gagal kirim email downgrade ke ${userEmail}:`, err));
          }
        }
      } 
      // Jika masih dalam masa Grace Period (0-2 hari)
      else {
        // Kirim notifikasi H+0 (baru masuk grace period)
        if (daysSinceExpiry === 0 && userEmail) {
          resend.emails.send({
            from: "Portfobe <hellocreator@mail.ritions.com>",
            to: userEmail,
            replyTo: "ikliluluyun@ritions.com",
            subject: "Grace Period: Your PRO Plan Expires Today — Portfobe",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
              <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
              </div>
              <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; margin-top: 0;">Hey, <strong>${userName}</strong>!</p>
                <p style="font-size: 16px;">Your PRO plan was supposed to expire today. However, we are providing a <strong>3-Day Grace Period</strong> so you don't lose access suddenly.</p>
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 14px; color: #1e40af;">✨ You can still use all PRO features for the next 3 days.</p>
                </div>
                <p style="font-size: 16px;">Please renew before your account is automatically switched to the Free (Starter) plan.</p>
                <br/>
                <p style="font-size: 14px; color: #64748b;">Portfobe Team</p>
              </div>
            </div>
            `,
          }).catch(err => console.error(`Failed to send grace period email to ${userEmail}:`, err));
        }
        // Kirim notifikasi H+2 (peringatan terakhir grace period)
        else if (daysSinceExpiry === 2 && userEmail) {
          resend.emails.send({
            from: "Portfobe <hellocreator@mail.ritions.com>",
            to: userEmail,
            replyTo: "ikliluluyun@ritions.com",
            subject: "[Important] Last Day of PRO Grace Period — Portfobe",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
              <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
              </div>
              <div style="padding: 32px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; margin-top: 0;">Hey, <strong>${userName}</strong>!</p>
                <p style="font-size: 16px;">This is the last day of your 3-day Grace Period. Tomorrow, your account will automatically be downgraded to the Free plan.</p>
                <p style="font-size: 16px;">Don't let your premium features stop! Contact us for a renewal today.</p>
                <br/>
                <p style="font-size: 14px; color: #64748b;">Portfobe Team</p>
              </div>
            </div>
            `,
          }).catch(err => console.error(`Failed to send grace period reminder to ${userEmail}:`, err));
        }
      }
    }

    // 5. Juga cari & notifikasi yang akan expire dalam 7 hari (reminder)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringSoonSubs = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        plan: { in: ["PRO", "SUPREME"] },
        expiredAt: {
          gt: now,
          lte: sevenDaysFromNow,
        },
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    console.log(
      `[Cron] ${expiringSoonSubs.length} subscription akan expire dalam 7 hari.`
    );

    for (const sub of expiringSoonSubs) {
      const daysLeft = Math.ceil(
        (sub.expiredAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const userName = sub.user.profile?.fullName || "Pengguna";
      const userEmail = sub.user.email;

      // Kirim reminder hanya di hari ke-7, ke-3, dan ke-1
      if ([7, 3, 1].includes(daysLeft)) {
        resend.emails
          .send({
            from: "Portfobe <hellocreator@mail.ritions.com>",
            to: userEmail,
            replyTo: "ikliluluyun@ritions.com",
            subject: `Your PRO Plan Expires in ${daysLeft} Days — Portfobe`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
              <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
              </div>
              <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; margin-top: 0;">Hey, <strong>${userName}</strong>!</p>
                <p style="font-size: 16px;">Your PRO plan will expire in <strong>${daysLeft} days</strong>. Renew soon so you don't lose access to PRO features!</p>
                <br/>
                <p style="font-size: 14px; color: #64748b;">Portfobe Team</p>
              </div>
            </div>
            `,
          })
          .catch((err) =>
            console.error(`Failed to send reminder to ${userEmail}:`, err)
          );
      }
    }

    // 6. Win-back Emails (H+3 & H+7 Setelah Downgrade)
    // Karena downgrade dilakukan di H+3 (setelah grace period berakhir),
    // maka H+3 setelah downgrade = 6 hari dari expiredAt (daysSinceExpiry === 6)
    // dan H+7 setelah downgrade = 10 hari dari expiredAt (daysSinceExpiry === 10)
    const winbackSubs = await prisma.subscription.findMany({
      where: {
        status: "EXPIRED",
        plan: { in: ["PRO", "SUPREME"] },
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    let winbackEmailsSent = 0;

    for (const sub of winbackSubs) {
      // Jika user sudah langganan lagi (plan-nya PRO), lewati.
      if (sub.user.plan !== "FREE") continue;

      const daysSinceExpiry = Math.floor(
        (now.getTime() - sub.expiredAt!.getTime()) / (1000 * 60 * 60 * 24)
      );

      const userName = sub.user.profile?.fullName || "Pengguna";
      const userEmail = sub.user.email;

      // H+3 Setelah Downgrade
      if (daysSinceExpiry === 6 && userEmail) {
        resend.emails.send({
          from: "Portfobe <hellocreator@mail.ritions.com>",
          to: userEmail,
          replyTo: "ikliluluyun@ritions.com",
          subject: "We Miss Your Great Work! 30% Off to Return to PRO 🎁",
          html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
            <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
            </div>
            <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; margin-top: 0;">Hey, <strong>${userName}</strong>!</p>
              <p style="font-size: 16px;">It's been a few days since your PRO plan ended. We really miss the captivating portfolios you created using our premium features.</p>
              <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 18px;">Special Creator Comeback Offer!</h3>
                <p style="margin: 0; font-size: 15px; color: #047857;">Use promo code <strong>COMEBACK30</strong> to get a 30% discount on renewing your PRO Plan today.</p>
              </div>
              <p style="font-size: 16px;">Elevate your professional career again and get in-depth analytics and a custom domain right now.</p>
              <br/>
              <p style="font-size: 14px; color: #64748b;">Warm regards,<br/>Portfobe Team</p>
            </div>
          </div>
          `,
        }).catch(err => console.error(`Gagal kirim win-back H+3 ke ${userEmail}:`, err));
        winbackEmailsSent++;
      }
      
      // H+7 Setelah Downgrade
      else if (daysSinceExpiry === 10 && userEmail) {
        resend.emails.send({
          from: "Portfobe <hellocreator@mail.ritions.com>",
          to: userEmail,
          replyTo: "ikliluluyun@ritions.com",
          subject: "Last Chance: 50% Off Just For You! 🔥",
          html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
            <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
            </div>
            <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; margin-top: 0;">Hey, <strong>${userName}</strong>!</p>
              <p style="font-size: 16px;">This is our biggest offer and exclusive just for you. We want to see you grow with Portfobe PRO.</p>
              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #b45309; font-size: 18px;">50% Off Forever!</h3>
                <p style="margin: 0; font-size: 15px; color: #d97706;">Use promo code <strong>MISSYOU50</strong> at checkout. This coupon is only valid for the next 24 hours.</p>
              </div>
              <p style="font-size: 16px;">Don't let your great work go unseen. Go back to PRO now.</p>
              <br/>
              <p style="font-size: 14px; color: #64748b;">Warm regards,<br/>Portfobe Team</p>
            </div>
          </div>
          `,
        }).catch(err => console.error(`Gagal kirim win-back H+7 ke ${userEmail}:`, err));
        winbackEmailsSent++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil memproses ${expiredSubscriptions.length} subscription expired.`,
      downgraded: downgradedUsers.length,
      downgradedUsers,
      remindersChecked: expiringSoonSubs.length,
      winbackSent: winbackEmailsSent,
    });
  } catch (error) {
    console.error("[Cron] Plan Expiry Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

