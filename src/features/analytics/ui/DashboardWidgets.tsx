import React from 'react';
import { Eye, User, Clock, LogOut, BarChart3, Trophy, Calendar, FolderOpen, RefreshCw, Lock } from 'lucide-react';
import { AnimatedCounter, SkeletonBlock } from './AnalyticsShared';

export function KpiCards({
  isLoading,
  isUserLoading,
  userPlan,
  stats,
  growth,
  isFree,
  lockedAvgTime,
  lockedBounceRate,
  handleLocked
}: any) {
  const cards = [
    { label: 'Total Views', val: stats.totalViews, icon: Eye, badge: `${growth > 0 ? '+' : ''}${growth}%`, badgeColor: growth >= 0 ? 'bg-[#ff9e00]/10 text-[#ff9e00]' : 'bg-rose-500/10 text-rose-400', locked: false },
    { label: 'Unique Visitors', val: stats.uniqueVisitors, icon: User, badge: 'Est.', badgeColor: 'bg-white/5 text-white/70 border border-white/5', locked: false },
    { label: 'Avg. Time', val: isFree ? lockedAvgTime : stats.avgTime, icon: Clock, badge: 'PRO', badgeColor: 'bg-[#ff9e00] text-black', locked: isFree },
    { label: 'Bounce Rate', val: isFree ? lockedBounceRate : stats.bounceRate, icon: LogOut, badge: 'PRO', badgeColor: 'bg-[#ff9e00] text-black', locked: isFree },
    { label: 'Returning Rate', val: isFree ? '18%' : stats.returningRate, icon: RefreshCw, badge: 'PRO', badgeColor: 'bg-[#ff9e00] text-black', locked: isFree },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5 mb-8">
      {(isLoading || isUserLoading || userPlan === undefined) ? [1, 2, 3, 4, 5].map(i => <SkeletonBlock key={i} className="h-[120px] md:h-[140px]" />) : cards.map((card, i) => {
        const IconComponent = card.icon;
        return (
          <div key={i} onClick={card.locked ? handleLocked : undefined}
            className={`bg-zinc-900/40 border border-white/10 rounded-md p-5 md:p-6 shadow-none hover:border-[#ff9e00]/40 transition-all duration-300 animate-enter flex flex-col justify-between relative overflow-hidden ${card.locked ? 'cursor-pointer' : ''}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {card.locked && (
              <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                <div className="w-8 h-8 bg-zinc-900 text-white border border-white/15 rounded-md flex items-center justify-center mb-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#ff9e00]" />
                </div>
                <span className="text-[10px] font-sans font-medium text-[#ff9e00]">PRO ONLY</span>
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-sans font-medium text-white/70">{card.label}</p>
              <span className={`text-[10px] font-sans font-medium px-1.5 py-0.5 rounded-md border border-white/5 ${card.badgeColor}`}>{card.badge}</span>
            </div>
            <h3 className={`text-3xl md:text-4xl font-mono font-bold text-white tracking-tight leading-none ${card.locked ? 'blur-[4px] opacity-20' : ''}`}>
              <AnimatedCounter value={card.val} duration={1000 + i * 150} />
            </h3>
          </div>
        );
      })}
    </div>
  );
}

export function SecondaryMetricStrip({
  isLoading,
  isUserLoading,
  userPlan,
  isFree,
  lockedAvgDaily,
  avgDaily,
  lockedPeakViews,
  peakEntry,
  lockedPeakDay,
  lockedTotalPeriod,
  totalPeriod,
  chartDataLength,
  galleryClicks,
  handleLocked
}: any) {
  const metrics = [
    { label: 'Daily Average', val: isFree ? lockedAvgDaily : avgDaily, suffix: isFree ? 'views/day' : 'views/day', icon: BarChart3 },
    { label: 'Peak Visits', val: isFree ? lockedPeakViews : peakEntry.views, suffix: isFree ? lockedPeakDay : peakEntry.day, icon: Trophy },
    { label: 'Total Period', val: isFree ? lockedTotalPeriod : totalPeriod, suffix: isFree ? 'in 7 days' : `in ${chartDataLength} days`, icon: Calendar },
    { label: 'Gallery Clicks', val: isFree ? 75 : (galleryClicks || 0), suffix: 'archive visits', icon: FolderOpen },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-8">
      {(isLoading || isUserLoading || userPlan === undefined) ? [1, 2, 3, 4].map(i => <SkeletonBlock key={i} className="h-20" />) : metrics.map((m, i) => {
        const IconComponent = m.icon;
        return (
          <div key={i} onClick={isFree ? handleLocked : undefined}
            className={`bg-zinc-900/40 border border-white/10 rounded-md p-4 md:p-5 shadow-none animate-enter flex items-center gap-3 md:gap-4 relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
            style={{ animationDelay: `${250 + i * 50}ms` }}
          >
            {isFree && (
              <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                <div className="w-7 h-7 bg-zinc-900 border border-white/10 text-white rounded-md flex items-center justify-center mb-1">
                  <Lock className="w-3 h-3 text-[#ff9e00]" />
                </div>
                <span className="text-[10px] font-sans font-medium text-[#ff9e00]">PRO ONLY</span>
              </div>
            )}
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-md bg-zinc-950 border border-white/5 flex items-center justify-center text-white/70 shrink-0">
              <IconComponent className="w-4 h-4 text-[#ff9e00]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-sans font-medium text-white/70 truncate">{m.label}</p>
              <p className={`text-xl md:text-2xl font-mono font-bold text-white tracking-tight leading-tight ${isFree ? 'blur-[5px] opacity-20' : ''}`}>
                <AnimatedCounter value={m.val} />
              </p>
              <p className={`text-[10px] font-sans text-white/70 mt-0.5 ${isFree ? 'blur-[5px] opacity-20' : ''}`}>{m.suffix}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
