"use client";

import useSWR from 'swr';
import { useMemo } from 'react';

// Fetcher standar menggunakan fetch bawaan
const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((res) => {
  if (!res.ok) throw new Error("Gagal memuat data");
  return res.json();
});

export function useDashboardOverview() {
  // 1. Definisikan semua SWR hooks (Optimasi: Matikan revalidateOnFocus untuk data statis)
  const { data: appearanceData, isLoading: isLoadingApp } = useSWR('/api/appearance', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { data: projectsData, isLoading: isLoadingProj } = useSWR('/api/projects', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { data: certsData, isLoading: isLoadingCerts } = useSWR('/api/certificates', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { data: linksData, isLoading: isLoadingLinks } = useSWR('/api/links', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { data: activitiesData, isLoading: isLoadingActivities } = useSWR('/api/activity', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useSWR('/api/analytics/stats', fetcher);

  // 2. Gunakan useMemo untuk mengolah data (Menjaga UI tetap sama)
  const processedData = useMemo(() => {
    const getArray = (json: any) => {
      if (!json) return [];
      return Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
    };

    const projArr = getArray(projectsData);
    const certArr = getArray(certsData);
    const linkArr = getArray(linksData);
    const actArr = getArray(activitiesData);

    const subdomain = appearanceData?.profile?.subdomain || '';
    const userPlan = appearanceData?.plan || 'FREE';

    let tName = "Neo Brutalism";
    const currentTheme = appearanceData?.siteAppearance?.themeTemplate;
    if (currentTheme === 'minimalist') tName = "Minimalist Clean";
    if (currentTheme === 'elegant') tName = "Elegant Serif";
    if (currentTheme === 'cinematic') tName = "Cinematic Dark";
    if (currentTheme === 'acid') tName = "Acid Punk";

    // --- CALCULATE PORTFOLIO STRENGTH ---
    let score = 0;
    if (appearanceData?.profile?.bio) score += 15;
    if (appearanceData?.profile?.avatarUrl) score += 15;
    if (appearanceData?.profile?.profession) score += 10;
    if (projArr.length > 0) score += 20;
    if (linkArr.length > 0) score += 20;
    if (certArr.length > 0) score += 20;

    return {
      stats: {
        projects: projArr.length,
        awards: certArr.length,
        links: linkArr.length,
        themeName: tName,
        strength: score
      },
      activities: actArr,
      subdomain,
      userPlan,
      analytics: analyticsData
    };
  }, [appearanceData, projectsData, certsData, linksData, activitiesData, analyticsData]);

  return {
    ...processedData,
    isLoadingStats: isLoadingApp || isLoadingProj || isLoadingCerts || isLoadingLinks,
    isLoadingActivities,
    isLoadingAnalytics
  };
}
