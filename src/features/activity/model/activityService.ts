import prisma from '@/shared/lib/prisma';

export async function getRecentActivity(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  return prisma.activity.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
}

export async function getAllActivity(email: string, page: number = 1, limit: number = 20) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
    }),
    prisma.activity.count({
      where: { userId: user.id },
    })
  ]);

  return {
    data: activities,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit)
    }
  };
}
