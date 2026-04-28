"use client";

import React from 'react';
import { useDashboardOverview } from '@/hooks/useDashboardOverview';
import { OverviewHeader } from '@/components/features/dashboard/OverviewHeader';
import { MetricsSummary } from '@/components/features/dashboard/MetricsSummary';
import { StatCards } from '@/components/features/dashboard/StatCards';
import { RecentActivity } from '@/components/features/dashboard/RecentActivity';

export default function DashboardOverview() {
  const {
    stats,
    activities,
    subdomain,
    analytics,
    isLoadingStats,
    isLoadingActivities,
    isLoadingAnalytics
  } = useDashboardOverview();

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] font-sans selection:bg-slate-200 selection:text-slate-900 pb-32 overflow-hidden">
      {/* ELEMEN DEKORASI BACKGROUND */}
      <div className="absolute inset-0 bg-dashboard-grid pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff9e00]/5 rounded-full blur-[100px] pointer-events-none z-0 translate-x-1/3 -translate-y-1/4"></div>

      {/* KONTEN UTAMA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 relative z-10">
        <OverviewHeader subdomain={subdomain} />
        
        <MetricsSummary 
          analytics={analytics} 
          strength={stats.strength || 0} 
          isLoading={isLoadingAnalytics} 
        />

        <StatCards stats={stats} isLoading={isLoadingStats} />
        <RecentActivity activities={activities} isLoading={isLoadingActivities} />
      </div>
    </div>
  );
}