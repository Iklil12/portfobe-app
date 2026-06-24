import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { getEffectivePlan } from '@/lib/planUtils';


export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (Anti-Spam Bot): Batasi maksimal 5 request upload per 5 menit per IP
    const rateLimitRes = await checkRateLimit(5, 5 * 60 * 1000, "upload_image");
    if (rateLimitRes) {
      return rateLimitRes;
    }

    // 2. Autentikasi
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // 3. Otorisasi Plan/Tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, planExpiredAt: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Gambar wajib diunggah' }, { status: 400 });
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Format tidak didukung. Harap unggah JPG, PNG, WEBP, atau GIF.' }, { status: 400 });
    }

    // Tentukan batas maksimal ukuran gambar berdasarkan paket (Misal: FREE 5MB, PRO 10MB, SUPREME 15MB)
    const effectivePlan = getEffectivePlan(user);
    const maxImageSize = effectivePlan === 'SUPREME' ? 15 * 1024 * 1024 : effectivePlan === 'PRO' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    const maxImageLabel = effectivePlan === 'SUPREME' ? '15MB' : effectivePlan === 'PRO' ? '10MB' : '5MB';
    
    if (file.size > maxImageSize) {
      return NextResponse.json({ error: `Ukuran maksimal gambar adalah ${maxImageLabel}` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 4. Validasi Magic Bytes (File Content Sniffing)
    const isPng = buffer.length >= 4 && buffer.readUInt32BE(0) === 0x89504E47;
    const isJpg = buffer.length >= 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    const isGif = buffer.length >= 3 && buffer.toString('ascii', 0, 3) === 'GIF';
    const isWebp = buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';

    if (!isPng && !isJpg && !isGif && !isWebp) {
      return NextResponse.json({ error: 'Format file tidak valid. Harap unggah gambar JPG, PNG, GIF, atau WEBP yang asli.' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary credentials missing");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Convert file to base64 or send as FormData directly to Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', uploadPreset);

    let secureUrl = '';
    try {
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudinaryFormData
      });

      if (!uploadRes.ok) {
        const errTxt = await uploadRes.text();
        console.error("Cloudinary Upload Error:", errTxt);
        throw new Error("Failed to upload image to CDN");
      }

      const data = await uploadRes.json();
      secureUrl = data.secure_url;
    } catch (fetchErr) {
      console.error("Cloudinary upload failed or timeout:", fetchErr);
      return NextResponse.json({ error: "Layanan CDN sedang sibuk atau gangguan. Silakan coba lagi beberapa saat." }, { status: 503 });
    }

    // Return the secure_url
    return NextResponse.json({ secure_url: secureUrl });

  } catch (error: any) {
    console.error('Upload Image Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat mengunggah gambar' }, { status: 500 });
  }
}

