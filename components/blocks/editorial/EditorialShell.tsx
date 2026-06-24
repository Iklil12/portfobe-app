"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditorialProvider, useEditorialMedia } from './EditorialContext';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';
import { EditableText } from '@/shared/ui/EditableText';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export function EditorialShellContent({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false, children }: any) {
    const { selectedMedia, setSelectedMedia } = useEditorialMedia();
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    // Data Extraction
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];

    // Theme Variables
    const fontHeading = theme?.fontHeading || 'Newsreader';
    const fontBody = theme?.fontBody || 'Instrument Sans';
    const cardRadiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[3rem]' : 'rounded-2xl';
    const cardStyle = theme?.cardStyle || 'soft';
    const cardStyleClassLight = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-white shadow-[0_30px_60px_rgba(0,0,0,0.08)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-white border-2 border-[#111] shadow-[8px_8px_0_0_#111]' : 'bg-[#fdfdfc] border border-[rgba(0,0,0,0.08)] shadow-sm';

    const getFontFamily = (f: string) => {
        if (!f) return "'Newsreader', serif";
        if (f.toLowerCase().includes('mono') || f.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f.toLowerCase().includes('serif') || f.toLowerCase().includes('playfair') || f.toLowerCase().includes('newsreader') || f.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
        if (f.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        return `'${f}', sans-serif`;
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const rawHighlightColor = theme?.themeColor || '#2563eb';
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#2563eb';

    const canvasEase = [0.22, 1, 0.36, 1] as any;

    return (
        <div className="w-full bg-[#fdfdfc] text-[#111111] font-sans selection:bg-[var(--hl)] selection:text-white overflow-x-hidden @container editorial-theme" style={{ '--hl': highlightColor } as React.CSSProperties}>
            <style dangerouslySetInnerHTML={{
                __html: `
        .editorial-theme { font-family: ${customBodyFont} !important; }
        .editorial-theme .font-sans { font-family: ${customBodyFont} !important; }
        .editorial-theme .font-serif { font-family: ${customHeadingFont} !important; }
        .editorial-theme .font-heading { font-family: ${customHeadingFont} !important; }
        .editorial-theme .font-body { font-family: ${customBodyFont} !important; }

        /* Custom Scrollbar — scoped ke editorial-theme */
        .editorial-theme ::-webkit-scrollbar { width: 6px; }
        .editorial-theme ::-webkit-scrollbar-track { background: #fdfdfc; }
        .editorial-theme ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .editorial-theme ::-webkit-scrollbar-thumb:hover { background: var(--hl); }

        .border-subtle { border-color: rgba(0, 0, 0, 0.08); }
        .bg-subtle { background-color: rgba(0, 0, 0, 0.03); }
        
        .shadow-soft { box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05); }
        .shadow-hover { box-shadow: 0 30px 60px -20px rgba(0,0,0,0.12); }

        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}} />

            {/* NAVBAR (Kapsul Melayang di Tengah) */}
            <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} top-6 left-0 w-full z-50 flex justify-center pointer-events-none px-4`}>
                <nav className="pointer-events-auto bg-white/80 backdrop-blur-md border border-subtle shadow-soft rounded-full px-4 py-2 @md:px-6 @md:py-3 flex items-center justify-between gap-4 @md:gap-16 w-full max-w-max">
                    <span className="font-sans font-bold tracking-tight text-sm">
                        <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                    </span>
                    <div className="hidden @md:flex items-center gap-6 font-sans text-xs font-medium text-slate-500">
                        <a href="#work" className="hover:text-black transition-colors">
                            <EditableText value={theme?.customTexts?.editorial_nav_work || 'Projects'} field="editorial_nav_work" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                        </a>
                        <a href="#awards" className="hover:text-black transition-colors">
                            <EditableText value={theme?.customTexts?.editorial_nav_awards || 'Recognitions'} field="editorial_nav_awards" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full animate-pulse bg-[var(--hl)] shrink-0"></span>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden @md:block">
                            <EditableText value={theme?.customTexts?.editorial_nav_available || 'Available'} field="editorial_nav_available" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                        </span>
                    </div>
                </nav>
            </div>

            {/* DYNAMIC BLOCKS INJECTED HERE */}
            <div className="flex flex-col w-full relative z-10 pt-32 @md:pt-40">
                {children}
            </div>

            {/* EDITORIAL MEDIA MODAL */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
                    >
                        {/* Soft Canvas Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-[#fdfdfc]/80" onClick={() => setSelectedMedia(null)}
                        ></motion.div>

                        <motion.div 
                            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.6, ease: canvasEase }}
                            className={`relative w-full max-w-5xl flex flex-col overflow-hidden ${cardStyleClassLight} ${cardRadiusClass}`}
                        >
                            {/* Museum-style Header */}
                            <div className="flex justify-between items-center p-6 @md:p-10 border-b border-subtle relative z-10 bg-white">
                                <div className="flex flex-col">
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">
                                        <EditableText value={theme?.customTexts?.editorial_modal_top || 'Editorial Exhibition'} field="editorial_modal_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                    </span>
                                    <h3 className="font-serif italic text-3xl @md:text-5xl text-[#111]">{selectedMedia.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="w-12 h-12 rounded-full border border-subtle flex items-center justify-center hover:bg-[#111] hover:text-white transition-all duration-300"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Presentation Area */}
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[65vh]'} bg-[#f8f8f6] flex items-center justify-center p-2 @md:p-8`}
                            >
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[55vh] object-contain shadow-2xl border-4 border-white" />
                                    </div>
                                )}
                            </motion.div>

                            {/* Minimal Footer */}
                            <div className="p-6 flex justify-center border-t border-subtle bg-white">
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 hover:text-[var(--hl)] transition-colors"
                                >
                                    <EditableText value={theme?.customTexts?.editorial_modal_close || 'DISMISS EXHIBITION'} field="editorial_modal_close" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function EditorialShell(props: any) {
    return (
        <EditorialProvider>
            <EditorialShellContent {...props} />
        </EditorialProvider>
    );
}
