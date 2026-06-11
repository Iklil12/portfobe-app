"use client";

import React, { useState, useRef, useCallback, Suspense } from 'react';
import { LazyImage } from '@/components/ui/LazyImage';
import PortfolioView from '@/components/PortfolioView';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Settings, 
  Sparkles, 
  Lock, 
  Palette, 
  Clock,
  Loader2
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function ThemeGrid({ themes, state, actions }: { themes: any[], state: any, actions: any }) {
    const { currentTheme, favorites = [] } = state;
    const { handleUseTheme, toggleFavorite } = actions;
    const [hoveredThemeId, setHoveredThemeId] = useState<string | null>(null);
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = useCallback((id: string) => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => setHoveredThemeId(id), 80);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => setHoveredThemeId(null), 80);
    }, []);

    const { data: fullProfileData } = useSWR('/api/appearance', fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 60000
    });

    const { data: themeStats } = useSWR<Record<string, number>>('/api/themes/stats', fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 30000
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24 animate-enter" style={{ animationDelay: '140ms' }}>
            {themes.map((theme, index) => {
                const isActive = currentTheme === theme.id;
                const isFavorite = favorites.includes(theme.id);
                const isHovered = hoveredThemeId === theme.id;

                return (
                    <div
                        key={theme.id}
                        onMouseEnter={() => handleMouseEnter(theme.id)}
                        onMouseLeave={handleMouseLeave}
                        className="group flex flex-col gap-3"
                    >
                        {/* 1. IMAGE CONTAINER */}
                        <div className={`relative w-full aspect-[4/3] rounded-none overflow-hidden transition-all duration-300
                            ${isActive ? 'border-2 border-[#ff9e00] scale-[1.01] z-10' :
                                        theme.isAvailable ? 'border border-white/10 hover:border-white/20 hover:-translate-y-1 z-0' :
                                            'border border-white/5 opacity-80 z-0'} 
                        `}>

                            {/* BACKGROUND STATIC IMAGE */}
                            <div className="absolute inset-0 bg-[#050505] overflow-hidden">
                                {theme.img ? (
                                    <LazyImage
                                        src={theme.img}
                                        className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear group-hover:scale-[1.05] ${!theme.isAvailable ? 'blur-[2px] grayscale opacity-40' : ''}`}
                                        alt={theme.name}
                                    />
                                ) : (
                                    theme.content
                                )}
                            </div>

                            {/* HOVER OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-between p-4 pointer-events-none">

                                {/* TOP SECTION: FAVORITE BUTTON */}
                                <div className="flex justify-end pointer-events-auto">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(theme.id); }}
                                        className={`w-8.5 h-8.5 rounded-none flex items-center justify-center transition-all duration-300 border
                                            ${isFavorite
                                                ? 'bg-zinc-900 border-rose-900/40 text-rose-500 scale-105'
                                                : 'bg-zinc-900/90 border-white/10 text-white/40 hover:text-white hover:border-white/20'
                                            }`}
                                        title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                    >
                                        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    </button>
                                </div>

                                {/* BOTTOM SECTION: TITLE & ACTION BUTTON */}
                                <div className="flex justify-between items-end transform translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                                    <span className="text-white font-mono font-bold uppercase tracking-wider text-[11px] truncate pr-4 drop-shadow-md">
                                        {theme.name}
                                    </span>

                                    <button
                                        onClick={() => handleUseTheme(theme.id, theme.name)}
                                        disabled={!theme.isAvailable && !isActive}
                                        className={`px-3.5 py-2 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 active:scale-95
                                            ${isActive
                                                ? 'bg-white text-black hover:bg-zinc-200 border border-transparent'
                                                : theme.isAvailable
                                                    ? 'bg-[#ff9e00] text-black hover:bg-[#ffaa22] border border-transparent'
                                                    : 'bg-zinc-900 text-white/30 cursor-not-allowed border border-white/5'
                                            }
                                        `}
                                    >
                                        {theme.isAvailable ? (
                                            isActive ? (
                                                <> <Settings className="w-3.5 h-3.5" /> Edit </>
                                            ) : (
                                                <> <Sparkles className="w-3.5 h-3.5" /> Use </>
                                            )
                                        ) : (
                                            <span className="text-white/20 italic">Soon</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Coming Soon Badge Overlay */}
                            {!theme.isAvailable && isHovered && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                                    <div className="bg-black/90 border border-white/10 px-5 py-2.5 rounded-none shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
                                        <span className="text-white font-mono font-bold text-[9px] uppercase tracking-widest flex items-center gap-2">
                                            <Lock className="w-3.5 h-3.5 text-[#ff9e00]" />
                                            Coming Soon
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. OUTSIDE FOOTER */}
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2 min-w-0">
                                {/* Creator Avatar */}
                                <div className="w-5 h-5 rounded-none bg-zinc-900 border border-white/10 text-white/50 flex items-center justify-center shrink-0">
                                    <Palette className="w-3 h-3" />
                                </div>

                                {/* Theme Name */}
                                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider truncate">
                                    {theme.name}
                                </span>

                                {/* Badges */}
                                {theme.isPro && (
                                    <span className="bg-[#ff9e00] text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded-none uppercase tracking-wider shrink-0">
                                        Pro
                                    </span>
                                )}
                                {isActive && (
                                    <span className="bg-[#ff9e00]/10 border border-[#ff9e00]/30 text-[#ff9e00] text-[9px] font-mono font-bold px-2 py-0.5 rounded-none uppercase tracking-wider shrink-0">
                                        Aktif
                                    </span>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-3 text-white/40 text-[10px] font-mono shrink-0">
                                <span
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(theme.id); }}
                                    className={`flex items-center gap-1 cursor-pointer transition-colors ${
                                        isFavorite ? 'text-rose-400 hover:text-rose-300' : 'hover:text-rose-400'
                                    }`}
                                    title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                >
                                    <Heart className={`w-3 h-3 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    <span>{(themeStats?.[theme.id] ?? 0).toLocaleString('id-ID')}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 3. PLACEHOLDER / COMING SOON CARD */}
            <div className="group flex flex-col gap-3">
                <div className="relative w-full aspect-[4/3] border border-dashed border-white/10 rounded-none flex flex-col items-center justify-center bg-[#050505] hover:border-white/20 transition-all duration-300 group cursor-default">
                    <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-none flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 text-white/40 group-hover:text-white">
                        <Palette className="w-5 h-5" />
                    </div>
                    <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest text-center leading-relaxed px-6">
                      Lagi Dimasak Oleh<br />Desainer
                    </p>
                </div>

                <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-white/40">
                            <Clock className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-mono font-bold text-white/30 uppercase tracking-wider">Tema Lainnya...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}