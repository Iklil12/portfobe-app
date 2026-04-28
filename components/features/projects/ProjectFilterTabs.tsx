"use client";

import React from 'react';

export function ProjectFilterTabs({ state, actions }: { state: any, actions: any }) {
  const { isLoading, items, activeTab } = state;
  const { setActiveTab } = actions;

  if (isLoading && items.length === 0) return null;

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 animate-enter pb-2 sm:pb-0" style={{animationDelay: '100ms'}}>
      {[
        { id: 'all', label: 'Semua Data', icon: 'fa-border-all' },
        { id: 'video', label: 'Video', icon: 'fa-play' },
        { id: 'photo', label: 'Foto', icon: 'fa-image' },
        { id: 'certificate', label: 'Sertifikat', icon: 'fa-award' }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`whitespace-nowrap shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border ${
            activeTab === tab.id 
              ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800 shadow-sm'
          }`}
        >
          <i className={`fas ${tab.icon} ${activeTab === tab.id ? 'opacity-100' : 'opacity-50'}`}></i>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
