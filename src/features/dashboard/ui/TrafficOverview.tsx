"use client";

import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnimateOnScroll } from '@/shared/ui/AnimateOnScroll';

interface TrafficOverviewProps {
  analytics: any;
  isLoading: boolean;
}

const safeDateFormatter = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 p-3 rounded-md border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <p className="text-[9px] font-sans font-medium text-white/60 mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-md" style={{ backgroundColor: entry.color }}></div>
                <span className="text-[10px] font-sans font-medium text-white/70 capitalize">{entry.name}</span>
              </div>
              <span className="text-xs font-sans font-medium text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function TrafficOverview({ analytics, isLoading }: TrafficOverviewProps) {
  const [activeMetric, setActiveMetric] = useState<'both' | 'views' | 'visitors'>('both');

  const chartData = useMemo(() => {
    let raw: any[] = [];
    if (analytics?.chartData && analytics.chartData.length > 0) {
      raw = [...analytics.chartData].slice(-7);
    } else if (analytics?.dailyStats && analytics.dailyStats.length > 0) {
      raw = [...analytics.dailyStats].slice(-7);
    }

    if (raw.length === 0) return [];

    return raw.map((d: any) => ({
      date: d.day || safeDateFormatter(d.date),
      views: d.views ?? 0,
      visitors: d.visitors ?? 0,
    }));
  }, [analytics]);

  const summary = useMemo(() => {
    if (!chartData.length) return { totalViews: 0, avgDaily: 0, peakDay: '-', peakViews: 0 };
    let total = 0;
    let peak = 0;
    let peakD = '-';
    chartData.forEach(d => {
      total += d.views;
      if (d.views > peak) {
        peak = d.views;
        peakD = d.date;
      }
    });
    return {
      totalViews: total,
      avgDaily: Math.round(total / chartData.length),
      peakDay: peakD,
      peakViews: peak
    };
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="bg-zinc-950 border border-white/10 rounded-md h-full min-h-[450px] shimmer w-full"></div>
    );
  }

  return (
    <AnimateOnScroll delay={100} className="h-full w-full">
      <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded-xl h-full flex flex-col w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-base font-sans font-medium text-white">Traffic Hub (Insights)</h3>
          <span className="text-xs font-sans text-white/50">Last 30 days</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Metrics - Kiri */}
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 lg:w-1/3 shrink-0">
            <div>
              <p className="text-[10px] font-sans font-bold text-[#ff9e00] tracking-wider uppercase mb-1">Total Visits</p>
              <h4 className="text-3xl font-mono font-bold text-[#ff9e00] mb-1">
                {(summary.totalViews > 1000 ? (summary.totalViews / 1000).toFixed(1) + 'k' : summary.totalViews) || '0'}
              </h4>
              <p className="text-[10px] font-sans text-white/50">Total traffic visits</p>
            </div>
            
            <div>
              <p className="text-[10px] font-sans font-bold text-[#ff9e00] tracking-wider uppercase mb-1">Today's Visits</p>
              <h4 className="text-3xl font-mono font-bold text-[#ff9e00] mb-1">
                {analytics?.dailyStats?.[analytics.dailyStats.length - 1]?.views || '0'}
              </h4>
              <p className="text-[10px] font-sans text-white/50">Today's visits</p>
            </div>

            <div>
              <p className="text-[10px] font-sans font-bold text-[#ff9e00] tracking-wider uppercase mb-1">Bounce Rate</p>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-mono font-bold text-[#ff9e00]">{analytics?.stats?.bounceRate || '0%'}</h4>
                {/* Mini chart placeholder */}
                <svg width="40" height="15" viewBox="0 0 40 15" fill="none">
                  <path d="M0 10 Q 10 5, 20 12 T 40 2" stroke="#ff9e00" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <p className="text-[10px] font-sans text-white/50">Bounce Rate %</p>
            </div>

            <div>
              <p className="text-[10px] font-sans font-bold text-[#ff9e00] tracking-wider uppercase mb-1">Avg Time</p>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-mono font-bold text-[#ff9e00]">{analytics?.stats?.avgTime || '0s'}</h4>
                <svg width="40" height="15" viewBox="0 0 40 15" fill="none">
                  <path d="M0 8 Q 10 12, 20 5 T 40 10" stroke="#ff9e00" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <p className="text-[10px] font-sans text-white/50">Avg. Times/Tims</p>
            </div>
          </div>

          {/* Chart - Kanan */}
          <div className="w-full lg:flex-1 mt-4 lg:mt-0" style={{ minHeight: '250px' }}>
            <div className="w-full h-[250px] lg:h-full lg:absolute lg:inset-0 relative">
              <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViewsOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff9e00" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#ff9e00" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorViewsBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#666', fontFamily: 'sans-serif' }}
                  dy={10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255, 255, 255, 0.05)', strokeWidth: 1 }} />

                {/* Dummy layer for blue overlap effect if needed, we'll just plot visitors if exist, else a scaled version of views */}
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViewsBlue)"
                  activeDot={false}
                />
                
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#ff9e00"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViewsOrange)"
                  activeDot={{ r: 5, fill: '#ff9e00', stroke: '#000', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
