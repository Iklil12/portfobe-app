"use client";

import React, { useRef } from 'react';
import Script from 'next/script';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { EditableText } from '@/components/ui/EditableText';
import { useLenis } from '@studio-freight/react-lenis';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HorizontalFlowShell({ children, theme, isMobileView, isCardPreview, isEditor, data }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  const cursorText = useRef<HTMLSpanElement>(null);
  const floatingImg = useRef<HTMLImageElement>(null);

  const fullName = data?.profile?.fullName || data?.fullName || "Elevate Studio";
  const profession = data?.profile?.profession || data?.profession || "Technical Art Director";

  useGSAP(() => {
    if (isCardPreview) return;

    // Cursor logic
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot.current) {
        gsap.set(cursorDot.current, { x: mouseX, y: mouseY });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    
    const tickerFunc = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (cursorRing.current) {
        gsap.set(cursorRing.current, { x: ringX, y: ringY }); 
      }
    };
    gsap.ticker.add(tickerFunc);

    // Magnetic buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    const onBtnMove = (e: any) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - v;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
    };
    const onBtnLeave = (e: any) => {
      const btn = e.currentTarget;
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    };

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', onBtnMove);
      btn.addEventListener('mouseleave', onBtnLeave);
      btn.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      btn.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // Data cursor injection
    const cursorElems = document.querySelectorAll('[data-cursor]');
    cursorElems.forEach(el => {
      el.addEventListener('mouseenter', function(this: any) {
        const text = this.getAttribute('data-cursor');
        if (cursorText.current) cursorText.current.innerText = text;
        document.body.classList.add('cursor-text-active');
      });
      el.addEventListener('mouseleave', function() {
        document.body.classList.remove('cursor-text-active');
        if (cursorText.current) cursorText.current.innerText = '';
      });
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tickerFunc);
      document.body.classList.remove('hovering', 'cursor-text-active');
    };
  }, { scope: containerRef, dependencies: [isEditor, isMobileView, isCardPreview] });

  const lenis = useLenis();
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      if (lenis) {
          lenis.scrollTo(id, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
          document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const fontStyleString = `
    @import url('https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

    .theme-hf {
        --bg: #050505;
        --surface: #111111;
        --surfaceHover: #1a1a1a;
        --textMain: #FAFAFA;
        --textMuted: #888888;
        --accent: #FF3366;
        
        font-family: 'Inter', sans-serif;
        background-color: var(--bg);
        color: var(--textMain);
        overflow-x: hidden;
        ${!isCardPreview && !isMobileView && !isEditor ? 'cursor: none;' : ''}
    }

    .theme-hf .font-display { font-family: 'Clash Display', sans-serif; }
    .theme-hf .font-body { font-family: 'Inter', sans-serif; }
    .theme-hf .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    
    .theme-hf .text-accent { color: var(--accent); }
    .theme-hf .bg-accent { background-color: var(--accent); }
    .theme-hf .bg-bg { background-color: var(--bg); }
    .theme-hf .bg-surface { background-color: var(--surface); }
    .theme-hf .text-bg { color: var(--bg); }
    .theme-hf .text-textMuted { color: var(--textMuted); }

    .theme-hf ::selection { background: var(--accent); color: #fff; }

    #cursor-dot, #cursor-ring {
        position: fixed; top: 0; left: 0; transform: translate(-50%, -50%);
        border-radius: 50%; pointer-events: none; z-index: 10000;
        ${isEditor ? 'display: none;' : ''}
    }
    #cursor-dot {
        width: 8px; height: 8px; background-color: #FAFAFA;
        transition: width 0.2s, height 0.2s, background-color 0.2s, opacity 0.2s;
    }
    #cursor-ring {
        width: 40px; height: 40px; border: 1px solid rgba(250,250,250,0.5);
        transition: width 0.3s, height 0.3s, border-color 0.3s, background-color 0.3s;
        display: flex; align-items: center; justify-content: center;
    }
    
    #cursor-text {
        font-family: 'Inter', sans-serif;
        font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
        color: #FAFAFA; opacity: 0; transition: opacity 0.3s;
        position: absolute; text-transform: uppercase;
    }

    body.hovering #cursor-dot { opacity: 0; }
    body.hovering #cursor-ring {
        width: 80px; height: 80px; border-color: var(--accent);
        background-color: rgba(255, 51, 102, 0.1); backdrop-filter: blur(2px);
    }
    body.cursor-text-active #cursor-dot { opacity: 0; }
    body.cursor-text-active #cursor-ring {
        width: 80px; height: 80px; border-color: rgba(250,250,250,0.2);
        background-color: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    }
    body.cursor-text-active #cursor-text { opacity: 1; }

    .theme-hf ::-webkit-scrollbar { display: none; }

    .marquee-wrapper { overflow: hidden; white-space: nowrap; display: flex; }
    .marquee-content { animation: scroll-left 25s linear infinite; display: flex; }
    .marquee-content.reverse { animation: scroll-right 25s linear infinite; }
    
    @keyframes scroll-left { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
    @keyframes scroll-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }

    .rotating-badge { animation: rotate 10s linear infinite; }
    @keyframes rotate { 100% { transform: rotate(360deg); } }

    .text-stroke {
        color: transparent;
        -webkit-text-stroke: 1px rgba(250,250,250,0.3);
        transition: -webkit-text-stroke 0.3s, color 0.3s;
    }
    .text-stroke:hover { color: #FAFAFA; -webkit-text-stroke: 1px transparent; }

    .horizontal-wrapper {
        width: 100%; height: 100vh; overflow: hidden; position: relative;
    }
    .horizontal-container {
        display: flex; height: 100%; width: max-content; padding-left: 5vw;
    }
    
    .project-card {
        width: 60vw; height: 70vh; margin-top: 15vh; margin-right: 5vw;
        position: relative; overflow: hidden; border-radius: 8px;
    }

    .floating-img {
        position: fixed; top: 0; left: 0;
        width: 350px; height: 450px; object-fit: cover;
        border-radius: 8px; pointer-events: none;
        opacity: 0; transform: scale(0.8) translate(-50%, -50%);
        z-index: 50; filter: grayscale(100%); transition: filter 0.3s;
    }
    
    @media (max-width: 768px) {
        .theme-hf { cursor: auto; }
        #cursor-dot, #cursor-ring, .floating-img { display: none; }
        .horizontal-wrapper { height: auto; overflow: visible; }
        .horizontal-container { flex-direction: column; width: 100%; padding: 0 5vw; }
        .project-card { width: 100%; height: 50vh; margin-top: 5vh; margin-right: 0; margin-bottom: 5vh; }
    }

    .noise {
        position: fixed; inset: 0; z-index: 9999; opacity: 0.04; pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
  `;

  return (
    <div ref={containerRef} className="bg-[#050505] text-[#FAFAFA] font-body min-h-screen relative antialiased theme-hf">
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="lazyOnload" />
      <style dangerouslySetInnerHTML={{__html: fontStyleString}} />

      <div className="noise"></div>
      {(!isCardPreview && !isMobileView) && (
        <>
          <div id="cursor-dot" ref={cursorDot}></div>
          <div id="cursor-ring" ref={cursorRing}><span id="cursor-text" ref={cursorText}></span></div>
          <img alt="Preview" className="floating-img" id="floating-image" ref={floatingImg} />
        </>
      )}

      <nav className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-50 mix-blend-difference pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
              <a href="#" onClick={(e) => handleScrollTo(e, '#hero')} className="font-display font-semibold text-xl tracking-wide uppercase interactive-elem magnetic-btn">
                <EditableText value={fullName.split(' ')[0]} field="firstName" entity="profile" isEditor={isEditor} as="span" />
                <span className="text-accent">.</span>
              </a>
              <div className="font-mono text-[10px] text-textMuted uppercase tracking-widest hidden md:block">
                  <span id="live-time">Jakarta</span> WIB<br/>
                  {profession}
              </div>
          </div>
          
          <div className="flex gap-8 text-sm font-medium tracking-widest uppercase pointer-events-auto mt-2">
              <a href="#about" onClick={(e) => handleScrollTo(e, '#about')} className="hover:text-accent transition-colors interactive-elem magnetic-btn hidden md:block">Profile</a>
              <a href="#work" onClick={(e) => handleScrollTo(e, '#work')} className="hover:text-accent transition-colors interactive-elem magnetic-btn hidden md:block">Archive</a>
              <a href="#contact" onClick={(e) => handleScrollTo(e, '#contact')} className="hover:text-accent transition-colors interactive-elem magnetic-btn">Talk</a>
          </div>
      </nav>

      <main className="w-full">
          {children}
      </main>
    </div>
  );
}
