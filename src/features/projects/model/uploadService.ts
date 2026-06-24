import prisma from '@/shared/lib/prisma';
import { getEffectivePlan } from '@/features/billing';
import crypto from 'crypto';

export async function processImageUpload(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error("INVALID_FILE_TYPE");
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("FILE_TOO_LARGE");
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const formData = new FormData();
  formData.append('file', new Blob([buffer], { type: file.type }));
  formData.append('upload_preset', uploadPreset);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error("CLOUDINARY_UPLOAD_FAILED");
  }

  const data = await uploadRes.json();
  return data.secure_url;
}

export async function processVideoUploadTicket(userId: string, title: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiredAt: true }
  });

  if (!user || getEffectivePlan(user) === 'FREE') {
    throw new Error("FEATURE_LOCKED");
  }

  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
  const apiKey = process.env.BUNNY_API_KEY;

  if (!libraryId || !apiKey) {
    throw new Error("BUNNY_NOT_CONFIGURED");
  }

  const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
    method: "POST",
    headers: {
      "AccessKey": apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ title: title || 'Untitled Video' })
  });

  if (!createRes.ok) {
    throw new Error("BUNNY_CREATE_FAILED");
  }

  const { guid } = await createRes.json();
  if (!guid) {
    throw new Error("BUNNY_GUID_FAILED");
  }

  const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  const signatureString = `${libraryId}${apiKey}${expirationTime}${guid}`;
  const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

  return { guid, libraryId, signature, expirationTime };
}

export async function process3DUpload(userId: string, file: File, title: string, description: string | null) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiredAt: true }
  });

  if (!user || getEffectivePlan(user) === 'FREE') {
    throw new Error("FEATURE_LOCKED");
  }

  const filename = file.name.toLowerCase();
  if (!filename.endsWith('.glb') && !filename.endsWith('.gltf')) {
    throw new Error("INVALID_3D_FORMAT");
  }

  const max3DSize = getEffectivePlan(user) === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
  if (file.size > max3DSize) {
    throw new Error("FILE_TOO_LARGE");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const isGlb = buffer.length >= 4 && buffer.toString('ascii', 0, 4) === 'glTF';
  let isGltf = false;
  if (!isGlb) {
    try {
      const text = buffer.toString('utf-8', 0, 100).trim();
      if (text.startsWith('{')) isGltf = true;
    } catch (e) {}
  }

  if (!isGlb && !isGltf) {
    throw new Error("INVALID_3D_CONTENT");
  }

  const safeTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const storagePath = `${userId}/${Date.now()}-${safeTitle}.glb`;
  
  const storageName = process.env.BUNNY_STORAGE_NAME;
  const accessKey = process.env.BUNNY_PASSWORD;
  
  if (!storageName || !accessKey) {
    throw new Error("BUNNY_NOT_CONFIGURED");
  }

  const bunnyUrl = `https://storage.bunnycdn.com/${storageName}/${storagePath}`;
  
  const bunnyRes = await fetch(bunnyUrl, {
    method: 'PUT',
    headers: {
      'AccessKey': accessKey,
      'Content-Type': 'application/octet-stream'
    },
    body: buffer
  });

  if (!bunnyRes.ok) {
    throw new Error("BUNNY_UPLOAD_FAILED");
  }

  const mediaUrl = `https://${storageName}.b-cdn.net/${storagePath}`;

  const project = await prisma.project.create({
    data: {
      title,
      description: description || null,
      mediaUrl,
      projectType: '3d',
      userId,
      detail3D: {
        create: {
          fileSize: file.size,
          storagePath
        }
      }
    }
  });

  return project;
}
