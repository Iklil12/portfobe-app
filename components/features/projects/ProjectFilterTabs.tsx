"use client";

import React from 'react';

export function ProjectFilterTabs({ state, actions }: { state: any, actions: any }) {
  const { isLoading, items, activeTab } = state;
  const { setActiveTab } = actions;

  if (isLoading && items.length === 0) return null;

  // Hitung jumlah item per kategori
  const counts = {
    all: items.length,
    video: items.filter((p: any) => p.projectType === 'video').length,
    photo: items.filter((p: any) => p.projectType === 'photo').length,
    certificate: items.filter((p: any) => p.projectType === 'certificate').length,
    '3d': items.filter((p: any) => p.projectType === '3d').length,
  };

  const tabs = [
    { id: 'all', label: 'All Data', icon: 'fa-border-all' },
    { id: 'video', label: 'Video', icon: 'fa-play' },
    { id: 'photo', label: 'Foto', icon: 'fa-image' },
    { id: 'certificate', label: 'Sertifikat', icon: 'fa-award' },
    { id: '3d', label: '3D Model', icon: 'fa-cube' }
  ] as const;

  return (
    <div className="relative mb-10">
      {/* Container horizontal scroll untuk mobile */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-4 -mb-4 sm:pb-0 sm:mb-0">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id as keyof typeof counts];

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
      
      {/* Efek Fade di sisi kanan untuk menandakan bisa scroll (Mobile Only) */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FAFAFA] to-transparent pointer-events-none md:hidden"></div>
    </div>
  );
}

