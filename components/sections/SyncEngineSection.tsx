"use client";

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Abstract3DShowcase } from '../ui/Abstract3DShowcase';

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
    payloadStr: "{\n  \"action\": \"SYNC_ALL\",\n  \"targets\": [\"GitHub\", \"Canva\", \"Penpot\"]\n}",
    renderComponent: () => (
      <div className="bg-[#050505] border border-white/5 p-8 rounded-[2rem] w-full h-[400px] flex flex-col justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Minimalist Header */}
        <div>
          <h3 className="text-white text-2xl font-semibold tracking-tight">Active Integrations</h3>
          <p className="text-white/40 text-sm mt-1">Data pipelines synchronized to core.</p>
        </div>

        {/* Minimalist Static List */}
        <div className="space-y-4">
          {[
            { id: 'gh', name: 'GitHub', desc: 'Code repositories & commits', icon: 'fa-github' },
            { id: 'pn', name: 'Penpot', desc: 'UI/UX design assets', icon: 'fa-pen-nib' },
            { id: 'cv', name: 'Canva', desc: 'Presentation slides', icon: 'fa-layer-group' }
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-t border-white/5 pt-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <i className={`fab ${item.icon} fas ${item.icon} text-white/70 text-lg`}></i>
              </div>
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                  <span className="text-white font-medium text-base">{item.name}</span>
                  <span className="text-white/40 text-xs">{item.desc}</span>
                </div>
                <div className="text-emerald-500 text-[10px] font-mono uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">
                  Connected
                </div>
              </div>
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
    renderComponent: () => (
      <div className="bg-[#050505]/90 border border-white/10 p-6 md:p-8 rounded-[2rem] w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all">
        <div className="w-full aspect-square rounded-2xl bg-gradient-to-tr from-neutral-950 to-neutral-900 border border-white/5 relative overflow-hidden group">

          <Abstract3DShowcase />

          <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/50 tracking-widest pointer-events-none">
            [ WEBGL ACCELERATED ]
          </div>
          <div className="absolute top-6 right-6 flex gap-1.5 pointer-events-none">
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
      <div className="relative bg-[#020202]/90 backdrop-blur-3xl border border-white/10 p-8 rounded-[2rem] w-full shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden group">

        {/* Animated Cyber Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] opacity-70"></div>

        {/* Sweeping Radar Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(16,185,129,0.05)_25%,transparent_50%)] animate-[spin_4s_linear_infinite] rounded-full pointer-events-none"></div>

        {/* Corner Crosshairs */}
        <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-white/30"></div>
        <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-white/30"></div>
        <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-white/30"></div>
        <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-white/30"></div>

        {/* Top Header / Status */}
        <div className="relative z-10 flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.3em]">Live Telemetry</span>
            </div>
            <h3 className="text-white text-4xl font-black tracking-tighter mix-blend-difference">Global Reach</h3>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2 flex items-center gap-3 backdrop-blur-md">
            <span className="text-emerald-500/50 text-[10px] font-mono tracking-widest">NODE</span>
            <span className="text-emerald-400 text-xs font-mono font-bold">ACTV-01</span>
          </div>
        </div>

        {/* Main Graph Area: Abstract SVG Line Chart with glow */}
        <div className="relative z-10 h-36 w-full mb-8">
          {/* Horizontal Guide Lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-20 pointer-events-none">
            <div className="w-full h-[1px] border-b border-dashed border-white/30"></div>
            <div className="w-full h-[1px] border-b border-dashed border-white/30"></div>
            <div className="w-full h-[1px] border-b border-dashed border-white/30"></div>
          </div>

          {/* Abstract Sine/Data Wave */}
          <svg viewBox="0 0 100 30" className="absolute bottom-0 w-full h-[120%] drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]" preserveAspectRatio="none">
            <motion.path
              d="M0,25 C10,10 15,30 25,20 C35,10 40,5 50,15 C60,25 70,5 80,18 C90,30 95,10 100,5"
              fill="none"
              stroke="url(#data-gradient)"
              strokeWidth="0.8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
            />
            <path
              d="M0,25 C10,10 15,30 25,20 C35,10 40,5 50,15 C60,25 70,5 80,18 C90,30 95,10 100,5 L100,30 L0,30 Z"
              fill="url(#data-fade)"
            />
            <defs>
              <linearGradient id="data-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="data-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Data Nodes */}
          <motion.div
            initial={{ y: 0 }} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-[30%] left-[25%] w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_15px_white]"
          >
            <div className="absolute -top-8 -left-5 bg-white text-black text-[10px] font-black px-2 py-0.5 rounded-sm font-mono border border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]">12.4K</div>
          </motion.div>
          <motion.div
            initial={{ y: 0 }} animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute top-[10%] left-[70%] w-2.5 h-2.5 bg-[#3b82f6] rounded-full shadow-[0_0_15px_#3b82f6]"
          >
            <div className="absolute -top-8 -left-5 bg-[#3b82f6] text-white text-[10px] font-black px-2 py-0.5 rounded-sm font-mono border border-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.5)]">24.8K</div>
          </motion.div>
        </div>

        {/* Bottom Metrics Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 overflow-hidden relative group/card hover:bg-white/10 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="text-white/40 text-[10px] font-mono tracking-widest mb-2 flex items-center justify-between">
              SESSIONS
              <i className="fas fa-chart-line text-emerald-500"></i>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">1.2M</div>
            <div className="text-emerald-400 text-[10px] font-mono mt-2 font-bold bg-emerald-400/10 inline-block px-2 py-1 rounded">+12.5% UP</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 overflow-hidden relative group/card hover:bg-white/10 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="text-white/40 text-[10px] font-mono tracking-widest mb-2 flex items-center justify-between">
              LATENCY
              <i className="fas fa-network-wired text-blue-500"></i>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">12<span className="text-lg text-white/30 ml-1">ms</span></div>
            <div className="text-blue-400 text-[10px] font-mono mt-2 font-bold bg-blue-400/10 inline-block px-2 py-1 rounded">GLOBAL AVG</div>
          </div>
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

      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
      >

        {/* Abstract Orbs (Epic Bloom Entrance) */}
        <div
          className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#ff9e00]/[0.02] rounded-full blur-[100px] pointer-events-none z-0 transform-gpu"
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none z-0 transform-gpu"
        ></div>

        {/* LAYER 1: RAW CODE WATERMARK (Matrix Fade In) */}
        <div
          className="absolute top-1/2 right-[10%] -translate-y-1/2 pointer-events-none z-0 select-none opacity-5"
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
                  <div
                    key={pillar.id}
                  >
                    <div
                      className="flex flex-col justify-center relative transition-all duration-500 ease-out"
                      style={{ opacity: isActive ? 1 : 0.35 }}
                    >
                      <div className="flex items-center gap-4">
                        <h1
                          className={`text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] font-black uppercase leading-[0.9] transition-all duration-500 ease-out select-none ${isActive ? 'scale-100 origin-left' : 'scale-[0.85] origin-left'
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* LAYER 4: THE HOLOGRAPHIC RENDERED ARTIFACT */}
          <div
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
          </div>

        </div>
      </div>
    </section>
  );
}
