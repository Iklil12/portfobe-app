"use client";

import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { EditableText } from '@/components/ui/EditableText';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface CinematicGalleryContextType {
    themeColor: string;
    customHeadingFont: string;
    customBodyFont: string;
    setSelectedMedia: (media: { url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null) => void;
    isEditor: boolean;
    isCardPreview: boolean;
    isMobileView: boolean;
    data: any;
    theme: any;
}

const CinematicGalleryContext = createContext<CinematicGalleryContextType | undefined>(undefined);

export const useCinematicGallery = () => {
    const context = useContext(CinematicGalleryContext);
    if (!context) throw new Error("useCinematicGallery must be used within a CinematicGalleryShell");
    return context;
};

export const CinematicGalleryShell = ({ children, data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: any) => {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const horizontalContainerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Mount immediately so scrolling is active the exact millisecond the page appears
        setIsMounted(true);
        
        // Safeguard: refresh ScrollTrigger silently after 800ms in case 
        // heavy images or fonts finish loading late and change the width.
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const isSmoothScroll = theme?.customTexts?.smooth_scroll === 'true';

    // Translate vertical scroll to smooth horizontal scroll
    useEffect(() => {
        if (!isMounted || isCardPreview) return;
        
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        // Custom buttery smooth scrolling (LERP)
        let currentScroll = wrapper.scrollLeft;
        let targetScroll = wrapper.scrollLeft;
        let rafId: number;

        const smoothScroll = () => {
            // LERP factor (0.07 = smooth, heavy cinematic feel)
            currentScroll += (targetScroll - currentScroll) * 0.07;
            wrapper.scrollLeft = currentScroll;

            if (Math.abs(targetScroll - currentScroll) > 0.5) {
                rafId = requestAnimationFrame(smoothScroll);
            } else {
                currentScroll = targetScroll;
                wrapper.scrollLeft = currentScroll;
            }
        };

        const handleScroll = () => {
            // Sync manual native scrolling (touch swipe, keyboard) with our target
            if (Math.abs(targetScroll - currentScroll) <= 0.5) {
                targetScroll = wrapper.scrollLeft;
                currentScroll = wrapper.scrollLeft;
            }
        };

        const handleWheel = (e: WheelEvent) => {
            // Only intercept pure vertical scrolling
            if (e.deltaY !== 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                
                if (isSmoothScroll) {
                    // SMOOTH SCROLL (LERP)
                    targetScroll = Math.max(0, Math.min(wrapper.scrollWidth - wrapper.clientWidth, targetScroll + e.deltaY * 1.8));
                    cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(smoothScroll);
                } else {
                    // INSTANT SCROLL (Smooth scroll turned off)
                    wrapper.scrollLeft += e.deltaY;
                    targetScroll = wrapper.scrollLeft;
                    currentScroll = wrapper.scrollLeft;
                }
            }
        };

        wrapper.addEventListener('scroll', handleScroll, { passive: true });
        wrapper.addEventListener('wheel', handleWheel, { passive: false });
        
        return () => {
            wrapper.removeEventListener('scroll', handleScroll);
            wrapper.removeEventListener('wheel', handleWheel);
            cancelAnimationFrame(rafId);
        };
    }, [isMounted, isCardPreview, isSmoothScroll, isEditor]);

    // Intersection Observer for Reveal on Scroll
    useEffect(() => {
        if (!isMounted || isCardPreview || isEditor) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    // Optional: Stop observing once revealed
                    // observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, root: wrapperRef.current }); // Use wrapper as root for horizontal scrolling!

        // Give React a tiny bit of time to mount the DOM nodes from children
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('.reveal-on-scroll');
            elements.forEach(el => observer.observe(el));
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [isMounted, isCardPreview, isEditor, children]);

    // GSAP ScrollTrigger for Parallax (Attached to the wrapper's scroll)
    useGSAP(() => {
        if (!isMounted || isCardPreview || isEditor) return;
        
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        gsap.utils.toArray('.img-parallax').forEach((img: any) => {
            gsap.to(img, {
                xPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: img.closest('.panel'),
                    horizontal: true,
                    scroller: wrapper,
                    start: "left right",
                    end: "right left",
                    scrub: true
                }
            });
        });

    }, { scope: containerRef, dependencies: [isMounted, isCardPreview, isEditor, children] });

    // Custom Cursor Logic
    const cursorRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (isCardPreview) return;
        
        const cursor = cursorRef.current;
        if (!cursor) return;

        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', onMouseMove);

        const ticker = gsap.ticker.add(() => {
            cursorPos.x += (mouse.x - cursorPos.x) * 0.15;
            cursorPos.y += (mouse.y - cursorPos.y) * 0.15;
            gsap.set(cursor, { x: cursorPos.x, y: cursorPos.y });
        });

        // We use event delegation for hover triggers because blocks can mount dynamically
        const handleMouseOver = (e: MouseEvent) => {
            if ((e.target as Element)?.closest('.hover-trigger')) {
                cursor.classList.add('active');
            }
        };
        const handleMouseOut = (e: MouseEvent) => {
            if ((e.target as Element)?.closest('.hover-trigger')) {
                cursor.classList.remove('active');
            }
        };

        document.body.addEventListener('mouseover', handleMouseOver);
        document.body.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            gsap.ticker.remove(ticker);
            document.body.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isCardPreview]);

    // Line indicator animation
    useEffect(() => {
        const line = document.querySelector('.line-indicator');
        if (line) {
            gsap.to(line, { width: "48px", duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" });
        }
    }, []);

    // Initial load animation properly scoped in useGSAP
    useGSAP(() => {
        if (!isMounted) return;
        
        if (isCardPreview || isEditor) {
            gsap.set('.panel-text', { opacity: 1, y: 0 });
            gsap.set('.fade-text', { opacity: 1, y: 0 });
            gsap.set('.reveal-on-scroll', { opacity: 1, y: 0 });
            return;
        }
        
        const tl = gsap.timeline();
        tl.from('.panel-text', { opacity: 0, y: 20, duration: 1.5, stagger: 0.2, ease: 'power3.out' })
          .from('.fade-text', { opacity: 0, y: 20, duration: 1, ease: 'power2.out' }, '-=1');
          
    }, { scope: containerRef, dependencies: [isMounted, isCardPreview, isEditor] });





    // Fonts
    const fontHeading = theme?.fontHeading || 'Playfair Display';
    const fontBody = theme?.fontBody || 'Manrope';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('space grotesk')) return "'Space Grotesk', sans-serif";
        if (f?.toLowerCase().includes('manrope')) return "'Manrope', sans-serif";
        if (f?.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif')) return "'Playfair Display', serif";
        if (f?.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        if (f?.toLowerCase().includes('satoshi')) return "'Satoshi', sans-serif";
        if (f?.toLowerCase().includes('cabinet')) return "'Cabinet Grotesk', sans-serif";
        return "'Playfair Display', serif"; 
    };
    
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);
    const themeColor = theme?.themeColor || "#ffffff";

    const fullName = data?.profile?.fullName || data?.fullName || "Ruang Studio";

    return (
        <CinematicGalleryContext.Provider value={{ themeColor, customHeadingFont, customBodyFont, setSelectedMedia, isEditor, isCardPreview, isMobileView, data, theme }}>
            <main ref={containerRef} className="cinematic-gallery-root bg-[#050505] text-[#f5f5f0] min-h-screen relative overflow-x-hidden selection:bg-[#f5f5f0] selection:text-[#050505]">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .cinematic-gallery-root {
                        ${!isCardPreview ? 'cursor: none;' : ''}
                    }
                    .cinematic-gallery-root .font-serif, .cinematic-gallery-root .font-display { font-family: ${customHeadingFont} !important; }
                    .cinematic-gallery-root .font-sans, .cinematic-gallery-root .font-body { font-family: ${customBodyFont} !important; }

                    /* Custom Cursor */
                    .cg-cursor {
                        position: fixed; top: 0; left: 0; width: 20px; height: 20px;
                        border-radius: 50%; background-color: #f5f5f0; mix-blend-mode: difference;
                        pointer-events: none; z-index: 10000; transform: translate(-50%, -50%);
                        transition: width 0.3s cubic-bezier(0.19, 1, 0.22, 1), height 0.3s cubic-bezier(0.19, 1, 0.22, 1);
                    }
                    .cg-cursor.active { width: 80px; height: 80px; }

                    /* Hide Scrollbar (Except in Editor) */
                    ${!isEditor ? `
                    .cinematic-gallery-root::-webkit-scrollbar { display: none; }
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    ` : `
                    .cg-wrapper::-webkit-scrollbar { height: 12px; }
                    .cg-wrapper::-webkit-scrollbar-track { background: #050505; }
                    .cg-wrapper::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; border: 3px solid #050505; }
                    .cg-wrapper::-webkit-scrollbar-thumb:hover { background: #555; }
                    `}
                    
                    .reveal-mask { overflow: hidden; }

                    /* Prevent elements from being stuck if JS fails */
                    .panel-text { opacity: 1; transform: translateY(0px); }
                    .fade-text { opacity: 1; }
                    
                    .reveal-on-scroll {
                        ${!isEditor && !isCardPreview ? 'opacity: 0; transform: translateY(50px); transition: opacity 1s cubic-bezier(0.215, 0.610, 0.355, 1), transform 1s cubic-bezier(0.215, 0.610, 0.355, 1);' : 'opacity: 1; transform: translateY(0);'}
                    }
                    .reveal-on-scroll.is-revealed {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .cg-text-huge {
                        font-size: clamp(4rem, 12vw, 15rem);
                        line-height: 0.85; letter-spacing: -0.02em;
                    }
                    .cg-outline-text {
                        color: transparent; -webkit-text-stroke: 1px rgba(245, 245, 240, 0.3);
                    }
                    
                    /* Utilities */
                    
                    /* Lenis Smooth Scroll CSS */
                    html.lenis, html.lenis body { height: auto; }
                    .lenis.lenis-smooth { scroll-behavior: auto !important; }
                    .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
                    .lenis.lenis-stopped { overflow: hidden; }
                    .lenis.lenis-scrolling iframe { pointer-events: none; }
                    
                    /* Parallax & Layout */
                    .cg-wrapper { 
                        ${!isCardPreview ? 'width: 100%; height: 100vh; overflow-x: auto; overflow-y: hidden; -ms-overflow-style: none; scrollbar-width: none;' : 'display: flex; flex-direction: column; width: 100%;'} 
                    }
                    .cg-wrapper::-webkit-scrollbar {
                        display: none;
                    }
                    .cg-horizontal-container { 
                        ${!isCardPreview ? 'width: max-content; height: 100vh; display: flex; flex-wrap: nowrap;' : 'display: flex; flex-direction: column; width: 100%; gap: 4rem; padding-bottom: 4rem;'} 
                    }
                    .panel {
                        ${!isCardPreview ? 'width: 100vw; height: 100vh; display: flex; justify-content: center; position: relative; padding: 4rem; flex-shrink: 0;' : 'width: 100%; min-height: 50vh; display: flex; flex-direction: column; justify-content: center; position: relative; padding: 2rem 1rem; flex-shrink: 0;'}
                    }

                    .img-container { overflow: hidden; position: relative; }
                    .img-parallax {
                        ${!isCardPreview ? 'width: 130%; height: 100%; object-fit: cover; position: absolute; top: 0; left: -15%;' : 'width: 100%; height: 100%; object-fit: cover;'}
                    }
                    `
                }} />

                {!isCardPreview && (
                    <div className="cg-cursor" ref={cursorRef}></div>
                )}
                
                {/* Fixed Headers */}
                <header className="fixed top-6 left-6 md:top-8 md:left-8 z-50 mix-blend-difference pointer-events-none flex flex-col gap-1">
                    <div className="font-serif italic text-xl md:text-2xl hover-trigger pointer-events-auto">
                        <EditableText value={theme?.customTexts?.cg_header_logo || `${fullName.split(' ')[0]}.`} field="cg_header_logo" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </div>
                </header>

                <header className="fixed top-6 right-6 md:top-8 md:right-8 z-50 mix-blend-difference pointer-events-none flex flex-col items-end gap-1">
                    <div className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase pointer-events-auto">
                        <EditableText value={theme?.customTexts?.cg_header_tagline || 'ESTETIKA / 2026'} field="cg_header_tagline" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                    </div>
                </header>

                {/* Fixed Footer Indicator */}
                {!isCardPreview && (
                    <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 mix-blend-difference pointer-events-none">
                        <p className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8b8b8b] flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-[#8b8b8b] inline-block line-indicator"></span>
                            Scroll to Navigate
                        </p>
                    </div>
                )}

                {/* Dynamic Block Children go here */}
                <div className="w-full relative">
                    <div className="cg-wrapper" ref={wrapperRef}>
                        <div className="cg-horizontal-container" ref={horizontalContainerRef}>
                            {children}
                        </div>
                    </div>
                </div>

                {/* Media Modal */}
                <AnimatePresence>
                    {selectedMedia && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[10001] flex items-center justify-center p-0 md:p-10"
                        >
                            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md" onClick={() => setSelectedMedia(null)}></div>
                            <motion.div 
                                initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
                                className="relative w-full max-w-6xl bg-[#0a0a0a] flex flex-col overflow-hidden border border-white/10 rounded-lg shadow-2xl"
                            >
                                <div className="flex justify-between items-center px-4 py-3 md:px-6 border-b border-white/10">
                                    <h3 className="font-serif italic text-xl md:text-2xl text-[#f5f5f0]">{selectedMedia.title}</h3>
                                    <button onClick={() => setSelectedMedia(null)} className="w-8 h-8 flex items-center justify-center bg-white/10 text-white hover:bg-white hover:text-black transition-all rounded-full hover-trigger">
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
            </main>
        </CinematicGalleryContext.Provider>
    );
}
