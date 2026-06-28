import React, { useState, useEffect } from 'react';
import { TooltipContentProps } from 'recharts';
import { Globe, MessageSquare, Play, Link2 } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon, TwitterIcon } from '@/shared/ui/Icons';

export function AnimatedCounter({ value, duration = 1200 }: { value: number | string, duration?: number }) {
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

export const getSourceIcon = (name: string) => {
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
      return <Link2 className="w-3.5 h-3.5 text-white/60" />;
  }
};

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`shimmer-dark rounded-md ${className}`} />;
}

export interface CustomTooltipProps extends TooltipContentProps<number, string> {
  isHourly?: boolean;
}

export const CustomAreaTooltip = ({ active, payload, label, isHourly }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-md shadow-2xl px-4 py-3 min-w-[140px] font-sans">
      <p className="text-[9px] font-medium text-white/60 mb-2">
        {isHourly ? `Time: ${label}` : label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-md" style={{ backgroundColor: entry.color }} />
              <span className="text-[10px] font-medium text-white/70 capitalize">{entry.name}</span>
            </div>
            <span className="text-xs font-medium text-white">{entry.value?.toLocaleString() || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
