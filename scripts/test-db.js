const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const drafts = await prisma.themeDraft.findMany();
  if (drafts.length > 0) {
    const app = await prisma.siteAppearance.findUnique({
      where: { userId: drafts[0].userId }
    });
    console.log('SiteAppearance customTexts:', app?.customTexts);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
