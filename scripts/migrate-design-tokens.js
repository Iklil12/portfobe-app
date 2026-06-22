const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Memulai Fase 2: Migrasi Data Visual ke designTokens...");

  // 1. Migrasi SiteAppearance (Desain Live)
  const appearances = await prisma.siteAppearance.findMany();
  console.log(`Ditemukan ${appearances.length} data SiteAppearance.`);
  let updatedLiveCount = 0;

  for (const app of appearances) {
    if (!app.designTokens) {
      const designTokens = {
        themeColor: app.themeColor,
        fontHeading: app.fontHeading,
        fontBody: app.fontBody,
        buttonShape: app.buttonShape,
        cardStyle: app.cardStyle
      };

      await prisma.siteAppearance.update({
        where: { id: app.id },
        data: { designTokens: JSON.stringify(designTokens) }
      });
      updatedLiveCount++;
    }
  }
  console.log(`✅ Berhasil memindahkan ${updatedLiveCount} data SiteAppearance ke laci baru.`);

  // 2. Migrasi ThemeDraft (Draft Desain)
  const drafts = await prisma.themeDraft.findMany();
  console.log(`Ditemukan ${drafts.length} data ThemeDraft.`);
  let updatedDraftCount = 0;

  for (const draft of drafts) {
    if (!draft.designTokens) {
      const designTokens = {
        themeColor: draft.themeColor,
        fontHeading: draft.fontHeading,
        fontBody: draft.fontBody,
        buttonShape: draft.buttonShape,
        cardStyle: draft.cardStyle
      };

      await prisma.themeDraft.update({
        where: { id: draft.id },
        data: { designTokens: JSON.stringify(designTokens) }
      });
      updatedDraftCount++;
    }
  }
  console.log(`✅ Berhasil memindahkan ${updatedDraftCount} data ThemeDraft ke laci baru.`);
  
  console.log("🎉 Fase 2 Selesai! Data aman. Silakan lanjut ke Fase 3.");
}

main()
  .catch(e => {
    console.error("Gagal melakukan migrasi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
