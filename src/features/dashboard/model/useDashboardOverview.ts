"use client";

import useSWR from 'swr';
import { useMemo, useState, useEffect } from 'react';

// Fetcher standar menggunakan fetch bawaan
const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((res) => {
  if (!res.ok) throw new Error("Failed to load data");
  return res.json();
});

export function useDashboardOverview() {
  const [tzOffset, setTzOffset] = useState<number | null>(null);

  useEffect(() => {
    setTzOffset(new Date().getTimezoneOffset());
  }, []);

  // 1. Sync: layout, announcements, overview counts, activities
  const { data: dashboardSyncData, isLoading: isLoadingSync } = useSWR('/api/dashboard/sync', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
    focusThrottleInterval: 10000,
  });

  // 2. Analytics: SATU sumber kebenaran yang sama dengan halaman Metrics
  const swrUrl = tzOffset !== null ? `/api/analytics/stats?range=7d&tzOffset=${tzOffset}` : null;
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useSWR(
    swrUrl,
    fetcher,
    { refreshInterval: 30000, dedupingInterval: 15000 }
  );

  const processedData = useMemo(() => {
    // Destructure data dari payload gabungan
    const layout = dashboardSyncData?.layout || {};
    const overview = dashboardSyncData?.overview || { projectsCount: 0, certificatesCount: 0, linksCount: 0, testimonialsCount: 0, activities: [] };
    // JANGAN shadow variabel analyticsData dari SWR!
    // Kita hapus const analyticsData = dashboardSyncData?.stats || null;
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
      'split-screen-studio': 'Split Screen Studio',
    };

    let tName = "Not Selected";
    if (currentTheme && themeMap[currentTheme]) {
        tName = themeMap[currentTheme];
    } else if (currentTheme) {
        tName = currentTheme.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // --- CALCULATE PORTFOLIO STRENGTH ---
    let score = 0;
    const strengthBreakdown = [
      { id: 'avatar', label: 'Profile Picture', done: !!layout.avatar, weight: 15 },
      { id: 'bio', label: 'Bio & Profession', done: !!layout.bio && !!layout.profession, weight: 25 },
      { id: 'projects', label: 'Add Project', done: overview.projectsCount > 0, weight: 20 },
      { id: 'links', label: 'Social Links', done: overview.linksCount > 0, weight: 20 },
      { id: 'certificates', label: 'Certificates', done: overview.certificatesCount > 0, weight: 20 }
    ];

    strengthBreakdown.forEach(item => {
      if (item.done) score += item.weight;
    });

    return {
      stats: {
        projects: overview.projectsCount,
        awards: overview.certificatesCount,
        links: overview.linksCount,
        testimonials: overview.testimonialsCount || 0,
        themeName: tName,
        strength: score,
        strengthBreakdown
      },
      activities: overview.activities,
      subdomain,
      userPlan,
      // Gunakan data dari /api/analytics/stats (sumber tunggal)
      analytics: analyticsData || null,
      avatarUrl: layout.avatar || ''
    };
  }, [dashboardSyncData, analyticsData]);

  return {
    ...processedData,
    isLoadingStats: isLoadingSync,
    isLoadingActivities: isLoadingSync,
    // Analytics loading terpisah dari layout loading
    isLoadingAnalytics: isLoadingAnalytics,
  };
}


