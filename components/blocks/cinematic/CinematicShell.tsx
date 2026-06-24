"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';
import { useCinematic, CinematicProvider } from './CinematicContext';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

const ShellContent = ({ children, theme }: any) => {
    const { selectedMedia, setSelectedMedia } = useCinematic();
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const rawThemeColor = theme?.themeColor || "#ffffff";
    const themeColor = isValidHexColor(rawThemeColor) ? rawThemeColor : "#ff9e00";
    const fontHeading = theme?.fontHeading || "Inter";
    const fontBody = theme?.fontBody || "Inter";
    const buttonShape = theme?.buttonShape || 'hard';

    const getFontFamily = (fontName: string) => {
        if (!fontName) return "'Inter', sans-serif";
        if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };

    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-3xl' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';

    return (
        <div className={`w-full min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black relative text-sm cinematic-theme`}>
            <style dangerouslySetInnerHTML={{
                __html: `
        .cinematic-theme { font-family: ${customBodyFont} !important; }
        .cine-heading { font-family: ${customHeadingFont} !important; }
        .cine-body { font-family: ${customBodyFont} !important; }
        .cinematic-theme .font-sans { font-family: ${customBodyFont} !important; }
        .cinematic-theme .font-serif { font-family: ${customHeadingFont} !important; }
        .cinematic-theme .font-heading { font-family: ${customHeadingFont} !important; }
        .cinematic-theme .font-body { font-family: ${customBodyFont} !important; }
        .cine-accent { color: ${themeColor} !important; }
        .cine-border-accent:hover { border-color: ${themeColor} !important; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 10s linear infinite; }
        .project-row { transition: all 0.4s ease; border-bottom: 1px solid #1f1f1f; }
        .project-row:hover { background-color: #111; padding-left: 1rem; padding-right: 1rem; border-color: ${themeColor}; }
        .award-row { transition: all 0.3s ease; }
        .award-row:hover { color: ${themeColor}; border-color: ${themeColor}; }
        .cinematic-theme ::-webkit-scrollbar { width: 4px; }
        .cinematic-theme ::-webkit-scrollbar-track { background: #0a0a0a; }
        .cinematic-theme ::-webkit-scrollbar-thumb { background: #333; }
      `}} />

            {children}

            {/* CINEMATIC MEDIA MODAL */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-0 @md:p-10"
                    >
                        {/* Immersive Blackout */}
                        <div className="absolute inset-0 bg-black/98" onClick={() => setSelectedMedia(null)}></div>

                        <motion.div 
                            initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0 }}
                            className={`relative w-full max-w-6xl bg-black border-y @md:border border-white/10 flex flex-col overflow-hidden ${cardRadiusClass}`}
                        >
                            {/* Theater Header */}
                            <div className="flex justify-between items-center p-6 @md:p-8 border-b border-white/5 relative z-10 bg-black">
                                <div className="flex flex-col">
                                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.5em] text-gray-500 mb-2">Cinematic Preview</span>
                                    <h3 className="cine-heading font-black uppercase tracking-tighter text-2xl @md:text-4xl text-white">{selectedMedia.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className={`w-12 h-12 flex items-center justify-center bg-white text-black hover:bg-gray-200 transition-colors ${radiusClass}`}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Widescreen Player */}
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} bg-black flex items-center justify-center`}
                            >
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-4">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[55vh] object-contain shadow-[0_0_50px_rgba(255,255,255,0.1)]" />
                                    </div>
                                )}
                            </motion.div>

                            {/* Minimal Bottom Bar */}
                            <div className="p-4 flex justify-between items-center bg-black px-8">
                                <div className="flex items-center gap-2 opacity-30">
                                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-white">Playback_Active</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="cine-body text-[9px] font-bold uppercase tracking-[0.5em] text-white/40 hover:text-white transition-colors"
                                >
                                    CLOSE_THEATER
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const CinematicShell = (props: any) => {
    return (
        <CinematicProvider>
            <ShellContent {...props} />
        </CinematicProvider>
    );
};
