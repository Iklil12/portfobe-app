import prisma from '@/shared/lib/prisma';
import { invalidatePortfolioCache } from '@/shared/lib/redis';

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

function isRateLimited(userId: string) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 menit
  const maxRequests = 30;

  let record = rateLimitMap.get(userId);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(userId, record);
    return false;
  }

  record.count++;
  return record.count > maxRequests;
}

export async function bulkUpdateBlocks(userId: string, blocks: any[]) {
  if (isRateLimited(userId)) {
    throw new Error("RATE_LIMIT_EXCEEDED");
  }

  if (!Array.isArray(blocks)) {
    throw new Error("INVALID_PAYLOAD");
  }

  if (blocks.length > 50) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  const payloadIds = blocks.map((b: any) => b.id).filter(Boolean);
  
  const deletePromise = prisma.pageBlock.deleteMany({
    where: {
      userId,
      id: { notIn: payloadIds }
    }
  });

  const updatePromises = blocks.map((block: any) => {
    return prisma.pageBlock.upsert({
      where: { id: block.id },
      create: {
        id: block.id,
        userId,
        blockType: block.blockType || 'UNKNOWN',
        orderIndex: block.orderIndex,
        isVisible: block.isVisible
      },
      update: { 
        orderIndex: block.orderIndex,
        isVisible: block.isVisible
      }
    });
  });

  await prisma.$transaction([deletePromise, ...updatePromises]);
  await invalidatePortfolioCache(userId);

  return true;
}

export async function reorderBlocks(userId: string, blocks: any[]) {
  if (!Array.isArray(blocks)) {
    throw new Error("INVALID_PAYLOAD");
  }

  const transactions = blocks.map((block: { id: string, orderIndex: number }) => {
    return prisma.pageBlock.update({
      where: { 
        id: block.id,
        userId
      },
      data: { orderIndex: block.orderIndex },
    });
  });

  await prisma.$transaction(transactions);
  await invalidatePortfolioCache(userId);

  return true;
}

export async function toggleBlockVisibility(userId: string, id: string, isVisible: boolean) {
  if (typeof id !== "string" || typeof isVisible !== "boolean") {
    throw new Error("INVALID_PAYLOAD");
  }

  const updatedBlock = await prisma.pageBlock.update({
    where: { 
      id,
      userId
    },
    data: { isVisible },
  });

  await invalidatePortfolioCache(userId);
  return updatedBlock;
}
