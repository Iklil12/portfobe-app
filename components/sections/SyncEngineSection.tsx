"use client";

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Abstract3DShowcase } from '../ui/Abstract3DShowcase';
import { ThemeHoverShowcase } from '../ui/ThemeHoverShowcase';

// ============================================================================
// ARTISTIC CONCEPT: THE INFINITE DATA SEA (PURE ABSTRACT EXHIBITION)
// Epic Cinematic Entrance Animations added for a breathtaking first impression.
// ============================================================================

interface Pillar {
  id: string;
  name: string;
  type: string;
  payloadStr: string;
  renderComponent: (instanceId?: string) => React.ReactNode;
}

const PILLARS: Pillar[] = [
  {
    id: 'integrations',
    name: 'Integrations',
    type: 'External Data Sync',
    payloadStr: "{\n  \"action\": \"SYNC_ALL\",\n  \"targets\": [\"GitHub\", \"Penpot\", \"Canva\", \"AI Core\"]\n}",
    renderComponent: (instanceId) => (
      <div className="w-full h-[400px] lg:h-[480px] flex flex-col gap-4 sm:gap-6">
        <style dangerouslySetInnerHTML={{ __html: `
          /* GitHub: Git branches and contributions calendar */
          @keyframes github-contrib-glow {
            0%, 100% { opacity: 0.65; }
            50% { opacity: 1; filter: brightness(1.2) drop-shadow(0 0 1px currentColor); }
          }
          @keyframes github-commit-flow {
            0% {
              offset-distance: 0%;
              opacity: 0;
            }
            12% {
              opacity: 1;
            }
            50% {
              offset-distance: 100%;
              opacity: 1;
            }
            52%, 100% {
              offset-distance: 100%;
              opacity: 0;
            }
          }
          @keyframes github-merge-ripple {
            0%, 49% {
              transform: scale(0.3);
              opacity: 0;
            }
            52% {
              transform: scale(0.3);
              opacity: 0.8;
            }
            72%, 100% {
              transform: scale(1.6);
              opacity: 0;
            }
          }
          .gh-empty { fill: #1f232b; }
          .gh-l1 { fill: #0e4429; color: #0e4429; animation: github-contrib-glow 4s ease-in-out infinite; }
          .gh-l2 { fill: #006d32; color: #006d32; animation: github-contrib-glow 4s ease-in-out infinite; }
          .gh-l3 { fill: #26a641; color: #26a641; animation: github-contrib-glow 4s ease-in-out infinite; }
          .gh-l4 { fill: #39d353; color: #39d353; animation: github-contrib-glow 4s ease-in-out infinite; }
          
          .gh-d1 { animation-delay: -0.8s; }
          .gh-d2 { animation-delay: -1.6s; }
          .gh-d3 { animation-delay: -2.4s; }
          .gh-d4 { animation-delay: -3.2s; }

          .github-commit-dot {
            animation: github-commit-flow 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          .github-ripple {
            animation: github-merge-ripple 4s ease-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }

          /* Penpot: Original flowing dash line animation */
          @keyframes penpot-flow {
            to { stroke-dashoffset: -32; }
          }
          .penpot-path {
            stroke-dasharray: 8 8;
            animation: penpot-flow 3s linear infinite;
          }

          /* Canva: Template resizing and grid alignment snapping */
          @keyframes canva-resize-group {
            0%, 100% {
              transform: scale(1);
            }
            45%, 55% {
              transform: scale(1.12);
            }
          }
          @keyframes canva-cursor-move {
            0%, 100% {
              transform: translate(0px, 0px);
            }
            45%, 55% {
              transform: translate(6.24px, 3.84px);
            }
          }
          @keyframes canva-snap-flash {
            0%, 40%, 60%, 100% { opacity: 0; }
            45%, 55% { opacity: 0.75; }
          }
          .canva-selected-layer {
            animation: canva-resize-group 4s ease-in-out infinite;
            transform-origin: 25px 25px;
          }
          .canva-cursor-group {
            animation: canva-cursor-move 4s ease-in-out infinite;
          }
          .canva-snap-x {
            animation: canva-snap-flash 4s ease-in-out infinite;
          }
          .canva-snap-y {
            animation: canva-snap-flash 4s ease-in-out infinite;
            animation-delay: -2s;
          }

          /* AI Integration: Firing synapses and glowing brain/neural nodes */
          @keyframes ai-synapse-fire {
            0%, 100% { opacity: 0.15; stroke-width: 1.5px; }
            50% { opacity: 0.7; stroke-width: 2.2px; }
          }
          @keyframes ai-node-glow {
            0%, 100% {
              transform: scale(0.85);
              opacity: 0.45;
              filter: drop-shadow(0 0 2px rgba(147, 51, 234, 0.4));
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
              filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.9));
            }
          }
          .ai-line {
            animation: ai-synapse-fire 3s ease-in-out infinite;
          }
          .ai-line-1 { animation-delay: 0s; }
          .ai-line-2 { animation-delay: 0.75s; }
          .ai-line-3 { animation-delay: 1.5s; }
          .ai-line-4 { animation-delay: 2.25s; }

          .ai-node {
            animation: ai-node-glow 4s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }
          .ai-node-center { animation-delay: 0s; }
          .ai-node-1 { animation-delay: 0.8s; }
          .ai-node-2 { animation-delay: 1.6s; }
          .ai-node-3 { animation-delay: 1.2s; }
          .ai-node-4 { animation-delay: 2s; }
        `}} />

        {/* 2x2 Grid Layout with responsive gaps */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 flex-1">
          {[
            {
              id: 'github',
              icon: 'fab fa-github',
              iconBg: 'bg-[#2b3137]', // GitHub dark
              date: '28 Nov 2024',
              label: 'Code Repositories',
              title: 'GitHub',
              subtitle: 'Commits & PRs sync',
              location: 'Pipeline Active',
              pattern: (
                <svg className="absolute -bottom-2 -right-2 w-24 h-24 sm:w-32 sm:h-32 opacity-40 pointer-events-none" viewBox="0 0 100 100">
                  {/* Contribution Grid (Top part) */}
                  <g>
                    {/* Col 0 */}
                    <rect x="52" y="15" width="4.5" height="4.5" rx="1" className="gh-empty" />
                    <rect x="52" y="21" width="4.5" height="4.5" rx="1" className="gh-l1 gh-d1" />
                    <rect x="52" y="27" width="4.5" height="4.5" rx="1" className="gh-empty" />
                    <rect x="52" y="33" width="4.5" height="4.5" rx="1" className="gh-l2 gh-d2" />

                    {/* Col 1 */}
                    <rect x="58" y="15" width="4.5" height="4.5" rx="1" className="gh-l3 gh-d3" />
                    <rect x="58" y="21" width="4.5" height="4.5" rx="1" className="gh-empty" />
                    <rect x="58" y="27" width="4.5" height="4.5" rx="1" className="gh-l1 gh-d4" />
                    <rect x="58" y="33" width="4.5" height="4.5" rx="1" className="gh-l4 gh-d1" />

                    {/* Col 2 */}
                    <rect x="64" y="15" width="4.5" height="4.5" rx="1" className="gh-empty" />
                    <rect x="64" y="21" width="4.5" height="4.5" rx="1" className="gh-l2 gh-d2" />
                    <rect x="64" y="27" width="4.5" height="4.5" rx="1" className="gh-l3 gh-d3" />
                    <rect x="64" y="33" width="4.5" height="4.5" rx="1" className="gh-empty" />

                    {/* Col 3 */}
                    <rect x="70" y="15" width="4.5" height="4.5" rx="1" className="gh-l1 gh-d4" />
                    <rect x="70" y="21" width="4.5" height="4.5" rx="1" className="gh-l4 gh-d1" />
                    <rect x="70" y="27" width="4.5" height="4.5" rx="1" className="gh-empty" />
                    <rect x="70" y="33" width="4.5" height="4.5" rx="1" className="gh-l2 gh-d2" />

                    {/* Col 4 */}
                    <rect x="76" y="15" width="4.5" height="4.5" rx="1" className="gh-l2 gh-d3" />
                    <rect x="76" y="21" width="4.5" height="4.5" rx="1" className="gh-l1 gh-d4" />
                    <rect x="76" y="27" width="4.5" height="4.5" rx="1" className="gh-l3 gh-d1" />
                    <rect x="76" y="33" width="4.5" height="4.5" rx="1" className="gh-empty" />

                    {/* Col 5 */}
                    <rect x="82" y="15" width="4.5" height="4.5" rx="1" className="gh-empty" />
                    <rect x="82" y="21" width="4.5" height="4.5" rx="1" className="gh-l3 gh-d2" />
                    <rect x="82" y="27" width="4.5" height="4.5" rx="1" className="gh-l4 gh-d3" />
                    <rect x="82" y="33" width="4.5" height="4.5" rx="1" className="gh-l1 gh-d4" />

                    {/* Col 6 */}
                    <rect x="88" y="15" width="4.5" height="4.5" rx="1" className="gh-l4 gh-d1" />
                    <rect x="88" y="21" width="4.5" height="4.5" rx="1" className="gh-empty" />
                    <rect x="88" y="27" width="4.5" height="4.5" rx="1" className="gh-l2 gh-d2" />
                    <rect x="88" y="33" width="4.5" height="4.5" rx="1" className="gh-empty" />
                  </g>

                  {/* Git branch graph (Bottom part) */}
                  <g>
                    {/* Main branch line */}
                    <path d="M 10 75 L 90 75" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" fill="none" />
                    
                    {/* Feature branch line */}
                    <path d="M 25 75 C 35 55, 60 55, 70 75" stroke="#58a6ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" fill="none" />
                    
                    {/* Branch commit nodes (static background points) */}
                    <circle cx="25" cy="75" r="2" fill="#ffffff" opacity="0.4" />
                    <circle cx="70" cy="75" r="2" fill="#ffffff" opacity="0.4" />
                    
                    {/* Glowing merge point indicator */}
                    <circle cx="70" cy="75" r="5" fill="none" stroke="#58a6ff" strokeWidth="1" className="github-ripple" />
                    
                    {/* Traveling commit node */}
                    <circle r="3" fill="#58a6ff" className="github-commit-dot" style={{ filter: 'drop-shadow(0 0 3px #58a6ff)', offsetPath: "path('M 25 75 C 35 55, 60 55, 70 75')" }} />
                  </g>
                </svg>
              )
            },
            {
              id: 'penpot',
              icon: 'fas fa-pen-nib',
              iconBg: 'bg-[#10b981]', // Penpot green feel
              date: '12 Oct 2024',
              label: 'UI/UX Design',
              title: 'Penpot',
              subtitle: 'Design assets sync',
              location: 'Pipeline Active',
              pattern: (
                <svg className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-28 sm:h-28 opacity-40 pointer-events-none" viewBox="0 0 100 100">
                  <path d="M0 100 Q 25 50 50 75 T 100 25" stroke="#10b981" strokeWidth="3" fill="none" className="penpot-path" />
                  <path d="M0 120 Q 25 70 50 95 T 100 45" stroke="#10b981" strokeWidth="3" fill="none" className="penpot-path" />
                  <path d="M0 140 Q 25 90 50 115 T 100 65" stroke="#10b981" strokeWidth="3" fill="none" className="penpot-path" />
                </svg>
              )
            },
            {
              id: 'canva',
              icon: 'fas fa-layer-group',
              iconBg: 'bg-[#0ea5e9]', // Canva cyan/blue
              date: '30 Dec 2024',
              label: 'Presentations',
              title: 'Canva',
              subtitle: 'Slides & graphics sync',
              location: 'Pipeline Active',
              pattern: (
                <svg className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 opacity-50 pointer-events-none" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="canva-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="0.8" fill="#0ea5e9" opacity="0.25" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#canva-grid)" />
                  <rect x="10" y="10" width="80" height="80" rx="6" fill="none" stroke="rgba(14, 165, 233, 0.15)" strokeWidth="1" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#0ea5e9" strokeWidth="1" className="canva-snap-line canva-snap-x" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="#0ea5e9" strokeWidth="1" className="canva-snap-line canva-snap-y" />
                  <rect x="18" y="18" width="64" height="64" rx="4" fill="rgba(14, 165, 233, 0.03)" stroke="none" />
                  <g className="canva-selected-layer">
                    <rect x="25" y="25" width="50" height="30" rx="3" fill="rgba(14, 165, 233, 0.08)" stroke="#0ea5e9" strokeWidth="1.2" />
                    <circle cx="50" cy="40" r="8" fill="#0ea5e9" opacity="0.35" />
                    <rect x="23" y="23" width="54" height="34" rx="4" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 2" />
                    <rect x="21" y="21" width="4" height="4" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
                    <rect x="75" y="21" width="4" height="4" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
                    <rect x="21" y="55" width="4" height="4" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
                    <rect x="75" y="55" width="4" height="4" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
                  </g>
                  <rect x="25" y="68" width="35" height="3" rx="1.5" fill="rgba(14, 165, 233, 0.25)" />
                  <rect x="25" y="75" width="50" height="3" rx="1.5" fill="rgba(14, 165, 233, 0.15)" />
                  <g className="canva-cursor-group">
                    <path d="M77 57 L85 65 L81 66 L86 71 L84 72 L79 67 L78 71 Z" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
                    <circle cx="77" cy="57" r="2" fill="#0ea5e9" />
                  </g>
                </svg>
              )
            },
            {
              id: 'ai',
              icon: 'fas fa-robot',
              iconBg: 'bg-[#9333ea]', // AI Purple
              date: '13 Aug 2024',
              label: 'Artificial Intelligence',
              title: 'AI Integration',
              subtitle: 'Automated content',
              location: 'Core Neural Active',
              pattern: (
                <svg className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 opacity-45 pointer-events-none" viewBox="0 0 100 100">
                  {/* Firing neural connections */}
                  <line x1="50" y1="50" x2="80" y2="20" stroke="#9333ea" className="ai-line ai-line-1" />
                  <line x1="50" y1="50" x2="20" y2="80" stroke="#9333ea" className="ai-line ai-line-2" />
                  <line x1="50" y1="50" x2="20" y2="20" stroke="#9333ea" className="ai-line ai-line-3" />
                  <line x1="50" y1="50" x2="80" y2="80" stroke="#9333ea" className="ai-line ai-line-4" />
                  
                  {/* Glowing/pulsing neural nodes */}
                  <circle cx="50" cy="50" r="6" fill="#9333ea" stroke="#ffffff" strokeWidth="1" className="ai-node ai-node-center" />
                  <circle cx="80" cy="20" r="4" fill="#9333ea" stroke="#ffffff" strokeWidth="1" className="ai-node ai-node-1" />
                  <circle cx="20" cy="80" r="5" fill="#9333ea" stroke="#ffffff" strokeWidth="1" className="ai-node ai-node-2" />
                  <circle cx="20" cy="20" r="4" fill="#9333ea" stroke="#ffffff" strokeWidth="1" className="ai-node ai-node-3" />
                  <circle cx="80" cy="80" r="5" fill="#9333ea" stroke="#ffffff" strokeWidth="1" className="ai-node ai-node-4" />
                </svg>
              )
            }
          ].map((item) => (
            <div key={item.id} className="bg-[#141414] rounded-xl p-3 sm:p-4 relative overflow-hidden flex flex-col justify-between group hover:bg-[#1a1a1a] transition-colors border border-white/5">
              
              {/* Top Row: Logo */}
              <div className="flex justify-between items-start relative z-10">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${item.iconBg} flex items-center justify-center shadow-lg`}>
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
    renderComponent: (instanceId) => (
      <div className="w-full transition-all">
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
    payloadStr: "{\n  \"activeId\": \"morphic_hover\",\n  \"cssVariables\": {\n    \"--bg\": \"#000000\",\n    \"--text\": \"#ffffff\",\n    \"--radius\": \"0px\"\n  }\n}",
    renderComponent: (instanceId) => (
      <div className="w-full h-[500px]">
        <ThemeHoverShowcase />
      </div>
    )
  },
  {
    id: 'analytics',
    name: 'Analytics',
    type: 'Visitor Intelligence',
    payloadStr: "{\n  \"event\": \"SESSION_START\",\n  \"visitorId\": \"v_9f82x\",\n  \"device\": \"Desktop\",\n  \"country\": \"ID\",\n  \"duration\": 245\n}",
    renderComponent: (instanceId) => (
      <div className="relative p-6 sm:p-8 rounded-[2rem] w-full overflow-hidden group">

        {/* Animated Cyber Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] opacity-70"></div>

        {/* Sweeping Radar Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(16,185,129,0.05)_25%,transparent_50%)] animate-[spin_4s_linear_infinite] rounded-full pointer-events-none"></div>

        {/* Corner Crosshairs */}
        <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-white/30"></div>
        <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-white/30"></div>
        <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-white/30"></div>
        <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-white/30"></div>



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
              stroke={`url(#data-gradient-${instanceId})`}
              strokeWidth="0.8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
            />
            <path
              d="M0,25 C10,10 15,30 25,20 C35,10 40,5 50,15 C60,25 70,5 80,18 C90,30 95,10 100,5 L100,30 L0,30 Z"
              fill={`url(#data-fade-${instanceId})`}
            />
            <defs>
              <linearGradient id={`data-gradient-${instanceId}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id={`data-fade-${instanceId}`} x1="0" y1="0" x2="0" y2="1">
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
    <div className="bg-[#020202]">
      {/* MOBILE LAYOUT (lg:hidden) */}
      <div className="lg:hidden w-full bg-[#020202] py-20 px-6 flex flex-col gap-16 relative z-20">
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
                
                {/* Micro Pill */}
                <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">Active</span>
                </div>
              </div>

              {/* Render visual component */}
              <div className="w-full relative z-10">
                {pillar.renderComponent('mobile')}
              </div>

              {/* Payload code snippet card (Header Only) */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mt-2">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">[ Payload Data ]</span>
                  <span className="font-mono text-[8px] text-neutral-500">JSON</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP LAYOUT (hidden lg:block) */}
      <section ref={containerRef} className="relative w-full h-[200vh] bg-[#020202] font-sans hidden lg:block">

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
            translate="no"
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
                  <motion.div 
                    className="absolute w-3.5 h-3.5 rounded-full bg-[#ff9e00] border-2 border-neutral-950 shadow-[0_0_12px_rgba(255,158,0,0.6)] -left-[5px] -translate-y-1/2"
                    animate={{ 
                      top: `calc(${activeIndex * (100 / (PILLARS.length - 1))}% + ${8 - activeIndex * 5.33}px)`,
                    }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  />
                </div>

                {/* Typography Menu */}
                <div className="flex flex-col gap-1 md:gap-3 flex-1">
                  {PILLARS.map((pillar, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <div key={pillar.id}>
                        <motion.div
                          animate={{ 
                            opacity: isActive ? 1 : 0.3,
                            scale: isActive ? 1 : 0.9,
                          }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="flex flex-col justify-center relative origin-left"
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

                          <motion.div 
                            initial={false}
                            animate={{ 
                              height: isActive ? 'auto' : 0, 
                              opacity: isActive ? 1 : 0 
                            }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <span className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-500 ml-1 block mt-1 md:mt-3">
                              ARCHITECTURE // {pillar.type}
                            </span>
                          </motion.div>
                        </motion.div>
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
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activePillar.id}
                  translate="no"
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

                  {activePillar.renderComponent('desktop')}

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
    </div>
  );
}
