const fs = require('fs');

// 1. Update lib/redis.ts
let redisFile = fs.readFileSync('c:/Users/user/portfobe-app/lib/redis.ts', 'utf8');
const helperCode = 
import prisma from '@/lib/prisma';

export async function invalidatePortfolioCache(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({ 
      where: { userId }, 
      select: { subdomain: true } 
    });
    
    if (profile?.subdomain) {
      const cacheKey = \portfolio_db:\\;
      await redis.del(cacheKey);
      console.log(\[Redis] Invalidate Cache Success: \\);
    }
  } catch (e) {
    console.error("?? Gagal menghapus cache Redis:", e);
  }
}
;

if (!redisFile.includes('invalidatePortfolioCache')) {
  fs.writeFileSync('c:/Users/user/portfobe-app/lib/redis.ts', redisFile + helperCode);
  console.log('Added helper to lib/redis.ts');
}

