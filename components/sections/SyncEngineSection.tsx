"use client";

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

// ============================================================================
// ARTISTIC CONCEPT: THE INFINITE DATA SEA (PURE ABSTRACT EXHIBITION)
// Epic Cinematic Entrance Animations added for a breathtaking first impression.
// ============================================================================

interface Pillar {
  id: string;
  name: string;
  type: string;
  payloadStr: string;
  renderComponent: () => React.ReactNode;
}

const PILLARS: Pillar[] = [
  {
    id: 'integrations',
    name: 'Integrations',
    type: 'External Data Sync',
    payloadStr: "{\n  \"action\": \"SYNC_ALL\",\n  \"targets\": [\"GitHub\", \"Canva\", \"Penpot\"],\n  \"status\": \"ACTIVE\",\n  \"latency\": \"14ms\"\n}",
    renderComponent: () => (
      <div className="bg-[#050505]/90 border border-white/10 p-6 md:p-8 rounded-[2rem] w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-white font-black text-xl tracking-tight">Connected Pipelines</h4>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-4">
               <i className="fab fa-github text-white text-xl"></i>
               <span className="text-sm text-white font-medium tracking-tight">GitHub Repositories</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Synced</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-4">
               <i className="fas fa-pen-nib text-white text-xl"></i>
               <span className="text-sm text-white font-medium tracking-tight">Penpot UI Embeds</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Synced</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-4">
               <i className="fas fa-layer-group text-white text-xl"></i>
               <span className="text-sm text-white font-medium tracking-tight">Canva Presentations</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Synced</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: '3d-showcase',
    name: '3D Showcase',
    type: 'Immersive WebGL',
    payloadStr: "{\n  \"renderer\": \"Bunny.net Edge\",\n  \"model\": \"architecture_v2.glb\",\n  \"polygons\": 142050,\n  \"materials\": \"PBR_Active\"\n}",
    renderComponent: () => (
      <div className="bg-[#050505]/90 border border-white/10 p-6 md:p-8 rounded-[2rem] w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all">
        <div className="w-full aspect-square rounded-2xl bg-gradient-to-tr from-neutral-950 to-neutral-900 border border-white/5 flex items-center justify-center relative overflow-hidden group">
           <div className="w-32 h-32 border border-white/20 rotate-[60deg] scale-110 relative animate-[spin_15s_linear_infinite]">
              <div className="absolute inset-0 border border-emerald-500/30 rotate-12"></div>
              <div className="absolute inset-0 border border-blue-500/30 -rotate-12"></div>
           </div>
           
           <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/50 tracking-widest">
             [ WEBGL ACCELERATED ]
           </div>
           <div className="absolute top-6 right-6 flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
           </div>
        </div>
      </div>
    )
  },
  {
    id: 'themes',
    name: 'Theme Engine',
    type: 'Architectural Layouts',
    payloadStr: "{\n  \"activeId\": \"absolute_noir\",\n  \"cssVariables\": {\n    \"--bg\": \"#000000\",\n    \"--text\": \"#ffffff\",\n    \"--radius\": \"0px\"\n  }\n}",
    renderComponent: () => (
      <div className="bg-[#050505]/90 border border-white/10 rounded-[2rem] w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex h-[350px] transition-all">
        <div className="w-1/2 bg-[#020202] p-8 border-r border-white/10 flex flex-col gap-6 relative group overflow-hidden">
          <div className="w-10 h-10 bg-white border border-white/20 rounded-none relative z-10"></div>
          <div className="w-full h-4 bg-white/20 rounded-none relative z-10"></div>
          <div className="w-3/4 h-4 bg-white/10 rounded-none relative z-10"></div>
          <div className="mt-auto w-full h-12 border-2 border-white text-white font-black text-[10px] tracking-widest uppercase flex items-center justify-center relative z-10">
            Absolute Noir
          </div>
        </div>
        <div className="w-1/2 bg-white p-8 flex flex-col gap-6 relative group overflow-hidden">
          <div className="w-10 h-10 bg-black/10 rounded-2xl relative z-10"></div>
          <div className="w-full h-4 bg-black/20 rounded-full relative z-10"></div>
          <div className="w-3/4 h-4 bg-black/10 rounded-full relative z-10"></div>
          <div className="mt-auto w-full h-12 bg-black text-white font-mono text-[10px] tracking-widest uppercase flex items-center justify-center rounded-[2rem] relative z-10">
            Minimalist
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'analytics',
    name: 'Analytics',
    type: 'Visitor Intelligence',
    payloadStr: "{\n  \"event\": \"SESSION_START\",\n  \"visitorId\": \"v_9f82x\",\n  \"device\": \"Desktop\",\n  \"country\": \"ID\",\n  \"duration\": 245\n}",
    renderComponent: () => (
      <div className="bg-[#050505]/90 border border-white/10 p-6 md:p-8 rounded-[2rem] w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="text-white/50 text-[10px] font-mono mb-2 uppercase tracking-widest">Total Impressions</div>
            <div className="text-5xl font-black text-white tracking-tighter">14,204</div>
          </div>
          <div className="text-emerald-400 text-xs font-mono bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
            +24.8%
          </div>
        </div>
        
        <div className="flex items-end gap-3 h-32 w-full border-b border-white/10 pb-3">
          {[30, 45, 20, 60, 80, 50, 90].map((h, i) => (
            <div key={i} className="flex-1 bg-white/10 rounded-t-sm relative group overflow-hidden" style={{ height: `${h}%` }}>
               <div className="absolute bottom-0 w-full bg-emerald-400/50" style={{ height: `${h/2}%` }}></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[9px] font-mono text-white/30 tracking-widest">
          <span>MON</span>
          <span>SUN</span>
        </div>
      </div>
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

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  });

  const activePillar = PILLARS[activeIndex];

  return (
    <section ref={containerRef} className="relative w-full h-[200vh] bg-[#020202] font-sans">
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
      >
        
        {/* Abstract Orbs (Epic Bloom Entrance) */}
        <motion.div 
          variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 3, ease: EASE } } }}
          className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#ff9e00]/[0.02] rounded-full blur-[100px] pointer-events-none z-0 transform-gpu"
        ></motion.div>
        <motion.div 
          variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 3.5, ease: EASE, delay: 0.2 } } }}
          className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none z-0 transform-gpu"
        ></motion.div>

        {/* LAYER 1: RAW CODE WATERMARK (Matrix Fade In) */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 100, scale: 1.1 }, visible: { opacity: 0.03, y: 0, scale: 1, transition: { duration: 2, ease: EASE, delay: 0.6 } } }}
          className="absolute top-1/2 right-[10%] -translate-y-1/2 pointer-events-none z-0 select-none"
        >
          <AnimatePresence mode="popLayout">
            <motion.pre
              key={activePillar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
              className="text-[4vw] font-mono text-emerald-400 font-bold leading-none tracking-tighter"
            >
              {activePillar.payloadStr}
            </motion.pre>
          </AnimatePresence>
        </motion.div>

        {/* LAYER 2: VERTICAL LABEL (Slide in) */}
        <motion.div 
          variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 1, ease: EASE, delay: 0.4 } } }}
          className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center pointer-events-none z-30"
        >
          <span className="font-mono text-[8px] text-neutral-600 tracking-[0.5em] uppercase whitespace-nowrap">
            PORTFOBE CORE ENGINE // V2.0
          </span>
        </motion.div>

        <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 h-full py-20">

          {/* ABSOLUTE HEADER TO PREVENT JIGGLE */}
          <motion.div 
            variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 1, ease: EASE } } }}
            className="absolute top-12 md:top-24 left-6 md:left-12 z-30 hidden md:block"
          >
            <span className="text-[#ff9e00] font-mono text-[10px] tracking-[0.4em] uppercase block border-l-2 border-[#ff9e00] pl-4">
              [ PLATFORM PILLARS ]
            </span>
          </motion.div>

          {/* ABSOLUTE FOOTER TO PREVENT JIGGLE */}
          <motion.div 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1, delay: 1.5 } } }}
            className="absolute bottom-12 md:bottom-24 left-6 md:left-12 z-30 hidden md:flex items-center gap-3 text-neutral-600 font-mono text-[9px] tracking-widest uppercase animate-pulse"
          >
            <i className="fas fa-arrow-down"></i> KEEP SCROLLING
          </motion.div>

          {/* LAYER 3: MASSIVE HOLLOW TYPOGRAPHY MENU */}
          <div className="w-full lg:w-3/5 flex flex-col justify-center gap-2 relative z-20 mt-8 md:mt-0">
            {/* Mobile-only header (flow-based) */}
            <div className="md:hidden mb-6">
              <span className="text-[#ff9e00] font-mono text-[10px] tracking-[0.4em] uppercase block border-l-2 border-[#ff9e00] pl-4">
                [ PLATFORM PILLARS ]
              </span>
            </div>

            <div className="flex flex-col gap-1 md:gap-3">
              {PILLARS.map((pillar, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <motion.div 
                    key={pillar.id}
                    variants={{
                      hidden: { opacity: 0, x: -100, filter: 'blur(20px)' },
                      visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: EASE } }
                    }}
                  >
                    <div 
                      className="flex flex-col justify-center relative transition-all duration-500 ease-out"
                      style={{ opacity: isActive ? 1 : 0.35 }}
                    >
                      <div className="flex items-center gap-4">
                        <h1 
                          className={`text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] font-black uppercase leading-[0.9] transition-all duration-500 ease-out select-none ${
                            isActive ? 'scale-100 origin-left' : 'scale-[0.85] origin-left'
                          }`}
                          style={{
                            WebkitTextStroke: isActive ? '0px' : '1.5px rgba(255,255,255,0.3)',
                            color: isActive ? '#ffffff' : 'transparent',
                          }}
                        >
                          {pillar.name}
                        </h1>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ease-out ${isActive ? 'max-h-12 opacity-100 mt-1 md:mt-3' : 'max-h-0 opacity-0'}`}>
                        <span className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-500 ml-1">
                          ARCHITECTURE // {pillar.type}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* LAYER 4: THE HOLOGRAPHIC RENDERED ARTIFACT */}
          <motion.div 
            variants={{ hidden: { opacity: 0, x: 100, rotateY: 30, filter: 'blur(30px)' }, visible: { opacity: 1, x: 0, rotateY: 0, filter: 'blur(0px)', transition: { duration: 1.5, ease: EASE, delay: 0.8 } } }}
            className="w-full lg:w-2/5 flex items-center justify-end relative z-30 min-h-[400px]"
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ willChange: "transform, opacity" }}
                className="w-full max-w-lg absolute right-0"
              >
                
                <div className="absolute -top-12 right-0 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#ff9e00] animate-pulse"></span>
                  <span className="font-mono text-[9px] text-[#ff9e00] tracking-[0.3em] uppercase">SYSTEM ACTIVE</span>
                </div>

                {activePillar.renderComponent()}
                
                <div className="absolute -bottom-10 right-0">
                  <span className="font-mono text-[9px] text-neutral-600 tracking-widest uppercase">
                    INSTANT ARCHITECTURE
                  </span>
                </div>

              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
