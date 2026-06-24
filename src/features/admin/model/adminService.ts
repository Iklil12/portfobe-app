import prisma from '@/shared/lib/prisma';
import jwt from "jsonwebtoken";

export async function getAdminNotes(userId: string, type: string | null) {
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!dbUser || dbUser.role !== "ADMIN") throw new Error("401:Unauthorized Admin");

  const notes = await prisma.adminNote.findMany({
    where: {
      userId,
      ...(type ? { type } : {})
    },
    orderBy: { createdAt: 'desc' }
  });

  return notes;
}

export async function createAdminNote(userId: string, content: string, type: string | null) {
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!dbUser || dbUser.role !== "ADMIN") throw new Error("401:Unauthorized Admin");

  if (!content) throw new Error("400:Content is required");

  const note = await prisma.adminNote.create({
    data: {
      content,
      type: type || "IDEA",
      userId
    }
  });

  return note;
}

export async function updateAdminNote(userId: string, noteId: string, isCompleted?: boolean, content?: string) {
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!dbUser || dbUser.role !== "ADMIN") throw new Error("401:Unauthorized Admin");

  const dataToUpdate: any = {};
  if (typeof isCompleted !== 'undefined') dataToUpdate.isCompleted = isCompleted;
  if (typeof content !== 'undefined') dataToUpdate.content = content;

  const note = await prisma.adminNote.update({
    where: { id: noteId },
    data: dataToUpdate
  });

  return note;
}

export async function deleteAdminNote(userId: string, noteId: string) {
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!dbUser || dbUser.role !== "ADMIN") throw new Error("401:Unauthorized Admin");

  await prisma.adminNote.delete({
    where: { id: noteId }
  });

  return { success: true };
}

export async function generateImpersonateToken(adminEmail: string, targetUserId: string) {
  const adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { id: true, role: true }
  });

  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("403:Akses ditolak. Anda bukan admin.");
  if (!targetUserId) throw new Error("400:ID target user tidak disertakan.");

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true }
  });

  if (!targetUser) throw new Error("404:Target user tidak ditemukan.");

  if (!process.env.NEXTAUTH_SECRET) throw new Error("500:NEXTAUTH_SECRET is not defined");

  const token = jwt.sign(
    { targetUserId: targetUserId, isAdminImpersonating: true },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: "60s" }
  );

  return { 
    message: "Token impersonasi berhasil dibuat.", 
    impersonateToken: token 
  };
}
