"use client";

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useAbsoluteNoir, AbsoluteNoirProvider } from './AbsoluteNoirContext';

const ShellContent = ({ children, theme, isMobileView, isCardPreview }: any) => {
    const { selectedMedia, setSelectedMedia } = useAbsoluteNoir();
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll === 'true');

    useEffect(() => {
        if (!isSmoothScroll) return;

        const lenis = new Lenis({
            autoRaf: true,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            infinite: false,
        });

        return () => {
            lenis.destroy();
        };
    }, [isSmoothScroll]);

    // Force strictly monochrome fonts (Inter, Space Mono as default)
    const fontHeading = theme?.fontHeading || 'Inter';
    const fontBody = theme?.fontBody || 'Inter';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };
    
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    return (
        <div className="relative noir-root">
            <main className="relative bg-[#050505] text-white font-sans selection:bg-white selection:text-black @container tracking-tight noir-theme">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .noir-theme { font-family: ${customBodyFont} !important; }
                    .noir-theme .font-sans { font-family: ${customHeadingFont} !important; }
                    .noir-theme .font-mono { font-family: ${customBodyFont} !important; }
                    .noir-theme .font-serif { font-family: ${customHeadingFont} !important; }
                    .noir-theme .font-heading { font-family: ${customHeadingFont} !important; }
                    .noir-theme .font-body { font-family: ${customBodyFont} !important; }
                    @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                    .animate-ticker { animation: ticker 30s linear infinite; }
                    .wire-border-b { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
                    .wire-border-r { border-right: 1px solid rgba(255, 255, 255, 0.1); }
                    .wire-border-t { border-top: 1px solid rgba(255, 255, 255, 0.1); }
                    .wire-border-l { border-left: 1px solid rgba(255, 255, 255, 0.1); }
                    .hover-invert:hover { background-color: white !important; color: black !important; }

                    /* Lenis Smooth Scroll CSS */
                    html.lenis, html.lenis body { height: auto; }
                    .lenis.lenis-smooth { scroll-behavior: auto !important; }
                    .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
                    .lenis.lenis-stopped { overflow: hidden; }
                `}} />

                {children}

            </main>

            {/* Modal rendered OUTSIDE the filtered main so fixed positioning works correctly */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-0 @md:p-10"
                    >
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedMedia(null)}></div>
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-6xl bg-black flex flex-col overflow-hidden border border-white/10 shadow-2xl"
                        >
                            <div className="flex justify-between items-center px-4 py-3 @md:px-6 border-b border-white/10 bg-[#0a0a0a]">
                                <div className="flex flex-col">
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">NOIR_PREVIEW_SYSTEM</span>
                                    <h3 className="font-sans font-black uppercase text-lg @md:text-xl text-white">{selectedMedia.title}</h3>
                                </div>
                                <button onClick={() => setSelectedMedia(null)} className="w-9 h-9 flex items-center justify-center bg-white text-black hover:invert transition-all shrink-0">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div 
                                className="w-full bg-black relative"
                                style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}
                            >
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4 @md:p-12">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl border border-white/20 grayscale-[100%] contrast-[1.4]" />
                                    </div>
                                )}
                            </div>

                            <div className="px-4 py-3 @md:px-6 flex justify-between items-center bg-[#0a0a0a] border-t border-white/10 font-mono text-[10px]">
                                <div className="flex items-center gap-4">
                                    <span className="text-white/40">RESOLUTION: OPTIMIZED</span>
                                    <span className="text-white/40">GRAYSCALE: 100%</span>
                                </div>
                                <button onClick={() => setSelectedMedia(null)} className="text-white hover:underline uppercase tracking-widest">/ EXIT_SYSTEM</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const AbsoluteNoirShell = (props: any) => {
    return (
        <AbsoluteNoirProvider>
            <ShellContent {...props} />
        </AbsoluteNoirProvider>
    );
};
