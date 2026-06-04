"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { EditableText } from '@/components/ui/EditableText';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export function MonolithShell({ 
    children, 
    data, 
    theme, 
    isMobileView = false, 
    isCardPreview = false, 
    isEditor = false,
    selectedMedia,
    setSelectedMedia 
}: any) {
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const userEmail = data?.email || data?.user?.email || `hello@username.com`;

    // Warna Aksen
    const rawHighlightColor = theme?.themeColor || '#ff3366';
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#ff3366';

    // Font Sync
    const fontHeading = theme?.fontHeading || 'Playfair Display';
    const fontBody = theme?.fontBody || 'Inter';
    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const buttonShape = theme?.buttonShape || 'rounded';
    const radiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';
    const cardRadiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-[40px]' : 'rounded-2xl';
    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#111111] shadow-[0_30px_60px_rgba(255,255,255,0.03)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[6px_6px_0_0_rgba(255,255,255,0.2)]' : 'bg-[#080808] border border-white/10 hover:border-white/30';

    const cinematicEase = [0.22, 1, 0.36, 1] as any;

    return (
        <div className="w-full bg-[#050505] text-[#f4f4f5] selection:bg-[var(--hl)] selection:text-white overflow-x-hidden @container monolith-theme" style={{ '--hl': highlightColor } as React.CSSProperties}>
            <style dangerouslySetInnerHTML={{
                __html: `
        .monolith-theme .font-serif { font-family: ${customHeadingFont}; }
        .monolith-theme .font-sans { font-family: ${customBodyFont}; }
        .monolith-theme .custom-heading { font-family: ${customHeadingFont} !important; }
        .monolith-theme .custom-body { font-family: ${customBodyFont} !important; }

        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 25s linear infinite; }

        .text-outline {
            color: transparent;
            -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6);
        }
        .text-outline-black {
            color: transparent;
            -webkit-text-stroke: 1px rgba(0, 0, 0, 0.3);
        }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; }
        .snap-item { scroll-snap-align: center; }
      `}} />

            {/* FLOATING NAVBAR */}
            <nav className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} top-0 left-0 w-full z-[200] mix-blend-difference flex justify-between items-center pointer-events-none px-6 py-6 @md:px-12`}>
                <div className="font-sans font-bold tracking-widest uppercase text-sm pointer-events-auto">
                    {firstName}<span className="text-[var(--hl)]">.</span>
                </div>
                <div className={`hidden @md:flex items-center gap-8 font-sans text-sm font-medium pointer-events-auto`}>
                    <a href="#about" className="hover:text-[var(--hl)] transition-colors"><EditableText value={theme?.customTexts?.monolith_nav_1 || 'Vision'} field="monolith_nav_1" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></a>
                    <a href="#work" className="hover:text-[var(--hl)] transition-colors"><EditableText value={theme?.customTexts?.monolith_nav_2 || 'Archive'} field="monolith_nav_2" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></a>
                    <a href="#awards" className="hover:text-[var(--hl)] transition-colors"><EditableText value={theme?.customTexts?.monolith_nav_3 || 'Honors'} field="monolith_nav_3" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></a>
                </div>
            </nav>

            {/* FLOATING ACTION BUTTON */}
            <a href={`mailto:${userEmail}`} className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} z-[200] bg-[var(--hl)] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer group bottom-4 right-4 w-12 h-12 @md:bottom-12 @md:right-12 @md:w-24 @md:h-24`}>
                <span className={`font-sans font-bold text-black uppercase tracking-widest text-center leading-tight text-[7px] @md:text-[10px]`}>
                    <EditableText value={theme?.customTexts?.monolith_fab_1 || "Let's"} field="monolith_fab_1" entity="appearance" isEditor={isEditor} as="span" maxLength={10} /><br/>
                    <EditableText value={theme?.customTexts?.monolith_fab_2 || "Talk"} field="monolith_fab_2" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                </span>
                <span className="absolute inset-0 rounded-full bg-[var(--hl)] animate-ping opacity-20 pointer-events-none"></span>
            </a>

            {/* CONTENT */}
            {children}

            {/* UNIVERSAL MEDIA MODAL */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-0 @md:p-12"
                    >
                        <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl" onClick={() => setSelectedMedia && setSelectedMedia(null)}></div>
                        
                        <motion.div 
                            initial={{ y: 100, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6, ease: cinematicEase }}
                            className={`relative w-full max-w-7xl flex flex-col overflow-hidden ${cardRadiusClass} ${cardStyleClassDark} shadow-[0_50px_100px_rgba(0,0,0,0.8)]`}
                        >
                            <div className="flex justify-between items-center px-6 py-3 @md:px-10 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">Monolith_Vault</span>
                                    <h3 className="font-serif text-xl @md:text-2xl text-white italic">{selectedMedia.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia && setSelectedMedia(null)} 
                                    className="w-10 h-10 @md:w-12 @md:h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 shrink-0"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div 
                                className="w-full bg-black relative"
                                style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4 @md:p-12">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-2xl border border-white/10" />
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-3 @md:px-8 flex justify-between items-center bg-black/50 border-t border-white/5 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <div className="flex items-center gap-8">
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[var(--hl)]"></span> Cinematic_Feed</span>
                                    <span className="hidden @md:inline">Aspect: Widescreen</span>
                                </div>
                                <button onClick={() => setSelectedMedia && setSelectedMedia(null)} className="text-white hover:text-[var(--hl)] transition-colors tracking-[0.5em]">/ TERMINATE_VIEW</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
