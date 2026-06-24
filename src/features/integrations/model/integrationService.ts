import prisma from '@/shared/lib/prisma';

export async function getIntegrations(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      integrations: {
        select: {
          id: true,
          provider: true,
          providerId: true,
          settings: true,
          cacheExpiresAt: true,
          updatedAt: true,
        }
      }
    }
  });

  if (!user) throw new Error("404:User not found");
  return user.integrations;
}

export async function upsertIntegration(email: string, provider: string, providerId: string) {
  if (!provider || !providerId) throw new Error("400:Provider and ProviderId are required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("404:User not found");

  const integration = await prisma.integration.upsert({
    where: {
      userId_provider: {
        userId: user.id,
        provider: provider,
      }
    },
    update: {
      providerId: providerId,
    },
    create: {
      userId: user.id,
      provider: provider,
      providerId: providerId,
    }
  });

  return integration;
}

export async function disconnectIntegration(email: string, provider: string) {
  if (!provider) throw new Error("400:Provider is required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("404:User not found");

  await prisma.integration.deleteMany({
    where: {
      userId: user.id,
      provider: provider,
    }
  });

  return { success: true };
}
