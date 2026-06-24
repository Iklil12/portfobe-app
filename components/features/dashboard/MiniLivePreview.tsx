"use client";

import React from 'react';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import Link from 'next/link';
import { Palette, ExternalLink } from 'lucide-react';

interface MiniLivePreviewProps {
  themeName: string;
  subdomain: string;
  isLoading?: boolean;
}

export function MiniLivePreview({ themeName, subdomain, isLoading }: MiniLivePreviewProps) {
  if (isLoading) {
    return (
      <div className="bg-zinc-950 border border-white/10 rounded-none h-full min-h-[250px] shimmer w-full"></div>
    );
  }

  return (
    <AnimateOnScroll delay={150} className="h-full">
      <div className="bg-zinc-950 border border-white/10 p-6 md:p-8 h-full flex flex-col justify-between relative overflow-hidden group rounded-none hover:border-white/20 transition-all duration-300">
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1">Active Theme</p>
            <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight uppercase">{themeName}</h3>
          </div>
          <Link
            href="/dashboard/appearance"
            className="w-8 h-8 rounded-none border border-white/10 bg-zinc-900 flex items-center justify-center text-white/70 hover:bg-white/5 hover:text-white transition-all shadow-sm"
          >
            <Palette className="w-4 h-4" />
          </Link>
        </div>

        {/* Mockup Device */}
        <div className="relative z-10 mt-4 flex-1 min-h-[180px] flex items-center justify-center">
          <div className="relative w-full max-w-[280px] aspect-[16/10] bg-black border border-white/10 rounded-none shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
            {/* Browser Header */}
            <div className="h-6 bg-zinc-950 w-full flex items-center justify-between px-3 border-b border-white/10 text-[8px] font-mono text-white/50 shrink-0">
              <span className="truncate">portfo.be/{subdomain}</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white/20 rounded-none"></div>
                <div className="w-1 h-1 bg-white/20 rounded-none"></div>
              </div>
            </div>
            {/* Browser Content (Mock) */}
            <div className="flex-1 bg-[#050505] p-3 relative overflow-hidden flex flex-col">
              {/* Skeleton for Portfolio */}
              <div className="w-6 h-6 rounded-none bg-white/10 mb-2 border border-white/10"></div>
              <div className="w-3/4 h-1.5 bg-white/10 rounded-none mb-1"></div>
              <div className="w-1/2 h-1.5 bg-white/5 rounded-none mb-3"></div>

              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-zinc-900 border border-white/5 rounded-none"></div>
                <div className="h-8 bg-zinc-900 border border-white/5 rounded-none"></div>
              </div>

              {/* Overlay blur and view button */}
              <div className="absolute inset-0 bg-black/90 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <a
                  href={`/${subdomain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#ff9e00] text-black rounded-none text-[9px] font-mono font-bold uppercase tracking-widest transition-all duration-200 hover:bg-[#ffaa22] hover:scale-105 flex items-center gap-1.5 shadow-md"
                >
                  <ExternalLink className="w-3 h-3" /> Live Preview
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
