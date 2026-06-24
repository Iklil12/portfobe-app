"use client";

import { useState } from 'react';
import Link from 'next/link';
import { NotificationItem } from '@/hooks/useDashboardLayout';

interface TopBannerProps {
  isLoading: boolean;
  topBanner: NotificationItem | undefined;
}

export function TopBanner({ isLoading, topBanner }: TopBannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  if (isLoading || !topBanner || dismissed.includes(topBanner.id)) return null;
  
  const isCritical = topBanner.type === 'critical';
  const isWarning = topBanner.type === 'warning';
  const isPromo = topBanner.type === 'promo';
  
  const baseBg = isCritical ? 'bg-rose-500/10 border-rose-500/20' : 
                 isWarning ? 'bg-amber-500/10 border-amber-500/20' : 
                 isPromo ? 'bg-[#ff9e00]/10 border-[#ff9e00]/20' : 
                 'bg-blue-500/10 border-blue-500/20';

  const iconColor = isCritical ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' :
                    isWarning ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                    isPromo ? 'text-[#ff9e00] border-[#ff9e00]/30 bg-[#ff9e00]/10' :
                    'text-blue-400 border-blue-500/30 bg-blue-500/10';

  const btnClass = isCritical ? 'bg-rose-500 text-black hover:bg-rose-400' :
                   isWarning ? 'bg-amber-500 text-black hover:bg-amber-400' :
                   isPromo ? 'bg-[#ff9e00] text-black hover:bg-[#ffaa22]' :
                   'bg-blue-500 text-black hover:bg-blue-400';

  return (
    <div className={`animate-page-load delay-200 shrink-0 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 sm:px-10 py-3 transition-all duration-500 relative overflow-hidden pr-12 sm:pr-16 z-20 ${baseBg}`}>
      
      {/* Ambient Glow Effect (subtle) */}
      <div className={`absolute top-0 right-0 w-48 h-48 blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4 rounded-none pointer-events-none ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}></div>

      {/* Tombol Close (X) */}
      <button 
        onClick={() => setDismissed([...dismissed, topBanner.id])}
        className="absolute top-2.5 right-4 sm:top-1/2 sm:-translate-y-1/2 sm:right-6 w-7 h-7 flex items-center justify-center rounded-none bg-zinc-950 border border-white/10 hover:bg-zinc-900 text-white/40 hover:text-white transition-colors z-20"
        aria-label="Close Warning"
      >
        <i className="fas fa-times text-[11px]"></i>
      </button>

      <div className="flex items-start sm:items-center gap-3.5 relative z-10">
        <div className={`mt-0.5 sm:mt-0 w-8 h-8 rounded-none flex items-center justify-center shrink-0 border shadow-none ${iconColor}`}>
          <i className={`fas ${topBanner.icon} text-xs`}></i>
        </div>
        <div className="flex flex-col">
          <h3 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest mb-0.5 text-white">{topBanner.title}</h3>
          <p className="text-[10px] sm:text-[11px] font-mono font-bold text-white/50 leading-snug uppercase tracking-wider">{topBanner.desc}</p>
        </div>
      </div>
      
      {topBanner.btnText && (
        <Link href={topBanner.link} className={`relative z-10 shrink-0 px-5 py-2.5 rounded-none font-mono font-bold text-[10px] sm:text-[11px] uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 ${btnClass}`}>
          {topBanner.btnText} <i className="fas fa-arrow-right text-[9px] opacity-70"></i>
        </Link>
      )}
    </div>
  );
}

