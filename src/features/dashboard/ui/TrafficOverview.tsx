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
    <AnimateOnScroll delay={100} className="h-full">
      <div className="bg-zinc-950 p-6 md:p-8 border border-white/10 rounded-md transition-all hover:border-white/20 h-full flex flex-col">
        {/* Header & Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-sans font-medium text-white">Traffic Overview</h3>
            <p className="text-xs font-sans text-white/50 mt-1">Your portfolio performance over the last 7 days</p>
          </div>

          <div className="px-4 py-1.5 border border-white/10 bg-white/5 text-[9px] font-sans font-medium text-white/70 self-start lg:self-auto rounded-md">
            Last 7 Days
          </div>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-md p-4">
            <p className="text-[9px] font-sans font-medium text-white/60 mb-1.5">Total Views</p>
            <h4 className="text-xl md:text-2xl font-sans font-medium text-white">{summary.totalViews.toLocaleString()}</h4>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-md p-4">
            <p className="text-[9px] font-sans font-medium text-white/60 mb-1.5">Daily Average</p>
            <h4 className="text-xl md:text-2xl font-sans font-medium text-white">{summary.avgDaily.toLocaleString()}</h4>
          </div>
          <div className="bg-[#ff9e00]/5 border border-[#ff9e00]/25 rounded-md p-4">
            <p className="text-[9px] font-sans font-medium text-[#ff9e00] mb-1.5">Peak Visits</p>
            <div className="flex items-baseline gap-2 truncate">
              <h4 className="text-xl md:text-2xl font-sans font-medium text-[#ff9e00]">{summary.peakDay}</h4>
              <span className="text-[10px] font-sans font-medium text-[#ff9e00]/70">({summary.peakViews} views)</span>
            </div>
          </div>
        </div>

        {/* Metric Toggles */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setActiveMetric(activeMetric === 'views' ? 'both' : 'views')}
            className="flex items-center gap-2 group"
          >
            <div className={`w-2.5 h-2.5 rounded-md transition-colors ${activeMetric === 'views' || activeMetric === 'both' ? 'bg-[#ff9e00]' : 'bg-zinc-800 border border-white/10'}`}></div>
            <span className={`text-[9px] font-sans font-medium transition-colors ${activeMetric === 'views' || activeMetric === 'both' ? 'text-white' : 'text-white/60 group-hover:text-white/60'}`}>Page Views</span>
          </button>
          <button
            onClick={() => setActiveMetric(activeMetric === 'visitors' ? 'both' : 'visitors')}
            className="flex items-center gap-2 group"
          >
            <div className={`w-2.5 h-2.5 rounded-md transition-colors ${activeMetric === 'visitors' || activeMetric === 'both' ? 'bg-white' : 'bg-zinc-800 border border-white/10'}`}></div>
            <span className={`text-[9px] font-sans font-medium transition-colors ${activeMetric === 'visitors' || activeMetric === 'both' ? 'text-white' : 'text-white/60 group-hover:text-white/60'}`}>Uniq. Visitors</span>
          </button>
        </div>

        {/* Chart */}
        <div className="w-full h-[280px] relative mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff9e00" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ff9e00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#71717a', fontWeight: 600, fontFamily: 'monospace' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#71717a', fontWeight: 600, fontFamily: 'monospace' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255, 255, 255, 0.05)', strokeWidth: 1 }} />

              {(activeMetric === 'both' || activeMetric === 'views') && (
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Views"
                  stroke="#ff9e00"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  activeDot={{ r: 5, fill: '#ff9e00', stroke: '#000', strokeWidth: 1.5 }}
                />
              )}

              {(activeMetric === 'both' || activeMetric === 'visitors') && (
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                  activeDot={{ r: 5, fill: '#ffffff', stroke: '#000', strokeWidth: 1.5 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
