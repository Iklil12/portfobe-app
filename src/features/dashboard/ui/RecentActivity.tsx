"use client";

import Link from 'next/link';
import { AnimateOnScroll } from '@/shared/ui/AnimateOnScroll';
import {
  ArrowRight,
  CheckCircle2,
  Link2,
  Palette,
  FolderOpen,
  Award,
  MessageSquare,
  Clock
} from 'lucide-react';

interface RecentActivityProps {
  activities: any[];
  isLoading: boolean;
}

// --- HELPER: FORMAT WAKTU ---
function timeAgo(dateParam: string | Date) {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

// --- HELPER: IKON & WARNA AKTIVITAS ---
function getActivityIcon(actionType: string) {
  if (actionType.includes('LINK')) return <Link2 className="w-3.5 h-3.5" />;
  if (actionType.includes('THEME')) return <Palette className="w-3.5 h-3.5" />;
  if (actionType.includes('PROJECT')) return <FolderOpen className="w-3.5 h-3.5" />;
  if (actionType.includes('CERTIFICATE')) return <Award className="w-3.5 h-3.5" />;
  if (actionType.includes('TESTIMONIAL')) return <MessageSquare className="w-3.5 h-3.5" />;
  return <CheckCircle2 className="w-3.5 h-3.5" />;
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return (
    <AnimateOnScroll delay={200} className="w-full">
      <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded-xl transition-all hover:border-white/10 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-sans font-medium text-white">Recent Activity</h3>
            <p className="text-xs font-sans text-white/50 mt-1">Your change timeline</p>
          </div>
          <Link href="/dashboard/history" className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 bg-[#111111] text-white/70 hover:bg-white/10 hover:text-white transition-all group shadow-sm">
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-2 bottom-4 left-[18px] -translate-x-1/2 w-[1px] bg-white/10 z-0"></div>

          <div className="space-y-6 relative z-10">
            {isLoading ? (
              <div className="absolute inset-0 z-50 bg-zinc-950/40 backdrop-blur-md rounded-md border border-white/10 shimmer" style={{ margin: '-24px -32px' }}></div>
            ) : activities.length === 0 ? (
              <div className="text-center py-10 text-white/60 text-xs rounded-md border border-dashed border-white/10 bg-white/[0.01] font-sans">No recent activity yet.</div>
            ) : (
              activities.slice(0, 5).map((activity, idx) => {
                return (
                  <AnimateOnScroll key={activity.id} delay={idx * 50}>
                    <div className="flex items-start gap-4 group cursor-default relative">
                      <div className="w-9 h-9 shrink-0 rounded-md bg-zinc-900 text-white/80 border border-white/10 flex items-center justify-center relative z-20 shadow-sm">
                        {getActivityIcon(activity.actionType)}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-xs font-sans text-white/80 leading-snug">
                          {activity.details.split(/"|'/).map((part: string, i: number) =>
                            i % 2 === 0 ? part : <span key={i} className="text-[#ff9e00] font-medium">"{part}"</span>
                          )}
                        </p>
                        <p className="text-[9px] font-sans font-medium text-white/60 mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeAgo(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
