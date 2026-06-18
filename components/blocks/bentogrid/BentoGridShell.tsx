"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export const BentoGridContext = React.createContext<any>(null);

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export function BentoGridShell({ data, theme, children, isMobileView, isCardPreview, isEditor }: any) {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);

    // Escape key to close media
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedMedia) {
                setSelectedMedia(null);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [selectedMedia]);

    // Theme Setup
    const rawHighlightColor = theme?.themeColor || '#ff0055';
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#ff0055';

    // Font Sync
    const fontHeading = theme?.fontHeading || 'Plus Jakarta Sans';
    const fontBody = theme?.fontBody || 'Plus Jakarta Sans';
    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return "'Plus Jakarta Sans', sans-serif";
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const cardStyle = theme?.cardStyle || 'flat';

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 0, 85';
    };

    return (
        <BentoGridContext.Provider value={{ selectedMedia, setSelectedMedia, highlightColor }}>
            <main className={`min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-white/20 overflow-x-hidden p-4 @md:p-6 @lg:p-8 bento-theme @container flex flex-col gap-4 @lg:gap-6 w-full max-w-[1800px] mx-auto`}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .bento-theme { font-family: ${customBodyFont}; }
                        .bento-theme *:not(i) { font-family: ${customBodyFont}; }
                        .bento-theme .custom-heading { font-family: ${customHeadingFont} !important; }
                        .bento-theme .custom-body { font-family: ${customBodyFont} !important; }
                        
                        .bento-card {
                        background-color: ${cardStyle === 'hard-shadow' || cardStyle === 'hard' ? '#1a1a1d' : cardStyle === 'soft-shadow' || cardStyle === 'soft' ? '#121214' : '#121214'};
                        border: ${cardStyle === 'hard-shadow' || cardStyle === 'hard' ? '2px solid white' : cardStyle === 'soft-shadow' || cardStyle === 'soft' ? '1px solid transparent' : '1px solid rgba(255,255,255,0.06)'};
                        border-radius: ${theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? '0' : theme?.buttonShape === 'pill' ? '32px' : '24px'};
                        box-shadow: ${cardStyle === 'hard-shadow' || cardStyle === 'hard' ? '6px 6px 0 0 white' : cardStyle === 'soft-shadow' || cardStyle === 'soft' ? '0 20px 50px rgba(0,0,0,0.5)' : 'inset 0 1px 1px rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.5)'};
                        overflow: hidden;
                        position: relative;
                        transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                        }
                        .bento-card:hover {
                        border-color: rgba(255,255,255,0.15);
                        transform: translateY(-4px);
                        box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.6);
                        }
                        
                        .bento-card-colored {
                        background-color: var(--hl);
                        color: #000;
                        border: none;
                        box-shadow: inset 0 2px 4px rgba(255,255,255,0.3), 0 10px 30px rgba(0,0,0,0.5);
                        }
                        .bento-card-colored:hover {
                        transform: translateY(-4px) scale(1.02);
                        box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 20px 40px rgba(var(--hl-rgb), 0.4);
                        }
                
                        .scroller {
                        max-width: 100%;
                        overflow: hidden;
                        -webkit-mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
                        mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
                        }
                        .scroller__inner {
                        display: flex;
                        width: max-content;
                        animation: ${isCardPreview ? 'none' : 'scroll 25s linear infinite'};
                        }
                        .scroller__inner:hover { animation-play-state: paused; }
                        @keyframes scroll { to { transform: translateX(-50%); } }
                    `
                }} />

                <div style={{ '--hl': highlightColor, '--hl-rgb': hexToRgb(highlightColor) } as React.CSSProperties} className="contents">
                    {children}
                </div>

                <AnimatePresence>
                    {selectedMedia && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
                        >
                            <div className="absolute inset-0 bg-[#09090b]/90 backdrop-blur-xl" onClick={() => setSelectedMedia(null)}></div>
                            <motion.div
                                initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                                className="relative w-full max-w-6xl bento-card flex flex-col overflow-hidden rounded-[32px] !border-white/10"
                                style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                            >
                                <div className="flex justify-between items-center px-5 py-3 @md:px-8 border-b border-white/5 bg-[#121214]">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">Now Playing</span>
                                        <h3 className="text-lg @md:text-xl font-black text-white leading-tight">{selectedMedia.title}</h3>
                                    </div>
                                    <button onClick={() => setSelectedMedia(null)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shrink-0">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                <div 
                                    className="w-full bg-black"
                                    style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}
                                >
                                    {selectedMedia.type === 'video' ? (
                                        <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                    ) : (
                                        <div className="w-full flex items-center justify-center p-4 @md:p-10">
                                            <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </BentoGridContext.Provider>
    );
}
