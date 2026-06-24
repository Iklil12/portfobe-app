"use client";

import React from 'react';
import { useThemes } from '@/features/themes';
import { ThemeSkeleton } from '@/features/themes';
import { ThemeHeader } from '@/features/themes';
import { ThemeGrid } from '@/features/themes';
import { ProBanner } from '@/features/themes';
import { 
  LayoutGrid, 
  Gift, 
  Crown, 
  Heart, 
  Ghost, 
  HeartOff, 
  ChevronRight 
} from 'lucide-react';

const FILTER_TABS = [
  { id: 'all',       label: 'All Themes',   icon: LayoutGrid },
  { id: 'free',      label: 'Free',         icon: Gift },
  { id: 'pro',       label: 'Pro',          icon: Crown },
  { id: 'favorites', label: 'Favorites',    icon: Heart },
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
    let list = themes;
    if (activeFilter === 'free')      list = availableThemes.filter(t => !t.isPro);
    else if (activeFilter === 'pro')  list = availableThemes.filter(t => t.isPro);
    else if (activeFilter === 'favorites') list = favoriteThemes;
    
    // Sort: Tema yang sedang aktif berada di urutan pertama
    return [...list].sort((a, b) => {
      if (a.id === state.currentTheme) return -1;
      if (b.id === state.currentTheme) return 1;
      return 0;
    });
  })();

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-[#ff9e00]/30 selection:text-white pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-enter { 
            opacity: 0;
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(40px) scale(0.98); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes scrollHint {
            0%, 100% { transform: translateX(0); opacity: 0.5; }
            50%       { transform: translateX(3px); opacity: 1; }
        }
        .scroll-hint-icon { animation: scrollHint 1.4s ease-in-out 1.2s 3; }
      `}} />

      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        <ThemeHeader state={state} />

        {/* ── TAB FILTER ── */}
        <div className="relative mb-10 animate-enter" style={{ animationDelay: '120ms' }}>
          {/* scroll-hint: right fade + chevron — mobile only */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 md:hidden flex items-center justify-end pr-1.5"
            style={{ background: 'linear-gradient(to left, rgba(9,9,11,0.98) 20%, transparent)' }}
          >
            <ChevronRight className="scroll-hint-icon w-3.5 h-3.5 text-white/40" />
          </div>

          <div
            role="tablist"
            className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-none p-1
              overflow-x-auto hide-scrollbar w-full md:w-auto md:inline-flex"
          >
            {FILTER_TABS.map(tab => {
              const isActive = activeFilter === tab.id;
              const TabIcon = tab.icon;
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
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`
                    relative flex items-center gap-2
                    px-4 py-2.5 rounded-none
                    text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0
                    transition-all duration-200 select-none
                    ${isActive
                      ? 'bg-[#ff9e00] text-black'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <TabIcon className="w-3.5 h-3.5 shrink-0" />
                  {tab.label}
                  {count > 0 && (
                    <span className={`
                      text-[9px] font-mono font-bold min-w-[18px] h-[18px] px-1.5 rounded-none
                      inline-flex items-center justify-center leading-none
                      ${isActive ? 'bg-black/10 text-black' : 'bg-white/5 border border-white/5 text-white/50'}
                    `}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {filteredThemes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 text-white/30">
              {activeFilter === 'favorites' ? (
                <HeartOff className="w-6 h-6" />
              ) : (
                <Ghost className="w-6 h-6" />
              )}
            </div>
            <p className="font-mono font-bold text-white uppercase tracking-wider mb-2">
              {activeFilter === 'favorites' ? 'No favorites yet' : 'No themes'}
            </p>
            <p className="text-white/40 text-xs font-mono max-w-xs">
              {activeFilter === 'favorites'
                ? 'Click the ♡ icon on themes you like to save them here.'
                : 'Try another filter or look out for new theme collections.'}
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