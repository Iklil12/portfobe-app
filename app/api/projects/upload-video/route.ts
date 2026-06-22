import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { getEffectivePlan } from '@/lib/planUtils';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (Anti-Spam Bot)
    const rateLimitRes = await checkRateLimit(10, 60 * 1000);
    if (rateLimitRes) return rateLimitRes;

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

    if (!user || getEffectivePlan(user) === 'FREE') {
      return NextResponse.json({ error: 'Upgrade ke PRO untuk mengunggah video.' }, { status: 403 });
    }

    const body = await req.json();
    const title = body.title || 'Untitled Video';

    const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
    const apiKey = process.env.BUNNY_API_KEY;

    if (!libraryId || !apiKey) {
      console.error("Bunny Stream credentials missing");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 4. Create Video Object in Bunny Stream (Lemari Kosong)
    const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: "POST",
      headers: {
        "AccessKey": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ title: title })
    });

    if (!createRes.ok) {
      const errTxt = await createRes.text();
      console.error("Bunny API Create Error:", errTxt);
      return NextResponse.json({ error: "Gagal membuat objek video di Bunny" }, { status: 500 });
    }

    const { guid } = await createRes.json();

    if (!guid) {
      return NextResponse.json({ error: "Gagal mendapatkan referensi video" }, { status: 500 });
    }

    // 5. Generate Presigned Auth Signature for TUS
    // Rumus: SHA256(library_id + api_key + expiration_time + video_id)
    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // Kadaluarsa dalam 1 jam
    const signatureString = `${libraryId}${apiKey}${expirationTime}${guid}`;
    const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

    // Kembalikan TIKET UPLOAD ke frontend (tanpa membocorkan API Key)
    return NextResponse.json({ 
      guid, 
      libraryId, 
      signature, 
      expirationTime 
    });

  } catch (error: any) {
    console.error('Upload Video Ticket Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem', details: error?.message || String(error), stack: error?.stack }, { status: 500 });
  }
}
