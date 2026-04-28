const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Hapus data lama jika ada
  await prisma.announcement.deleteMany({});
  
  // Buat 2 pengumuman test
  const a1 = await prisma.announcement.create({
    data: {
      title: "Maintenance Server",
      message: "Sistem akan offline jam 00:00 - 02:00 WIB untuk pemeliharaan rutin.",
      type: "WARNING",
      channel: "BOTH",
      targetPlan: "ALL",
      isActive: true,
    }
  });
  console.log("Created:", a1.id, a1.title);

  const a2 = await prisma.announcement.create({
    data: {
      title: "Diskon Pro Plan 50%",
      message: "Upgrade sekarang dan nikmati semua fitur premium dengan setengah harga!",
      type: "SUCCESS",
      channel: "BELL",
      targetPlan: "FREE",
      isActive: true,
    }
  });
  console.log("Created:", a2.id, a2.title);

  // Verifikasi
  const all = await prisma.announcement.findMany();
  console.log("\nTotal announcements:", all.length);
  all.forEach(a => console.log(`- [${a.type}] ${a.title} | channel=${a.channel} | target=${a.targetPlan} | active=${a.isActive}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
