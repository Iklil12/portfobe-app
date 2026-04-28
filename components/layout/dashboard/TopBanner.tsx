"use client";

import Link from 'next/link';
import { NotificationItem } from '@/hooks/useDashboardLayout';

interface TopBannerProps {
  isLoading: boolean;
  topBanner: NotificationItem | undefined;
}

export function TopBanner({ isLoading, topBanner }: TopBannerProps) {
  if (isLoading || !topBanner) return null;
  
  return (
    <div className={`animate-page-load delay-200 shrink-0 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-10 py-3 sm:py-4 transition-all duration-500 ${topBanner.bg} ${topBanner.border}`}>
      <div className={`flex items-start sm:items-center gap-3 ${topBanner.color}`}>
        <div className="mt-0.5 sm:mt-0 shrink-0"><i className={`fas ${topBanner.icon} text-base sm:text-lg animate-pulse`}></i></div>
        <div>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">{topBanner.title}</p>
          <p className="text-xs sm:text-sm font-semibold">{topBanner.desc}</p>
        </div>
      </div>
      {topBanner.btnText && (
        <Link href={topBanner.link} className={`shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm ${topBanner.btnColor || 'bg-slate-900 text-white hover:bg-slate-800'}`}>
          {topBanner.btnText}
        </Link>
      )}
    </div>
  );
}
