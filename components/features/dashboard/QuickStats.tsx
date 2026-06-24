"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import {
  ArrowUpRight,
  Lock,
  Check,
  Minus,
  Target,
  FolderOpen,
  Award,
  MessageSquare,
  Link2
} from 'lucide-react';

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
  stats: any;
  analytics: any;
  isLoadingStats: boolean;
  isLoadingAnalytics: boolean;
  userPlan?: string;
  strength: number;
  strengthBreakdown: { id: string; label: string; done: boolean; weight: number }[];
}

export function QuickStats({ stats, analytics, isLoadingStats, isLoadingAnalytics, userPlan = 'FREE', strength, strengthBreakdown }: QuickStatsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [animatedStrength, setAnimatedStrength] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoadingStats && isMounted) {
      const timer = setTimeout(() => setAnimatedStrength(strength), 100);
      return () => clearTimeout(timer);
    }
  }, [strength, isLoadingStats, isMounted]);

  if (isLoadingStats || isLoadingAnalytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="h-36 bg-zinc-950 border border-white/10 rounded-none shimmer"></div>
          <div className="h-36 bg-zinc-950 border border-white/10 rounded-none shimmer"></div>
          <div className="col-span-2 h-28 bg-zinc-950 border border-white/10 rounded-none shimmer"></div>
        </div>
        <div className="h-full min-h-[280px] bg-zinc-950 border border-white/10 rounded-none shimmer"></div>
      </div>
    );
  }

  const totalViews = analytics?.stats?.totalViews ?? analytics?.summary?.totalViews ?? 0;
  const chartData: any[] = analytics?.chartData ?? analytics?.dailyStats ?? [];
  const todayViews = chartData[chartData.length - 1]?.views ?? 0;
  const yesterdayViews = chartData[chartData.length - 2]?.views ?? 0;
  const change = yesterdayViews === 0 ? 0 : Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100);
  const sparkData = chartData.slice(-7).map((d: any) => ({ views: d.views ?? 0 }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

      {/* LEFT 2 COLUMNS: Stats + Portfolio Strength */}
      <div className="md:col-span-2 grid grid-cols-2 gap-4 md:gap-5">

        {/* Total Kunjungan */}
        <AnimateOnScroll delay={0} className="h-full">
          <div className="h-full bg-zinc-950 border border-white/10 p-5 rounded-none transition-all hover:border-white/20">
            <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#ff9e00] rounded-full animate-pulse shadow-[0_0_8px_#ff9e00]"></span>
              Total Visits
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                <AnimatedCounter value={totalViews} />
              </h3>
              <div className="flex items-center gap-1 text-[8px] font-mono font-bold text-[#ff9e00] bg-[#ff9e00]/10 border border-[#ff9e00]/20 px-2 py-0.5">
                <ArrowUpRight className="w-3 h-3 animate-pulse" /> +12%
              </div>
            </div>
            {userPlan !== 'FREE' ? (
              <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1">Desktop</p>
                  <div className="w-full h-1 bg-white/10 rounded-none overflow-hidden">
                    <div className="h-full bg-[#ff9e00] transition-all duration-1000" style={{ width: `${analytics?.stats?.devices?.desktop || 0}%` }}></div>
                  </div>
                  <p className="text-[10px] font-mono font-bold text-white mt-1">{analytics?.stats?.devices?.desktop || 0}%</p>
                </div>
                <div>
                  <p className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1">Mobile</p>
                  <div className="w-full h-1 bg-white/10 rounded-none overflow-hidden">
                    <div className="h-full bg-[#ff9e00] transition-all duration-1000" style={{ width: `${analytics?.stats?.devices?.mobile || 0}%` }}></div>
                  </div>
                  <p className="text-[10px] font-mono font-bold text-white mt-1">{analytics?.stats?.devices?.mobile || 0}%</p>
                </div>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                <div className="w-5 h-5 rounded-none border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                  <Lock className="w-2.5 h-2.5 text-white/40" />
                </div>
                <p className="text-[9px] font-mono font-bold text-white/40">UPGRADE <span className="text-[#ff9e00]">PRO</span> FOR DETAILS</p>
              </div>
            )}
          </div>
        </AnimateOnScroll>

        {/* Hari Ini */}
        <AnimateOnScroll delay={80} className="h-full">
          <div className="h-full bg-zinc-950 border border-white/10 p-5 rounded-none transition-all hover:border-white/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  Today
                  <span className="w-1.5 h-1.5 bg-[#ff9e00] rounded-full animate-pulse shadow-[0_0_8px_#ff9e00]"></span>
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                    <AnimatedCounter value={todayViews} duration={1200} />
                  </h3>
                  {change !== 0 && (
                    <span className={`text-[9px] font-mono font-bold ${change > 0 ? 'text-emerald-450' : 'text-red-400'}`}>
                      {change > 0 ? '+' : ''}<AnimatedCounter value={change} duration={1200} />%
                    </span>
                  )}
                </div>
              </div>
              <div className="w-14 h-7 opacity-95">
                {isMounted && sparkData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <Line type="monotone" dataKey="views" stroke="#ff9e00" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            {userPlan !== 'FREE' ? (
              <div className="mt-3 pt-3 border-t border-white/10 flex justify-between gap-2">
                <div>
                  <p className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest mb-0.5">Avg. Time</p>
                  <p className="text-xs font-mono font-bold text-white">{analytics?.todayStats?.avgTime || '0s'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest mb-0.5">Bounce Rate</p>
                  <p className="text-xs font-mono font-bold text-white">{analytics?.todayStats?.bounceRate || '0%'}</p>
                </div>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                <div className="w-5 h-5 rounded-none border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                  <Lock className="w-2.5 h-2.5 text-white/40" />
                </div>
                <p className="text-[9px] font-mono font-bold text-white/40">UPGRADE <span className="text-[#ff9e00]">PRO</span> FOR DETAILS</p>
              </div>
            )}
          </div>
        </AnimateOnScroll>

        {/* Portfolio Strength - spans both columns below */}
        <AnimateOnScroll delay={160} className="col-span-2 h-full">
          <div className="h-full bg-zinc-950 border border-white/10 p-5 rounded-none transition-all group overflow-hidden relative cursor-help hover:border-white/20">
            <div className="flex items-center justify-between gap-6 h-full relative z-10 transition-all duration-350 group-hover:opacity-0 group-hover:scale-95">
              <div className="flex-1">
                <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Portfolio Strength</p>
                <h4 className="text-sm md:text-base font-display font-bold text-white tracking-wide uppercase">
                  {strength === 100 ? 'Perfect Portfolio!' : 'Complete Your Profile'}
                </h4>
                <p className="text-[10px] font-mono text-white/50 mt-1 leading-snug">
                  {strength === 100 ? 'All aspects of your profile are fully completed.' : 'Enhance your profile strength for optimal visibility.'}
                </p>
              </div>

              {/* Progress bar horizontal */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-32 md:w-48">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      {strength === 100 ? 'Ready to Compete' : 'Needs Completion'}
                    </span>
                    <span className="text-xs font-mono font-bold text-white"><AnimatedCounter value={strength} duration={1500} />%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-none overflow-hidden">
                    <div
                      className="h-full bg-[#ff9e00] rounded-none transition-all duration-[1500ms]"
                      style={{ width: `${animatedStrength}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Breakdown Overlay */}
            <div className="absolute inset-0 bg-zinc-950 p-4 md:p-5 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 transition-all duration-200 z-20 flex flex-col justify-center rounded-none border border-white/10">
              <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-2 shrink-0">
                <Target className="w-4 h-4 text-[#ff9e00]" /> Profile Completeness
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 overflow-y-auto pr-1 pb-1 hide-scrollbar">
                {strengthBreakdown.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ transitionDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-none border flex items-center justify-center shrink-0 ${item.done ? 'bg-[#ff9e00] text-black border-[#ff9e00]' : 'bg-white/5 text-white/30 border-white/10'}`}>
                        {item.done ? <Check className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
                      </div>
                      <span className={`text-[10px] font-mono ${item.done ? 'text-white font-bold' : 'text-white/40'}`}>{item.label}</span>
                    </div>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded-none ${item.done ? 'bg-[#ff9e00]/10 text-[#ff9e00] border-[#ff9e00]/20' : 'bg-white/5 text-white/30 border-white/10'}`}>
                      +{item.weight}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* RIGHT COLUMN: KARYA & KOLEKSI */}
      <AnimateOnScroll delay={120} className="h-full">
        <div className="h-full bg-zinc-950 border border-white/10 p-4 md:p-5 rounded-none transition-all overflow-hidden relative hover:border-white/20">
          <div className="flex flex-col h-full relative z-10">
            <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-1.5 px-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              Works & Collections
            </p>

            <div className="grid grid-cols-2 gap-2.5 flex-1">
              {/* Proyek */}
              <div className="bg-white/[0.02] border border-white/5 rounded-none p-3.5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group/item flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-7 h-7 bg-zinc-900 border border-white/10 flex items-center justify-center group-hover/item:scale-105 transition-transform duration-300">
                    <FolderOpen className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[7px] font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 border border-white/10 uppercase tracking-widest">Live</span>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-display font-bold text-white leading-none block mb-0.5">
                    <AnimatedCounter value={stats?.projects ?? 0} />
                  </span>
                  <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider">Projects</span>
                </div>
              </div>

              {/* Sertifikat */}
              <div className="bg-white/[0.02] border border-white/5 rounded-none p-3.5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group/item flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-7 h-7 bg-zinc-900 border border-white/10 flex items-center justify-center group-hover/item:scale-105 transition-transform duration-300">
                    <Award className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[7px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 uppercase tracking-widest">Verified</span>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-display font-bold text-white leading-none block mb-0.5">
                    <AnimatedCounter value={stats?.awards ?? 0} />
                  </span>
                  <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider">Certificates</span>
                </div>
              </div>

              {/* Testimoni */}
              <div className="bg-white/[0.02] border border-white/5 rounded-none p-3.5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group/item flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-7 h-7 bg-zinc-900 border border-white/10 flex items-center justify-center group-hover/item:scale-105 transition-transform duration-300">
                    <MessageSquare className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[7px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 border border-blue-500/20 uppercase tracking-widest">Social</span>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-display font-bold text-white leading-none block mb-0.5">
                    <AnimatedCounter value={stats?.testimonials ?? 0} />
                  </span>
                  <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider">Testimonials</span>
                </div>
              </div>

              {/* Tautan */}
              <div className="bg-white/[0.02] border border-white/5 rounded-none p-3.5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group/item flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-7 h-7 bg-zinc-900 border border-white/10 flex items-center justify-center group-hover/item:scale-105 transition-transform duration-300">
                    <Link2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[7px] font-mono font-bold text-[#ff9e00] bg-[#ff9e00]/10 px-1.5 py-0.5 border border-[#ff9e00]/20 uppercase tracking-widest">Active</span>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-display font-bold text-white leading-none block mb-0.5">
                    <AnimatedCounter value={stats?.links ?? 0} />
                  </span>
                  <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider">Links</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

    </div>
  );
}
