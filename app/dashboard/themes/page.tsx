"use client";

import React from 'react';
import { useThemes } from '@/hooks/useThemes';
import { ThemeSkeleton } from '@/components/features/themes/ThemeSkeleton';
import { ThemeHeader } from '@/components/features/themes/ThemeHeader';
import { ThemeGrid } from '@/components/features/themes/ThemeGrid';
import { ProBanner } from '@/components/features/themes/ProBanner';

const FILTER_TABS = [
  { id: 'all',       label: 'All Themes',   icon: 'fa-th-large' },
  { id: 'free',      label: 'Free',         icon: 'fa-gift' },
  { id: 'pro',       label: 'Pro',          icon: 'fa-crown' },
  { id: 'favorites', label: 'Favorit',      icon: 'fa-heart' },
] as const;

export default function ThemesPage() {
  const { state, actions, themes } = useThemes();
  const { activeFilter, favorites } = state;
  const { setActiveFilter } = actions;

  if (state.isLoading) return <ThemeSkeleton />;

  // Filter logic
  const availableThemes = themes.filter(t => t.isAvailable !== false);
  const favoriteThemes = themes.filter(t => favorites.includes(t.id));

  const filteredThemes = (() => {
    if (activeFilter === 'free')      return availableThemes.filter(t => !t.isPro);
    if (activeFilter === 'pro')       return availableThemes.filter(t => t.isPro);
    if (activeFilter === 'favorites') return favoriteThemes;
    return themes; // 'all' — tampilkan semua
  })();

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0;
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(40px) scale(0.98); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-spin-slow { animation: spin 10s linear infinite; }
      `}} />

      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        <ThemeHeader state={state} />

        {/* ── TAB FILTER ── */}
        <div className="relative mb-10">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-4 -mb-4 sm:pb-0 sm:mb-0">
            {FILTER_TABS.map(tab => {
              const isActive = activeFilter === tab.id;
              const count = tab.id === 'all'
                ? themes.length
                : tab.id === 'free'
                ? themes.filter(t => !t.isPro && t.isAvailable).length
                : tab.id === 'pro'
                ? themes.filter(t => t.isPro).length
                : favorites.length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[12px] font-extrabold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap shrink-0
                    ${isActive
                      ? tab.id === 'favorites'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                        : 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <i className={`fas ${tab.icon} text-[10px] ${isActive && tab.id === 'favorites' ? 'text-white' : tab.id === 'pro' && isActive ? 'text-[#ff9e00]' : ''}`}></i>
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-black
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

        {filteredThemes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
              <i className={`fas ${activeFilter === 'favorites' ? 'fa-heart-broken' : 'fa-ghost'} text-3xl text-slate-300`}></i>
            </div>
            <p className="font-extrabold text-slate-700 text-xl mb-2">
              {activeFilter === 'favorites' ? 'Belum ada favorit' : 'Tidak ada tema'}
            </p>
            <p className="text-slate-400 text-sm font-medium">
              {activeFilter === 'favorites'
                ? 'Klik ikon ♡ pada tema yang kamu suka untuk menyimpannya di sini.'
                : 'Coba filter lain atau nantikan koleksi tema terbaru.'}
            </p>
          </div>
        ) : (
          <ThemeGrid themes={filteredThemes} state={state} actions={actions} />
        )}

        <ProBanner actions={actions} />
      </div>
    </main>
  );
}