const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProject() {
  const proj = await prisma.project.findFirst({
    where: { title: 'TEST 3D' }
  });
  console.log(JSON.stringify(proj, null, 2));
}

checkProject().catch(console.error).finally(() => prisma.$disconnect());
