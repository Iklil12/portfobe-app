//app/dashboard/analytics/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { showToast } from '@/lib/customToast';
import useSWR from 'swr';
import { Lock } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

import { AnimatedCounter, getSourceIcon, SkeletonBlock, CustomAreaTooltip } from '@/components/features/analytics/AnalyticsShared';
import { KpiCards, SecondaryMetricStrip } from '@/components/features/analytics/DashboardWidgets';
import { TrafficOverviewChart, DailyVolumeChart } from '@/components/features/analytics/TrafficWidgets';
import { DeviceBreakdown, TopLocations } from '@/components/features/analytics/GeoDeviceWidgets';
import { TopSourcesWidget, ProjectPopularityWidget, SocialMediaWidget, ContactConversionsWidget, GalleryActivityWidget } from '@/components/features/analytics/InteractionWidgets';

const STATIC_SOURCES = [
  { name: 'Instagram', count: 842, percentage: 38 },
  { name: 'Google', count: 531, percentage: 24 },
  { name: 'Direct', count: 419, percentage: 19 },
  { name: 'LinkedIn', count: 265, percentage: 12 },
  { name: 'Twitter / X', count: 154, percentage: 7 },
];

const STATIC_COUNTRIES = [
  { name: 'Indonesia', count: 1240, percentage: 75 },
  { name: 'Singapore', count: 248, percentage: 15 },
  { name: 'Malaysia', count: 99, percentage: 6 },
  { name: 'United States', count: 49, percentage: 3 },
  { name: 'Japan', count: 16, percentage: 1 },
];

const STATIC_CITIES = [
  { name: 'Jakarta', count: 620, percentage: 38 },
  { name: 'Bandung', count: 295, percentage: 18 },
  { name: 'Surabaya', count: 180, percentage: 11 },
  { name: 'Singapore City', count: 248, percentage: 15 },
  { name: 'Kuala Lumpur', count: 99, percentage: 6 },
];

const STATIC_PROJECTS = [
  { title: 'Interactive Cinematic Showreel', count: 421, percentage: 48 },
  { title: 'Nexus Noir Theme Boilerplate', count: 219, percentage: 25 },
  { title: 'Acid Tech 3D Playground', count: 130, percentage: 15 },
  { title: 'Spatial Studio Landing Page', count: 68, percentage: 8 },
  { title: 'Minimalist Portfolio Starter', count: 35, percentage: 4 },
];

const STATIC_SOCIAL_STATS = [
  { name: 'Instagram', count: 184, percentage: 53 },
  { name: 'LinkedIn', count: 98, percentage: 28 },
  { name: 'GitHub', count: 42, percentage: 12 },
  { name: 'Twitter / X', count: 24, percentage: 7 },
];

const STATIC_CONTACT_STATS = [
  { name: 'WhatsApp', count: 120, percentage: 65 },
  { name: 'Email', count: 45, percentage: 24 },
  { name: 'Phone', count: 20, percentage: 11 },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState('7d');
  const [isMounted, setIsMounted] = useState(false);
  const [animReady, setAnimReady] = useState(false);
  
  // Ambil tzOffset secara sinkron (karena string url swr tidak akan menyebabkan hydration mismatch)
  const tzOffset = typeof window !== 'undefined' ? new Date().getTimezoneOffset() : 0;

  useEffect(() => { 
    setIsMounted(true);
  }, []);

  const swrUrl = `/api/analytics/stats?range=${range}&tzOffset=${tzOffset}`;
  const { data, isLoading } = useSWR(swrUrl, fetcher, { refreshInterval: 30000, keepPreviousData: true });
  const { data: userData, isLoading: isUserLoading } = useSWR('/api/layout-sync', fetcher);
  
  const userPlan = userData ? (userData.plan || 'FREE') : undefined;

  useEffect(() => {
    if (!isLoading && isMounted && data) {
      const t = setTimeout(() => setAnimReady(true), 200);
      return () => clearTimeout(t);
    }
  }, [isLoading, isMounted, data]);

  const stats = data?.stats || { totalViews: 0, uniqueVisitors: 0, avgTime: '0s', bounceRate: '0%' };
  const chartData: { day: string; date: string; views: number }[] = data?.chartData || [];
  const sources: { name: string; count: number; percentage: number }[] = data?.sources || [];

  // derived metrics
  const { peakEntry, totalPeriod, avgDaily, todayViews, yesterdayViews, growth } = useMemo(() => {
    const pEntry = chartData.reduce((a, b) => (b.views > a.views ? b : a), { day: '-', date: '', views: 0 });
    const tPeriod = chartData.reduce((s, d) => s + d.views, 0);
    const aDaily = chartData.length > 0 ? Math.round(tPeriod / chartData.length) : 0;
    const tViews = chartData.length > 0 ? chartData[chartData.length - 1].views : 0;
    const yViews = chartData.length >= 2 ? chartData[chartData.length - 2].views : 0;
    const g = chartData.length >= 2
      ? yViews === 0 
          ? (tViews > 0 ? 100 : 0) 
          : Math.round(((tViews - yViews) / yViews) * 100)
      : 0;
    return { peakEntry: pEntry, totalPeriod: tPeriod, avgDaily: aDaily, todayViews: tViews, yesterdayViews: yViews, growth: g };
  }, [chartData]);

  const isFree = userPlan === 'FREE';
  const deviceData = useMemo(() => isFree
    ? [
        { name: 'Desktop', pct: 58, color: '#ffffff' },
        { name: 'Mobile', pct: 36, color: '#ff9e00' },
        { name: 'Tablet', pct: 6, color: 'rgba(255,255,255,0.3)' },
      ]
    : [
        { name: 'Desktop', pct: stats.devices?.desktop || 0, color: '#ffffff' },
        { name: 'Mobile', pct: stats.devices?.mobile || 0, color: '#ff9e00' },
        { name: 'Tablet', pct: stats.devices?.tablet || 0, color: 'rgba(255,255,255,0.3)' },
      ], [isFree, stats.devices]);

  const displaySources = isFree ? STATIC_SOURCES : sources;

  const countries: { name: string; count: number; percentage: number }[] = data?.geo?.countries || [];
  const cities: { name: string; count: number; percentage: number }[] = data?.geo?.cities || [];

  const displayCountries = isFree ? STATIC_COUNTRIES : countries;
  const displayCities = isFree ? STATIC_CITIES : cities;

  const topProjects: { title: string; count: number; percentage: number }[] = data?.topProjects || [];
  const displayProjects = isFree ? STATIC_PROJECTS : topProjects;

  const displaySocialStats = isFree ? STATIC_SOCIAL_STATS : (data?.socialStats || []);
  const displayContactStats = isFree ? STATIC_CONTACT_STATS : (data?.contactStats || []);

  const lockedAvgTime = '2m 34s';
  const lockedBounceRate = '42%';
  const lockedAvgDaily = 127;
  const lockedPeakViews = 384;
  const lockedPeakDay = 'Senin';
  const lockedTotalPeriod = 891;

  const handleLocked = useCallback(() => showToast({ message: "Upgrade to PRO to unlock full analytics features!", id: "range-lock", icon: "fa-lock" }), []);

  const handleComingSoon = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast({ message: "Advanced analytics features will be available soon!", id: "coming-soon-analytics", icon: "fa-clock" });
  }, []);

  const RANGES = [
    { id: '1d', label: 'Today', pro: false },
    { id: '7d', label: '7 Days', pro: false },
    { id: '30d', label: '30 Days', pro: true },
    { id: 'all', label: 'All Time', pro: true },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 pb-32 selection:bg-[#ff9e00]/30 selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp { from { opacity:0;transform:translateY(20px) } to { opacity:1;transform:translateY(0) } }
        .animate-enter { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .recharts-wrapper,.recharts-surface,.recharts-wrapper svg,.recharts-layer { outline:none!important; }
        .shimmer-dark {
          background: linear-gradient(110deg, rgba(255,255,255,0.03) 8%, rgba(255,255,255,0.08) 18%, rgba(255,255,255,0.03) 33%);
          background-size: 200% 100%;
          animation: 1.5s shine linear infinite;
        }
        @keyframes shine { to { background-position-x: -200%; } }
      `}} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 animate-enter">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tight uppercase mb-1.5">
            Metrics.
          </h1>
          <p className="text-xs font-mono text-white/40">In-depth analysis of your portfolio's performance and traffic.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 border border-white/10 rounded-none self-start md:self-auto">
          {RANGES.map(r => {
            const locked = r.pro && userPlan === 'FREE';
            return (
              <button key={r.id}
                onClick={() => locked ? handleLocked() : setRange(r.id)}
                className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap rounded-none ${range === r.id ? 'bg-zinc-800 text-[#ff9e00] border border-white/5' : 'text-white/40 hover:text-white'}`}
              >
                {r.label}
                {locked && <Lock className="w-3 h-3 text-[#ff9e00]/70" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <KpiCards 
        isLoading={isLoading} isUserLoading={isUserLoading} userPlan={userPlan} 
        stats={stats} growth={growth} isFree={isFree} 
        lockedAvgTime={lockedAvgTime} lockedBounceRate={lockedBounceRate} 
        handleLocked={handleLocked} 
      />

      {/* SECONDARY METRIC STRIP */}
      <SecondaryMetricStrip 
        isLoading={isLoading} isUserLoading={isUserLoading} userPlan={userPlan} 
        isFree={isFree} lockedAvgDaily={lockedAvgDaily} avgDaily={avgDaily} 
        lockedPeakViews={lockedPeakViews} peakEntry={peakEntry} 
        lockedPeakDay={lockedPeakDay} lockedTotalPeriod={lockedTotalPeriod} 
        totalPeriod={totalPeriod} chartDataLength={chartData.length} 
        galleryClicks={data?.galleryClicks} handleLocked={handleLocked} 
      />

      {/* MAIN CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

        {/* TRAFFIC AREA CHART — spans 2 cols */}
        <TrafficOverviewChart 
          isLoading={isLoading} isMounted={isMounted} 
          chartData={chartData} range={range} 
        />

        {/* DEVICE BREAKDOWN */}
        <DeviceBreakdown 
          isLoading={isLoading} isFree={isFree} handleLocked={handleLocked} 
          deviceData={deviceData} animReady={animReady} 
        />
      </div>

      {/* GEOGRAPHIC GRID: Countries & Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* TOP COUNTRIES */}
        <TopLocations 
          isLoading={isLoading} isFree={isFree} handleLocked={handleLocked} 
          dataList={displayCountries} animReady={animReady} 
          title="Top Countries" subtitle="Visitor origin country" 
        />

        {/* TOP CITIES */}
        <TopLocations 
          isLoading={isLoading} isFree={isFree} handleLocked={handleLocked} 
          dataList={displayCities} animReady={animReady} 
          title="Top Cities" subtitle="Visitor origin city" 
        />
      </div>

      {/* BOTTOM ROW: Top Sources + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

        {/* TOP SOURCES */}
        <TopSourcesWidget 
          isLoading={isLoading} isFree={isFree} handleLocked={handleLocked} 
          displaySources={displaySources} animReady={animReady} 
        />

        {/* DAILY BAR CHART */}
        <DailyVolumeChart 
          isLoading={isLoading} isMounted={isMounted} 
          chartData={chartData} peakEntry={peakEntry} 
        />
      </div>

      {/* PROJECT POPULARITY WIDGET */}
      <div className="grid grid-cols-1 gap-5 mb-8">
        {/* TOP PROJECTS */}
        <ProjectPopularityWidget 
          isLoading={isLoading} isFree={isFree} handleLocked={handleLocked} 
          displayProjects={displayProjects} animReady={animReady} 
        />
      </div>

      {/* SOCIAL MEDIA & CONTACT CONVERSION WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        
        {/* SOCIAL MEDIA CLICKS */}
        <SocialMediaWidget 
          isLoading={isLoading} isFree={isFree} handleLocked={handleLocked} 
          displaySocialStats={displaySocialStats} animReady={animReady} 
        />

        {/* CONTACT CONVERSIONS */}
        <ContactConversionsWidget 
          isLoading={isLoading} isFree={isFree} handleLocked={handleLocked} 
          displayContactStats={displayContactStats} animReady={animReady} 
        />

      </div>

      {/* GALLERY BUTTON ACTIVITY WIDGET */}
      <div className="grid grid-cols-1 gap-5 mb-8">
        {/* GALLERY BUTTON ACTIVITY WIDGET */}
        <GalleryActivityWidget 
          isLoading={isLoading} isFree={isFree} handleLocked={handleLocked} 
          galleryClicks={data?.galleryClicks} 
        />
      </div>

    </main>
  );
}