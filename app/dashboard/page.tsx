"use client";

import React from 'react';
import { useDashboardOverview } from '@/features/dashboard';
import { OverviewHeader } from '@/features/dashboard';
import { QuickStats } from '@/features/dashboard';
import { RecentActivity } from '@/features/dashboard';
import { TrafficOverview } from '@/features/dashboard';
import { MiniLivePreview } from '@/features/dashboard';

export default function DashboardOverview() {
  const {
    stats,
    activities,
    subdomain,
    avatarUrl,
    analytics,
    userPlan,
    isLoadingStats,
    isLoadingActivities,
    isLoadingAnalytics
  } = useDashboardOverview();

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden">
      {/* KONTEN UTAMA */}
      <div className="max-w-[2000px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-8 relative z-10">
        {/* ROW 1: HEADER & QUICK STATS (full width) */}
        <div className="mb-8">
          <OverviewHeader subdomain={subdomain} avatarUrl={avatarUrl} isLoading={isLoadingStats} />
          <QuickStats
            stats={stats}
            analytics={analytics}
            isLoadingStats={isLoadingStats}
            isLoadingAnalytics={isLoadingAnalytics}
            userPlan={userPlan}
            strength={stats.strength || 0}
            strengthBreakdown={stats.strengthBreakdown || []}
          />
        </div>

        {/* ROW 2: CHARTS, TEMA AKTIF & RECENT ACTIVITIES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <TrafficOverview analytics={analytics} isLoading={isLoadingAnalytics} />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <MiniLivePreview themeName={stats.themeName} subdomain={subdomain} isLoading={isLoadingStats} />
            <RecentActivity activities={activities} isLoading={isLoadingActivities} />
          </div>
        </div>
      </div>
    </div>
  );
}
