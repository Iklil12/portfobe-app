const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding new blocks to database...");
  
  // Ambil semua user
  const users = await prisma.user.findMany();
  
  const blocksToEnsure = ['SKILLS', 'EXPERIENCE'];
  
  for (const user of users) {
    // Ambil blok yang ada
    const existingBlocks = await prisma.pageBlock.findMany({
      where: { userId: user.id }
    });
    
    const existingTypes = existingBlocks.map(b => b.blockType);
    let orderIndex = existingBlocks.length;
    
    for (const type of blocksToEnsure) {
      if (!existingTypes.includes(type)) {
        await prisma.pageBlock.create({
          data: {
            userId: user.id,
            blockType: type,
            orderIndex: orderIndex++,
            isVisible: true,
            configJson: "{}"
          }
        });
        console.log(`Inserted ${type} for user ${user.email}`);
      }
    }
  }
  
  console.log("Done.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
