"use client";

import React, { useRef, useEffect } from 'react';
import Script from 'next/script';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { GithubStats } from '@/components/themes/widgets/GithubStats';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { TestimonialSection } from '@/components/features/testimonials/TestimonialSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HorizontalFlowTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: any) {
  // Data extraction logic
  const fullName = data?.profile?.fullName || data?.fullName || "Elevate Studio";
  const profession = data?.profile?.profession || data?.profession || "Technical Art Director";
  const bio = data?.profile?.bio || data?.bio || "We merge architectural precision with avant-garde web technology to engineer flagship digital products for global visionaries.";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;
  
  const allProjects = data?.projects || data?.user?.projects || [];
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');
  
  const awards = data?.certificates || data?.user?.certificates || [];
  const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom cursor state
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  const cursorText = useRef<HTMLSpanElement>(null);
  const floatingImg = useRef<HTMLImageElement>(null);

  const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll === 'true');

  // Use Lenis inside useEffect
  useEffect(() => {
    if (!isSmoothScroll) return; // Only run lenis if smooth scroll is enabled
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => { lenis.raf(time * 1000) });
    };
  }, [isCardPreview, isSmoothScroll]);

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

    // Animations
    gsap.from(".slide-up-text", {
      y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2
    });

    gsap.to(".hero-bg", {
      y: 200, 
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });

    gsap.from(".reveal-text", {
      scrollTrigger: { trigger: "#about", start: "top 80%" },
      y: 50, opacity: 0, duration: 1, ease: "power3.out"
    });

    // Horizontal scroll
    let mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const horizontalWrapper = document.querySelector('.horizontal-wrapper') as HTMLElement;
      const horizontalContainer = document.querySelector('.horizontal-container') as HTMLElement;
      
      if (horizontalWrapper && horizontalContainer) {
        function getScrollAmount() {
          let containerWidth = horizontalContainer.scrollWidth;
          return -(containerWidth - window.innerWidth);
        }

        const tween = gsap.to(horizontalContainer, {
          x: getScrollAmount,
          ease: "none"
        });

        ScrollTrigger.create({
          trigger: horizontalWrapper,
          start: "top top",
          end: () => `+=${getScrollAmount() * -1}`, 
          pin: true,
          animation: tween,
          scrub: true,
          invalidateOnRefresh: true 
        });
      }
    });

    // Bento Card 3D Tilt Logic
    if(window.innerWidth > 768) {
      const bentoCards = document.querySelectorAll('.bento-card');
      bentoCards.forEach(card => {
        const htmlCard = card as HTMLElement;
        htmlCard.addEventListener('mousemove', (e) => {
          const rect = htmlCard.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
          const rotateY = ((x - centerX) / centerX) * 10;
          
          gsap.to(htmlCard, {
            rotateX, rotateY, transformPerspective: 1000, duration: 0.5, ease: 'power2.out'
          });
        });
        
        htmlCard.addEventListener('mouseleave', () => {
          gsap.to(htmlCard, {
            rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power2.out'
          });
        });
      });
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tickerFunc);
      // Clean up hover states and classes
      document.body.classList.remove('hovering', 'cursor-text-active');
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#050505] text-[#FAFAFA] font-body min-h-screen relative antialiased theme-hf">
      {/* Script for phospher icons */}
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="lazyOnload" />
      {/* Styles */}
      <style dangerouslySetInnerHTML={{__html: `
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
            ${!isCardPreview && !isMobileView ? 'cursor: none;' : ''}
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

        .lenis.lenis-smooth { scroll-behavior: auto; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }

        #cursor-dot, #cursor-ring {
            position: fixed; top: 0; left: 0; transform: translate(-50%, -50%);
            border-radius: 50%; pointer-events: none; z-index: 10000;
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
      `}} />

      {/* NOISE & CURSOR */}
      <div className="noise"></div>
      {(!isCardPreview && !isMobileView) && (
        <>
          <div id="cursor-dot" ref={cursorDot}></div>
          <div id="cursor-ring" ref={cursorRing}><span id="cursor-text" ref={cursorText}></span></div>
          <img alt="Preview" className="floating-img" id="floating-image" ref={floatingImg} />
        </>
      )}

      {/* NAVBAR */}
      <nav className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-50 mix-blend-difference pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
              <a href="#" className="font-display font-semibold text-xl tracking-wide uppercase interactive-elem magnetic-btn">
                <EditableText value={fullName.split(' ')[0]} field="firstName" entity="profile" isEditor={isEditor} as="span" />
                <span className="text-accent">.</span>
              </a>
              <div className="font-mono text-[10px] text-textMuted uppercase tracking-widest hidden md:block">
                  <span id="live-time">Jakarta</span> WIB<br/>
                  {profession}
              </div>
          </div>
          
          <div className="flex gap-8 text-sm font-medium tracking-widest uppercase pointer-events-auto mt-2">
              <a href="#about" className="hover:text-accent transition-colors interactive-elem magnetic-btn hidden md:block">Profile</a>
              <a href="#work" className="hover:text-accent transition-colors interactive-elem magnetic-btn hidden md:block">Archive</a>
              <a href="#contact" className="hover:text-accent transition-colors interactive-elem magnetic-btn">Talk</a>
          </div>
      </nav>

      {/* MAIN */}
      <main className="w-full">
          {/* 01. HERO SECTION */}
          <section className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden px-4" id="hero">
              <div className="absolute inset-0 z-0 opacity-40">
                  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover hero-bg grayscale" alt="Abstract" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
              </div>

              <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start mt-20">
                  <p className="font-mono text-accent tracking-[0.3em] uppercase text-xs mb-4 slide-up-text">
                      <EditableText value={theme?.customTexts?.hf_hero_top || 'System / V2.0.26'} field="hf_hero_top" entity="appearance" isEditor={isEditor} as="span" />
                  </p>
                  <h1 className="font-display text-[12vw] md:text-[8vw] font-bold uppercase leading-[0.85] tracking-tight">
                      <div className="overflow-hidden"><span className="block slide-up-text"><EditableText value={theme?.customTexts?.hf_hero_t1 || 'Shaping'} field="hf_hero_t1" entity="appearance" isEditor={isEditor} as="span" /></span></div>
                      <div className="overflow-hidden"><span className="block slide-up-text"><EditableText value={theme?.customTexts?.hf_hero_t2 || 'Digital'} field="hf_hero_t2" entity="appearance" isEditor={isEditor} as="span" /></span></div>
                      <div className="overflow-hidden"><span className="block slide-up-text text-stroke" data-cursor="EXPLORE"><EditableText value={theme?.customTexts?.hf_hero_t3 || 'Realities'} field="hf_hero_t3" entity="appearance" isEditor={isEditor} as="span" /></span></div>
                  </h1>
                  
                  <div className="mt-12 flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-8">
                      <p className="font-body text-textMuted max-w-sm text-sm leading-relaxed slide-up-text">
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} maxLength={250} />
                      </p>
                      
                      <div className="slide-up-text relative w-24 h-24 flex items-center justify-center">
                          <svg className="rotating-badge absolute inset-0 w-full h-full text-textMuted" viewBox="0 0 100 100">
                              <path id="textPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none"></path>
                              <text fontFamily="Inter" fontSize="10.5" fontWeight="600" letterSpacing="2" fill="currentColor">
                                  <textPath href="#textPath">SCROLL TO EXPLORE • SCROLL TO EXPLORE •</textPath>
                              </text>
                          </svg>
                          <i className="ph ph-arrow-down text-xl text-accent"></i>
                      </div>
                  </div>
              </div>
          </section>

          {/* 02. KINETIC MARQUEE */}
          <section className="py-12 md:py-24 border-y border-white/10 bg-surface/30">
              <div className="marquee-wrapper mb-4">
                  <div className="marquee-content font-display text-5xl md:text-7xl font-bold uppercase tracking-tight text-white/5">
                      <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq1_1 || 'Awwwards SOTD'} field="hf_mq1_1" entity="appearance" isEditor={isEditor} as="span" /></span>•
                      <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq1_2 || 'FWA of the Day'} field="hf_mq1_2" entity="appearance" isEditor={isEditor} as="span" /></span>•
                      <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq1_3 || 'Webby Nominee'} field="hf_mq1_3" entity="appearance" isEditor={isEditor} as="span" /></span>•
                      <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq1_4 || 'CSSDA Winner'} field="hf_mq1_4" entity="appearance" isEditor={isEditor} as="span" /></span>•
                      
                      <span className="mx-8">{theme?.customTexts?.mq1_1 || 'Awwwards SOTD'}</span>•
                      <span className="mx-8">{theme?.customTexts?.mq1_2 || 'FWA of the Day'}</span>•
                      <span className="mx-8">{theme?.customTexts?.mq1_3 || 'Webby Nominee'}</span>•
                      <span className="mx-8">{theme?.customTexts?.mq1_4 || 'CSSDA Winner'}</span>•
                  </div>
              </div>
              <div className="marquee-wrapper">
                  <div className="marquee-content reverse font-display text-5xl md:text-7xl font-bold uppercase tracking-tight text-white/5">
                      <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq2_1 || 'Creative Strategy'} field="hf_mq2_1" entity="appearance" isEditor={isEditor} as="span" /></span>•
                      <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq2_2 || 'WebGL Engineering'} field="hf_mq2_2" entity="appearance" isEditor={isEditor} as="span" /></span>•
                      <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq2_3 || 'Spatial UX/UI'} field="hf_mq2_3" entity="appearance" isEditor={isEditor} as="span" /></span>•
                      <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq2_4 || 'Motion Design'} field="hf_mq2_4" entity="appearance" isEditor={isEditor} as="span" /></span>•
                      
                      <span className="mx-8">{theme?.customTexts?.mq2_1 || 'Creative Strategy'}</span>•
                      <span className="mx-8">{theme?.customTexts?.mq2_2 || 'WebGL Engineering'}</span>•
                      <span className="mx-8">{theme?.customTexts?.mq2_3 || 'Spatial UX/UI'}</span>•
                      <span className="mx-8">{theme?.customTexts?.mq2_4 || 'Motion Design'}</span>•
                  </div>
              </div>
          </section>

          {/* 03. ABOUT */}
          <section id="about" className="py-32 px-6 md:px-10 max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-4">
                      <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4">
                        <EditableText value={theme?.customTexts?.hf_manifesto_label || '01 / The Manifesto'} field="hf_manifesto_label" entity="appearance" isEditor={isEditor} as="span" />
                      </h2>
                  </div>
                  <div className="md:col-span-8">
                      <h3 className="font-display text-3xl md:text-5xl font-medium leading-[1.2] tracking-tight reveal-text">
                          <EditableText value={theme?.customTexts?.hf_manifesto_text || "We don't believe in templates. We believe in bespoke digital architecture. Every project is an opportunity to push the boundaries of physics, interaction, and aesthetics on the web."} field="hf_manifesto_text" entity="appearance" isEditor={isEditor} as="span" />
                      </h3>
                      
                      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8">
                          <div>
                              <p className="font-display text-3xl md:text-4xl font-bold">{archiveItems.length || "45+"}</p>
                              <p className="font-mono text-[10px] text-textMuted mt-2 uppercase tracking-widest">Projects</p>
                          </div>
                          <div>
                              <p className="font-display text-3xl md:text-4xl font-bold">{awards.length || "12"}</p>
                              <p className="font-mono text-[10px] text-textMuted mt-2 uppercase tracking-widest">Awards</p>
                          </div>
                          <div>
                              <p className="font-display text-3xl md:text-4xl font-bold">8</p>
                              <p className="font-mono text-[10px] text-textMuted mt-2 uppercase tracking-widest">Years Active</p>
                          </div>
                          <div>
                              <p className="font-display text-3xl md:text-4xl font-bold">∞</p>
                              <p className="font-mono text-[10px] text-textMuted mt-2 uppercase tracking-widest">Possibilities</p>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* 04. HORIZONTAL SCROLL PROJECTS */}
          <section id="work" className="bg-surface relative" data-cursor="DRAG">
              <div className="horizontal-wrapper">
                  <div className="absolute top-0 left-0 w-full p-6 md:p-10 z-10 pointer-events-none flex justify-between items-end h-screen">
                      <h2 className="font-display text-6xl md:text-[8vw] font-bold uppercase tracking-tight opacity-10">
                        <EditableText value={theme?.customTexts?.hf_archive_title || 'Archive'} field="hf_archive_title" entity="appearance" isEditor={isEditor} as="span" />
                      </h2>
                      <div className="font-mono text-xs opacity-50 uppercase tracking-widest mb-4">
                        <EditableText value={theme?.customTexts?.hf_archive_subtitle || 'Scroll Horizontal →'} field="hf_archive_subtitle" entity="appearance" isEditor={isEditor} as="span" />
                      </div>
                  </div>
                  <div className="horizontal-container">
                      
                      {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';

                        return (
                        <div key={i} className="project-card group" data-cursor={isVideo ? "PLAY" : "VIEW"}>
                            <LazyImage src={isVideo ? (p.thumbnailUrl || getVideoThumbnail(p.mediaUrl)) : p.mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={p.title} />
                            
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500"></div>
                            
                            {isVideo && (
                                <i className="ph-fill ph-play-circle text-6xl text-white opacity-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform pointer-events-none"></i>
                            )}
                            
                            <div className="absolute top-8 left-8 flex gap-2">
                                <span className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">{p.projectType || 'Case Study'}</span>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                                <div>
                                    <p className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-2">{new Date(p.createdAt || Date.now()).getFullYear()} / {p.projectType || 'Design'}</p>
                                    <h3 className="font-display text-4xl md:text-6xl font-bold uppercase">{p.title}</h3>
                                </div>
                            </div>
                        </div>
                      )}) : (
                        [1,2,3,4].map((i) => (
                          <div key={i} className="project-card group" data-cursor="VIEW">
                              <img src={`https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" alt="Preview" />
                              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500"></div>
                              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                  <div>
                                      <p className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-2">2026 / Project {i}</p>
                                      <h3 className="font-display text-4xl md:text-6xl font-bold uppercase">Sample Case</h3>
                                  </div>
                              </div>
                          </div>
                        ))
                      )}

                      <div className="w-[10vw] h-full flex-shrink-0"></div>
                  </div>
              </div>
          </section>

          {/* 05. 3D SHOWCASE */}
          {items3D.length > 0 && (
            <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-20">
              <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
                 <EditableText value={theme?.customTexts?.hf_showcase3d_label || '3D Space'} field="hf_showcase3d_label" entity="appearance" isEditor={isEditor} as="span" />
              </h2>
              
              <div className={`grid grid-cols-1 ${items3D.length > 1 ? 'md:grid-cols-2' : ''} gap-8 w-full`}>
                {items3D.map((p: any, i: number) => (
                  <div key={i} className="group bento-card bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 overflow-hidden relative">
                    <div className={`w-full ${items3D.length === 1 ? 'h-[50vh] md:h-[70vh]' : 'h-80'} rounded-xl overflow-hidden relative mb-6`}>
                       <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-display font-medium uppercase tracking-tight text-white mb-2 ${items3D.length === 1 ? 'text-3xl md:text-5xl' : 'text-2xl'}`}>{p.title}</h3>
                        {p.description && <p className={`font-body text-textMuted ${items3D.length === 1 ? 'text-base max-w-2xl' : 'text-sm'}`}>{p.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 06. EXPERTISE (BENTO GRID) */}
          <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full border-t border-white/10 relative z-20">
              <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
                <EditableText value={theme?.customTexts?.hf_expertise_label || '02 / Expertise'} field="hf_expertise_label" entity="appearance" isEditor={isEditor} as="span" />
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full" style={{ perspective: '1000px' }}>
                  
                  {/* Card 1: Wide */}
                  <div className="bento-card group col-span-1 md:col-span-2 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative min-h-[300px]" data-cursor="EXPLORE" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 pointer-events-auto" style={{ transform: 'translateZ(30px)' }}>
                        <h3 className="font-display text-4xl md:text-5xl font-medium uppercase tracking-tight mb-4">
                          <EditableText value={theme?.customTexts?.hf_srv1_title || 'Digital Strategy'} field="hf_srv1_title" entity="appearance" isEditor={isEditor} />
                        </h3>
                        <p className="font-body text-textMuted max-w-md text-sm md:text-base">
                          <EditableText value={theme?.customTexts?.hf_srv1_desc || 'Brand positioning, architecture, and user journey mapping designed to elevate your digital presence and drive measurable impact.'} field="hf_srv1_desc" entity="appearance" isEditor={isEditor} />
                        </p>
                      </div>
                      <div className="relative z-10 mt-12 flex justify-end" style={{ transform: 'translateZ(40px)' }}>
                         <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300 text-white">
                             <i className="ph ph-arrow-up-right text-xl"></i>
                         </div>
                      </div>
                  </div>

                  {/* Card 2: Tall (Tanpa Gambar, Pure CSS Design) */}
                  <div className="bento-card group col-span-1 md:row-span-2 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-end overflow-hidden relative min-h-[400px] md:min-h-full" data-cursor="VIEW" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
                          {/* Glowing Orb */}
                          <div className="w-64 h-64 bg-accent/20 rounded-full blur-[80px] group-hover:bg-accent/40 group-hover:scale-150 transition-all duration-1000"></div>
                          {/* Dot Grid Pattern */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(250,250,250,0.1)_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
                      </div>
                      <div className="relative z-10 pointer-events-auto" style={{ transform: 'translateZ(30px)' }}>
                          <span className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4 inline-block text-white">Focus</span>
                          <h3 className="font-display text-3xl md:text-4xl font-medium uppercase tracking-tight mb-2 text-white">
                            <EditableText value={theme?.customTexts?.hf_srv2_title || 'Spatial UI/UX'} field="hf_srv2_title" entity="appearance" isEditor={isEditor} />
                          </h3>
                          <p className="font-body text-textMuted text-sm">
                            <EditableText value={theme?.customTexts?.hf_srv2_desc || 'Designing interfaces that feel tactile, logical, and beautiful.'} field="hf_srv2_desc" entity="appearance" isEditor={isEditor} />
                          </p>
                      </div>
                  </div>

                  {/* Card 3: Small Square */}
                  <div className="bento-card group col-span-1 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative min-h-[250px]" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <i className="ph ph-code text-4xl text-textMuted group-hover:text-accent transition-colors duration-300" style={{ transform: 'translateZ(20px)' }}></i>
                      <div className="mt-8 relative z-10 pointer-events-auto" style={{ transform: 'translateZ(30px)' }}>
                         <h3 className="font-display text-2xl font-medium uppercase tracking-tight mb-2">
                           <EditableText value={theme?.customTexts?.hf_srv3_title || 'Creative Eng'} field="hf_srv3_title" entity="appearance" isEditor={isEditor} />
                         </h3>
                         <p className="font-body text-textMuted text-xs">
                           <EditableText value={theme?.customTexts?.hf_srv3_desc || 'WebGL, GSAP, and robust frontend architectures.'} field="hf_srv3_desc" entity="appearance" isEditor={isEditor} />
                         </p>
                      </div>
                  </div>

                  {/* Card 4: Stats */}
                  <div className="bento-card group col-span-1 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-center items-center overflow-hidden relative min-h-[250px]" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div style={{ transform: 'translateZ(40px)' }} className="text-center">
                        <h4 className="font-display text-6xl md:text-7xl font-bold text-transparent" style={{ WebkitTextStroke: '1px rgba(250,250,250,0.5)' }}>100<span className="text-accent">%</span></h4>
                        <p className="font-mono text-[10px] text-textMuted mt-4 uppercase tracking-widest text-center">Pixel<br/>Perfection</p>
                      </div>
                  </div>

              </div>
          </section>

          {/* TESTIMONIALS */}
          {testimonials.length > 0 && (
            <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full border-t border-white/10 relative z-20">
               <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
                 <EditableText value={theme?.customTexts?.hf_testimonials_label || '0X / Client Words'} field="hf_testimonials_label" entity="appearance" isEditor={isEditor} as="span" />
               </h2>
               <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-4">
                 <TestimonialSection testimonials={testimonials} variant="grid" isEditor={isEditor} theme={theme} />
               </div>
            </section>
          )}

          {/* OPEN SOURCE & DESIGN WIDGETS */}
          <div className="horizontal-wrapper !h-auto !overflow-visible border-t border-white/10" style={{ height: 'auto', overflow: 'visible' }}>
            <div className="flex flex-col @lg:flex-row gap-8 w-full max-w-7xl mx-auto py-20 px-6 md:px-10 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
              <GithubStats userId={data?.userId || data?.user?.id || data?.id || ""} variant="horizontal-flow" />
              <CanvaShowcase userId={data?.userId || data?.user?.id || data?.id || ""} variant="horizontal-flow" />
              <PenpotShowcase userId={data?.userId || data?.user?.id || data?.id || ""} variant="horizontal-flow" />
            </div>
          </div>

          {/* 07. AWARDS */}
          <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full mb-20" id="awards">
              <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
                 <EditableText value={theme?.customTexts?.hf_recognition_label || '03 / Recognition'} field="hf_recognition_label" entity="appearance" isEditor={isEditor} as="span" />
              </h2>
              <div className="w-full text-sm font-mono uppercase tracking-widest text-textMuted border-b border-white/20 pb-4 flex justify-between">
                  <span>Award</span>
                  <span>Project</span>
                  <span className="hidden md:block">Year</span>
              </div>
              
              {awards.length > 0 ? awards.map((award: any, i: number) => (
                <div key={i} className="w-full flex justify-between items-center py-6 border-b border-white/10 hover:bg-white/5 transition-colors px-4 -mx-4 rounded" data-cursor="AWARD">
                    <span className="font-display text-xl font-medium text-white tracking-wide w-1/3">{award.title}</span>
                    <span className="w-1/3 text-center">{award.issuer}</span>
                    <span className="w-1/3 text-right hidden md:block">{award.year || new Date(award.createdAt).getFullYear()}</span>
                </div>
              )) : (
                <>
                  <div className="w-full flex justify-between items-center py-6 border-b border-white/10 hover:bg-white/5 transition-colors px-4 -mx-4 rounded" data-cursor="AWARD">
                      <span className="font-display text-xl font-medium text-white tracking-wide w-1/3">Site of the Day</span>
                      <span className="w-1/3 text-center">Aether E-Com</span>
                      <span className="w-1/3 text-right hidden md:block">2026</span>
                  </div>
                  <div className="w-full flex justify-between items-center py-6 border-b border-white/10 hover:bg-white/5 transition-colors px-4 -mx-4 rounded" data-cursor="AWARD">
                      <span className="font-display text-xl font-medium text-white tracking-wide w-1/3">Developer Award</span>
                      <span className="w-1/3 text-center">Nexus Fin</span>
                      <span className="w-1/3 text-right hidden md:block">2025</span>
                  </div>
                </>
              )}
          </section>

          {/* 08. FOOTER */}
          <section id="contact" className="bg-accent text-bg py-20 px-6 md:px-10 relative overflow-hidden flex flex-col justify-between min-h-[80vh]">
              <div className="relative z-10 mt-10">
                  <p className="font-mono text-[10px] font-semibold tracking-[0.3em] uppercase mb-4">
                     <EditableText value={theme?.customTexts?.hf_contact_label || '04 / Start a project'} field="hf_contact_label" entity="appearance" isEditor={isEditor} as="span" />
                  </p>
                  <a href={`mailto:${userEmail}`} className="inline-block group magnetic-btn" data-cursor="SAY HI">
                      <h2 className="font-display text-[14vw] md:text-[11vw] font-bold uppercase leading-[0.8] tracking-tighter">
                          <EditableText value={theme?.customTexts?.hf_contact_title || "Let's Talk"} field="hf_contact_title" entity="appearance" isEditor={isEditor} as="span" />
                      </h2>
                      <div className="w-full h-2 bg-bg transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100 mt-4"></div>
                  </a>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mt-24 pt-8 border-t border-bg/20 font-mono text-[10px] uppercase tracking-widest font-semibold gap-8">
                  <div className="flex gap-8">
                      {links.map((link: any, idx: number) => (
                        <a key={idx} href={link.url} target="_blank" className="hover:underline magnetic-btn">{link.platform}</a>
                      ))}
                      {links.length === 0 && (
                        <>
                          <a href="#" className="hover:underline magnetic-btn">Twitter / X</a>
                          <a href="#" className="hover:underline magnetic-btn">Instagram</a>
                          <a href="#" className="hover:underline magnetic-btn">LinkedIn</a>
                        </>
                      )}
                  </div>
                  <div className="text-right flex flex-col items-end">
                      <p>{fullName} © {new Date().getFullYear()}</p>
                      <p className="text-bg/60 mt-2">portfo.be/{subdomain}</p>
                  </div>
              </div>
          </section>
      </main>
    </div>
  );
}
