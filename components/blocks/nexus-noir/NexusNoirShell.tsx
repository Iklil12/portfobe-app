"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import Link from 'next/link';
import { EditableText } from '@/components/ui/EditableText';
import { AnimatePresence, motion } from 'framer-motion';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
}

export function NexusNoirShell({ children, theme, isMobileView, isCardPreview, isEditor, data }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);

    useLenis((scroll) => {
        ScrollTrigger.update();
    });

    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    // Provide the selectedMedia setter down via context or handle it globally?
    // In Pageblock, the DynamicBlockRenderer passes `setSelectedMedia` down to blocks.
    // So the shell just needs to render the modal if `selectedMedia` is managed at the `DynamicBlockRenderer` level!
    // Wait, `DynamicBlockRenderer` renders the `Shell`? No, `DynamicBlockRenderer` maps blocks, but how does the Shell get wrapped?
    // Actually, in `DynamicBlockRenderer`, we don't use Shell directly. The `page/layout` or `[subdomain]/page.tsx` uses the Shell?
    // Oh, wait, how did AuraKineticShell work? `app/[subdomain]/page.tsx` dynamically imports the Shell based on themeTemplate!
    
    // TEMA & WARNA
    const accentColor = theme?.themeColor || '#4F46E5'; 
    const fontHeading = theme?.fontHeading || 'Outfit';
    const fontBody = theme?.fontBody || 'Inter';

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    useGSAP(() => {
        if (isCardPreview) return;

        // Custom Cursor Animation
        const cursorDot = document.getElementById('nn-cursor-dot');
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX, dotY = mouseY;

        const onMouseMove = (e: MouseEvent) => {
            const container = containerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const scaleX = rect.width / container.offsetWidth || 1;
            const scaleY = rect.height / container.offsetHeight || 1;
            
            mouseX = (e.clientX - rect.left) / scaleX;
            mouseY = (e.clientY - rect.top) / scaleY;
        };

        window.addEventListener('mousemove', onMouseMove);

        const animateCursor = () => {
            if (!cursorDot) return;
            const dt = 1.0 - Math.pow(1.0 - 0.25, gsap.ticker.deltaRatio()); 
            dotX += (mouseX - dotX) * dt;
            dotY += (mouseY - dotY) * dt;
            
            cursorDot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%))`;
            requestAnimationFrame(animateCursor);
        };
        let animFrame = requestAnimationFrame(animateCursor);

        // Visibility Toggle
        const container = containerRef.current;
        const showCursor = () => { if (cursorDot) cursorDot.style.opacity = '1'; };
        const hideCursor = () => { if (cursorDot) cursorDot.style.opacity = '0'; };

        if (container) {
            container.addEventListener('mouseenter', showCursor);
            container.addEventListener('mouseleave', hideCursor);
        }

        // Magnetic Hover Effect
        const magneticElements = document.querySelectorAll('.magnetic, .magnetic-card, button, a, .hover-trigger');
        
        const handleMouseEnter = () => {
            if (cursorDot) cursorDot.classList.add('cursor-hover');
        };
        const handleMouseLeave = (e: Event) => {
            if (cursorDot) cursorDot.classList.remove('cursor-hover');
            gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
        };
        const handleMagneticMove = (e: Event) => {
            const el = e.currentTarget as HTMLElement;
            if (el.classList.contains('magnetic') || el.classList.contains('magnetic-card')) {
                const mouseEvent = e as MouseEvent;
                const rect = el.getBoundingClientRect();
                
                const relX = mouseEvent.clientX - rect.left - rect.width / 2;
                const relY = mouseEvent.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: relX * 0.2, y: relY * 0.2, duration: 0.3, ease: 'power2.out' });
            }
        };

        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
            el.addEventListener('mousemove', handleMagneticMove);
        });

        if (!isEditor) {
            // Scramble Text
            const scrambleLinks = document.querySelectorAll('.scramble-link');
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            
            scrambleLinks.forEach((link: any) => {
                link.addEventListener('mouseenter', (event: any) => {
                    let iterations = 0;
                    const originalText = event.target.dataset.text;
                    if(!originalText) return;
                    clearInterval(link.interval);
                    link.interval = setInterval(() => {
                        event.target.innerText = originalText.split("")
                            .map((letter: string, index: number) => {
                                if(index < iterations) return originalText[index];
                                return letters[Math.floor(Math.random() * 26)];
                            })
                            .join("");
                        if(iterations >= originalText.length) clearInterval(link.interval);
                        iterations += 1 / 2;
                    }, 30);
                });
            });

            // Hero Animations
            gsap.fromTo('.text-reveal', 
                { y: '100%' },
                { y: '0%', duration: 1.5, ease: 'power4.out', stagger: 0.1, delay: 0.2 }
            );
            
            gsap.fromTo('#hero-line', 
                { scaleX: 0 },
                { scaleX: 1, duration: 1.5, ease: 'power4.inOut', delay: 0.7 }
            );

            // Scroll Reveal
            const revealElements = gsap.utils.toArray('.gs-reveal') as HTMLElement[];
            revealElements.forEach((el) => {
                gsap.fromTo(el, 
                    { y: 40, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                        },
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power3.out"
                    }
                );
            });
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animFrame);
            if (container) {
                container.removeEventListener('mouseenter', showCursor);
                container.removeEventListener('mouseleave', hideCursor);
            }
            magneticElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
                el.removeEventListener('mousemove', handleMagneticMove);
            });
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

    }, { scope: containerRef, dependencies: [isMobileView, isCardPreview, isEditor, theme, accentColor] });

    const safeHeading = fontHeading === 'sans-serif' ? 'Inter' : fontHeading;
    const safeBody = fontBody === 'sans-serif' ? 'Inter' : fontBody;
    
    const headingQuery = safeHeading.replace(/ /g, '+');
    const bodyQuery = safeBody.replace(/ /g, '+');
    
    const familyQuery = safeHeading === safeBody 
        ? `family=${headingQuery}:wght@300;400;500;600;700;800`
        : `family=${headingQuery}:wght@300;400;500;600;700;800&family=${bodyQuery}:wght@300;400;500;600;700;800`;

    const fontStyleString = `
        @import url('https://fonts.googleapis.com/css2?${familyQuery}&display=swap');

        .font-nn-heading { font-family: "${safeHeading}", 'Outfit', sans-serif; }
        .font-nn-sans { font-family: "${safeBody}", 'Inter', sans-serif; }
        
        .nn-theme {
            background-color: #050505;
            color: #F5F5F5;
            ${!isMobileView && !isCardPreview && !isEditor ? 'cursor: none;' : ''}
        }
        
        ::selection { background-color: #F5F5F5; color: #050505; }
        
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        
        .nn-noise {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 10; opacity: 0.035;
            background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
        }

        .nn-bg-grid {
            position: absolute; inset: 0; z-index: 1; pointer-events: none;
            background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 50px 50px;
            mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
            -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
        }

        .nn-cursor {
            position: absolute; top: 0; left: 0; width: 10px; height: 10px;
            background-color: #fff; border-radius: 50%;
            pointer-events: none; z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, background-color 0.3s, mix-blend-mode 0.3s, opacity 0.3s;
            opacity: 0;
            ${isEditor ? 'display: none;' : ''}
        }
        .nn-cursor.cursor-hover {
            width: 70px; height: 70px;
            background-color: rgba(255, 255, 255, 1);
            mix-blend-mode: difference;
        }

        .marquee-wrap { overflow: hidden; display: flex; position: relative; }
        .marquee-inner { display: flex; white-space: nowrap; animation: marquee 20s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .project-card .img-wrap { overflow: hidden; position: relative; }
        .project-card img { transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .project-card:hover img { transform: scale(1.08); }
        .project-details-overlay {
            position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
            opacity: 0; transition: opacity 0.5s ease; display: flex; align-items: center; justify-content: center;
        }
        .project-card:hover .project-details-overlay { opacity: 1; }
        .view-btn { transform: translateY(20px); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .project-card:hover .view-btn { transform: translateY(0); }

        .scramble-link { display: inline-block; min-width: max-content; }

        .glass-panel {
            background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.4s ease, border-color 0.4s ease;
        }
        .glass-panel:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.15); }

        .text-reveal-wrap { overflow: hidden; }
        .text-reveal { transform: ${isEditor ? 'translateY(0)' : 'translateY(100%)'}; }
    `;

    const lenis = useLenis();
    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(id, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
            document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const content = (
        <div ref={containerRef} className={`w-full min-h-screen nn-theme relative font-nn-sans ${isCardPreview ? 'overflow-hidden' : ''}`}>
            <style dangerouslySetInnerHTML={{ __html: fontStyleString }} />
            
            {/* Background Elements */}
            <div className="nn-noise fixed"></div>
            <div className="nn-bg-grid fixed"></div>

            {/* Custom Cursor */}
            {!isMobileView && !isCardPreview && (
                <div className="nn-cursor" id="nn-cursor-dot"></div>
            )}

            {/* Navigation */}
            <nav className="absolute w-full top-0 z-50 px-6 py-6 mix-blend-difference">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="#" className="magnetic font-nn-heading font-bold text-xl tracking-wide text-white">
                        <EditableText entity="appearance" field="nn_logo" value={getCustomText('nn_logo', 'N')} isEditor={isEditor} />
                        <span className="text-gray-500">.</span>
                    </Link>
                    <div className="hidden md:flex gap-12 text-sm font-medium text-[#888888]">
                        <a href="#work" onClick={(e) => handleScrollTo(e, '#work')} className="magnetic hover:text-white transition-colors scramble-link hover-trigger" data-text={getCustomText('nn_nav_1', 'Works')}>
                            <EditableText entity="appearance" field="nn_nav_1" value={getCustomText('nn_nav_1', 'Works')} isEditor={isEditor} as="span" className="pointer-events-auto" />
                        </a>
                        <a href="#experience" onClick={(e) => handleScrollTo(e, '#experience')} className="magnetic hover:text-white transition-colors scramble-link hover-trigger" data-text={getCustomText('nn_nav_2', 'Experience')}>
                            <EditableText entity="appearance" field="nn_nav_2" value={getCustomText('nn_nav_2', 'Experience')} isEditor={isEditor} as="span" className="pointer-events-auto" />
                        </a>
                        <a href="#about" onClick={(e) => handleScrollTo(e, '#about')} className="magnetic hover:text-white transition-colors scramble-link hover-trigger" data-text={getCustomText('nn_nav_3', 'Expertise')}>
                            <EditableText entity="appearance" field="nn_nav_3" value={getCustomText('nn_nav_3', 'Expertise')} isEditor={isEditor} as="span" className="pointer-events-auto" />
                        </a>
                    </div>
                    <a href="#contact" onClick={(e) => handleScrollTo(e, '#contact')} className="magnetic text-sm font-medium border border-white/20 rounded-full px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-300 hover-trigger">
                        Let's Talk
                    </a>
                </div>
            </nav>

            {children}
        </div>
    );

    return content;
}
