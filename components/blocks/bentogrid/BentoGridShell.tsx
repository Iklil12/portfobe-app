"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export const BentoGridContext = React.createContext<any>(null);

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export function BentoGridShell({ data, theme, children, isMobileView, isCardPreview, isEditor }: any) {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    // User Data Extraction
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const firstName = fullName.split(' ')[0];
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;

    return (
        <BentoGridContext.Provider value={{ selectedMedia, setSelectedMedia, highlightColor }}>
            <div className="w-full min-h-screen bg-[#09090b] bento-theme relative text-slate-200" style={{ '--hl': highlightColor, '--hl-rgb': hexToRgb(highlightColor) } as React.CSSProperties}>
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

                        /* Hide scrollbar for Chrome, Safari and Opera */
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        /* Hide scrollbar for IE, Edge and Firefox */
                        .no-scrollbar {
                            -ms-overflow-style: none;  /* IE and Edge */
                            scrollbar-width: none;  /* Firefox */
                        }
                    `
                }} />

                {/* FLOATING NAVBAR */}
                <div className="sticky top-6 z-[99] w-full px-4 max-w-[1800px] mx-auto pointer-events-none mb-6 @md:mb-8">
                    <header 
                        className={`pointer-events-auto mx-auto max-w-[950px] bg-[#09090b]/80 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col p-3 px-5 transition-all duration-300 overflow-hidden`}
                        style={{ 
                            borderRadius: theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? '0' : '24px'
                        }}
                    >
                        {/* Main Bar */}
                        <div className="flex items-center justify-between w-full h-[38px]">
                            {/* Logo */}
                            <div className="flex items-center gap-2 pl-2 shrink-0">
                                <span className="font-mono font-black tracking-wider text-white text-base">
                                    {firstName.toUpperCase()}
                                </span>
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: highlightColor }}></span>
                            </div>

                            {/* Navigation Links (Desktop only) */}
                            <nav className="hidden @md:flex items-center gap-2 text-xs @lg:text-sm font-mono font-bold text-slate-400">
                                <a href="#work" className="hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all">PROJECTS</a>
                                <a href="#about" className="hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all">ABOUT</a>
                                <a href="#experience" className="hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all">EXPERIENCE</a>
                                <a href="#services" className="hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all">SERVICES</a>
                            </nav>

                            {/* Desktop Contact / Active Info */}
                            <div className="hidden @md:flex items-center gap-3 shrink-0">
                                <div className="hidden @lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Active</span>
                                </div>
                                <a 
                                    href={`mailto:${userEmail}`} 
                                    className="bg-white hover:bg-slate-200 text-black text-xs font-mono font-black px-5 py-2.5 transition-all shrink-0"
                                    style={{ borderRadius: theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? '0' : '14px' }}
                                >
                                    CONTACT
                                </a>
                            </div>

                            {/* Mobile Toggle Button */}
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="@md:hidden w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white bg-white/5 border border-white/10 transition-all rounded-full shrink-0"
                            >
                                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-sm`}></i>
                            </button>
                        </div>

                        {/* Collapsible Mobile Menu */}
                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full @md:hidden flex flex-col gap-3 mt-4 pt-4 border-t border-white/10"
                                >
                                    <a 
                                        href="#work" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-slate-300 hover:text-white text-sm font-mono font-bold tracking-wider py-1.5 border-b border-white/5"
                                    >
                                        PROJECTS
                                    </a>
                                    <a 
                                        href="#about" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-slate-300 hover:text-white text-sm font-mono font-bold tracking-wider py-1.5 border-b border-white/5"
                                    >
                                        ABOUT
                                    </a>
                                    <a 
                                        href="#experience" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-slate-300 hover:text-white text-sm font-mono font-bold tracking-wider py-1.5 border-b border-white/5"
                                    >
                                        EXPERIENCE
                                    </a>
                                    <a 
                                        href="#services" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-slate-300 hover:text-white text-sm font-mono font-bold tracking-wider py-1.5 border-b border-white/5"
                                    >
                                        SERVICES
                                    </a>
                                    <a 
                                        href={`mailto:${userEmail}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="bg-white hover:bg-slate-200 text-black text-center text-sm font-mono font-black py-3 mt-2 transition-all w-full block"
                                        style={{ borderRadius: theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? '0' : '12px' }}
                                    >
                                        CONTACT
                                    </a>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </header>
                </div>

                <main className="p-4 @md:p-6 @lg:p-8 flex flex-col gap-4 @lg:gap-6 w-full max-w-[1800px] mx-auto">
                    {children}
                </main>

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
            </div>
        </BentoGridContext.Provider>
    );
}
