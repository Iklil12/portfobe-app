//app/dashboard/explore/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Palette, UploadCloud, Star, Zap, Compass, Bell, Download, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Community Themes',
    desc: 'Discover and use unique portfolio themes created by other creators in the Portfo.be community.',
  },
  {
    icon: UploadCloud,
    title: 'Publish Your Design',
    desc: 'Share your custom portfolio look with the community and gain reputation as a top creator.',
  },
  {
    icon: Star,
    title: 'Ratings & Reviews',
    desc: 'Provide honest ratings and reviews to help the community keep delivering quality portfolio designs.',
  },
  {
    icon: Zap,
    title: '1-Click Apply',
    desc: 'Apply any design directly to your portfolio — your content and project data stay safe.',
  },
];

const mockCards = [
  { label: 'Midnight Dev', user: '@arsyad', uses: '1.2K', tag: 'Dark · Developer' },
  { label: 'Clean Studio', user: '@linadesign', uses: '980', tag: 'Light · Designer' },
  { label: 'Bold Minimal', user: '@rizkiworks', uses: '754', tag: 'Minimal · Writer' },
  { label: 'Neon Coder', user: '@devhero_id', uses: '631', tag: 'Dark · Developer' },
  { label: 'Warm Lens', user: '@kirafoto', uses: '510', tag: 'Warm · Photographer' },
  { label: 'Type Editorial', user: '@rahmatype', uses: '412', tag: 'Light · Writer' },
];

export default function ExplorePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <main className="min-h-screen relative overflow-hidden pb-24 selection:bg-[#ff9e00]/30 selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        .animate-enter { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(20px) scale(0.99); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .shimmer-dark {
          background: linear-gradient(110deg, rgba(255,255,255,0.03) 8%, rgba(255,255,255,0.08) 18%, rgba(255,255,255,0.03) 33%);
          background-size: 200% 100%;
          animation: 1.5s shine linear infinite;
        }
        @keyframes shine { to { background-position-x: -200%; } }
      `}} />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">

        {/* ── HEADER ── */}
        <div className="animate-enter mb-12" style={{animationDelay:'0ms'}}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-white/10 text-white/50 text-[9px] font-sans font-medium mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9e00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff9e00]"></span>
            </span>
            In Development
          </div>

          <h1 className="text-3xl font-sans font-medium text-white tracking-tight uppercase mb-3">
            Explore <span className="text-white/60">Community</span>
          </h1>
          <p className="text-white/50 text-xs font-sans max-w-lg leading-relaxed">
            Coming soon — a portfolio design marketplace from fellow Portfo.be creators. Discover, use, and share your best design work.
          </p>
        </div>

        {/* ── FEATURE CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14 animate-enter" style={{animationDelay:'100ms'}}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-zinc-900/30 rounded-md border border-white/10 p-6 hover:border-[#ff9e00]/40 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-zinc-950 border border-white/5 rounded-md flex items-center justify-center mb-4 group-hover:bg-[#ff9e00]/10 group-hover:border-[#ff9e00]/30 transition-colors text-white/50 group-hover:text-[#ff9e00]">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-sans font-medium text-white text-xs mb-2">{f.title}</h3>
                <p className="text-white/60 text-[11px] font-sans leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* ── PREVIEW BLUR SECTION ── */}
        <div className="animate-enter" style={{animationDelay:'200ms'}}>
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-sans font-medium text-white text-xs">Community Preview</h2>
              <p className="text-white/50 text-[9px] font-sans mt-1">Initial release interface estimation</p>
            </div>
            <span className="px-2.5 py-1 bg-zinc-900 text-white/60 text-[9px] font-sans font-medium rounded-md border border-white/5">Soon</span>
          </div>

          {/* Blurred Grid Preview */}
          <div className="relative rounded-md overflow-hidden border border-white/10">
            {/* Blur Overlay */}
            <div className="absolute inset-0 z-10 backdrop-blur-md bg-black/70 flex flex-col items-center justify-center px-4">
              <div className="w-14 h-14 rounded-md bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 text-white/50">
                <Compass className="w-6 h-6 animate-pulse text-[#ff9e00]" />
              </div>
              <p className="font-sans font-medium text-white text-xs mb-1.5">Community Not Open</p>
              <p className="text-white/60 font-mono text-[10px] text-center max-w-xs leading-relaxed">
                We are designing the most seamless theme-sharing ecosystem for Portfo.be creators.
              </p>
            </div>

            {/* Mock Grid (behind blur) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 pointer-events-none select-none">
              {mockCards.map((card, i) => (
                <div key={i} className="bg-zinc-950 border border-white/5 rounded-md overflow-hidden flex flex-col">
                  {/* Mock thumbnail */}
                  <div className="h-28 shimmer-dark border-b border-white/5"></div>
                  <div className="p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans font-medium text-white/70 text-[10px] truncate">{card.label}</span>
                      <span className="text-[9px] font-sans text-white/50 flex items-center gap-1 shrink-0">
                        <Download className="w-2.5 h-2.5" />{card.uses}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] text-white/60 font-sans truncate">{card.user}</span>
                      <span className="text-[8px] px-1.5 py-0.5 bg-zinc-900 text-[#ff9e00] rounded-md font-sans font-medium border border-white/5 shrink-0">{card.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── NOTIFY BANNER ── */}
        <div className="animate-enter mt-10" style={{animationDelay:'300ms'}}>
          <div className="bg-zinc-900/50 border border-white/10 rounded-md p-6 sm:p-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950 border border-white/10 text-white/60 text-[9px] font-sans font-medium mb-4">
                  <Bell className="w-3 h-3 text-[#ff9e00]" /> Get Notified
                </div>
                <h3 className="font-sans font-medium text-white text-sm mb-1">Be the First Creator</h3>
                <p className="text-white/60 font-mono text-xs leading-relaxed max-w-xl">When the Explore Community launches, your custom themes can be instantly recognized and used by others.</p>
              </div>
              <button
                onClick={() => {}}
                className="flex-shrink-0 bg-[#ff9e00] hover:bg-[#ffaa22] text-black px-6 py-3.5 rounded-md font-sans font-medium text-xs active:scale-95 transition-all whitespace-nowrap"
              >
                Notify Me
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
