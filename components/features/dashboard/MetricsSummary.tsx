"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Smooth Counter Component
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

interface MetricsSummaryProps {
  analytics: any;
  strength: number;
  isLoading: boolean;
}

export function MetricsSummary({ analytics, strength, isLoading }: MetricsSummaryProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [animatedStrength, setAnimatedStrength] = useState(0);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isMounted) {
      const timer = setTimeout(() => {
        setAnimatedStrength(strength);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [strength, isLoading, isMounted]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white border border-slate-100 rounded-[2rem] skeleton-premium"></div>
        ))}
      </div>
    );
  }

  // Data Processing
  const totalViews = analytics?.summary?.totalViews || 0;
  const todayViews = analytics?.dailyStats?.[analytics?.dailyStats?.length - 1]?.views || 0;
  const yesterdayViews = analytics?.dailyStats?.[analytics?.dailyStats?.length - 2]?.views || 0;
  
  // Calculate change %
  const change = yesterdayViews === 0 ? 0 : Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100);
  
  // Last 7 days for Sparkline
  const sparkData = (analytics?.dailyStats || []).slice(-7).map((d: any) => ({ views: d.views }));

  // Dynamic message for strength
  const getStrengthMessage = (score: number) => {
    if (score < 30) return "Lengkapi profil Anda!";
    if (score < 60) return "Hampir siap dipublikasi!";
    if (score < 90) return "Sangat bagus, dikit lagi!";
    return "Portofolio Sempurna!";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mb-12">
      
      {/* CARD 1: TOTAL VIEWS */}
      <div className="bg-white border border-slate-100 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
        <div className="flex flex-col h-full justify-between relative z-10">
            <div>
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5 flex items-center gap-1.5">
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> 
                    Views
                </p>
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">
                  <AnimatedCounter value={totalViews} />
                </h3>
            </div>
            <div className="mt-3 md:mt-4 flex items-center justify-between">
                <span className="hidden md:block text-[10px] font-bold text-slate-400">7 Hari</span>
                <div className="w-full md:w-24 h-8 md:h-10">
                   {isMounted && (
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparkData}>
                           <Line type="monotone" dataKey="views" stroke="#0f172a" strokeWidth={2} dot={false} />
                        </LineChart>
                     </ResponsiveContainer>
                   )}
                </div>
            </div>
        </div>
      </div>

      {/* CARD 2: TODAY'S TRAFFIC */}
      <div className="bg-[#0a0a0a] p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
        <div className="flex flex-col h-full justify-between relative z-10">
            <div>
                <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-1.5">
                    Hari Ini
                </p>
                <div className="flex items-baseline gap-2 md:gap-3">
                    <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter">
                      <AnimatedCounter value={todayViews} duration={1200} />
                    </h3>
                    {change !== 0 && (
                        <span className={`text-[9px] md:text-[11px] font-black ${change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                           {change > 0 ? '+' : ''}<AnimatedCounter value={change} duration={1200} />%
                        </span>
                    )}
                </div>
            </div>
            <div className="mt-3 md:mt-4">
               <div className="inline-flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl bg-white/5 border border-white/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#ff9e00] animate-ping"></div>
                   <span className="text-[8px] md:text-[10px] font-black text-white tracking-widest uppercase">Live</span>
               </div>
            </div>
        </div>
      </div>

      {/* CARD 3: PORTFOLIO STRENGTH */}
      <div className="col-span-2 md:col-span-1 bg-white border border-slate-100 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
        <div className="flex flex-col h-full justify-between relative z-10">
            <div>
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5 flex justify-between items-center">
                    <span>Portfolio Strength</span>
                    <span className="text-slate-900 font-black"><AnimatedCounter value={strength} duration={1500} />%</span>
                </p>
                <div className="w-full h-2 md:h-3 bg-slate-50 rounded-full overflow-hidden mt-2 md:mt-3 p-0.5 border border-slate-100">
                    <div 
                        className="h-full bg-slate-900 rounded-full transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ width: `${animatedStrength}%` }}
                    ></div>
                </div>
            </div>
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-50">
               <div className="flex items-center gap-2 md:gap-3">
                   <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs ${strength === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                       <i className={`fas ${strength === 100 ? 'fa-check-circle' : 'fa-rocket'}`}></i>
                   </div>
                   <span className="text-[9px] md:text-[11px] font-bold text-slate-500 leading-tight">
                        {getStrengthMessage(strength)}
                   </span>
               </div>
            </div>
        </div>
      </div>

    </div>
  );
}
