import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Ghost, BarChart3 } from 'lucide-react';
import { SkeletonBlock, CustomAreaTooltip } from './AnalyticsShared';

export function TrafficOverviewChart({ isLoading, isMounted, chartData, range }: any) {
  if (isLoading) {
    return <div className="lg:col-span-2 rounded-none shimmer-dark h-[400px]" />;
  }
  
  return (
    <div className="lg:col-span-2 bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter" style={{ animationDelay: '300ms' }}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Traffic Overview</h3>
          <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">
            {range === '1d' ? 'Hourly — today' : range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'All time'}
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
              <Tooltip content={(props: any) => <CustomAreaTooltip {...props} isHourly={range === '1d'} />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="views" name="Page Views" stroke="#ff9e00" strokeWidth={2} fill="url(#viewsGrad)" dot={false} activeDot={{ r: 4, fill: '#ff9e00', stroke: '#000', strokeWidth: 2 }} animationDuration={1500} />
              <Area type="monotone" dataKey="visitors" name="Uniq. Visitors" stroke="rgba(255,255,255,0.4)" strokeWidth={2} fill="transparent" dot={false} activeDot={{ r: 4, fill: 'rgba(255,255,255,0.4)', stroke: '#000', strokeWidth: 2 }} animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white/20">
            <Ghost className="w-8 h-8 mb-3" />
            <p className="text-[9px] font-mono font-bold tracking-widest uppercase">No traffic data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function DailyVolumeChart({ isLoading, isMounted, chartData, peakEntry }: any) {
  if (isLoading) {
    return <div className="rounded-none shimmer-dark h-[340px]" />;
  }

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-none p-6 md:p-8 shadow-none animate-enter flex flex-col" style={{ animationDelay: '450ms' }}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Daily Volume</h3>
          <p className="text-[9px] font-mono font-bold text-white/30 mt-1 uppercase tracking-widest">Daily distribution</p>
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
                {chartData.map((entry: any, idx: number) => (
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
            <p className="text-[9px] font-mono font-bold tracking-widest uppercase">No data yet</p>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-white/5">
          <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-white/40">
            <span className="w-2.5 h-2.5 bg-[#ff9e00] inline-block" /> Peak
          </span>
          <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-white/40">
            <span className="w-2.5 h-2.5 bg-white inline-block" /> Today
          </span>
          <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-white/40">
            <span className="w-2.5 h-2.5 bg-white/10 inline-block" /> Others
          </span>
        </div>
      )}
    </div>
  );
}
