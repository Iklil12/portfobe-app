"use client";

import { useState, useEffect } from 'react';

export function useDashboardOverview() {
  const [activities, setActivities] = useState<any[]>([]);
  const [subdomain, setSubdomain] = useState<string>(''); 
  const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>('FREE');
  const [stats, setStats] = useState({
    projects: 0,
    awards: 0,
    links: 0,
    themeName: 'Loading...',
    strength: 0
  });

  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appRes, projRes, certRes, linkRes, actRes, anaRes] = await Promise.all([
                    fetch('/api/appearance').catch(() => null),
                    fetch('/api/projects').catch(() => null),
                    fetch('/api/certificates').catch(() => null),
                    fetch('/api/links').catch(() => null),
                    fetch('/api/activity').catch(() => null),
                    fetch('/api/analytics/stats').catch(() => null)
                ]);

                const appData = appRes?.ok ? await appRes.json() : {};
                const projJson = projRes?.ok ? await projRes.json() : { data: [] };
                const certJson = certRes?.ok ? await certRes.json() : { data: [] };
                const linkJson = linkRes?.ok ? await linkRes.json() : { data: [] };
                const actJson = actRes?.ok ? await actRes.json() : { data: [] };
                const anaJson = anaRes?.ok ? await anaRes.json() : null;

                setAnalytics(anaJson);

        // Helper untuk ambil array dari properti .data atau fallback
        const getArray = (json: any) => Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);

        const projData = getArray(projJson);
        const certData = getArray(certJson);
        const linkData = getArray(linkJson);
        const actData = getArray(actJson);

        if (appData?.profile?.subdomain) setSubdomain(appData.profile.subdomain);
        if (appData?.plan) setUserPlan(appData.plan);

        let tName = "Neo Brutalism";
        const currentTheme = appData?.siteAppearance?.themeTemplate;
        if (currentTheme === 'minimalist') tName = "Minimalist Clean";
        if (currentTheme === 'elegant') tName = "Elegant Serif";
        if (currentTheme === 'cinematic') tName = "Cinematic Dark";
        if (currentTheme === 'acid') tName = "Acid Punk";

        // --- CALCULATE PORTFOLIO STRENGTH ---
        let score = 0;
        if (appData?.profile?.bio) score += 15;
        if (appData?.profile?.avatarUrl) score += 15;
        if (appData?.profile?.profession) score += 10;
        if (projData.length > 0) score += 20;
        if (linkData.length > 0) score += 20;
        if (certData.length > 0) score += 20;

        setStats({
          projects: Array.isArray(projData) ? projData.length : 0,
          awards: Array.isArray(certData) ? certData.length : 0,
          links: Array.isArray(linkData) ? linkData.length : 0,
          themeName: tName,
          strength: score // Simpan skor kekuatan di sini
        });

        setActivities(Array.isArray(actData) ? actData : []);
      } catch (error) {
        console.error("Gagal memuat data dashboard", error);
      } finally {
        setIsLoadingStats(false);
        setIsLoadingActivities(false);
        setIsLoadingAnalytics(false);
      }
    };
    fetchData();
  }, []);

  return {
    stats,
    activities,
    subdomain,
    userPlan,
    analytics,
    isLoadingStats,
    isLoadingActivities,
    isLoadingAnalytics
  };
}
