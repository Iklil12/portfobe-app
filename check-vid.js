const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVideo() {
  const proj = await prisma.project.findFirst({
    where: { projectType: 'video' }
  });
  console.log(JSON.stringify(proj, null, 2));
}

checkVideo().catch(console.error).finally(() => prisma.$disconnect());
