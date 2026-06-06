"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import { usePathname } from 'next/navigation';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { SplitScreenStudioProvider, useSplitScreenStudio } from './SplitScreenStudioContext';
import { BlockEditorWrapper } from '@/components/features/appearance/BlockEditorWrapper';
import { SplitScreenStudioHeroBlock } from './SplitScreenStudioHeroBlock';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

function SplitScreenStudioInner({ children, data, theme, isMobileView, isCardPreview, isEditor, heroBlock }: any) {
    const { selectedMedia, setSelectedMedia, activeSection, cursorHovered, setCursorHovered } = useSplitScreenStudio();
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const pathname = usePathname();
    const isPreviewRoute = pathname?.includes('/preview/');

    // Performance Optimized Cursor
    const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
    const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
    const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });
    const ringX = useSpring(mouseX, { damping: 30, stiffness: 200 });
    const ringY = useSpring(mouseY, { damping: 30, stiffness: 200 });

    useEffect(() => {
        if (isCardPreview) return;
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isCardPreview, mouseX, mouseY]);

    const rawHighlightColor = theme?.themeColor || '#ffffff';
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#ffffff';
    const fontHeading = theme?.fontHeading || 'Cabinet Grotesk';
    const fontBody = theme?.fontBody || 'Satoshi';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return `'${f}', sans-serif`;
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll !== 'false');

    const content = (
        <main className="split-screen-theme w-full flex flex-col md:flex-row relative font-sans selection:bg-white selection:text-black min-h-screen transition-colors duration-1000" 
              style={{ 
                  backgroundColor: activeSection.bg,
                  '--hl': highlightColor 
              } as React.CSSProperties}>
            <style dangerouslySetInnerHTML={{
                __html: `
        .split-screen-theme {
            color: #f4f4f4;
            ${isMobileView || isCardPreview ? '' : 'cursor: none;'}
        }
        .split-screen-theme .font-display { font-family: ${customHeadingFont}; }
        .split-screen-theme .font-sans { font-family: ${customBodyFont}; }
        
        .split-screen-theme ::-webkit-scrollbar { width: 0px; display: none; }
        
        /* Smooth Scroll Config */
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        
        .cursor-hover-target { cursor: none; }
      `}} />

            {/* Custom Cursor (Hidden on mobile/card preview) */}
            {(!isMobileView && !isCardPreview) && (
                <>
                    <motion.div 
                        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference"
                        style={{ x: smoothMouseX, y: smoothMouseY, translateX: "-50%", translateY: "-50%" }}
                    />
                    <motion.div 
                        className="fixed top-0 left-0 border border-white/40 rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
                        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
                        animate={{ 
                            width: cursorHovered ? 100 : 40,
                            height: cursorHovered ? 100 : 40,
                            backgroundColor: cursorHovered ? 'white' : 'transparent',
                            borderColor: cursorHovered ? 'transparent' : 'rgba(255,255,255,0.4)',
                            mixBlendMode: cursorHovered ? 'normal' : 'normal'
                        }}
                        transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                    >
                        <AnimatePresence>
                            {cursorHovered && (
                                <motion.span 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="font-sans text-[10px] font-bold tracking-[0.2em] text-black uppercase"
                                >
                                    EXPLORE
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}

            {/* ================= LEFT PANEL ================= */}
            {heroBlock && (
                <div className="w-full md:w-[45%] lg:w-5/12 flex flex-col justify-between p-8 md:p-12 lg:p-16 border-r border-white/10 z-20 md:h-[100svh] md:sticky md:top-0">
                    <BlockEditorWrapper block={heroBlock} isEditor={isEditor} isHero={true}>
                        <SplitScreenStudioHeroBlock data={data} theme={theme} isEditor={isEditor} blockConfig={heroBlock} />
                    </BlockEditorWrapper>
                </div>
            )}

            {/* ================= RIGHT PANEL ================= */}
            <section className={`w-full ${heroBlock ? 'md:w-[55%] lg:w-7/12' : ''} relative z-10`}>
                {children}
            </section>

            {/* Media Modal */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-12"
                        data-lenis-prevent="true"
                    >
                        <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md" onClick={() => setSelectedMedia(null)}></div>
                        
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                            className="relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 flex flex-col overflow-hidden"
                        >
                            <div className="flex justify-between items-center px-5 py-3 border-b border-white/10 bg-white/5">
                                <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">{selectedMedia.title}</h3>
                                <button onClick={() => setSelectedMedia(null)} className="w-10 h-10 flex items-center justify-center border border-white/10 text-white hover:bg-white hover:text-black transition-all">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="w-full bg-black relative overflow-hidden" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );

    if (isSmoothScroll) {
        return (
            <ReactLenis root options={{ smoothWheel: true, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}>
                {content}
            </ReactLenis>
        );
    }

    return content;
}

export function SplitScreenStudioShell(props: any) {
    const { theme, isEditor, data } = props;
    const bio = data?.profile?.bio || data?.bio || "We believe that great design is not just how it looks, but how it feels and functions.";
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    // Initial state for the left panel
    const initialActiveSection = {
        bg: '#050505',
        index: 'INT / 00',
        tag: getCustomText('sss_intro_tag', 'OVERVIEW'),
        title: <>{getCustomText('sss_intro_title1', 'CRAFTING')}<br/>{getCustomText('sss_intro_title2', 'DIGITAL')}<br/>{getCustomText('sss_intro_title3', 'REALITIES.')}</>,
        desc: bio
    };

    return (
        <SplitScreenStudioProvider initialActiveSection={initialActiveSection}>
            <SplitScreenStudioInner {...props} />
        </SplitScreenStudioProvider>
    );
}
