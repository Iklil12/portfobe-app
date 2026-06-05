"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useAcidTech, AcidTechProvider } from './AcidTechContext';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

const ShellContent = ({ children, data, theme, isEditor }: any) => {
    const { selectedMedia, setSelectedMedia } = useAcidTech();
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const rawThemeColor = theme?.themeColor || "#DFFF00";
    const themeColor = isValidHexColor(rawThemeColor) ? rawThemeColor : "#ff9e00";
    const fontHeading = theme?.fontHeading || "Syne";
    const fontBody = theme?.fontBody || "Space Grotesk";

    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const getHeadingFont = (fontName: string) => {
        if (!fontName) return "'Syne', sans-serif";
        if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant') || fontName.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        if (fontName.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        return "'Syne', sans-serif";
    };
    
    const getBodyFont = (fontName: string) => {
        if (!fontName) return "'Space Grotesk', sans-serif";
        if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant') || fontName.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        if (fontName.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        return "'Space Grotesk', sans-serif";
    };

    const acidEase = [0.22, 1, 0.36, 1] as any;

    return (
        <div className={`w-full min-h-screen bg-[#09090b] text-[#fafafa] selection:text-black relative text-sm acid-theme`}>
            <style dangerouslySetInnerHTML={{
                __html: `
        .acid-heading { font-family: ${getHeadingFont(fontHeading)} !important; }
        .acid-body { font-family: ${getBodyFont(fontBody)} !important; }
        
        .acid-theme ::selection { background: ${themeColor}; color: #000000; }
        
        .acid-text { color: ${themeColor} !important; }
        .acid-bg { background-color: ${themeColor} !important; }
        .acid-border { border-color: ${themeColor} !important; }
        
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 10s linear infinite; }
        
        .project-item { transition: all 0.3s ease; }
        .project-item:hover { background-color: ${themeColor} !important; color: #09090b !important; transform: translateX(10px); border-color: ${themeColor} !important; }
        
        .hover-img { position: absolute; right: 10%; top: 50%; transform: translateY(-50%) scale(0.8) rotate(5deg); opacity: 0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; z-index: 20; width: 300px; aspect-ratio: 16/9; object-fit: cover; border: 4px solid #000; box-shadow: 10px 10px 0px rgba(0,0,0,0.5); }
        .project-item:hover .hover-img { opacity: 1; transform: translateY(-50%) scale(1) rotate(-2deg); }

        .btn-acid { background-color: transparent; color: ${themeColor}; border: 2px solid ${themeColor}; transition: all 0.3s ease; position: relative; overflow: hidden; z-index: 1; }
        .btn-acid::before { content: ''; position: absolute; top: 0; left: 0; width: 0%; height: 100%; background-color: ${themeColor}; transition: all 0.3s ease; z-index: -1; }
        .btn-acid:hover { color: #000 !important; }
        .btn-acid:hover::before { width: 100%; }

        .acid-theme ::-webkit-scrollbar { width: 6px; }
        .acid-theme ::-webkit-scrollbar-track { background: #09090b; }
        .acid-theme ::-webkit-scrollbar-thumb { background: #27272a; }
      `}} />

            {/* NAVBAR */}
            <div className="sticky top-0 left-0 right-0 z-[99] h-0 @container">
                <motion.nav 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: acidEase }}
                    className={`mix-blend-difference flex justify-between items-center p-6 @md:px-12`}
                >
                    <div className={`acid-heading font-extrabold tracking-tighter text-white uppercase text-2xl @md:text-3xl`}>
                        {firstName}<span className="acid-text">.</span>{lastName || 'PORTFO'}
                    </div>
                    <div className={`flex font-bold uppercase tracking-widest text-white acid-body gap-3 text-[9px] @md:gap-8 @md:text-sm`}>
                        <a href="#work" className="hover:text-[var(--theme-color)] transition" style={{ '--theme-color': themeColor } as any}>Index</a>
                        <a href="#awards" className="hover:text-[var(--theme-color)] transition" style={{ '--theme-color': themeColor } as any}>Awards</a>
                    </div>
                </motion.nav>
            </div>

            {children}

            {/* ACID MEDIA MODAL */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
                    >
                        <div className="absolute inset-0 bg-[#09090b]/95" onClick={() => setSelectedMedia(null)}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--theme-color)] to-transparent opacity-50" style={{ '--theme-color': themeColor } as any}></div>
                        </div>

                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, x: -20 }} animate={{ scale: 1, opacity: 1, x: 0 }} exit={{ scale: 1.1, opacity: 0, x: 20 }}
                            className={`relative w-full max-w-5xl bg-[#09090b] border-4 border-white shadow-[10px_10px_0px_var(--theme-color)] flex flex-col overflow-hidden`}
                            style={{ '--theme-color': themeColor } as any}
                        >
                            <div className="flex justify-between items-center p-4 @md:p-8 bg-white text-[#09090b] relative z-10">
                                <div className="flex flex-col">
                                    <span className="font-bold uppercase tracking-[0.3em] acid-body text-[10px] mb-1">SYSTEM://MEDIA_PLAYER</span>
                                    <h3 className="acid-heading font-extrabold uppercase tracking-tighter text-2xl @md:text-4xl">{selectedMedia.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="w-12 h-12 bg-[#09090b] text-white flex items-center justify-center hover:bg-[var(--theme-color)] hover:text-black transition-colors transform -skew-x-12"
                                    style={{ '--theme-color': themeColor } as any}
                                >
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} bg-zinc-900 border-y-4 border-white flex items-center justify-center p-2 @md:p-4`}
                            >
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black/40">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[55vh] object-contain grayscale hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                )}
                            </motion.div>

                            <div className="p-4 flex justify-between items-center bg-[#09090b] px-6 @md:px-10">
                                <div className="flex items-center gap-4 hidden @md:flex">
                                    <div className="w-3 h-3 acid-bg animate-ping"></div>
                                    <span className="acid-body text-[10px] font-bold uppercase tracking-widest text-white/40">Live_Stream_Active</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="acid-body text-[10px] font-bold uppercase tracking-[0.5em] text-white hover:text-[var(--theme-color)] transition-colors"
                                    style={{ '--theme-color': themeColor } as any}
                                >
                                    TERMINATE_PREVIEW [ESC]
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
