"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/shared/ui/SmoothScroll';
import { THEMES_DATA } from '@/features/themes/config/themesData';
import { LazyImage } from '@/shared/ui/LazyImage';
import { 
  Sparkles,
  Lock,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TemplatesPage() {
  const [hoveredThemeId, setHoveredThemeId] = useState<string | null>(null);

  const filteredThemes = THEMES_DATA;

  return (
    <SmoothScroll>
      <div className="text-white bg-[#050505] font-sans selection:bg-[#ff9e00]/30 selection:text-white overflow-x-clip w-full relative min-h-screen flex flex-col">
        <Navbar isDarkBg={true} />

        <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="text-center mb-16 md:mb-24">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-4">[ ARCHITECTURES ]</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 uppercase">
              Engineered for <span className="text-[#ff9e00]">Brilliance.</span>
            </h1>
            <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed font-mono uppercase tracking-tight">
              Explore our collection of meticulously crafted portfolio themes. 
              Built for performance, designed for impact.
            </p>
          </div>



          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredThemes.map((theme, index) => {
                const isHovered = hoveredThemeId === theme.id;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    key={theme.id}
                    onMouseEnter={() => setHoveredThemeId(theme.id)}
                    onMouseLeave={() => setHoveredThemeId(null)}
                    className="group flex flex-col gap-4"
                  >
                    {/* Image Container */}
                    <div className={`
                      relative w-full aspect-[4/3] rounded-none overflow-hidden transition-all duration-500
                      ${theme.isAvailable ? 'border border-white/10 hover:border-white/30 z-0' : 'border border-white/5 opacity-80 z-0'}
                    `}>
                      <div className="absolute inset-0 bg-[#050505] overflow-hidden">
                        {theme.img ? (
                          <LazyImage
                            src={theme.img}
                            className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear group-hover:scale-[1.05] ${!theme.isAvailable ? 'blur-[2px] grayscale opacity-40' : ''}`}
                            alt={theme.name}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                             No Image
                          </div>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-5 pointer-events-none">
                        <div className="flex justify-between items-end transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                          <span className="text-white font-mono font-bold uppercase tracking-wider text-xs truncate pr-4 drop-shadow-md">
                            {theme.name}
                          </span>

                          <div className="flex items-center gap-2">
                            {theme.isAvailable ? (
                              <>
                                <Link
                                  href={`/templates/${theme.id}`}
                                  className="px-3 py-2.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 active:scale-95 bg-black/50 text-white hover:bg-white hover:text-black backdrop-blur-md border border-white/20"
                                >
                                  Preview
                                </Link>
                                <Link
                                  href={`/register?theme=${theme.id}`}
                                  className="px-3 py-2.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 active:scale-95 bg-[#ff9e00] text-black hover:bg-white border border-transparent"
                                >
                                  <Sparkles className="w-3.5 h-3.5" /> Use
                                </Link>
                              </>
                            ) : (
                              <button disabled className="px-4 py-2.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 bg-zinc-900 text-white/30 cursor-not-allowed border border-white/5">
                                <span className="text-white/20 italic">Soon</span>
                              </button>
                            )}
                          </div>
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

                    {/* Footer Stats/Info */}
                    <div className="flex justify-between items-start px-1">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-none bg-zinc-900 border border-white/10 text-white/50 flex items-center justify-center shrink-0">
                            <Palette className="w-3 h-3" />
                          </div>
                          <span className="text-sm font-mono font-bold text-white uppercase tracking-wider truncate">
                            {theme.name}
                          </span>
                          {theme.isPro && (
                            <span className="bg-[#ff9e00] text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded-none uppercase tracking-wider shrink-0">
                              Pro
                            </span>
                          )}
                        </div>
                        <p className="text-white/40 text-[11px] font-sans leading-relaxed line-clamp-2 pr-4">
                          {theme.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
