"use client";

import useSWR from 'swr';
import { useMemo } from 'react';

// Fetcher standar menggunakan fetch bawaan
const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((res) => {
  if (!res.ok) throw new Error("Gagal memuat data");
  return res.json();
});

export function useDashboardOverview() {
  // HANYA 1 API CALL UNTUK SELURUH HALAMAN DASBOR (Mega BFF)
  const { data: dashboardSyncData, isLoading: isLoadingSync } = useSWR('/api/dashboard/sync', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
    focusThrottleInterval: 10000,
  });

  const processedData = useMemo(() => {
    // Destructure data dari payload gabungan
    const layout = dashboardSyncData?.layout || {};
    const overview = dashboardSyncData?.overview || { projectsCount: 0, certificatesCount: 0, linksCount: 0, activities: [] };
    const analyticsData = dashboardSyncData?.stats || null;

    const subdomain = layout.subdomain || '';
    const userPlan = layout.plan || 'FREE';

    const currentTheme = layout.siteAppearance?.themeTemplate;
    
    // Map ID tema ke nama aslinya
    const themeMap: Record<string, string> = {
      'brutalism': 'Neo Brutalism',
      'minimalist': 'Minimalist Clean',
      'cinematic': 'Cinematic Dark',
      'acid': 'Acid Punk',
      'bentogrid': 'Bento Grid',
      'viewfinder': 'Viewfinder',
      'spatial': 'Spatial',
      'monolith': 'Monolith',
      'split': 'Split Screen',
      'editorial': 'Editorial',
      'midnight-emulsion': 'Midnight Emulsion',
      'aura-kinetic': 'Aura Kinetic',
      'absolute-noir': 'Absolute Noir',
    };

    let tName = "Belum Dipilih";
    if (currentTheme && themeMap[currentTheme]) {
        tName = themeMap[currentTheme];
    } else if (currentTheme) {
        tName = currentTheme.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // --- CALCULATE PORTFOLIO STRENGTH ---
    let score = 0;
    if (layout.bio) score += 15;
    if (layout.avatar) score += 15;
    if (layout.profession) score += 10;
    if (overview.projectsCount > 0) score += 20;
    if (overview.linksCount > 0) score += 20;
    if (overview.certificatesCount > 0) score += 20;

    return {
      stats: {
        projects: overview.projectsCount,
        awards: overview.certificatesCount,
        links: overview.linksCount,
        themeName: tName,
        strength: score
      },
      activities: overview.activities,
      subdomain,
      userPlan,
      analytics: analyticsData
    };
  }, [dashboardSyncData]);

  return {
    ...processedData,
    isLoadingStats: isLoadingSync,
    isLoadingActivities: isLoadingSync,
    isLoadingAnalytics: isLoadingSync
  };
}
