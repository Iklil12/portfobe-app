import prisma from '@/shared/lib/prisma';
import { decryptToken } from '@/shared/lib/encryption';

export async function getPenpotManualProjects(userId: string) {
  const integration = await prisma.integration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: "PENPOT",
      },
    },
  });

  const settings = integration?.settings ? JSON.parse(integration.settings) : {};
  return settings.manualProjects || [];
}

export async function savePenpotManualProjects(userId: string, projects: any[]) {
  if (!Array.isArray(projects)) throw new Error("400:Format data tidak valid");
  if (projects.length > 10) throw new Error("400:Maximum 10 projects allowed");

  for (const project of projects) {
    const { title, url } = project;
    if (title && title.length > 100) throw new Error("400:Judul terlalu panjang (maks 100 karakter)");
    if (url) {
      if (url.length > 500) throw new Error("400:URL terlalu panjang (maks 500 karakter)");
      if (!url.startsWith('https://')) throw new Error("400:URL harus diawali dengan https://");
    }
  }

  await prisma.integration.upsert({
    where: {
      userId_provider: {
        userId,
        provider: "PENPOT",
      },
    },
    update: {
      providerId: "penpot",
      settings: JSON.stringify({ manualProjects: projects }),
    },
    create: {
      userId,
      provider: "PENPOT",
      providerId: "penpot",
      settings: JSON.stringify({ manualProjects: projects }),
    },
  });

  return { success: true };
}

export async function getPenpotThumbnail(userId: string, fileId: string) {
  const integration = await prisma.integration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: "PENPOT",
      },
    },
  });

  if (!integration || !integration.accessToken) throw new Error("401:Unauthorized");

  const token = decryptToken(integration.accessToken);
  if (!token) throw new Error("500:Token error");

  const res = await fetch(`https://design.penpot.app/api/files/id/${fileId}/thumbnail`, {
    headers: {
      'Authorization': `Token ${token}`,
      'User-Agent': 'Portfobe-App/1.0'
    }
  });

  if (!res.ok) throw new Error(`${res.status}:Failed to fetch thumbnail`);

  const contentType = res.headers.get("content-type") || "image/png";
  const buffer = await res.arrayBuffer();

  return { buffer, contentType };
}
