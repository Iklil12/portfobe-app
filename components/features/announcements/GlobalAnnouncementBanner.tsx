"use client";

import { useEffect, useState } from "react";

interface AnnouncementBannerProps {
  announcements?: any[];
  userPlan?: string;
}

export function GlobalAnnouncementBanner({ announcements, userPlan }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);

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
    <div className="flex flex-col w-full z-50">
      {bannerItems.map((item: any) => {
        let style = "bg-blue-600 text-white border-blue-700";
        let iconClass = "fa-solid fa-info-circle";
        
        if (item.type === "WARNING") {
          style = "bg-amber-500 text-amber-950 border-amber-600";
          iconClass = "fa-solid fa-triangle-exclamation";
        } else if (item.type === "DANGER") {
          style = "bg-red-600 text-white border-red-700";
          iconClass = "fa-solid fa-circle-exclamation";
        } else if (item.type === "SUCCESS") {
          style = "bg-emerald-600 text-white border-emerald-700";
          iconClass = "fa-solid fa-circle-check";
        }

        return (
          <div key={item.id} className={`w-full py-2 px-4 text-sm font-medium flex items-center justify-between gap-3 ${style} shadow-sm relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
            
            <div className="flex items-center gap-3 relative z-10 mx-auto">
              <div className="p-1.5 bg-black/10 rounded-md w-7 h-7 flex items-center justify-center">
                <i className={`${iconClass} text-sm flex-shrink-0`} />
              </div>
              <span className="flex items-center gap-2">
                <strong className="tracking-wide uppercase text-xs opacity-90">{item.title}:</strong> 
                {item.message}
              </span>
            </div>

            <button 
              onClick={() => setDismissed([...dismissed, item.id])}
              className="relative z-10 w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded-md transition-colors"
              aria-label="Tutup Pengumuman"
            >
              <i className="fa-solid fa-xmark text-sm opacity-70 hover:opacity-100" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
