"use client";

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { 
  Plug, 
  Layers, 
  Plus 
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

// Import Modular Components
import { ManualPenpotManager } from '@/components/features/integrations/ManualPenpotManager';
import { ManualCanvaManager } from '@/components/features/integrations/ManualCanvaManager';
import { GitHubManager } from '@/components/features/integrations/GitHubManager';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const PenpotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22 4.5L37.5 12.25V31.75L22 39.5L6.5 31.75V12.25L22 4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 39.5V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M37.5 12.25L22 22L6.5 12.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 12V6M22 15V4M30 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Skeleton = () => (
  <div className="space-y-12 animate-billing-fade">
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes billingFadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
      .animate-billing-fade { opacity: 0; animation: billingFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
    `}} />
    {[1, 2, 3].map(i => (
      <div key={i} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-none bg-white/5 border border-white/5 shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-white/5 border border-white/5 rounded-none shimmer" />
            <div className="h-3 w-48 bg-white/5 border border-white/5 rounded-none shimmer" />
          </div>
        </div>
        <div className="h-40 rounded-none bg-white/5 border border-white/5 shimmer" />
      </div>
    ))}
  </div>
);

export default function IntegrationsPage() {
  const { isLoading } = useSWR('/api/settings/integrations', fetcher);
  const [isMinimumLoadTimeMet, setIsMinimumLoadTimeMet] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMinimumLoadTimeMet(true), 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="min-h-screen relative pb-24 z-10 selection:bg-[#ff9e00]/30 selection:text-white">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-10 relative z-20">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-900 border border-white/10 text-white/50 text-[9px] font-mono font-bold uppercase tracking-wider mb-6">
            <Plug className="w-3.5 h-3.5" /> Connected Works
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wider mb-3">Connected Works</h1>
          <p className="text-xs text-white/40 font-mono leading-relaxed max-w-xl">Hubungkan platform favoritmu dan tampilkan karya langsung di portofolio.</p>
        </motion.div>

        {/* Sections */}
        {(isLoading || !isMinimumLoadTimeMet) ? <Skeleton /> : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-20"
          >
            
            {/* ── GITHUB ── */}
            <section className="space-y-6 relative z-30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-[#ff9e00]">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">GitHub Repository</h3>
                  <p className="text-[10px] text-white/40 font-mono">Sync your repositories and contribution stats.</p>
                </div>
              </div>
              <GitHubManager />
            </section>

            {/* ── PENPOT ── */}
            <section className="space-y-6 relative z-30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-[#ff9e00]">
                    <PenpotIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Penpot Integration</h3>
                    <p className="text-[10px] text-white/40 font-mono">Showcase your design prototypes via public links.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-none bg-[#ff9e00]/10 border border-[#ff9e00]/30 text-[#ff9e00] text-[9px] font-mono font-bold uppercase tracking-wider">
                    Manual Mode
                  </span>
                </div>
              </div>
              <ManualPenpotManager />
            </section>

            {/* ── CANVA ── */}
            <section className="space-y-6 relative z-30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-[#ff9e00]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Canva Showcase</h3>
                    <p className="text-[10px] text-white/40 font-mono">Embed your Canva presentations and designs.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-none bg-[#ff9e00]/10 border border-[#ff9e00]/30 text-[#ff9e00] text-[9px] font-mono font-bold uppercase tracking-wider">
                    Manual Mode
                  </span>
                </div>
              </div>
              <ManualCanvaManager />
            </section>

            {/* ── More Coming Soon ── */}
            <div className="rounded-none border border-dashed border-white/10 bg-[#050505] p-8 flex items-center gap-6">
              <div className="w-12 h-12 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-white/30">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-white uppercase tracking-wider">More connected works coming soon</p>
                <p className="text-xs text-white/40 mt-1.5 font-mono leading-relaxed">Figma, Behance, Dribbble, dan lainnya sedang dalam pengembangan.</p>
              </div>
            </div>

          </motion.div>
        )}
      </div>

    </main>
  );
}
