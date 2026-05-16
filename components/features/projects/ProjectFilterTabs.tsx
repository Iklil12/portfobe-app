"use client";

import React from 'react';

export function ProjectFilterTabs({ state, actions }: { state: any, actions: any }) {
  const { isLoading, items, activeTab } = state;
  const { setActiveTab } = actions;

  if (isLoading && items.length === 0) return null;

  // Kumpulkan semua tag unik dari semua project (bukan sertifikat)
  const allTags = Array.from(new Set(
    items
      .filter((p: any) => p.itemType !== 'certificate')
      .flatMap((p: any) => {
        try {
          return Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags || '[]');
        } catch { return []; }
      })
  )) as string[];

  // Hitung jumlah item per filter
  const counts: Record<string, number> = {
    all: items.length,
    video: items.filter((p: any) => p.projectType === 'video').length,
    photo: items.filter((p: any) => p.projectType === 'photo').length,
    certificate: items.filter((p: any) => p.projectType === 'certificate').length,
    '3d': items.filter((p: any) => p.projectType === '3d').length,
  };

  // Hitung per-tag
  allTags.forEach((tag: string) => {
    counts[`tag:${tag}`] = items.filter((p: any) => {
      try {
        const tags = Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags || '[]');
        return tags.includes(tag);
      } catch { return false; }
    }).length;
  });

  const typeTabs = [
    { id: 'all', label: 'All Data', icon: 'fa-border-all' },
    { id: 'video', label: 'Video', icon: 'fa-play' },
    { id: 'photo', label: 'Foto', icon: 'fa-image' },
    { id: 'certificate', label: 'Sertifikat', icon: 'fa-award' },
    { id: '3d', label: '3D Model', icon: 'fa-cube' },
  ] as const;

  return (
    <div className="relative mb-10 space-y-3">
      {/* ROW 1: Filter by type */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {typeTabs.map(tab => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] ?? 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] sm:text-[12px] font-extrabold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap shrink-0
                ${isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
                }`}
            >
              <i className={`fas ${tab.icon} text-[10px] ${isActive ? 'opacity-100' : 'opacity-50'}`}></i>
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-black transition-colors
                ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ROW 2: Filter by tag — hanya muncul jika ada tag */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0 pl-1">
            Tag:
          </span>
          {allTags.map((tag: string) => {
            const tagId = `tag:${tag}`;
            const isActive = activeTab === tagId;
            return (
              <button
                key={tag}
                onClick={() => setActiveTab(isActive ? 'all' : tagId as any)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 border whitespace-nowrap shrink-0
                  ${isActive
                    ? 'bg-[#ff9e00] text-black border-[#ff9e00] shadow-md shadow-[#ff9e00]/20'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-[#ff9e00]/50 hover:text-[#ff9e00] hover:bg-orange-50 shadow-sm'
                  }`}
              >
                <i className={`fas fa-tag text-[8px] ${isActive ? 'opacity-100' : 'opacity-50'}`}></i>
                {tag}
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black
                  ${isActive ? 'bg-black/10' : 'bg-slate-100 text-slate-400'}`}>
                  {counts[tagId] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Efek Fade di sisi kanan untuk menandakan bisa scroll (Mobile Only) */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FAFAFA] to-transparent pointer-events-none md:hidden"></div>
    </div>
  );
}
