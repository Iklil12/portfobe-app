import prisma from "./prisma";

// Daftar semua jenis blok universal yang didukung oleh Hybrid Modular Builder
const UNIVERSAL_BLOCKS = [
  "HERO",
  "MARQUEE",
  "ABOUT",
  "SKILLS",
  "EXPERIENCE",
  "SERVICES",
  "STATS",
  "PROJECTS",
  "3D",
  "PENPOT",
  "CANVA",
  "GITHUB",
  "AWARDS",
  "TESTIMONIALS",
  "FOOTER"
];

/**
 * Fungsi untuk memastikan pengguna memiliki semua set Blok Universal.
 * Hanya akan menambahkan blok yang belum ada, TIDAK PERNAH menghapus blok yang sudah ada.
 */
export async function ensureUniversalBlocks(userId: string) {
  try {
    // 1. Ambil blok yang sudah dimiliki user
    const existingBlocks = await prisma.pageBlock.findMany({
      where: { userId },
      orderBy: { orderIndex: 'asc' }
    });

    const existingTypes = existingBlocks.map(b => b.blockType);

    // 2. Cari blok universal yang belum dimiliki user
    const missingBlocks = UNIVERSAL_BLOCKS.filter(type => !existingTypes.includes(type));

    // 3. Masukkan blok yang kurang (tambahkan di urutan paling bawah)
    if (missingBlocks.length > 0) {
      const blocksToInsert = missingBlocks.map((type, index) => ({
        userId,
        blockType: type,
        orderIndex: existingBlocks.length + index,
        // Set selalu visible agar tidak membingungkan user
        isVisible: true,
        configJson: "{}"
      }));

      await prisma.pageBlock.createMany({
        data: blocksToInsert
      });
      console.log(`Successfully seeded ${missingBlocks.length} universal blocks for user ${userId}`);
    }

    return true;
  } catch (error) {
    console.error("Error ensuring universal blocks:", error);
    return false;
  }
}
