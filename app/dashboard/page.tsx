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
    <div className="relative min-h-screen font-sans selection:bg-slate-200 selection:text-slate-900 pb-32 overflow-hidden">
      {/* ELEMEN DEKORASI BACKGROUND DIHAPUS (Dipindah ke layout.tsx) */}

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