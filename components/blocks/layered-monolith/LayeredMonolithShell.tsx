"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { AnimatePresence, motion } from 'framer-motion';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
}

export function LayeredMonolithShell({ children, data, theme, isMobileView = false, isCardPreview = false, isEditor = false, selectedMedia, setSelectedMedia }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lenisRef = useRef<any>(null);

    useEscapeKey(() => setSelectedMedia && setSelectedMedia(null), !!selectedMedia);

    // GSAP Stacking Effect
    useGSAP(() => {
        if (isCardPreview) return;
        
        const cards = gsap.utils.toArray('.stack-card') as HTMLElement[];
        
        cards.forEach((card, i) => {
            if (i === cards.length - 1) return; // Skip last card

            const nextCard = cards[i + 1];

            // Shrink animation
            gsap.to(card, {
                scale: 0.92,
                opacity: 0.8,
                ease: "none",
                scrollTrigger: {
                    trigger: nextCard,
                    start: "top 95%", 
                    end: "top 5%",      
                    scrub: true,         
                }
            });

            // Parallax Images
            const img = card.querySelector('.parallax-img');
            if (img) {
                gsap.to(img, {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        });

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
        
        return () => clearTimeout(timer);
    }, { scope: containerRef, dependencies: [isMobileView, isCardPreview, children] });



    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(`nav-${id}`);
        if (element) {
            let targetEl: HTMLElement | null = element.closest('.stack-card');
            
            // Fallback for blocks that wrap multiple cards (like Works)
            if (!targetEl) {
                targetEl = element.parentElement;
            }

            if (targetEl) {
                const wrapper = targetEl.parentElement;
                if (wrapper && wrapper.classList.contains('group/block')) {
                    targetEl = wrapper as HTMLElement;
                }
                
                let top = 0;
                let sibling = targetEl.previousElementSibling as HTMLElement;
                while (sibling) {
                    top += sibling.offsetHeight;
                    sibling = sibling.previousElementSibling as HTMLElement;
                }
                
                let currParent = targetEl.parentElement;
                while (currParent) {
                    top += currParent.offsetTop;
                    currParent = currParent.offsetParent as HTMLElement;
                }
                
                if (lenisRef.current?.lenis) {
                    lenisRef.current.lenis.scrollTo(top, { immediate: false, duration: 1.2 });
                } else {
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            } else {
                if (lenisRef.current?.lenis) {
                    lenisRef.current.lenis.scrollTo(element, { immediate: false, duration: 1.2 });
                } else {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    // Fonts
    const fontHeading = theme?.fontHeading || 'Space Grotesk';
    const fontBody = theme?.fontBody || 'Manrope';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('space grotesk')) return "'Space Grotesk', sans-serif";
        if (f?.toLowerCase().includes('manrope')) return "'Manrope', sans-serif";
        if (f?.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };
    
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);
    const accentColor = theme?.themeColor || '#E84A27';

    const content = (
        <div ref={containerRef} className="layered-monolith-root bg-black text-[#1A1A18] font-body selection:bg-brand-accent selection:text-white min-h-screen relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                .layered-monolith-root {
                    --brand-accent: ${accentColor};

                }
                .layered-monolith-root .font-display { font-family: ${customHeadingFont} !important; }
                .layered-monolith-root .font-body { font-family: ${customBodyFont} !important; }
                .layered-monolith-root .text-brand-accent { color: var(--brand-accent) !important; }
                .layered-monolith-root .bg-brand-accent { background-color: var(--brand-accent) !important; }
                .layered-monolith-root .border-brand-accent { border-color: var(--brand-accent) !important; }

                /* Lenis Override to prevent native smooth scroll conflict */
                html.lenis, html.lenis body { height: auto; }
                .lenis.lenis-smooth { scroll-behavior: auto !important; }
                .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
                .lenis.lenis-stopped { overflow: hidden; }
                


                .stack-container { position: relative; width: 100%; }
                /* Stacking cards */
                .stack-card {
                    position: sticky; top: 0; height: 100dvh; width: 100%; overflow: hidden;
                    transform-origin: top center; border-bottom: 1px solid rgba(0,0,0,0.1);
                    box-shadow: 0 -20px 50px rgba(0,0,0,0.15); 
                    display: flex; flex-direction: column; will-change: transform, filter;
                }
                .stack-card:nth-child(1) { box-shadow: none; border-bottom: none; }
                
                .parallax-img { position: absolute; top: 0; left: 0; width: 100%; height: 120%; object-fit: cover; z-index: 0; }
                .parallax-overlay { position: absolute; inset: 0; z-index: 1; }

                .floating-dock {
                    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
                    background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.2); border-radius: 100px;
                    padding: 0.5rem 1rem; display: flex; gap: 2rem; z-index: 9999;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: all 0.4s ease;
                }
                .floating-dock a {
                    font-family: ${customHeadingFont}; font-size: 0.75rem; text-transform: uppercase;
                    font-weight: 600; letter-spacing: 0.1em; color: #fff; opacity: 0.7; transition: opacity 0.3s;
                    padding: 0.5rem;
                }
                .floating-dock a:hover { opacity: 1; }

                @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
                .animate-marquee { display: flex; width: 200%; white-space: nowrap; animation: marquee 20s linear infinite; }
                @keyframes spin-slow { 100% { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 12s linear infinite; }

                .chip {
                    border: 1px solid rgba(255,255,255,0.2); border-radius: 50px;
                    padding: 6px 16px; font-family: ${customHeadingFont};
                    font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em;
                    backdrop-filter: blur(10px); background: rgba(255,255,255,0.05);
                }
                .chip-dark { border-color: rgba(0,0,0,0.2); background: rgba(0,0,0,0.05); }

                @media (max-width: 768px) {
                    .floating-dock { bottom: 1rem; width: 90%; gap: 1rem; justify-content: space-around; padding: 0.5rem; }
                    .floating-dock a { font-size: 0.65rem; gap: 0.5rem; }
                }

                .noise {
                    position: absolute; inset: 0; opacity: 0.03; z-index: 1; pointer-events: none;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
            `}} />



            {/* Floating Dock Navigation */}
            <nav className="floating-dock mix-blend-difference">
                <a href="#hero" onClick={(e) => handleScrollTo(e, 'hero')} className="cursor-hover" data-cursor-text="TOP">Start</a>
                <a href="#philosophy" onClick={(e) => handleScrollTo(e, 'philosophy')} className="cursor-hover" data-cursor-text="READ">Ethos</a>
                <a href="#works" onClick={(e) => handleScrollTo(e, 'works')} className="cursor-hover" data-cursor-text="VIEW">Works</a>
                <a href="#expertise" onClick={(e) => handleScrollTo(e, 'expertise')} className="cursor-hover" data-cursor-text="INFO">Studio</a>
            </nav>

            <main className="stack-container w-full">
                {children}
            </main>

            {/* Media Modal */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-10"
                    >
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedMedia && setSelectedMedia(null)}></div>
                        <motion.div 
                            initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="relative w-full max-w-6xl bg-[#1A1A18] flex flex-col overflow-hidden border border-white/10 shadow-2xl rounded-lg"
                        >
                            <div className="flex justify-between items-center px-4 py-3 md:px-6 border-b border-white/10">
                                <h3 className="font-display font-bold uppercase tracking-tight text-white">{selectedMedia.title}</h3>
                                <button onClick={() => setSelectedMedia && setSelectedMedia(null)} className="w-8 h-8 flex items-center justify-center bg-white/10 text-white hover:bg-white hover:text-black transition-all rounded-full cursor-hover" data-cursor-text="CLOSE">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="w-full bg-black relative" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4 md:p-12">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll === 'true');

    if (isSmoothScroll) {
        return (
            <ReactLenis 
                root 
                ref={lenisRef}
                options={{ 
                    duration: 1.2, 
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
                    smoothWheel: true
                }}
            >
                {content}
            </ReactLenis>
        );
    }

    return content;
}
