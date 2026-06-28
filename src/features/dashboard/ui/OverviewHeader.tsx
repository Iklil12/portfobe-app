"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ShareModal } from './ShareModal';
import { AnimateOnScroll } from '@/shared/ui/AnimateOnScroll';
import { Share2, ExternalLink, Plus, Edit } from 'lucide-react';

interface OverviewHeaderProps {
  subdomain: string;
  avatarUrl?: string;
  isLoading?: boolean;
}

export function OverviewHeader({ subdomain, avatarUrl, isLoading }: OverviewHeaderProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-sans font-medium text-white mb-1 md:mb-2 uppercase tracking-wide">
              Overview
            </h1>
            <p className="text-xs md:text-sm font-sans text-white/50">Summary of your current portfolio performance and data.</p>
          </div>

          {/* Desktop: full label buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {subdomain && (
              <>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 border border-white/10 text-white/80 rounded-md text-[10px] font-sans font-medium hover:border-white/20 hover:bg-zinc-800 hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-white/60 group-hover:text-[#ff9e00] transition-colors" />
                  Share
                </button>
                <a
                  id="tour-preview-btn"
                  href={`/${subdomain}`} target="_blank" rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 border border-white/10 text-white/80 rounded-md text-[10px] font-sans font-medium hover:border-white/20 hover:bg-zinc-800 hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-white/60 group-hover:text-[#ff9e00] transition-colors" />
                  View Site
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ALL ACTIONS ROW — single line on mobile */}
      <AnimateOnScroll delay={50} className="mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/dashboard/projects"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#ff9e00] text-black font-sans font-semibold text-xs md:text-sm hover:bg-[#ffaa22] hover:shadow-[0_0_15px_rgba(255,158,0,0.3)] active:scale-95 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">Project</span>
          </Link>
          <Link
            id="tour-canvas-btn"
            href="/dashboard/appearance"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white transition-all duration-300 font-sans font-medium text-xs md:text-sm"
          >
            <Edit className="w-4 h-4 text-white/50" />
            <span className="whitespace-nowrap">Canvas</span>
          </Link>

          {/* Mobile: compact icon buttons for Bagikan & Lihat Web */}
          {subdomain && (
            <div className="flex md:hidden items-center gap-1.5 ml-auto shrink-0">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-10 h-10 rounded-md border border-white/10 bg-zinc-900 text-white/70 flex items-center justify-center hover:bg-zinc-800 hover:text-[#ff9e00] hover:border-white/20 transition-all active:scale-90 shadow-sm"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <a
                id="tour-mobile-preview-btn"
                href={`/${subdomain}`} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-md border border-white/10 bg-zinc-900 text-white/70 flex items-center justify-center hover:bg-zinc-800 hover:text-[#ff9e00] hover:border-white/20 transition-all active:scale-90 shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </AnimateOnScroll>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        subdomain={subdomain}
        avatarUrl={avatarUrl}
      />
    </>
  );
}
