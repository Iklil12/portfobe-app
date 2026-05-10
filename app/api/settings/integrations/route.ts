import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provider, providerId } = await req.json();

    if (!provider || !providerId) {
      return NextResponse.json({ error: 'Provider and ProviderId are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Upsert integration
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

    return NextResponse.json({ success: true, integration });
  } catch (error) {
    console.error('Integration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
