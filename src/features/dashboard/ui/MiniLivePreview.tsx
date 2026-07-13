"use client";

import React from 'react';
import { AnimateOnScroll } from '@/shared/ui/AnimateOnScroll';
import Link from 'next/link';
import { Palette, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MiniLivePreviewProps {
  themeName: string;
  subdomain: string;
  isLoading?: boolean;
}

export function MiniLivePreview({ themeName, subdomain, isLoading }: MiniLivePreviewProps) {
  const t = useTranslations('DashboardOverview');
  if (isLoading) {
    return (
      <div className="bg-zinc-950 border border-white/10 rounded-md h-full min-h-[250px] shimmer w-full"></div>
    );
  }

  return (
    <AnimateOnScroll delay={150} className="w-full">
      <div className="bg-[#1a1a1a] border border-white/5 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group rounded-xl hover:border-white/10 transition-all duration-300 w-full">
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-sans font-bold text-white/60 mb-1">{t('activeTheme')}</p>
            <h3 className="text-2xl font-sans font-bold text-white tracking-tight">{themeName}</h3>
          </div>
          <Link
            href="/dashboard/appearance"
            className="w-10 h-10 rounded-xl border border-white/5 bg-[#111111] flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
          >
            <Palette className="w-5 h-5" />
          </Link>
        </div>

        {/* Mockup Device */}
        <div className="relative z-10 mt-2 w-full flex justify-center">
          <div className="relative w-full aspect-[16/10] bg-[#111111] border border-white/5 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
            {/* Browser Header */}
            <div className="h-8 bg-[#111111] w-full flex items-center justify-between px-4 border-b border-white/5 text-[9px] font-sans font-medium text-white/50 shrink-0">
              <span className="truncate">portfo.be/{subdomain}</span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
              </div>
            </div>
            {/* Browser Content (Mock) */}
            <div className="flex-1 bg-[#1a1a1a] p-4 relative overflow-hidden flex flex-col">
              {/* Skeleton for Portfolio */}
              <div className="w-8 h-8 rounded-lg bg-white/5 mb-3 border border-white/5"></div>
              <div className="w-3/4 h-2 bg-white/10 rounded-md mb-2"></div>
              <div className="w-1/2 h-2 bg-white/5 rounded-md mb-4"></div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="h-10 bg-[#111111] border border-white/5 rounded-lg"></div>
                <div className="h-10 bg-[#111111] border border-white/5 rounded-lg"></div>
              </div>

              {/* Overlay blur and view button */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <a
                  href={`/${subdomain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-[#ff9e00] text-black rounded-lg text-xs font-sans font-bold transition-all duration-300 hover:bg-[#ffaa22] hover:scale-105 flex items-center gap-2 shadow-[0_0_15px_rgba(255,158,0,0.4)]"
                >
                  <ExternalLink className="w-4 h-4" /> {t('livePreview')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
