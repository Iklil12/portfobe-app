"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { EditableText } from '@/components/ui/EditableText';

export function KineticAvantGardeShell({ children, theme, isMobileView = false, isCardPreview = false, isEditor = false }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const accentColor = theme?.themeColor || '#c92a2a'; // Blood Red default
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    useGSAP(() => {
        if (isCardPreview) return;

        const cursorDot = document.getElementById('kag-cursor-dot');
        const cursorOutline = document.getElementById('kag-cursor-outline');
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX, dotY = mouseY;
        let outlineX = mouseX, outlineY = mouseY;

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
            if (!cursorDot || !cursorOutline) return;
            dotX += (mouseX - dotX) * 0.2;
            dotY += (mouseY - dotY) * 0.2;
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;

            cursorDot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%))`;
            cursorOutline.style.transform = `translate(calc(${outlineX}px - 50%), calc(${outlineY}px - 50%))`;

            requestAnimationFrame(animateCursor);
        };
        let animFrame = requestAnimationFrame(animateCursor);

        const container = containerRef.current;
        const showCursor = () => {
            if (cursorOutline) cursorOutline.style.opacity = '1';
            if (cursorDot && !cursorDot.classList.contains('dot-hidden')) cursorDot.style.opacity = '1';
        };
        const hideCursor = () => {
            if (cursorOutline) cursorOutline.style.opacity = '0';
            if (cursorDot) cursorDot.style.opacity = '0';
        };

        if (container) {
            container.addEventListener('mouseenter', showCursor);
            container.addEventListener('mouseleave', hideCursor);
        }

        const handleMouseEnter = () => {
            cursorOutline?.classList.add('cursor-hover');
            cursorDot?.classList.add('dot-hidden');
            if (cursorDot) cursorDot.style.opacity = '0';
        };
        const handleMouseLeave = () => {
            cursorOutline?.classList.remove('cursor-hover');
            cursorDot?.classList.remove('dot-hidden');
            if (cursorDot) cursorDot.style.opacity = '1';
        };

        const attachHoverListeners = () => {
            const hoverTriggers = document.querySelectorAll('.hover-trigger');
            hoverTriggers.forEach(el => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
        };

        attachHoverListeners();
        // Set up mutation observer to attach listeners to newly added elements (like dynamically rendered blocks)
        const observer = new MutationObserver(() => {
            attachHoverListeners();
        });
        if (container) observer.observe(container, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animFrame);
            observer.disconnect();
            const hoverTriggers = document.querySelectorAll('.hover-trigger');
            hoverTriggers.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, { scope: containerRef, dependencies: [isMobileView, isCardPreview, isEditor, theme, accentColor] });

    const fontStyleString = `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        .font-kag-brutal { font-family: 'Anton', sans-serif; }
        .font-kag-serif { font-family: 'Playfair Display', serif; }
        .font-kag-mono { font-family: 'Space Grotesk', monospace; }
        
        .kag-theme {
            background-color: #0a0a0a;
            color: #e6e4dc;
            ${!isMobileView && !isCardPreview ? 'cursor: none;' : ''}
        }
        
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        
        .kag-cursor-dot, .kag-cursor-outline {
            position: absolute;
            top: 0; left: 0;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            z-index: 10000;
            pointer-events: none;
            mix-blend-mode: difference;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .kag-cursor-dot { width: 10px; height: 10px; background-color: white; }
        .kag-cursor-outline {
            width: 40px; height: 40px; border: 1px solid white;
            transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
        }
        .kag-cursor-outline.cursor-hover { width: 80px; height: 80px; background-color: white; border: none; }
        
        .kag-text-massive { font-size: clamp(6rem, 20vw, 25rem); line-height: 0.8; letter-spacing: -0.02em; }
        .kag-text-outline { color: transparent; -webkit-text-stroke: 2px #e6e4dc; }
        
        .parallax-wrap { position: relative; width: 100%; height: 100vh; overflow: hidden; }
        .floating-img { position: absolute; transition: transform 0.1s linear; box-shadow: 0 30px 60px rgba(0,0,0,0.5); will-change: transform; }
        
        .stack-card { position: sticky; top: 0; height: 100vh; width: 100%; transform-origin: center top; }
        
        .kag-marquee { white-space: nowrap; overflow: hidden; display: flex; width: 100%; }
        .kag-marquee-item { display: inline-block; padding-right: 2rem; animation: kag-marquee 15s linear infinite; }
        @keyframes kag-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        
        .kag-bg-void { background-color: #0a0a0a; }
        .kag-bg-bone { background-color: #e6e4dc; }
        .kag-bg-blood { background-color: ${accentColor}; }
        
        .kag-text-void { color: #0a0a0a; }
        .kag-text-bone { color: #e6e4dc; }
        .kag-text-blood { color: ${accentColor}; }
    `;

    const content = (
        <div ref={containerRef} className={`w-full min-h-screen kag-theme relative selection:bg-white selection:text-black ${isCardPreview ? 'overflow-hidden' : ''}`}>
            <style dangerouslySetInnerHTML={{ __html: fontStyleString }} />
            
            {!isMobileView && !isCardPreview && (
                <>
                    <div className="kag-cursor-dot" id="kag-cursor-dot"></div>
                    <div className="kag-cursor-outline" id="kag-cursor-outline"></div>
                </>
            )}

            <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference kag-text-bone pointer-events-none">
                <div className="font-kag-mono text-sm tracking-widest uppercase font-bold hover-trigger pointer-events-auto">Dynamic / 01</div>
                <div className="font-kag-brutal text-3xl hover-trigger pointer-events-auto">
                    <EditableText entity="appearance" field="kag_logo" value={getCustomText('kag_logo', 'KXT.')} isEditor={isEditor} />
                </div>
                <div className="font-kag-mono text-sm tracking-widest uppercase hover-trigger pointer-events-auto">
                    <EditableText entity="appearance" field="kag_nav_menu" value={getCustomText('kag_nav_menu', 'Menu')} isEditor={isEditor} />
                </div>
            </nav>

            {children}
        </div>
    );

    const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll === 'true');

    if (isSmoothScroll) {
        return (
            <ReactLenis root options={{ smoothWheel: true, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}>
                {content}
            </ReactLenis>
        );
    }

    return content;
}
