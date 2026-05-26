"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// NEW CONCEPT: THE DATA SYNCHRONIZATION ENGINE
// Shows how Portfobe automatically ingests data from GitHub, LinkedIn, etc.
// (Export name kept as MemeGeneratorSection to prevent breaking imports in page.tsx)
// ============================================================================

interface Integration {
  id: string;
  name: string;
  type: string;
  icon: string;
  accent: string;
  payloadJsx: React.ReactNode;
  renderComponent: () => React.ReactNode;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    type: 'Open Source & Code',
    icon: 'fa-github',
    accent: 'text-white',
    payloadJsx: (
      <pre className="font-mono text-[10px] md:text-[11px] leading-relaxed">
        <span className="text-neutral-500">{"{"}</span><br/>
        <span className="text-neutral-300 ml-4">"endpoint"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"api.github.com/graphql"</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-4">"status"</span><span className="text-neutral-500">: </span><span className="text-blue-400">200</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-4">"data"</span><span className="text-neutral-500">: {"{"}</span><br/>
        <span className="text-neutral-300 ml-8">"repo"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"quantum-engine"</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-8">"stars"</span><span className="text-neutral-500">: </span><span className="text-blue-400">4092</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-8">"language"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"TypeScript"</span><br/>
        <span className="text-neutral-500 ml-4">{"}"}</span><br/>
        <span className="text-neutral-500">{"}"}</span>
      </pre>
    ),
    renderComponent: () => (
      <div className="bg-[#080808] border border-neutral-800 p-6 md:p-8 rounded-[2rem] w-full shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <i className="fab fa-github text-white text-xl"></i>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-[#0a0a0a] border border-neutral-800 rounded-full text-[10px] font-mono text-neutral-400 flex items-center gap-1.5">
              <i className="fas fa-star text-yellow-500"></i> 4,092
            </span>
          </div>
        </div>
        <h4 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">quantum-engine</h4>
        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
          Next-generation physics engine optimized for WebGL and WebAssembly. Built for high-performance browser rendering.
        </p>
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> TypeScript</span>
          <span className="text-neutral-800">|</span>
          <span>Updated 2h ago</span>
        </div>
      </div>
    )
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    type: 'Career Timeline',
    icon: 'fa-linkedin',
    accent: 'text-blue-500',
    payloadJsx: (
      <pre className="font-mono text-[10px] md:text-[11px] leading-relaxed">
        <span className="text-neutral-500">{"{"}</span><br/>
        <span className="text-neutral-300 ml-4">"endpoint"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"api.linkedin.com/v2/me"</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-4">"status"</span><span className="text-neutral-500">: </span><span className="text-blue-400">200</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-4">"data"</span><span className="text-neutral-500">: {"{"}</span><br/>
        <span className="text-neutral-300 ml-8">"role"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"Senior Engineer"</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-8">"company"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"Vercel"</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-8">"duration"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"2023 - Present"</span><br/>
        <span className="text-neutral-500 ml-4">{"}"}</span><br/>
        <span className="text-neutral-500">{"}"}</span>
      </pre>
    ),
    renderComponent: () => (
      <div className="bg-[#080808] border border-neutral-800 p-6 md:p-8 rounded-[2rem] w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-8 md:left-10 w-[2px] h-full bg-neutral-900"></div>
        <div className="relative z-10 pl-8 md:pl-10 py-2">
          <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-blue-500 border-4 border-[#080808] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <h4 className="text-lg md:text-xl font-bold text-white mb-1">Senior Frontend Engineer</h4>
          <div className="text-blue-400 font-medium text-sm mb-4">Vercel <span className="text-neutral-600 font-normal ml-2">2023 - Present</span></div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Led the architectural redesign of the edge-compute analytics dashboard. Improved rendering performance by 40% using React Server Components and optimized caching layers.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'medium',
    name: 'Medium',
    type: 'Technical Writing',
    icon: 'fa-medium',
    accent: 'text-white',
    payloadJsx: (
      <pre className="font-mono text-[10px] md:text-[11px] leading-relaxed">
        <span className="text-neutral-500">{"{"}</span><br/>
        <span className="text-neutral-300 ml-4">"endpoint"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"api.medium.com/feed"</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-4">"status"</span><span className="text-neutral-500">: </span><span className="text-blue-400">200</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-4">"data"</span><span className="text-neutral-500">: {"{"}</span><br/>
        <span className="text-neutral-300 ml-8">"title"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"React Server Comps"</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-8">"views"</span><span className="text-neutral-500">: </span><span className="text-blue-400">12400</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-8">"readTime"</span><span className="text-neutral-500">: </span><span className="text-blue-400">8</span><br/>
        <span className="text-neutral-500 ml-4">{"}"}</span><br/>
        <span className="text-neutral-500">{"}"}</span>
      </pre>
    ),
    renderComponent: () => (
      <div className="bg-[#080808] border border-neutral-800 p-6 md:p-8 rounded-[2rem] w-full shadow-2xl flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-neutral-900 border border-neutral-800 flex-shrink-0 flex items-center justify-center">
           <i className="fab fa-medium text-white text-2xl sm:text-3xl"></i>
        </div>
        <div>
          <div className="flex items-center gap-3 text-[9px] font-mono text-neutral-500 mb-3 uppercase tracking-widest">
            <span>Oct 24, 2026</span>
            <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
            <span>8 min read</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white leading-snug mb-3">Mastering React Server Components in Production Environments</h4>
          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
            <i className="fas fa-eye text-neutral-600"></i> 12.4k views
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'figma',
    name: 'Figma',
    type: 'Design Tokens',
    icon: 'fa-figma',
    accent: 'text-purple-400',
    payloadJsx: (
      <pre className="font-mono text-[10px] md:text-[11px] leading-relaxed">
        <span className="text-neutral-500">{"{"}</span><br/>
        <span className="text-neutral-300 ml-4">"endpoint"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"api.figma.com/v1"</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-4">"status"</span><span className="text-neutral-500">: </span><span className="text-blue-400">200</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-4">"data"</span><span className="text-neutral-500">: {"{"}</span><br/>
        <span className="text-neutral-300 ml-8">"file"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">"Design System 2.0"</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-8">"nodes"</span><span className="text-neutral-500">: </span><span className="text-blue-400">142</span><span className="text-neutral-500">,</span><br/>
        <span className="text-neutral-300 ml-8">"tokens"</span><span className="text-neutral-500">: </span><span className="text-emerald-400">true</span><br/>
        <span className="text-neutral-500 ml-4">{"}"}</span><br/>
        <span className="text-neutral-500">{"}"}</span>
      </pre>
    ),
    renderComponent: () => (
      <div className="bg-[#080808] border border-neutral-800 rounded-[2rem] w-full shadow-2xl overflow-hidden">
        <div className="h-28 md:h-32 bg-neutral-900 relative overflow-hidden flex items-center justify-center">
           {/* Abstract minimalist shapes representing design tokens */}
           <div className="w-12 h-12 rounded-full bg-purple-500/80 mix-blend-screen -ml-4"></div>
           <div className="w-12 h-12 rounded-full bg-orange-500/80 mix-blend-screen -mr-4"></div>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-white font-bold text-lg">Design System 2.0</h4>
            <i className="fab fa-figma text-purple-400 text-xl"></i>
          </div>
          <p className="text-neutral-500 text-xs mb-6 font-mono">142 Nodes • Core UI Kit</p>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-[#080808] shadow-sm"></div>
            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#080808] shadow-sm -ml-4"></div>
            <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#080808] shadow-sm -ml-4"></div>
            <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-[#080808] shadow-sm -ml-4"></div>
          </div>
        </div>
      </div>
    )
  }
];

export function MemeGeneratorSection() {
  const [activeId, setActiveId] = useState<string>(INTEGRATIONS[0].id);

  const activeIntegration = INTEGRATIONS.find(i => i.id === activeId) || INTEGRATIONS[0];

  return (
    <section className="relative py-24 md:py-40 bg-[#020202] overflow-hidden font-sans border-y border-neutral-900">
      
      <div className="max-w-[1800px] w-full mx-auto px-6 md:px-12 relative z-10">

        {/* WIDESCREEN HEADER */}
        <div className="mb-16 md:mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="font-mono text-[#ff9e00] text-[10px] tracking-[0.4em] uppercase block mb-4">
              [ THE SYNCHRONIZATION ENGINE ]
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              CONNECT ONCE. <br/>
              <span className="text-neutral-700">SYNC FOREVER.</span>
            </h2>
          </div>
          <p className="text-neutral-500 text-sm md:text-base max-w-md leading-relaxed">
            Your portfolio lives where you work. Portfobe automatically ingests your repositories, career timeline, and articles to keep your site updated in real-time. Zero maintenance required.
          </p>
        </div>

        {/* MAJESTIC WIDESCREEN GRID (3 - 4 - 5 Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

          {/* ======================================================== */}
          {/* LEFT COLUMN: THE CONNECTORS (3/12 Columns)              */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-6 border-b border-neutral-900 pb-4">
              DATA SOURCES
            </div>
            <div className="flex flex-col">
              {INTEGRATIONS.map((int) => {
                const isActive = activeId === int.id;
                return (
                  <button 
                    key={int.id}
                    onClick={() => setActiveId(int.id)}
                    className={`w-full text-left py-6 border-b border-neutral-900 flex items-center justify-between group transition-all duration-300 cursor-pointer ${
                      isActive ? 'border-white' : 'hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <h3 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors ${
                        isActive ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-300'
                      }`}>
                        {int.name}
                      </h3>
                      <span className={`font-mono text-[9px] tracking-widest uppercase mt-2 block transition-colors ${
                        isActive ? 'text-neutral-400' : 'text-neutral-700'
                      }`}>
                        {int.type}
                      </span>
                    </div>
                    <i className={`fab ${int.icon} text-2xl transition-all duration-300 ${
                      isActive ? int.accent : 'text-neutral-800 group-hover:text-neutral-600'
                    }`}></i>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER COLUMN: THE DATA STREAM (4/12 Columns)             */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-6 border-b border-neutral-900 pb-4">
              RAW API PAYLOAD
            </div>
            <div className="bg-[#050505] border border-neutral-900 rounded-[2rem] p-6 md:p-8 flex-1 min-h-[300px] lg:min-h-[400px] flex flex-col relative overflow-hidden shadow-inner">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-900/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
                </div>
                <span className="font-mono text-[9px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                  STATUS 200 OK
                </span>
              </div>

              {/* Streaming JSON payload */}
              <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {activeIntegration.payloadJsx}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: THE COMPILED OUTPUT (5/12 Columns)          */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-6 border-b border-neutral-900 pb-4">
              COMPILED UI COMPONENT
            </div>
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  {activeIntegration.renderComponent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
