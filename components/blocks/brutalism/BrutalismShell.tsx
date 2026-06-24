"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export const BrutalismContext = React.createContext<any>(null);

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export function BrutalismShell({ data, theme, children, isMobileView, isCardPreview, isEditor }: any) {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedMedia) {
                setSelectedMedia(null);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [selectedMedia]);

    const rawThemeColor = theme?.themeColor || "#000000";
    const themeColor = isValidHexColor(rawThemeColor) ? rawThemeColor : "#ff3300";
    const fontHeading = theme?.fontHeading || "Space Mono";
    const fontBody = theme?.fontBody || "Space Mono";

    const getFontFamily = (fontName: string) => {
        if (fontName === 'sans-serif' || fontName === 'Inter') return "'Inter', sans-serif";
        return "'Space Mono', monospace";
    };

    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';

    const strokeWidth = "border-[3px] border-black";

    const hardShadow = cardStyle === 'flat' ? 'shadow-none' :
        (cardStyle === 'soft-shadow' || cardStyle === 'soft') ? 'shadow-xl' :
            'shadow-[6px_6px_0px_0px_#000]';

    const hardShadowHover = cardStyle === 'flat' ? 'hover:bg-black hover:text-white transition-colors' :
        (cardStyle === 'soft-shadow' || cardStyle === 'soft') ? 'hover:shadow-2xl hover:-translate-y-1 transition-all' :
            'hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all';

    const radiusClass = buttonShape === 'pill' ? 'rounded-full' :
        buttonShape === 'rounded' ? 'rounded-2xl' :
            'rounded-none';

    return (
        <BrutalismContext.Provider value={{ selectedMedia, setSelectedMedia, themeColor, strokeWidth, hardShadow, hardShadowHover, radiusClass }}>
            <main className={`relative w-full min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-black selection:text-white @container overflow-x-hidden brutal-theme flex flex-col ${isCardPreview ? '' : 'p-0 @sm:p-6'}`} style={{ '--hl': themeColor } as React.CSSProperties}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .brutal-theme { font-family: ${customBodyFont} !important; }
                    .brutal-theme .custom-heading { font-family: ${customHeadingFont} !important; }
                    .brutal-theme .custom-body { font-family: ${customBodyFont} !important; }
                    .brutal-theme .font-sans { font-family: ${customBodyFont} !important; }
                    .brutal-theme .font-serif { font-family: ${customHeadingFont} !important; }
                    .brutal-theme .font-heading { font-family: ${customHeadingFont} !important; }
                    .brutal-theme .font-body { font-family: ${customBodyFont} !important; }
                    .brutal-theme *:not(i) { font-family: inherit; }
                    
                    .brutal-theme::-webkit-scrollbar { width: 10px; border-left: 3px solid black; }
                    .brutal-theme::-webkit-scrollbar-track { background: #f4f4f0; }
                    .brutal-theme::-webkit-scrollbar-thumb { background: black; }

                    @keyframes brutal-marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .brutal-theme .animate-marquee { animation: ${isCardPreview ? 'none' : 'brutal-marquee 45s linear infinite'}; }

                    .brutal-theme .brutal-hover-invert:hover {
                        background-color: black !important;
                        color: white !important;
                    }

                    .brutal-theme-item {
                        transition: none !important;
                    }
                    `
                }} />

                <div className={`w-full max-w-[1700px] mx-auto bg-white border-y-[3px] @sm:border-[3px] border-black shadow-none @sm:${hardShadow} relative z-10 flex flex-col`}>
                    <div className="absolute -top-3 -left-3 text-xl font-bold font-mono hidden @sm:block">+</div>
                    <div className="absolute -top-3 -right-3 text-xl font-bold font-mono hidden @sm:block">+</div>
                    <div className="absolute -bottom-3 -left-3 text-xl font-bold font-mono hidden @sm:block">+</div>
                    <div className="absolute -bottom-3 -right-3 text-xl font-bold font-mono hidden @sm:block">+</div>

                    {children}
                </div>

                {/* BRUTAL MEDIA MODAL */}
                <AnimatePresence>
                    {selectedMedia && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] flex items-center justify-center p-4 @md:p-10"
                        >
                            <div className="absolute inset-0 bg-[#f4f4f0]/90 backdrop-blur-sm" onClick={() => setSelectedMedia(null)}></div>

                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, rotate: -1 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.9, opacity: 0, rotate: 1 }}
                                className={`relative w-full max-w-5xl bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_#000] flex flex-col overflow-hidden ${radiusClass}`}
                            >
                                <div className="flex justify-between items-center p-4 @md:p-8 border-b-[4px] border-black bg-[var(--hl)] text-black relative z-10">
                                    <div className="flex flex-col">
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] bg-black text-white px-2 py-0.5 w-max mb-2">RECORD_VIEWER</span>
                                        <h3 className="custom-heading font-black uppercase tracking-tighter text-2xl @md:text-4xl">{selectedMedia.title}</h3>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedMedia(null)}
                                        className="w-14 h-14 bg-black text-white flex items-center justify-center hover:bg-white hover:text-black border-l-[4px] border-black transition-none group"
                                    >
                                        <i className="fas fa-times text-xl group-hover:rotate-90 transition-transform duration-200"></i>
                                    </button>
                                </div>

                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                    className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} bg-gray-100 flex items-center justify-center p-4 border-b-[4px] border-black`}
                                >
                                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>
                                    
                                    {selectedMedia.type === 'video' ? (
                                        <div className={`w-full h-full border-[4px] border-black ${hardShadow} bg-black`}>
                                            <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                        </div>
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center bg-white border-[4px] border-black ${hardShadow}`}>
                                            <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[50vh] object-contain grayscale hover:grayscale-0 transition-all duration-500 p-2" />
                                        </div>
                                    )}
                                </motion.div>

                                <div className="p-4 flex justify-between items-center bg-white px-6 @md:px-10 font-mono">
                                    <div className="flex items-center gap-4 hidden @md:flex">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">BUFFERING_READY</span>
                                        <div className="w-20 h-2 bg-gray-200 border border-black">
                                            <div className="w-3/4 h-full bg-black"></div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedMedia(null)}
                                        className="text-[10px] font-bold uppercase tracking-[0.5em] text-black hover:bg-black hover:text-white px-4 py-2 transition-none border-2 border-transparent hover:border-black"
                                    >
                                        DISCONNECT_X
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </BrutalismContext.Provider>
    );
}
