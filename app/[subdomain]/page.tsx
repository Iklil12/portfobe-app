import React from 'react';
import { NotFoundUI } from '@/components/errors/NotFoundUI';
import { getPortfolioData } from '@/features/portfolio/model/portfolioService';
import PortfolioClientWrapper from '@/features/portfolio/ui/PortfolioClientWrapper';

// Cloudflare / Next.js ISR settings
export const revalidate = 60; // Revalidate every 60 seconds (stale-while-revalidate fallback)

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