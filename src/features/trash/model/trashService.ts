import prisma from '@/shared/lib/prisma';
import { logActivity } from '@/shared/lib/activity';
import { getEffectivePlan } from '@/features/billing';

const TRASH_RETENTION_DAYS = 30;
const DEFAULT_LIMIT = 10;

export async function getTrashItems(email: string, pageParam: string | null, limitParam: string | null) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("404:User not found");

  const page  = Math.max(1, parseInt(pageParam ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(limitParam ?? String(DEFAULT_LIMIT), 10)));
  const skip  = (page - 1) * limit;

  const [totalProjects, totalCerts] = await Promise.all([
    prisma.project.count({ where: { userId: user.id, deletedAt: { not: null } } }),
    prisma.certificate.count({ where: { userId: user.id, deletedAt: { not: null } } }),
  ]);
  const total = totalProjects + totalCerts;

  const [projects, certificates] = await Promise.all([
    prisma.project.findMany({
      where: { userId: user.id, deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
      select: { id: true, title: true, mediaUrl: true, projectType: true, deletedAt: true, createdAt: true },
    }),
    prisma.certificate.findMany({
      where: { userId: user.id, deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
      select: { id: true, title: true, mediaUrl: true, deletedAt: true, createdAt: true },
    }),
  ]);

  const formattedProjects = projects.map((p) => ({
    ...p,
    itemType: "project",
    expiresAt: new Date(p.deletedAt!.getTime() + TRASH_RETENTION_DAYS * 86400000),
  }));
  const formattedCerts = certificates.map((c) => ({
    ...c,
    itemType: "certificate",
    projectType: "certificate",
    expiresAt: new Date(c.deletedAt!.getTime() + TRASH_RETENTION_DAYS * 86400000),
  }));

  const allItems = [...formattedProjects, ...formattedCerts].sort(
    (a, b) => new Date(b.deletedAt!).getTime() - new Date(a.deletedAt!).getTime()
  );

  const items      = allItems.slice(skip, skip + limit);
  const totalPages = Math.ceil(total / limit);
  const hasMore    = page < totalPages;

  return { items, total, page, totalPages, hasMore };
}

export async function processTrashAction(email: string, action: string, id: string, type: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("404:User not found");

  if (action === "restore") {
    if (!id || !type) throw new Error("400:Incomplete data");

    if (type === "project") {
      if (getEffectivePlan(user) === "FREE") {
        const activeCount = await prisma.project.count({ where: { userId: user.id, deletedAt: null } });
        if (activeCount >= 4) {
          throw new Error("403:FREE project quota is full (4/4). Delete active projects or upgrade to PRO.");
        }
      }
      const item = await prisma.project.findUnique({ where: { id } });
      if (!item || item.userId !== user.id) throw new Error("403:Access denied");

      await prisma.project.update({ where: { id }, data: { deletedAt: null } });
      await logActivity(user.id, "RESTORE_PROJECT", `Restored work from trash: "${item.title}"`);
      return { message: "Project successfully restored" };
    }

    if (type === "certificate") {
      if (getEffectivePlan(user) === "FREE") {
        const activeCount = await prisma.certificate.count({ where: { userId: user.id, deletedAt: null } });
        if (activeCount >= 1) {
          throw new Error("403:FREE certificate quota is full (1/1). Delete active certificate or upgrade to PRO.");
        }
      }
      const item = await prisma.certificate.findUnique({ where: { id } });
      if (!item || item.userId !== user.id) throw new Error("403:Access denied");

      await prisma.certificate.update({ where: { id }, data: { deletedAt: null } });
      await logActivity(user.id, "RESTORE_CERTIFICATE", `Restored certificate from trash: "${item.title}"`);
      return { message: "Certificate successfully restored" };
    }

    throw new Error("400:Invalid type");
  }

  if (action === "purge") {
    if (!id || !type) throw new Error("400:Incomplete data");

    if (type === "project") {
      const item = await prisma.project.findUnique({ where: { id } });
      if (!item || item.userId !== user.id) throw new Error("403:Access denied");
      await prisma.project.delete({ where: { id } });
      await logActivity(user.id, "PURGE_PROJECT", `Permanently deleted work: "${item.title}"`);
      return { message: "Project permanently deleted" };
    }

    if (type === "certificate") {
      const item = await prisma.certificate.findUnique({ where: { id } });
      if (!item || item.userId !== user.id) throw new Error("403:Access denied");
      await prisma.certificate.delete({ where: { id } });
      await logActivity(user.id, "PURGE_CERTIFICATE", `Permanently deleted certificate: "${item.title}"`);
      return { message: "Certificate permanently deleted" };
    }

    throw new Error("400:Invalid type");
  }

  if (action === "purge_all") {
    const [projDel, certDel] = await Promise.all([
      prisma.project.deleteMany({ where: { userId: user.id, deletedAt: { not: null } } }),
      prisma.certificate.deleteMany({ where: { userId: user.id, deletedAt: { not: null } } }),
    ]);
    const total = projDel.count + certDel.count;
    await logActivity(user.id, "PURGE_ALL_TRASH", `Emptied trash: ${total} items permanently deleted`);
    return { message: `${total} items permanently deleted` };
  }

  throw new Error("400:Action not recognized");
}
