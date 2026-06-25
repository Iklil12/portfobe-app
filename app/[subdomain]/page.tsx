import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { NotFoundUI } from '@/components/errors/NotFoundUI';
import { getPortfolioData } from '@/features/portfolio/model/portfolioService';
import PortfolioClientWrapper from '@/features/portfolio/ui/PortfolioClientWrapper';

// Cloudflare / Next.js ISR settings
export const revalidate = 60; // Revalidate every 60 seconds (stale-while-revalidate fallback)

export async function generateMetadata(
  { params }: { params: Promise<{ subdomain: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const subdomain = resolvedParams.subdomain.trim().toLowerCase();

  const isDashboard = subdomain === 'dashboard' || subdomain === 'settings' || subdomain === 'api';
  if (isDashboard) return { title: 'Portfo.be' };

  try {
    const data = await getPortfolioData(subdomain);
    if (!data || !data.profile) return { title: 'Portfolio Not Found' };

    if (data.isLive === false) {
      return {
        title: 'Portfolio Sedang Dimasak',
        robots: { index: false, follow: false }
      };
    }

    const customTexts = data.siteAppearance?.customTexts as Record<string, string> | undefined;

    const fullName = data.profile.fullName || subdomain;
    const profession = data.profile.profession || 'Creative Professional';
    const fallbackBio = data.profile.bio || `Check out ${fullName}'s portfolio on Portfo.be`;
    const avatar = data.profile.avatarUrl || 'https://portfo.be/portfo.be.png';

    const seoTitle = customTexts?.seo_title || `${fullName} - ${profession}`;
    const seoDesc = customTexts?.seo_description || fallbackBio;

    return {
      title: seoTitle,
      description: seoDesc,
      openGraph: {
        title: seoTitle,
        description: seoDesc,
        images: [{ url: avatar }],
        type: 'profile',
      }
    };
  } catch (error) {
    return { title: 'Portfolio Not Found' };
  }
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const resolvedParams = await params;
  const subdomain = resolvedParams.subdomain.trim().toLowerCase();

  // Mencegah intercepting route menabrak halaman dashboard
  const isDashboard = subdomain === 'dashboard' || subdomain === 'settings' || subdomain === 'api';
  if (isDashboard) return null;

  let data = null;
  let is404 = false;

  try {
    data = await getPortfolioData(subdomain);
    if (!data) is404 = true;
  } catch (error) {
    console.error("🔥 Error Loading Portfolio SSR:", error);
    if (error instanceof Error && error.message.includes('404')) {
      is404 = true;
    } else {
      throw error;
    }
  }

  if (is404) {
    return <NotFoundUI subdomain={subdomain} />;
  }

  return (
    <>
      <PortfolioClientWrapper data={data} subdomain={subdomain} />
    </>
  );
}