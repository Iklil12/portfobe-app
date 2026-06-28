"use client";

import { useEffect, useState } from "react";

interface AnnouncementBannerProps {
  announcements?: any[];
  userPlan?: string;
}

export function GlobalAnnouncementBanner({ announcements, userPlan }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("dismissedAnnouncements");
      if (stored) {
        setDismissed(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    try {
      sessionStorage.setItem("dismissedAnnouncements", JSON.stringify(newDismissed));
    } catch (e) {}
  };

  // Filter: hanya tampilkan yang channel BANNER atau BOTH, dan cocok dengan plan user
  const bannerItems = (announcements || []).filter((a: any) => {
    const ch = a.channel || 'BOTH';
    const tp = a.targetPlan || 'ALL';
    const channelMatch = ch === 'BANNER' || ch === 'BOTH';
    const planMatch = tp === 'ALL' || tp === (userPlan || 'FREE');
    return channelMatch && planMatch && !dismissed.includes(a.id);
  });

  if (bannerItems.length === 0) return null;

  return (
    <div className="flex flex-col w-full z-[60] relative">
      {bannerItems.map((item: any) => {
        let style = "bg-blue-500/10 border-b border-blue-500/20";
        let iconClass = "fa-solid fa-info-circle text-blue-400";
        
        if (item.type === "WARNING") {
          style = "bg-amber-500/10 border-b border-amber-500/20";
          iconClass = "fa-solid fa-triangle-exclamation text-amber-400";
        } else if (item.type === "DANGER") {
          style = "bg-rose-500/10 border-b border-rose-500/20";
          iconClass = "fa-solid fa-circle-exclamation text-rose-400";
        } else if (item.type === "SUCCESS") {
          style = "bg-emerald-500/10 border-b border-emerald-500/20";
          iconClass = "fa-solid fa-circle-check text-emerald-400";
        }

        return (
          <div key={item.id} className={`w-full py-3 px-4 sm:px-6 flex items-center justify-between gap-4 ${style} relative overflow-hidden transition-all duration-300`}>
            
            <div className="flex items-center gap-3 relative z-10 w-full max-w-7xl mx-auto justify-center">
              <div className="p-1.5 bg-zinc-950 rounded-md w-7 h-7 flex items-center justify-center shrink-0 border border-white/10 shadow-none">
                <i className={`${iconClass} text-[11px]`} />
              </div>
              <span className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 tracking-wider">
                <strong className="tracking-widest uppercase font-mono text-[9px] font-medium bg-zinc-950 px-2 py-1 rounded-md border border-white/10 shrink-0 text-center text-white">
                  {item.title}
                </strong> 
                <span className="font-mono text-[10px] sm:text-[11px] uppercase text-white/70">{item.message}</span>
              </span>
            </div>

            <button 
              onClick={() => handleDismiss(item.id)}
              className="relative z-10 w-7 h-7 flex items-center justify-center bg-zinc-950 hover:bg-zinc-900 rounded-md transition-all shrink-0 border border-white/10 hover:border-white/20 text-white/50 hover:text-white"
              aria-label="Close Announcement"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
