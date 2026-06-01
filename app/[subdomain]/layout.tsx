import React from 'react';
import { ClientTransition } from '@/components/animations/ClientTransition';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';

// 1. DYNAMIC SEO METADATA: Bintang utama untuk membuka mata Google dan WhatsApp
export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const subdomain = resolvedParams.subdomain.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: { profile: { subdomain } },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    return {
      title: 'Portfolio Not Found',
    };
  }

  const name = user.profile.fullName || subdomain;
  const profession = user.profile.profession || 'Creative Professional';
  
  return {
    title: `${name} | ${profession}`,
    description: user.profile.bio || `Welcome to the creative portfolio of ${name}, a ${profession}.`,
    openGraph: {
      title: `${name} | ${profession}`,
      description: user.profile.bio || `Welcome to the creative portfolio of ${name}.`,
      images: [
        {
          url: user.profile.avatarUrl || '/default-og-image.jpg', // Ganti dengan path logo default Anda
          width: 1200,
          height: 630,
          alt: `${name} Portfolio`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | ${profession}`,
      description: user.profile.bio || `Welcome to the creative portfolio of ${name}.`,
      images: [user.profile.avatarUrl || '/default-og-image.jpg'],
    },
  };
}

export default async function SubdomainLayout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const resolvedParams = await params;
  const subdomain = resolvedParams.subdomain;

  // JANGAN biarkan Intercepting Route galeri aktif jika kita sedang berada di dashboard
  const isDashboard = subdomain === 'dashboard' || subdomain === 'settings' || subdomain === 'api';

  return (
    <>
      <ClientTransition>
        {children}
      </ClientTransition>
      
      {!isDashboard && (
        <ClientTransition>
          {modal}
        </ClientTransition>
      )}
    </>
  );
}
