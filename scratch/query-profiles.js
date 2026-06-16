const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.profile.findMany({
    select: {
      subdomain: true,
      fullName: true,
      whatsapp: true
    }
  });
  console.log("PROFILES:", profiles);
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true
    }
  });
  console.log("USERS:", users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
