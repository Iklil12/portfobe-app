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
        message: "Tidak ada subscription yang expired hari ini.",
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
              subject: "Paket PRO Anda Telah Berakhir (Grace Period Habis) — Portfobe",
              html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
                <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
                </div>
                <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                  <p style="font-size: 16px; margin-top: 0;">Hei, <strong>${userName}</strong>!</p>
                  <p style="font-size: 16px;">Masa berlaku tambahan (Grace Period) Paket PRO kamu di <strong>Portfobe</strong> telah habis. Akun kamu sekarang kembali ke paket <strong>Starter (Gratis)</strong>.</p>
                  <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">⚠️ Fitur PRO seperti analitik lanjutan, tema custom, dan batas 5 proyek tidak lagi tersedia. Data lama kamu tetap aman.</p>
                  </div>
                  <p style="font-size: 16px;">Hubungi kami untuk memperpanjang paket PRO kamu kapan saja.</p>
                  <br/>
                  <p style="font-size: 14px; color: #64748b;">Tim Portfobe</p>
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
            subject: "Masa Tenggang: Paket PRO Anda Berakhir Hari Ini — Portfobe",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
              <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
              </div>
              <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; margin-top: 0;">Hei, <strong>${userName}</strong>!</p>
                <p style="font-size: 16px;">Paket PRO kamu seharusnya berakhir hari ini. Namun, kami memberikan <strong>Masa Tenggang (Grace Period) selama 3 Hari</strong> agar kamu tidak kehilangan akses secara mendadak.</p>
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 14px; color: #1e40af;">✨ Kamu masih bisa menggunakan semua fitur PRO selama 3 hari ke depan.</p>
                </div>
                <p style="font-size: 16px;">Silakan lakukan perpanjangan sebelum akun kamu otomatis dialihkan ke paket Gratis (Starter).</p>
                <br/>
                <p style="font-size: 14px; color: #64748b;">Tim Portfobe</p>
              </div>
            </div>
            `,
          }).catch(err => console.error(`Gagal kirim email grace period ke ${userEmail}:`, err));
        }
        // Kirim notifikasi H+2 (peringatan terakhir grace period)
        else if (daysSinceExpiry === 2 && userEmail) {
          resend.emails.send({
            from: "Portfobe <hellocreator@mail.ritions.com>",
            to: userEmail,
            replyTo: "ikliluluyun@ritions.com",
            subject: "[Penting] Hari Terakhir Masa Tenggang PRO — Portfobe",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
              <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
              </div>
              <div style="padding: 32px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; margin-top: 0;">Hei, <strong>${userName}</strong>!</p>
                <p style="font-size: 16px;">Ini adalah hari terakhir dari masa tenggang (Grace Period) 3 hari kamu. Besok, akun kamu akan otomatis di-downgrade ke paket Gratis.</p>
                <p style="font-size: 16px;">Jangan sampai fitur-fitur premium kamu terhenti! Segera hubungi kami untuk perpanjangan hari ini.</p>
                <br/>
                <p style="font-size: 14px; color: #64748b;">Tim Portfobe</p>
              </div>
            </div>
            `,
          }).catch(err => console.error(`Gagal kirim email reminder grace period ke ${userEmail}:`, err));
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
            subject: `Paket PRO Kamu Berakhir dalam ${daysLeft} Hari — Portfobe`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
              <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
              </div>
              <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; margin-top: 0;">Hei, <strong>${userName}</strong>!</p>
                <p style="font-size: 16px;">Paket PRO kamu akan berakhir dalam <strong>${daysLeft} hari</strong>. Segera perpanjang agar tidak kehilangan akses ke fitur-fitur PRO!</p>
                <br/>
                <p style="font-size: 14px; color: #64748b;">Tim Portfobe</p>
              </div>
            </div>
            `,
          })
          .catch((err) =>
            console.error(`Gagal kirim reminder ke ${userEmail}:`, err)
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
          subject: "Kami Rindu Karya Hebatmu! Diskon 30% untuk Kembali ke PRO 🎁",
          html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
            <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
            </div>
            <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; margin-top: 0;">Hei, <strong>${userName}</strong>!</p>
              <p style="font-size: 16px;">Sudah beberapa hari sejak paket PRO kamu berakhir. Kami sangat merindukan portofolio menawan yang kamu buat menggunakan fitur premium kami.</p>
              <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 18px;">Penawaran Spesial Kembalinya Kreator!</h3>
                <p style="margin: 0; font-size: 15px; color: #047857;">Gunakan kode promo <strong>COMEBACK30</strong> untuk mendapatkan diskon 30% perpanjangan Paket PRO hari ini.</p>
              </div>
              <p style="font-size: 16px;">Tingkatkan kembali karir profesionalmu dan dapatkan analitik mendalam serta custom domain sekarang juga.</p>
              <br/>
              <p style="font-size: 14px; color: #64748b;">Salam hangat,<br/>Tim Portfobe</p>
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
          subject: "Kesempatan Terakhir: Diskon 50% Khusus Untukmu! 🔥",
          html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
            <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">portfobe</h1>
            </div>
            <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; margin-top: 0;">Hei, <strong>${userName}</strong>!</p>
              <p style="font-size: 16px;">Ini adalah penawaran terbesar kami dan eksklusif hanya untukmu. Kami ingin melihatmu berkembang bersama Portfobe PRO.</p>
              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #b45309; font-size: 18px;">Diskon 50% Selamanya!</h3>
                <p style="margin: 0; font-size: 15px; color: #d97706;">Gunakan kode promo <strong>MISSYOU50</strong> saat checkout. Kupon ini hanya berlaku selama 24 jam ke depan.</p>
              </div>
              <p style="font-size: 16px;">Jangan biarkan karya hebatmu tidak terlihat. Kembali jadi PRO sekarang.</p>
              <br/>
              <p style="font-size: 14px; color: #64748b;">Salam hangat,<br/>Tim Portfobe</p>
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
