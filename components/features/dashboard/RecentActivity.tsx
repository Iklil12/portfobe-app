"use client";

import Link from 'next/link';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';

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

  if (seconds < 60) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days === 1) return 'Kemarin';
  if (days < 7) return `${days} hari yang lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

// --- HELPER: IKON AKTIVITAS ---
function getActivityIcon(actionType: string) {
  const iconMap: Record<string, string> = {
    'UPDATE_AVATAR': 'fa-camera',
    'UPDATE_PROFILE': 'fa-user-edit',
    'ADD_LINK': 'fa-link',
    'UPDATE_LINK': 'fa-link',
    'DELETE_LINK': 'fa-trash-alt',
    'CHANGE_THEME': 'fa-palette',
    'UPLOAD_PROJECT': 'fa-cloud-upload-alt',
    'UPDATE_PROJECT': 'fa-edit',
  };
  if (iconMap[actionType]) return iconMap[actionType];
  if (actionType.includes('LINK')) return 'fa-link';
  if (actionType.includes('THEME')) return 'fa-palette';
  if (actionType.includes('PROJECT')) return 'fa-project-diagram';
  if (actionType.includes('CERTIFICATE')) return 'fa-award';
  return 'fa-check-circle';
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return (
    <AnimateOnScroll>
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
        <Link href="/dashboard/history" className="text-xs font-extrabold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group flex items-center gap-1">
          View All <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
        </Link>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          // SKELETON PREMIUM SHIMMER
          [1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 p-4 items-center">
              <div className="w-12 h-12 rounded-2xl shimmer shrink-0"></div>
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-3.5 shimmer rounded-md w-3/4"></div>
                <div className="h-2.5 shimmer rounded-md w-1/4"></div>
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm font-medium">Belum ada aktivitas baru.</div>
        ) : (
          activities.map((activity, idx) => (
            <AnimateOnScroll key={activity.id} delay={idx * 40}>
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 group cursor-default border border-transparent hover:border-slate-100">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 shadow-sm transition-all group-hover:shadow group-hover:scale-105">
                <i className={`fas ${getActivityIcon(activity.actionType)} text-sm`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {activity.details.split(/"|'/).map((part: string, i: number) =>
                    i % 2 === 0 ? part : <span key={i} className="text-[#ff9e00] font-black underline decoration-2 underline-offset-4">"{part}"</span>
                  )}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{timeAgo(activity.createdAt)}</p>
              </div>
            </div>
            </AnimateOnScroll>
          ))
        )}
      </div>
    </div>
    </AnimateOnScroll>
  );
}
