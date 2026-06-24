"use client";

import React, { useEffect, useState } from "react";
import { LayoutGrid, Play, Image as ImageIcon, Award, Box, ChevronRight, Hash } from 'lucide-react';

const TYPE_TABS = [
  { id: "all",         label: "All",         icon: LayoutGrid },
  { id: "video",       label: "Video",       icon: Play       },
  { id: "photo",       label: "Photo",       icon: ImageIcon      },
  { id: "certificate", label: "Certificate", icon: Award      },
  { id: "3d",          label: "3D",         icon: Box       },
] as const;

/* ── Skeleton ──────────────────────────────────────────────── */
function FilterSkeleton() {
  return (
    <div className="mb-8 space-y-4 animate-pulse">
      {/* row 1: tab bar skeleton */}
      <div className="inline-flex items-center gap-1 bg-zinc-900 border border-white/10 p-1.5 rounded-none">
        {[88, 72, 60, 96, 52].map((w, i) => (
          <div
            key={i}
            className="h-9 bg-white/5 border border-white/5 rounded-none shrink-0 shimmer"
            style={{ width: w }}
          />
        ))}
      </div>
      {/* row 2: tag chips skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-6 bg-white/5 rounded-none shimmer" />
        <div className="h-3.5 w-px bg-white/10" />
        {[52, 68, 44].map((w, i) => (
          <div
            key={i}
            className="h-7 bg-white/5 border border-white/5 rounded-none shimmer"
            style={{ width: w }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────── */
export function ProjectFilterTabs({ state, actions }: { state: any; actions: any }) {
  const { isLoading, items, activeTab } = state;
  const { setActiveTab } = actions;

  // Entrance animation trigger
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  /* ── loading state ── */
  if (isLoading && items.length === 0) return <FilterSkeleton />;

  /* ── counts ──────────────────────────────────────── */
  const counts: Record<string, number> = {
    all:         items.length,
    video:       items.filter((p: any) => p.projectType === "video").length,
    photo:       items.filter((p: any) => p.projectType === "photo").length,
    certificate: items.filter((p: any) => p.projectType === "certificate").length,
    "3d":        items.filter((p: any) => p.projectType === "3d").length,
  };

  /* ── tags ────────────────────────────────────────── */
  const allTags = Array.from(
    new Set(
      items
        .filter((p: any) => p.itemType !== "certificate")
        .flatMap((p: any) => {
          try { return Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags || "[]"); }
          catch { return []; }
        })
    )
  ) as string[];

  allTags.forEach((tag) => {
    counts[`tag:${tag}`] = items.filter((p: any) => {
      try {
        const t = Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags || "[]");
        return t.includes(tag);
      } catch { return false; }
    }).length;
  });

  /* ── helpers ─────────────────────────────────────── */
  const onTag = (tag: string) => {
    const id = `tag:${tag}`;
    setActiveTab(activeTab === id ? "all" : (id as any));
  };

  /* ── render ──────────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes filterFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .filter-enter      { animation: filterFadeIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .filter-enter-tags { animation: filterFadeIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) 80ms both; }
        @keyframes scrollHint {
          0%, 100% { transform: translateX(0) translateY(-50%); opacity: 0.5; }
          50%       { transform: translateX(3px) translateY(-50%); opacity: 1; }
        }
        .scroll-hint-icon { animation: scrollHint 1.4s ease-in-out 1.2s 3; }
      `}</style>

      <div className="mb-8 space-y-4">

        {/* ── ROW 1: type tabs — segmented pill ── */}
        <div className="relative">
          {/* scroll hint: right fade + chevron — mobile only */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 md:hidden flex items-center justify-end pr-1.5"
            style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.98) 20%, transparent)' }}
          >
            <ChevronRight className="scroll-hint-icon w-3.5 h-3.5 text-white/40" />
          </div>

          <div
            role="tablist"
            className={`flex items-center gap-1 bg-zinc-900 border border-white/10 p-1.5
              overflow-x-auto hide-scrollbar w-full md:w-auto md:inline-flex rounded-none
              ${visible ? "filter-enter" : "opacity-0"}`}
          >
          {TYPE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count    = counts[tab.id] ?? 0;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2
                  px-4 py-2.5 rounded-none
                  text-[11px] font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0
                  transition-all duration-200 select-none
                  ${isActive
                    ? "bg-zinc-800 text-white border border-white/10 shadow-sm"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#ff9e00]" : "text-white/30"}`} />
                {tab.label}
                {count > 0 && (
                  <span className={`
                    text-[9px] font-mono font-bold min-w-[18px] h-[18px] px-1.5 rounded-none
                    inline-flex items-center justify-center leading-none
                    ${isActive ? "bg-white/10 text-white" : "bg-white/5 text-white/40"}
                  `}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          </div>{/* end tablist */}
        </div>{/* end relative wrapper */}

        {/* ── ROW 2: tag chips ── */}
        {allTags.length > 0 && (
          <div className={`flex items-center gap-2 flex-wrap ${visible ? "filter-enter-tags" : "opacity-0"}`}>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/40">
              Tag
            </span>
            <div className="w-px h-3.5 bg-white/10" />
            {allTags.map((tag) => {
              const isActive = activeTab === `tag:${tag}`;
              return (
                <button
                  key={tag}
                  onClick={() => onTag(tag)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-none
                    text-[10px] font-mono font-bold uppercase tracking-wider
                    transition-all duration-150 border
                    ${isActive
                      ? "bg-[#ff9e00]/10 border-[#ff9e00] text-[#ff9e00]"
                      : "bg-zinc-900 text-white/50 border-white/10 hover:border-white/20 hover:text-white"
                    }
                  `}
                >
                  <Hash className={`w-2.5 h-2.5 ${isActive ? "opacity-60" : "opacity-30"}`} />
                  {tag}
                  <span className={`text-[9px] font-mono font-bold ml-0.5 ${isActive ? "text-white" : "text-white/40"}`}>
                    {counts[`tag:${tag}`] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>{/* end mb-8 space-y-3 */}
    </>
  );
}
