"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';
import { useAcidTech, AcidTechProvider } from './AcidTechContext';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

const ShellContent = ({ children, data, theme, isEditor }: any) => {
    const { selectedMedia, setSelectedMedia } = useAcidTech();
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = isValidHexColor(rawThemeColor) ? rawThemeColor : "#00ff00";
    const fontHeading = theme?.fontHeading || "Space Mono";
    const fontBody = theme?.fontBody || "Space Mono";

    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const getHeadingFont = (fontName: string) => {
        if (!fontName) return "'Space Mono', monospace";
        if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant') || fontName.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        if (fontName.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        return "'Space Mono', monospace";
    };
    
    const getBodyFont = (fontName: string) => {
        if (!fontName) return "'Space Mono', monospace";
        if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant') || fontName.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        if (fontName.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        return "'Space Mono', monospace";
    };

    const acidEase = [0.22, 1, 0.36, 1] as any;

    return (
        <div className="w-full min-h-screen bg-black text-[#fafafa] selection:text-black relative text-sm acid-theme font-mono">
            <style dangerouslySetInnerHTML={{
                __html: `
        .acid-theme { font-family: ${getBodyFont(fontBody)} !important; }
        .acid-heading { font-family: ${getHeadingFont(fontHeading)} !important; }
        .acid-body { font-family: ${getBodyFont(fontBody)} !important; }
        .acid-theme .font-sans { font-family: ${getBodyFont(fontBody)} !important; }
        .acid-theme .font-serif { font-family: ${getHeadingFont(fontHeading)} !important; }
        .acid-theme .font-heading { font-family: ${getHeadingFont(fontHeading)} !important; }
        .acid-theme .font-body { font-family: ${getBodyFont(fontBody)} !important; }
        
        .acid-theme ::selection { background: ${themeColor}; color: #000000; }
        
        .acid-text { color: ${themeColor} !important; }
        .acid-bg { background-color: ${themeColor} !important; }
        .acid-border { border-color: ${themeColor} !important; }
        
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 12s linear infinite; }
        
        .project-item { transition: all 0.3s ease; }
        .project-item:hover { background-color: rgba(0, 255, 0, 0.05) !important; border-color: ${themeColor} !important; }
        
        .hover-img { position: absolute; right: 10%; top: 50%; transform: translateY(-50%) scale(0.8) rotate(2deg); opacity: 0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; z-index: 20; width: 300px; aspect-ratio: 16/9; object-fit: cover; border: 1px solid ${themeColor}; box-shadow: 0 0 15px rgba(0,255,0,0.1); }
        .project-item:hover .hover-img { opacity: 1; transform: translateY(-50%) scale(1) rotate(-1deg); }

        .btn-acid { background-color: transparent; color: ${themeColor}; border: 1px solid ${themeColor}; transition: all 0.3s ease; position: relative; overflow: hidden; z-index: 1; }
        .btn-acid::before { content: ''; position: absolute; top: 0; left: 0; width: 0%; height: 100%; background-color: ${themeColor}; transition: all 0.3s ease; z-index: -1; }
        .btn-acid:hover { color: #000 !important; }
        .btn-acid:hover::before { width: 100%; }

        .acid-theme ::-webkit-scrollbar { width: 6px; }
        .acid-theme ::-webkit-scrollbar-track { background: #000000; }
        .acid-theme ::-webkit-scrollbar-thumb { background: #1f1f23; }
      `}} />

            {/* NAVBAR */}
            <div className="sticky top-0 left-0 right-0 z-[99] border-b border-[var(--tc)]/15 bg-black/75 backdrop-blur-md font-mono" style={{ '--tc': themeColor } as React.CSSProperties}>
                <div className="max-w-[90rem] mx-auto px-4 md:px-16 h-16 flex justify-between items-center text-white gap-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: acidEase }}
                        className="font-bold uppercase tracking-wide text-xs sm:text-sm text-[var(--tc)] flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                        <span className="w-1.5 h-1.5 bg-[var(--tc)] rounded-full animate-pulse shrink-0"></span>
                        <span>[ <span className="hidden sm:inline">NODE // </span>{firstName} ]</span>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: acidEase }}
                        className="flex font-bold uppercase tracking-widest gap-2 sm:gap-6 text-[8px] sm:text-[10px] md:text-xs whitespace-nowrap shrink-0"
                    >
                        <a href="#work" className="hover:text-[var(--tc)] transition-colors py-1">[ <span className="hidden sm:inline">01_</span>PROJECTS ]</a>
                        <a href="#testimonials" className="hover:text-[var(--tc)] transition-colors py-1">[ <span className="hidden sm:inline">02_</span>REVIEWS ]</a>
                        <a href="#faq" className="hover:text-[var(--tc)] transition-colors py-1">[ <span className="hidden sm:inline">03_</span>FAQ ]</a>
                    </motion.div>
                </div>
            </div>

            {children}

            {/* ACID MEDIA MODAL */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10 font-mono"
                    >
                        <div className="absolute inset-0 bg-[#000000]/95 hover:cursor-pointer" onClick={() => setSelectedMedia(null)}>
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-color)] to-transparent opacity-50" style={{ '--theme-color': themeColor } as any}></div>
                        </div>

                        <motion.div 
                            initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.02, opacity: 0 }}
                            className="relative w-full max-w-4xl bg-black border border-[var(--theme-color)] flex flex-col overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.1)]"
                            style={{ '--theme-color': themeColor } as any}
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 bg-zinc-950 text-white border-b border-zinc-900 relative z-10 font-mono">
                                <div className="flex flex-col">
                                    <span className="font-bold uppercase tracking-[0.2em] text-[8px] text-[var(--theme-color)] mb-1">SYSTEM://MEDIA_PLAYER</span>
                                    <h3 className="font-bold uppercase tracking-wider text-base md:text-lg">{selectedMedia.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="w-8 h-8 bg-black border border-zinc-800 text-white flex items-center justify-center hover:bg-[var(--theme-color)] hover:text-black transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} bg-black flex items-center justify-center p-1 md:p-3`}
                            >
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[50vh] object-contain grayscale hover:grayscale-0 transition-all duration-500 border border-zinc-900" />
                                    </div>
                                )}
                            </motion.div>

                            {/* Modal Footer */}
                            <div className="p-4 flex justify-between items-center bg-zinc-950 px-6 text-[10px] border-t border-zinc-900">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[var(--theme-color)] animate-pulse rounded-full"></div>
                                    <span className="text-zinc-500 uppercase tracking-widest">LIVE_FEED_STREAMING</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="font-bold uppercase tracking-widest text-zinc-400 hover:text-[var(--theme-color)] transition-colors"
                                >
                                    [ ESC_CLOSE ]
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const AcidTechShell = (props: any) => {
    return (
        <AcidTechProvider>
            <ShellContent {...props} />
        </AcidTechProvider>
    );
};
