//app/dashboard/analytics/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { showToast } from '@/lib/customToast';
import useSWR from 'swr';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { 
  Eye, User, Clock, LogOut, BarChart3, Trophy, Calendar, 
  Target, Ghost, Crown, Lock, Globe, MessageSquare, 
  Play, Link2, AlertTriangle, Loader2 
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon, TwitterIcon } from '@/components/ui/Icons';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function AnimatedCounter({ value, duration = 1200 }: { value: number | string, duration?: number }) {
  const [count, setCount] = useState(typeof value === 'number' ? 0 : value);
  useEffect(() => {
    if (typeof value !== 'number') { setCount(value); return; }
    let start: number | null = null;
    let raf: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(2, -10 * p);
      setCount(Math.round(ease * value));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{typeof count === 'number' ? count.toLocaleString() : count}</>;
}

const getSourceIcon = (name: string) => {
  switch (name) {
    case 'Instagram':
      return <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />;
    case 'LinkedIn':
      return <LinkedinIcon className="w-3.5 h-3.5 text-blue-500" />;
    case 'YouTube':
      return <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />;
    case 'Twitter / X':
      return <TwitterIcon className="w-3.5 h-3.5 text-white" />;
    case 'Google':
      return <Globe className="w-3.5 h-3.5 text-blue-400" />;
    case 'WhatsApp':
      return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
    case 'TikTok':
      return <Play className="w-3.5 h-3.5 text-purple-400" />;
    default:
      return <Link2 className="w-3.5 h-3.5 text-white/40" />;
  }
};

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`shimmer-dark rounded-none ${className}`} />;
}

const CustomAreaTooltip = ({ active, payload, label, isHourly }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-none shadow-2xl px-4 py-3 min-w-[140px] font-mono">
      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2">
        {isHourly ? `Pukul ${label}` : label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-none" style={{ backgroundColor: entry.color }} />
              <span className="text-[10px] font-bold text-white/70 capitalize">{entry.name}</span>
            </div>
            <span className="text-xs font-bold text-white">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [range, setRange] = useState('7d');
  const [isMounted, setIsMounted] = useState(false);
  const [animReady, setAnimReady] = useState(false);
  const [tzOffset, setTzOffset] = useState<number | null>(null);

  useEffect(() => { 
    setIsMounted(true);
    setTzOffset(new Date().getTimezoneOffset());
  }, []);

  const swrUrl = tzOffset !== null ? `/api/analytics/stats?range=${range}&tzOffset=${tzOffset}` : null;
  const { data, isLoading } = useSWR(swrUrl, fetcher, { refreshInterval: 30000 });
  const { data: userData, isLoading: isUserLoading } = useSWR('/api/layout-sync', fetcher);
  
  const userPlan = userData?.plan ?? undefined;

  useEffect(() => {
    if (!isLoading && isMounted && data) {
      const t = setTimeout(() => setAnimReady(true), 200);
      return () => clearTimeout(t);
    }
  }, [isLoading, isMounted, data]);

  const stats = data?.stats || { totalViews: 0, uniqueVisitors: 0, avgTime: '0s', bounceRate: '0%' };
  const chartData: { day: string; date: string; views: number }[] = data?.chartData || [];
  const sources: { name: string; count: number; percentage: number }[] = data?.sources || [];

  // derived metrics
  const peakEntry = chartData.reduce((a, b) => (b.views > a.views ? b : a), { day: '-', date: '', views: 0 });
  const totalPeriod = chartData.reduce((s, d) => s + d.views, 0);
  const avgDaily = chartData.length > 0 ? Math.round(totalPeriod / chartData.length) : 0;
  const growth = chartData.length >= 2
    ? chartData[chartData.length - 2].views === 0 ? 0
      : Math.round(((chartData[chartData.length - 1].views - chartData[chartData.length - 2].views) / chartData[chartData.length - 2].views) * 100)
    : 0;

  const isFree = userPlan === 'FREE';
  const deviceData = isFree
    ? [
        { name: 'Desktop', pct: 58, color: '#ffffff' },
        { name: 'Mobile', pct: 36, color: '#ff9e00' },
        { name: 'Tablet', pct: 6, color: 'rgba(255,255,255,0.3)' },
      ]
    : [
        { name: 'Desktop', pct: stats.devices?.desktop || 0, color: '#ffffff' },
        { name: 'Mobile', pct: stats.devices?.mobile || 0, color: '#ff9e00' },
        { name: 'Tablet', pct: stats.devices?.tablet || 0, color: 'rgba(255,255,255,0.3)' },
      ];

  const staticSources = [
    { name: 'Instagram', count: 842, percentage: 38 },
    { name: 'Google', count: 531, percentage: 24 },
    { name: 'Direct', count: 419, percentage: 19 },
    { name: 'LinkedIn', count: 265, percentage: 12 },
    { name: 'Twitter / X', count: 154, percentage: 7 },
  ];
  const displaySources = isFree ? staticSources : sources;

  const lockedAvgTime = '2m 34s';
  const lockedBounceRate = '42%';
  const lockedAvgDaily = 127;
  const lockedPeakViews = 384;
  const lockedPeakDay = 'Senin';
  const lockedTotalPeriod = 891;

  const handleLocked = () => showToast({ message: "Upgrade ke PRO untuk membuka fitur analitik lengkap!", id: "range-lock", icon: "fa-lock" });

  const RANGES = [
    { id: '1d', label: 'Hari Ini', pro: false },
    { id: '7d', label: '7 Hari', pro: false },
    { id: '30d', label: '30 Hari', pro: true },
    { id: 'all', label: 'Semua', pro: true },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 pb-32 selection:bg-[#ff9e00]/30 selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp { from { opacity:0;transform:translateY(20px) } to { opacity:1;transform:translateY(0) } }
        .animate-enter { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .recharts-wrapper,.recharts-surface,.recharts-wrapper svg,.recharts-layer { outline:none!important; }
        .shimmer-dark {
          background: linear-gradient(110deg, rgba(255,255,255,0.03) 8%, rgba(255,255,255,0.08) 18%, rgba(255,255,255,0.03) 33%);
          background-size: 200% 100%;
          animation: 1.5s shine linear infinite;
        }
        @keyframes shine { to { background-position-x: -200%; } }
      `}} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 animate-enter">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tight uppercase mb-1.5">
            Metrics.
          </h1>
          <p className="text-xs font-mono text-white/40">Analisis mendalam performa dan trafik portofolio Anda.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 border border-white/10 rounded-none self-start md:self-auto">
          {RANGES.map(r => {
            const locked = r.pro && userPlan === 'FREE';
            return (
              <button key={r.id}
                onClick={() => locked ? handleLocked() : setRange(r.id)}
                className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap rounded-none ${range === r.id ? 'bg-zinc-800 text-[#ff9e00] border border-white/5' : 'text-white/40 hover:text-white'}`}
              >
                {r.label}
                {locked && <Lock className="w-3 h-3 text-[#ff9e00]/70" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-8">
        {(isLoading || isUserLoading || userPlan === undefined) ? [1,2,3,4].map(i => <SkeletonBlock key={i} className="h-[120px] md:h-[140px]" />) : [
          { label: 'Total Views', val: stats.totalViews, icon: Eye, badge: `${growth > 0 ? '+' : ''}${growth}%`, badgeColor: growth >= 0 ? 'bg-[#ff9e00]/10 text-[#ff9e00]' : 'bg-rose-500/10 text-rose-400', locked: false },
          { label: 'Unique Visitors', val: stats.uniqueVisitors, icon: User, badge: 'Est.', badgeColor: 'bg-white/5 text-white/50 border border-white/5', locked: false },
          { label: 'Avg. Time', val: isFree ? lockedAvgTime : stats.avgTime, icon: Clock, badge: 'PRO', badgeColor: 'bg-[#ff9e00] text-black', locked: isFree },
          { label: 'Bounce Rate', val: isFree ? lockedBounceRate : stats.bounceRate, icon: LogOut, badge: 'PRO', badgeColor: 'bg-[#ff9e00] text-black', locked: isFree },
        ].map((card, i) => {
          const IconComponent = card.icon;
          return (
            <div key={i} onClick={card.locked ? handleLocked : undefined}
              className={`bg-zinc-900/40 border border-white/10 rounded-none p-5 md:p-6 shadow-none hover:border-[#ff9e00]/40 transition-all duration-300 animate-enter flex flex-col justify-between relative overflow-hidden ${card.locked ? 'cursor-pointer' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {card.locked && (
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 bg-zinc-900 text-white border border-white/15 rounded-none flex items-center justify-center mb-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#ff9e00]" />
                  </div>
                  <span className="text-[8px] font-mono font-bold text-[#ff9e00] tracking-widest uppercase">PRO ONLY</span>
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <p className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-widest">{card.label}</p>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none border border-white/5 uppercase tracking-wider ${card.badgeColor}`}>{card.badge}</span>
              </div>
              <h3 className={`text-2xl md:text-3xl font-mono font-bold text-white tracking-tighter leading-none ${card.locked ? 'blur-[4px] opacity-20' : ''}`}>
                <AnimatedCounter value={card.val} duration={1000 + i * 150} />
              </h3>
            </div>
          );
        })}
      </div>

      {/* SECONDARY METRIC STRIP */}
      <div className="grid grid-cols-3 gap-3 md:gap-5 mb-8">
        {(isLoading || isUserLoading || userPlan === undefined) ? [1,2,3].map(i => <SkeletonBlock key={i} className="h-20" />) : [
          { label: 'Rata-rata Harian', val: isFree ? lockedAvgDaily : avgDaily, suffix: isFree ? 'views/hari' : 'views/hari', icon: BarChart3 },
          { label: 'Puncak Kunjungan', val: isFree ? lockedPeakViews : peakEntry.views, suffix: isFree ? lockedPeakDay : peakEntry.day, icon: Trophy },
          { label: 'Total Periode', val: isFree ? lockedTotalPeriod : totalPeriod, suffix: isFree ? 'dalam 7 hari' : `dalam ${chartData.length} hari`, icon: Calendar },
        ].map((m, i) => {
          const IconComponent = m.icon;
          return (
            <div key={i} onClick={isFree ? handleLocked : undefined}
              className={`bg-zinc-900/40 border border-white/10 rounded-none p-4 md:p-5 shadow-none animate-enter flex items-center gap-3 md:gap-4 relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
              style={{ animationDelay: `${250 + i * 50}ms` }}
            >
              {isFree && (
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                  <div className="w-7 h-7 bg-zinc-900 border border-white/10 text-white rounded-none flex items-center justify-center mb-1">
                    <Lock className="w-3 h-3 text-[#ff9e00]" />
                  </div>
                  <span className="text-[8px] font-mono font-bold text-[#ff9e00] tracking-widest uppercase">PRO ONLY</span>
                </div>
              )}
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/30 shrink-0">
                <IconComponent className="w-4 h-4 text-[#ff9e00]" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest truncate">{m.label}</p>
                <p className={`text-lg md:text-xl font-mono font-bold text-white tracking-tighter leading-tight ${isFree ? 'blur-[5px] opacity-20' : ''}`}>
                  <AnimatedCounter value={m.val} />
                </p>
                <p className={`text-[8px] font-mono text-white/30 uppercase tracking-widest mt-0.5 ${isFree ? 'blur-[5px] opacity-20' : ''}`}>{m.suffix}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

        {/* TRAFFIC AREA CHART — spans 2 cols */}
        {isLoading ? (
          <div className="lg:col-span-2 rounded-none shimmer-dark h-[400px]" />
        ) : (
        <div className="lg:col-span-2 bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter" style={{ animationDelay: '300ms' }}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Traffic Overview</h3>
              <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">
                {range === '1d' ? 'Per jam — hari ini' : range === '7d' ? '7 hari terakhir' : range === '30d' ? '30 hari terakhir' : 'Semua waktu'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-none bg-[#ff9e00] inline-block" /> Page Views
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-none bg-white/40 inline-block" /> Uniq. Visitors
              </span>
            </div>
          </div>

          <div className="h-[280px]" onMouseDown={e => e.preventDefault()}>
            {isMounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9e00" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ff9e00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }} />
                  <Tooltip content={<CustomAreaTooltip isHourly={range === '1d'} />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="views" name="Page Views" stroke="#ff9e00" strokeWidth={2} fill="url(#viewsGrad)" dot={false} activeDot={{ r: 4, fill: '#ff9e00', stroke: '#000', strokeWidth: 2 }} animationDuration={1500} />
                  <Area type="monotone" dataKey="visitors" name="Uniq. Visitors" stroke="rgba(255,255,255,0.4)" strokeWidth={2} fill="transparent" dot={false} activeDot={{ r: 4, fill: 'rgba(255,255,255,0.4)', stroke: '#000', strokeWidth: 2 }} animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/20">
                <Ghost className="w-8 h-8 mb-3" />
                <p className="text-[9px] font-mono font-bold tracking-widest uppercase">Belum ada data traffic</p>
              </div>
            )}
          </div>
        </div>
        )}

        {/* DEVICE BREAKDOWN */}
        {isLoading ? (
          <div className="rounded-none shimmer-dark h-[400px]" />
        ) : (
        <div onClick={isFree ? handleLocked : undefined}
          className={`bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter flex flex-col relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
          style={{ animationDelay: '350ms' }}
        >
          {isFree && (
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
              <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-none flex items-center justify-center mb-2">
                <Lock className="w-4 h-4 text-[#ff9e00]" />
              </div>
              <span className="text-[8px] font-mono font-bold text-[#ff9e00] tracking-widest uppercase">PRO ONLY</span>
              <p className="text-[10px] text-white/40 font-mono mt-1 text-center">Upgrade untuk melihat data perangkat</p>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Perangkat</h3>
            <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">Distribusi per device</p>
          </div>
          <div className="space-y-5 flex-1">
            {deviceData.map((d, i) => (
              <div key={d.name} className="group">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-none shrink-0" style={{ background: d.color }} />
                    <span className="text-[11px] font-mono text-white/70">{d.name}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white">{d.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-none overflow-hidden">
                  <div className="h-full rounded-none transition-all duration-[1200ms] ease-out"
                    style={{ width: animReady ? `${d.pct}%` : '0%', background: d.color, transitionDelay: `${i * 100}ms` }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 mt-4 border-t border-white/5">
              <p className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest mb-3">Estimasi User Agent</p>
              <div className="grid grid-cols-3 gap-2">
                {deviceData.map(d => (
                  <div key={d.name} className="bg-zinc-900/40 rounded-none p-2.5 text-center border border-white/5">
                    <p className="text-xs font-mono font-bold text-white">{d.pct}%</p>
                    <p className="text-[8px] font-mono text-white/30 uppercase mt-0.5 tracking-wider">{d.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* BOTTOM ROW: Top Sources + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

        {/* TOP SOURCES */}
        {isLoading ? (
          <div className="rounded-none shimmer-dark h-[340px]" />
        ) : (
        <div onClick={isFree ? handleLocked : undefined}
          className={`bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
          style={{ animationDelay: '400ms' }}
        >
          {isFree && (
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center px-4">
              <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-none flex items-center justify-center mb-2">
                <Lock className="w-4 h-4 text-[#ff9e00]" />
              </div>
              <span className="text-[8px] font-mono font-bold text-[#ff9e00] tracking-widest uppercase">PRO ONLY</span>
              <p className="text-[10px] text-white/40 font-mono mt-1 text-center">Upgrade untuk melihat sumber trafik</p>
            </div>
          )}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Top Sources</h3>
              <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">Dari mana trafik berasal</p>
            </div>
            <div className="w-9 h-9 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-white/40">
              <Target className="w-4 h-4 text-[#ff9e00]" />
            </div>
          </div>
          
          {displaySources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-white/20">
              <Ghost className="w-8 h-8 mb-3" />
              <p className="text-[9px] font-mono font-bold tracking-widest uppercase">Belum ada data sources</p>
            </div>
          ) : (
            <div className="space-y-5">
              {displaySources.map((src, i) => (
                <div key={i} className="group/src">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                        {getSourceIcon(src.name)}
                      </div>
                      <span className="text-[11px] font-mono text-white/80">{src.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-white">{src.percentage}%</p>
                      <p className="text-[8px] font-mono text-white/30 uppercase mt-0.5 tracking-wider">{src.count} hits</p>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-none overflow-hidden">
                    <div className="h-full bg-white rounded-none group-hover/src:bg-[#ff9e00] transition-colors duration-300"
                      style={{ width: animReady ? `${src.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* DAILY BAR CHART */}
        {isLoading ? (
          <div className="rounded-none shimmer-dark h-[340px]" />
        ) : (
        <div className="bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter flex flex-col" style={{ animationDelay: '450ms' }}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Volume Harian</h3>
              <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">Distribusi per hari</p>
            </div>
            <div className="w-9 h-9 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-white/40">
              <BarChart3 className="w-4 h-4 text-[#ff9e00]" />
            </div>
          </div>
          <div className="flex-1 min-h-[240px]" onMouseDown={e => e.preventDefault()}>
            {isMounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)', stroke: 'none' }}
                    contentStyle={{ borderRadius: '0px', border: '1px solid rgba(255,255,255,0.1)', background: '#09090b', color: '#fff', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }} />
                  <Bar dataKey="views" radius={[0, 0, 0, 0]} barSize={24} animationDuration={1400}>
                    {chartData.map((entry, idx) => (
                      <Cell key={`c-${idx}`}
                        fill={entry.date === peakEntry.date ? '#ff9e00' : idx === chartData.length - 1 ? '#ffffff' : 'rgba(255,255,255,0.15)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/20">
                <Ghost className="w-8 h-8 mb-3" />
                <p className="text-[9px] font-mono font-bold tracking-widest uppercase">Belum ada data</p>
              </div>
            )}
          </div>

          {!isLoading && chartData.length > 0 && (
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
              <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-white/40">
                <span className="w-2.5 h-2.5 bg-[#ff9e00] inline-block" /> Puncak
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-white/40">
                <span className="w-2.5 h-2.5 bg-white inline-block" /> Hari Ini
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-white/40">
                <span className="w-2.5 h-2.5 bg-white/10 inline-block" /> Lainnya
              </span>
            </div>
          )}
        </div>
        )}
      </div>

      {/* PRO BANNER */}
      <div onClick={handleLocked}
        className="relative overflow-hidden bg-zinc-950 p-8 md:p-14 rounded-none border border-white/10 cursor-pointer group shadow-2xl animate-enter hover:border-[#ff9e00]/40 transition-all duration-500 max-w-5xl mx-auto"
        style={{ animationDelay: '500ms' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#ff9e00]/5 blur-[80px] rounded-full group-hover:bg-[#ff9e00]/10 transition-all duration-700 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-white/10 bg-white/5 text-[9px] font-mono font-bold tracking-wider text-white/50 mb-6 uppercase">
            <Crown className="w-3 h-3 text-[#ff9e00]" /> Pro Feature
          </span>
          <h4 className="text-xl md:text-2xl font-mono font-bold text-white mb-3 uppercase tracking-wider">
            Advanced <span className="text-white/40">Insights.</span>
          </h4>
          <p className="text-white/40 text-xs font-mono leading-relaxed mb-8">
            Dapatkan data geografis, peta panas klik pengunjung, rincian demografi, dan pelacakan konversi secara real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Real-time Tracking','Visitor Demographics','Click Heatmaps','Conversion Funnel','Geo Analytics'].map(t => (
              <span key={t} className="px-3 py-1 bg-zinc-900 text-white/50 text-[9px] font-mono font-bold rounded-none tracking-wider border border-white/5 uppercase">
                {t}
              </span>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest group-hover:bg-zinc-100 transition-all rounded-none shadow-lg">
            <Lock className="w-3.5 h-3.5 text-zinc-400" /> Tersedia Segera
          </div>
        </div>
      </div>

    </main>
  );
}