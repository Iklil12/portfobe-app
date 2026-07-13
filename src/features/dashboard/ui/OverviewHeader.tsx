"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ShareModal } from './ShareModal';
import { useTranslations } from 'next-intl';
import { AnimateOnScroll } from '@/shared/ui/AnimateOnScroll';
import { Share2, ExternalLink, Plus, Edit } from 'lucide-react';

interface OverviewHeaderProps {
  subdomain: string;
  avatarUrl?: string;
  isLoading?: boolean;
}

export function OverviewHeader({ subdomain, avatarUrl, isLoading }: OverviewHeaderProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const t = useTranslations('DashboardOverview');

  if (isLoading) {
    return (
      <div className="animate-enter">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="h-10 w-48 bg-zinc-900 border border-white/10 rounded-md shimmer mb-3"></div>
            <div className="h-4 w-72 bg-zinc-900 border border-white/10 rounded-md shimmer"></div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="h-12 flex-1 md:w-32 bg-zinc-900 border border-white/10 rounded-md shimmer"></div>
            <div className="h-12 flex-1 md:w-32 bg-zinc-900 border border-white/10 rounded-md shimmer"></div>
          </div>
        </div>
        <div className="mb-8 flex gap-3">
          <div className="h-10 w-32 bg-zinc-900 border border-white/10 rounded-md shimmer"></div>
          <div className="h-10 w-24 bg-zinc-900 border border-white/10 rounded-md shimmer"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 md:mb-8 animate-enter">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-sans font-bold text-white mb-1 uppercase tracking-wider">{t('headerTitle')}</h1>
            <p className="text-xs md:text-sm font-sans text-white/50">{t('headerDesc')}</p>
          </div>

          {/* ACTIONS ROW */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap md:flex-nowrap">
            <Link
              href="/dashboard/projects"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#ff9e00] text-black font-sans font-semibold text-xs md:text-sm hover:bg-[#ffaa22] hover:shadow-[0_0_15px_rgba(255,158,0,0.3)] active:scale-95 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">{t('btnProject')}</span>
            </Link>



            <Link
              id="tour-canvas-btn"
              href="/dashboard/appearance"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-white/10 bg-[#1a1a1a] text-white/90 hover:bg-white/10 hover:text-white transition-all duration-300 font-sans font-medium text-xs md:text-sm"
            >
              <Edit className="w-4 h-4 text-white/50" />
              <span className="whitespace-nowrap">{t('btnCanvas')}</span>
            </Link>

            {subdomain && (
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-white/10 bg-[#1a1a1a] text-white/90 hover:bg-white/10 hover:text-white transition-all duration-300 font-sans font-medium text-xs md:text-sm"
              >
                <Share2 className="w-4 h-4 text-white/50" />
                <span className="whitespace-nowrap">{t('btnShare')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        subdomain={subdomain}
        avatarUrl={avatarUrl}
      />
    </>
  );
}
