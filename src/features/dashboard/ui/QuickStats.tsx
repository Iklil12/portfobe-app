"use client";

import React, { useState, useEffect } from 'react';
import { AnimateOnScroll } from '@/shared/ui/AnimateOnScroll';
import { FolderOpen, Award, MessageSquare, Link2, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

function AnimatedCounter({ value, duration = 1500 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(easeOut * value));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}

interface QuickStatsProps {
  type: 'works' | 'progress';
  stats?: any;
  isLoadingStats?: boolean;
  strength?: number;
  strengthBreakdown?: { id: string; label: string; done: boolean; weight: number }[];
}

export function QuickStats({ type, stats, isLoadingStats, strength = 0, strengthBreakdown = [] }: QuickStatsProps) {
  const t = useTranslations('DashboardOverview');
  if (isLoadingStats) {
    return <div className="h-[300px] bg-[#1a1a1a] border border-white/5 rounded-xl shimmer w-full"></div>;
  }

  if (type === 'works') {
    return (
      <AnimateOnScroll delay={0} className="w-full h-full">
        <div className="bg-[#1a1a1a] border border-white/5 p-5 md:p-6 rounded-xl w-full h-full flex flex-col">
          <h3 className="text-base font-sans font-medium text-white mb-6">{t('statsWorksTitle')}</h3>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                  <FolderOpen className="w-4 h-4 text-white/70" />
                </div>
                <span className="text-sm font-sans text-white/80">{t('statsProjects')}</span>
                <span className="ml-auto text-[9px] px-2 py-0.5 rounded bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/20 font-medium tracking-wide">{t('badgeLive')}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-[#ff9e00]"><AnimatedCounter value={stats?.projects ?? 0} /></span>
                <span className="text-xl font-mono text-[#ff9e00]"><AnimatedCounter value={3} /></span>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-white/70" />
                </div>
                <span className="text-sm font-sans text-white/80">{t('statsCerts')}</span>
                <span className="ml-auto text-[9px] px-2 py-0.5 rounded bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/20 font-medium tracking-wide">{t('badgeVerified')}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-[#ff9e00]"><AnimatedCounter value={stats?.awards ?? 0} /></span>
                <span className="text-xl font-mono text-[#ff9e00]"><AnimatedCounter value={3} /></span>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-white/70" />
                </div>
                <span className="text-sm font-sans text-white/80 truncate">{t('statsTesti')}</span>
                <span className="ml-auto text-[9px] px-2 py-0.5 rounded bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/20 font-medium tracking-wide">{t('badgeSocial')}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white"><AnimatedCounter value={stats?.testimonials ?? 0} /></span>
                <span className="text-xl font-mono text-[#ff9e00]"><AnimatedCounter value={3} /></span>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4 text-white/70" />
                </div>
                <span className="text-sm font-sans text-white/80">{t('statsLinks')}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white"><AnimatedCounter value={stats?.links ?? 0} /></span>
                <span className="text-xl font-mono text-[#ff9e00]"><AnimatedCounter value={4} /></span>
              </div>
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    );
  }

  // Circular Progress Type
  return (
    <AnimateOnScroll delay={100} className="w-full">
      <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-xl w-full flex flex-col items-center relative overflow-hidden h-[300px]">
        {/* Glow behind chart */}
        <div className="absolute top-10 w-[150px] h-[150px] bg-[#ff9e00]/20 blur-[50px] rounded-full pointer-events-none"></div>
        
        {/* Arc Chart */}
        <div className="relative w-full h-[140px] flex items-end justify-center mb-6 z-10">
          <svg className="absolute inset-x-0 bottom-0 w-full h-[140px]" viewBox="0 0 200 120" preserveAspectRatio="xMidYMax meet">
            <path
              d="M 20 110 A 80 80 0 0 1 180 110"
              fill="none"
              stroke="#333"
              strokeWidth="12"
              strokeLinecap="round"
              pathLength="100"
            />
            <path
              d="M 20 110 A 80 80 0 0 1 180 110"
              fill="none"
              stroke="#ff9e00"
              strokeWidth="12"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - strength}
              style={{ transition: 'stroke-dashoffset 1.5s ease-in-out', filter: 'drop-shadow(0 0 8px rgba(255,158,0,0.6))' }}
            />
          </svg>
          <div className="flex flex-col items-center pb-2 z-10 mb-[-10px]">
            <span className="text-4xl md:text-5xl font-mono font-bold text-[#ff9e00] drop-shadow-[0_0_12px_rgba(255,158,0,0.6)]">
              <AnimatedCounter value={strength} />%
            </span>
          </div>
        </div>

        {/* Checklists */}
        <div className="w-full grid grid-cols-2 gap-x-2 gap-y-3 z-10 mt-auto">
          {strengthBreakdown.slice(0, 6).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${item.done ? 'text-[#ff9e00]' : 'text-white/20'}`} />
              <span className={`text-[10px] font-sans truncate ${item.done ? 'text-white/80' : 'text-white/40'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </AnimateOnScroll>
  );
}
