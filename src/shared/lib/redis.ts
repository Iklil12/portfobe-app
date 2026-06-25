import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Mencegah pembuatan multiple connection selama hot-reloading di mode development Next.js
const globalForRedis = globalThis as unknown as {
  prismaRedis: Redis | undefined;
};

export const redis =
  globalForRedis.prismaRedis ??
  new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.prismaRedis = redis;
}

import prisma from '@/shared/lib/prisma';

export async function invalidatePortfolioCache(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({ 
      where: { userId }, 
      select: { subdomain: true } 
    });
    
    if (profile?.subdomain) {
      const cacheKey = `portfolio_db:${profile.subdomain.toLowerCase().trim()}`;
      await redis.del(cacheKey);
      console.log(`[Redis] Invalidate Cache Success: ${cacheKey}`);
    }

    // INVALIDATE DASHBOARD SYNC CACHE JUGA BIAR REALTIME
    const syncKeys = await redis.keys(`dashboard:sync:${userId}:*`);
    if (syncKeys.length > 0) {
      await redis.del(...syncKeys);
      console.log(`[Redis] Invalidate Dashboard Sync Success for ${userId}`);
    }
  } catch (e) {
    console.error("⚠️ Gagal menghapus cache Redis:", e);
  }
}
