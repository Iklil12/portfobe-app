"use client";

import React, { useRef, useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useInView } from 'framer-motion';

const Abstract3DShowcase = dynamic(() => import('../ui/Abstract3DShowcase').then(mod => mod.Abstract3DShowcase), { ssr: false });
const ThemeHoverShowcase = dynamic(() => import('../ui/ThemeHoverShowcase').then(mod => mod.ThemeHoverShowcase), { ssr: false });
import './sync-engine-integrations.css';
import { AnalyticsDashboard } from './sync-engine/AnalyticsDashboard';
import { GitHubPattern, PenpotPattern, CanvaPattern, AIPattern } from './sync-engine/SyncEnginePatterns';
import { LazyMobilePillar } from './sync-engine/LazyMobilePillar';


// ============================================================================
// ARTISTIC CONCEPT: THE INFINITE DATA SEA (PURE ABSTRACT EXHIBITION)
// Epic Cinematic Entrance Animations added for a breathtaking first impression.
// ============================================================================

interface Pillar {
  id: string;
  name: string;
  type: string;
  payloadStr: string;
  renderComponent: (instanceId?: string, isActive?: boolean) => React.ReactNode;
}

const PILLARS: Pillar[] = [
  {
    id: 'integrations',
    name: 'Integrations',
    type: 'External Data Sync',
    payloadStr: "{\n  \"action\": \"SYNC_ALL\",\n  \"targets\": [\"GitHub\", \"Penpot\", \"Canva\", \"AI Core\"]\n}",
    renderComponent: (instanceId, isActive) => (
      <div className="w-full h-[400px] lg:h-[450px] flex flex-col gap-4 sm:gap-6">

        {/* 2x2 Grid Layout with responsive gaps */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 flex-1">
          {[
            {
              id: 'github',
              icon: 'fab fa-github',
              iconBg: 'bg-neutral-800', // GitHub dark
              date: '28 Nov 2024',
              label: 'Code Repositories',
              title: 'GitHub',
              subtitle: 'Commits & PRs sync',
              location: 'Pipeline Active',
              pattern: <GitHubPattern />
            },
            {
              id: 'penpot',
              icon: 'fas fa-pen-nib',
              iconBg: 'bg-neutral-800',
              date: '12 Oct 2024',
              label: 'UI/UX Design',
              title: 'Penpot',
              subtitle: 'Design assets sync',
              location: 'Pipeline Active',
              pattern: <PenpotPattern />
            },
            {
              id: 'canva',
              icon: 'fas fa-layer-group',
              iconBg: 'bg-neutral-800',
              date: '30 Dec 2024',
              label: 'Presentations',
              title: 'Canva',
              subtitle: 'Slides & graphics sync',
              location: 'Pipeline Active',
              pattern: <CanvaPattern />
            },
            {
              id: 'ai',
              icon: 'fas fa-robot',
              iconBg: 'bg-neutral-800',
              date: '13 Aug 2024',
              label: 'Artificial Intelligence',
              title: 'AI Integration',
              subtitle: 'Automated content',
              location: 'Core Neural Active',
              pattern: <AIPattern />
            }
          ].map((item) => (
            <div key={item.id} className="bg-[#0a0a0a] rounded-none p-3 sm:p-4 relative overflow-hidden flex flex-col justify-between group hover:bg-[#111111] transition-colors border border-white/10">

              {/* Top Row: Logo */}
              <div className="flex justify-between items-start relative z-10">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-none ${item.iconBg} flex items-center justify-center border border-white/10 shadow-lg`}>
                  <i className={`${item.icon} text-white text-[10px] sm:text-sm`}></i>
                </div>
              </div>

              {/* Middle Row: Text Content */}
              <div className="mt-2.5 sm:mt-4 mb-1 sm:mb-2 relative z-10">
                <p className="text-white/50 text-[8px] sm:text-[10px] uppercase tracking-wider mb-0.5 sm:mb-1">{item.label}</p>
                <h4 className="text-white text-xs sm:text-sm font-bold tracking-tight leading-tight">{item.title}</h4>
                <p className="text-white/70 text-[9px] sm:text-xs mt-0.5 sm:mt-1 font-mono">{item.subtitle}</p>
              </div>

              {/* Bottom Row: Location */}
              <div className="relative z-10 mt-auto pt-1 sm:pt-2">
                <span className="text-white/40 text-[8px] sm:text-[9px] uppercase tracking-wider">{item.location}</span>
              </div>

              {/* Background Pattern */}
              {item.pattern}
            </div>
          ))}
        </div>

      </div>
    )
  },
  {
    id: '3d-showcase',
    name: '3D Showcase',
    type: 'Immersive WebGL',
    payloadStr: "{\n  \"renderer\": \"Bunny.net Edge\",\n  \"model\": \"architecture_v2.glb\",\n  \"polygons\": 142050,\n  \"materials\": \"PBR_Active\"\n}",
    renderComponent: (instanceId, isActive) => (
      <div className="w-full transition-all">
        <div className="w-full aspect-square rounded-none bg-gradient-to-tr from-neutral-950 to-neutral-900 border border-white/10 relative overflow-hidden group">

          <Abstract3DShowcase isActive={isActive} />

          <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/50 tracking-widest pointer-events-none">
            [ WEBGL ACCELERATED ]
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'themes',
    name: 'Theme Engine',
    type: 'Architectural Layouts',
    payloadStr: "{\n  \"activeId\": \"morphic_hover\",\n  \"cssVariables\": {\n    \"--bg\": \"#000000\",\n    \"--text\": \"#ffffff\",\n    \"--radius\": \"0px\"\n  }\n}",
    renderComponent: (instanceId, isActive) => (
      <div className="w-full h-[380px] md:h-[450px]">
        <ThemeHoverShowcase />
      </div>
    )
  },
  {
    id: 'analytics',
    name: 'Analytics',
    type: 'Visitor Intelligence',
    payloadStr: "{\n  \"event\": \"SESSION_START\",\n  \"visitorId\": \"v_9f82x\",\n  \"device\": \"Desktop\",\n  \"country\": \"ID\",\n  \"duration\": 245\n}",
    renderComponent: (instanceId, isActive) => (
      <AnalyticsDashboard instanceId={instanceId} />
    )
  }
];

// Apple-style cinematic easing curve
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SyncEngineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalSections = PILLARS.length;
    let newIndex = Math.floor(latest * totalSections);
    if (newIndex >= totalSections) newIndex = totalSections - 1;
    if (newIndex < 0) newIndex = 0;

    // Use functional state update to completely avoid stale closure issues
    // React will bail out of the render if it returns the exact same value.
    setActiveIndex(prev => prev === newIndex ? prev : newIndex);
  });

  const activePillar = PILLARS[activeIndex];

  return (
    <div className="bg-[#050505]">
      {/* MOBILE LAYOUT (lg:hidden) */}
      <div className="lg:hidden w-full bg-[#050505] py-20 px-6 flex flex-col gap-16 relative z-20">
        <div className="flex flex-col gap-2">
          <span className="text-[#ff9e00] font-mono text-[10px] tracking-[0.4em] uppercase block border-l-2 border-[#ff9e00] pl-4">
            [ PLATFORM PILLARS ]
          </span>
          <h2 className="text-white text-3xl font-black tracking-tight mt-2 uppercase">
            Core Architecture
          </h2>
        </div>

        <div className="flex flex-col gap-14">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="flex flex-col gap-5 border-t border-white/5 pt-8 first:border-t-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[9px] tracking-widest uppercase text-neutral-500">
                    {pillar.type}
                  </span>
                  <h3 className="text-white text-2xl font-bold uppercase tracking-tight mt-1">
                    {pillar.name}
                  </h3>
                </div>


              </div>

              {/* Render visual component — lazy loaded on mobile */}
              <div className="w-full relative z-10">
                <LazyMobilePillar height={pillar.id === '3d-showcase' ? '450px' : '400px'}>
                  {pillar.renderComponent('mobile')}
                </LazyMobilePillar>
              </div>


            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP LAYOUT (hidden lg:block) */}
      <section ref={containerRef} className="relative w-full h-[320vh] bg-[#050505] font-sans hidden lg:block">

        <div
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
        >

          {/* Abstract Orbs (Epic Bloom Entrance) - Optimized */}
          <div
            className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[60vw] h-[60vw] bg-[radial-gradient(circle,_rgba(255,158,0,0.04)_0%,_transparent_70%)] rounded-full pointer-events-none z-0 transform-gpu"
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] bg-[radial-gradient(circle,_rgba(255,158,0,0.02)_0%,_transparent_70%)] rounded-full pointer-events-none z-0 transform-gpu"
          ></div>

          {/* LAYER 1: RAW CODE WATERMARK (Matrix Fade In) */}
          <div
            className="absolute top-1/2 right-[10%] -translate-y-1/2 pointer-events-none z-0 select-none opacity-[0.03] w-[50vw] h-[30vh] overflow-hidden"
            translate="no"
          >
            {PILLARS.map((pillar, idx) => {
              const isActive = activeIndex === idx;
              return (
                <motion.pre
                  key={pillar.id}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : (activeIndex > idx ? -20 : 20),
                    visibility: isActive ? 'visible' : 'hidden'
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  style={{ willChange: "transform, opacity" }}
                  className="text-[4vw] font-mono text-[#ff9e00] font-bold leading-none tracking-tighter absolute inset-0 flex items-center justify-end text-right"
                >
                  {pillar.payloadStr}
                </motion.pre>
              );
            })}
          </div>

          {/* LAYER 2: VERTICAL LABEL (Slide in) */}
          <div
            className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center pointer-events-none z-30"
          >
            <span className="font-mono text-[8px] text-neutral-600 tracking-[0.5em] uppercase whitespace-nowrap">
              PORTFOBE CORE ENGINE // V2.0
            </span>
          </div>

          <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 h-full py-20">

            {/* ABSOLUTE HEADER TO PREVENT JIGGLE */}
            <div
              className="absolute top-12 md:top-24 left-6 md:left-12 z-30 hidden md:block"
            >
              <span className="text-[#ff9e00] font-mono text-[10px] tracking-[0.4em] uppercase block border-l-2 border-[#ff9e00] pl-4">
                [ PLATFORM PILLARS ]
              </span>
            </div>

            {/* ABSOLUTE FOOTER TO PREVENT JIGGLE */}
            <div
              className="absolute bottom-12 md:bottom-24 left-6 md:left-12 z-30 hidden md:flex items-center gap-3 text-neutral-600 font-mono text-[9px] tracking-widest uppercase animate-pulse"
            >
              <i className="fas fa-arrow-down"></i> KEEP SCROLLING
            </div>

            {/* LAYER 3: MASSIVE HOLLOW TYPOGRAPHY MENU WITH SCROLL TRACKER */}
            <div className="w-full lg:w-3/5 flex flex-col justify-center gap-2 relative z-20 mt-8 md:mt-0">
              {/* Mobile-only header (flow-based) */}
              <div className="md:hidden mb-6">
                <span className="text-[#ff9e00] font-mono text-[10px] tracking-[0.4em] uppercase block border-l-2 border-[#ff9e00] pl-4">
                  [ PLATFORM PILLARS ]
                </span>
              </div>

              <div className="flex gap-6 md:gap-8 items-stretch relative">
                {/* Scroll Timeline Tracker (Desktop Only) */}
                <div className="hidden md:flex flex-col items-center relative w-1 select-none">
                  {/* Background Track Line */}
                  <div className="absolute top-2 bottom-2 w-[2px] bg-white/10 rounded-full" />

                  {/* Active Progress Fill Line */}
                  <motion.div
                    className="absolute top-2 w-[2px] bg-gradient-to-b from-[#ff9e00] to-amber-500 rounded-full origin-top"
                    style={{ scaleY: scrollYProgress, originY: 0, height: 'calc(100% - 16px)' }}
                  />

                  {/* Floating Glowing Indicator Dot */}
                  <div
                    className="absolute w-3.5 h-3.5 rounded-full bg-[#ff9e00] border-2 border-neutral-950 shadow-[0_0_12px_rgba(255,158,0,0.6)] -left-[5px] -translate-y-1/2 transition-all duration-300 ease-out"
                    style={{
                      top: `calc(${activeIndex * (100 / (PILLARS.length - 1))}% + ${8 - activeIndex * 5.33}px)`,
                    }}
                  />
                </div>

                {/* Typography Menu */}
                <div className="flex flex-col gap-1 md:gap-3 flex-1">
                  {PILLARS.map((pillar, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <div key={pillar.id}>
                        <div
                          className={`flex flex-col justify-center relative origin-left transition-all duration-300 ease-out ${isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-90'
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <h1
                              className="text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] font-black uppercase leading-[0.9] select-none transition-colors duration-300"
                              style={{
                                WebkitTextStroke: isActive ? '0px' : '1.5px rgba(255,255,255,0.2)',
                                color: isActive ? '#ffffff' : 'transparent',
                              }}
                            >
                              {pillar.name}
                            </h1>
                          </div>

                          <div
                            className={`overflow-hidden transition-all duration-300 ease-out ${isActive ? 'h-8 md:h-12 opacity-100' : 'h-0 opacity-0'
                              }`}
                          >
                            <span className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-500 ml-1 block mt-1 md:mt-3">
                              ARCHITECTURE // {pillar.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LAYER 4: THE HOLOGRAPHIC RENDERED ARTIFACT */}
            <div
              className="w-full lg:w-2/5 flex items-center justify-end relative z-30 min-h-[400px]"
            >
              {/* CYBERPUNK VIEWPORT WINDOW FRAME */}
              <div className="w-full max-w-lg relative bg-[#070708] border border-white/10 p-1 sm:p-2 shadow-[0_0_50px_rgba(255,158,0,0.02)]">
                {/* Tech Corner Brackets */}
                <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-[#ff9e00]"></div>
                <div className="absolute -top-[2px] -right-[2px] w-4 h-4 border-t-2 border-r-2 border-[#ff9e00]"></div>
                <div className="absolute -bottom-[2px] -left-[2px] w-4 h-4 border-b-2 border-l-2 border-[#ff9e00]"></div>
                <div className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2 border-[#ff9e00]"></div>

                {/* Mock OS Header Bar */}
                <div className="w-full flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-black/40 font-mono text-[9px] text-neutral-500 mb-3 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                    <span className="ml-2 uppercase tracking-widest text-white/40">CORE_MONITOR.sys</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>BUFF: 99.4%</span>
                    <span className="animate-pulse text-[#ff9e00]">● LIVE</span>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full relative h-[400px] lg:h-[450px] overflow-hidden bg-black/30">
                  {PILLARS.map((pillar, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <motion.div
                        key={pillar.id}
                        translate="no"
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          y: isActive ? 0 : (activeIndex > idx ? -30 : 30),
                          scale: isActive ? 1 : 0.96,
                          pointerEvents: isActive ? 'auto' : 'none',
                          visibility: isActive ? 'visible' : 'hidden'
                        }}
                        transition={{ duration: 0.5, ease: EASE }}
                        style={{ willChange: "transform, opacity" }}
                        className="w-full absolute inset-0 flex flex-col justify-center p-3 sm:p-5"
                      >
                        {pillar.renderComponent('desktop', isActive)}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Viewport Footer */}
                <div className="w-full flex justify-between items-center px-3 py-1.5 border-t border-white/5 bg-black/40 font-mono text-[8px] text-neutral-500 select-none mt-2">
                  <span className="tracking-widest uppercase">SYS_REF: {activePillar.id.toUpperCase()}</span>
                  <span>OP_CODE: 0x8F92</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
