//components/features/appearance/ThemeSelectionModal.tsx
"use client";

import React, { useState } from 'react';
import { THEMES_DATA } from '@/lib/themes';
import { ThemeGrid } from '../themes/ThemeGrid';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, Gift, Crown, Heart, X, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface ThemeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: string;
  onSelectTheme: (themeId: string) => void;
  favorites?: string[];
  userPlan?: string;
  onToggleFavorite?: (themeId: string) => void;
}

const FILTER_TABS = [
  { id: 'all',       label: 'All Themes',   icon: LayoutGrid },
  { id: 'free',      label: 'Free',         icon: Gift },
  { id: 'pro',       label: 'Pro',          icon: Crown },
  { id: 'favorites', label: 'Favorit',      icon: Heart },
] as const;

export function ThemeSelectionModal({ 
  isOpen, 
  onClose, 
  activeTheme, 
  onSelectTheme, 
  favorites = [], 
  userPlan = 'FREE',
  onToggleFavorite
}: ThemeSelectionModalProps) {
  const [isSwitching, setIsSwitching] = useState(false);
  const [targetTheme, setTargetTheme] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'pro' | 'favorites'>('all');

  // Filter logic
  const availableThemes = THEMES_DATA.filter(t => t.isAvailable !== false);
  const favoriteThemes = THEMES_DATA.filter(t => favorites.includes(t.id));

  const filteredThemes = (() => {
    let list = THEMES_DATA;
    if (activeFilter === 'free')      list = availableThemes.filter(t => !t.isPro);
    else if (activeFilter === 'pro')  list = availableThemes.filter(t => t.isPro);
    else if (activeFilter === 'favorites') list = favoriteThemes;
    
    // Sort: Active theme is placed first
    return [...list].sort((a, b) => {
      if (a.id === activeTheme) return -1;
      if (b.id === activeTheme) return 1;
      return 0;
    });
  })();

  // Mock actions for ThemeGrid
  const actions = {
    handleUseTheme: (themeId: string, themeName: string) => {
      const theme = THEMES_DATA.find(t => t.id === themeId);
      if (theme && !theme.isAvailable) return;

      setTargetTheme(themeName);
      setIsSwitching(true);
      
      // Simulate smooth transition loading
      setTimeout(() => {
        onSelectTheme(themeId);
        setTimeout(() => {
          setIsSwitching(false);
          setTargetTheme(null);
          onClose();
        }, 600);
      }, 800);
    },
    toggleFavorite: (themeId: string) => {
      if (onToggleFavorite) onToggleFavorite(themeId);
    }
  };

  const state = {
    currentTheme: activeTheme,
    favorites: favorites
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000001] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
            onClick={!isSwitching ? onClose : undefined}
          ></motion.div>

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-6xl h-[90vh] bg-zinc-900 border border-white/10 rounded-none shadow-none overflow-hidden flex flex-col"
          >
            {/* Loading Overlay */}
            <AnimatePresence>
              {isSwitching && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-center"
                >
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                      <div className="absolute inset-0 rounded-none border-4 border-white/5"></div>
                      <div className="absolute inset-0 rounded-none border-4 border-[#ff9e00] border-t-transparent animate-spin"></div>
                      <Sparkles className="w-6 h-6 text-[#ff9e00] animate-pulse" />
                    </div>
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2">Menerapkan Tema...</h3>
                    <p className="text-[10px] font-mono text-white/40 uppercase">Menyesuaikan tata letak untuk {targetTheme}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 shrink-0 bg-zinc-900/90 backdrop-blur-md relative z-40">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Pilih Tema Basis</h2>
                  <p className="text-[10px] text-white/40 font-mono mt-1 uppercase">Eksplorasi berbagai gaya visual untuk portofolio Anda.</p>
                </div>
                <button 
                  onClick={!isSwitching ? onClose : undefined}
                  disabled={isSwitching}
                  className="w-8 h-8 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                {FILTER_TABS.map(tab => {
                  const isActive = activeFilter === tab.id;
                  const TabIcon = tab.icon;
                  const count = tab.id === 'all'
                    ? THEMES_DATA.length
                    : tab.id === 'free'
                    ? THEMES_DATA.filter(t => !t.isPro && t.isAvailable).length
                    : tab.id === 'pro'
                    ? THEMES_DATA.filter(t => t.isPro).length
                    : favorites.length;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap shrink-0
                        ${isActive
                          ? tab.id === 'favorites'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-[#ff9e00] text-black border-[#ff9e00]'
                          : 'bg-zinc-950 text-white/50 border-white/10 hover:border-[#ff9e00] hover:text-white'
                        }`}
                    >
                      <TabIcon className={`w-3.5 h-3.5 ${isActive && tab.id === 'favorites' ? 'text-white' : tab.id === 'pro' && isActive ? 'text-black' : ''}`} />
                      <span>{tab.label}</span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none ${isActive ? 'bg-black/20 text-black' : 'bg-zinc-900 border border-white/10 text-white/40'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative z-30">
              {filteredThemes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center mb-6">
                    <AlertCircle className="w-6 h-6 text-white/30" />
                  </div>
                  <p className="font-mono font-bold text-white text-xs uppercase tracking-wider mb-1">
                    {activeFilter === 'favorites' ? 'Belum ada favorit' : 'Tidak ada tema'}
                  </p>
                  <p className="text-white/40 text-[10px] font-mono max-w-[240px] mx-auto uppercase tracking-wide">
                    {activeFilter === 'favorites'
                      ? 'Klik ikon ♡ pada tema untuk menyimpannya.'
                      : 'Coba filter lain.'}
                  </p>
                </div>
              ) : (
                <ThemeGrid themes={filteredThemes} state={state} actions={actions} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
