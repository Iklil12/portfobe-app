"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ThemeType = 'spatial' | 'cyber' | 'noir' | 'brutalist';

const THEME_DATA = {
  spatial: {
    name: 'Aura Spatial',
    bg: 'from-slate-950 via-slate-900 to-indigo-950',
    gridColor: 'rgba(96, 165, 250, 0.04)',
    floorFill: 'rgba(255, 255, 255, 0.12)',
    floorStroke: 'rgba(255, 255, 255, 0.25)',
    floorStrokeWidth: 1.5,
    wallLeftFill: 'rgba(255, 255, 255, 0.06)',
    wallLeftStroke: 'rgba(255, 255, 255, 0.12)',
    wallRightFill: 'rgba(255, 255, 255, 0.06)',
    wallRightStroke: 'rgba(255, 255, 255, 0.12)',
    deskFill: 'rgba(255, 255, 255, 0.12)',
    deskStroke: 'rgba(255, 255, 255, 0.35)',
    deskStrokeWidth: 1.5,
    deskLegsStroke: 'rgba(255, 255, 255, 0.2)',
    screenFill: '#0f172a',
    screenStroke: '#60a5fa',
    screenContentFill: '#1e3a8a',
    posterFill: 'rgba(255, 255, 255, 0.08)',
    posterStroke: 'rgba(255, 255, 255, 0.2)',
    windowFill: 'rgba(96, 165, 250, 0.15)',
    windowStroke: 'rgba(96, 165, 250, 0.3)',
    lampFill: '#ffffff',
    lampBeamFill: 'url(#spatial-beam-grad)',
    lampBeamOpacity: 0.3,
    accentColor: '#60a5fa',
    fontClass: 'font-sans tracking-widest uppercase font-semibold text-[9px]',
    cssText: `:root {\n  --theme-name: "Aura Spatial";\n  --bg-color: #020617;\n  --card-bg: rgba(255, 255, 255, 0.08);\n  --border: 1px solid rgba(255, 255, 255, 0.2);\n  --radius: 24px;\n  --blur: 20px;\n  --glow: 0 8px 32px rgba(96, 165, 250, 0.2);\n}`
  },
  cyber: {
    name: 'Acid Tech',
    bg: 'from-[#030504] to-[#07100b]',
    gridColor: 'rgba(188, 254, 0, 0.05)',
    floorFill: '#0e1a14',
    floorStroke: '#bcfe00',
    floorStrokeWidth: 1.5,
    wallLeftFill: '#08120e',
    wallLeftStroke: 'rgba(0, 255, 255, 0.35)',
    wallRightFill: '#08120e',
    wallRightStroke: 'rgba(255, 0, 128, 0.35)',
    deskFill: '#09120e',
    deskStroke: '#bcfe00',
    deskStrokeWidth: 1.5,
    deskLegsStroke: '#bcfe00',
    screenFill: '#000000',
    screenStroke: '#00ffff',
    screenContentFill: '#022c22',
    posterFill: '#000000',
    posterStroke: '#ff007f',
    windowFill: 'rgba(255, 0, 128, 0.1)',
    windowStroke: '#ff007f',
    lampFill: '#ff007f',
    lampBeamFill: 'url(#cyber-beam-grad)',
    lampBeamOpacity: 0.25,
    accentColor: '#bcfe00',
    fontClass: 'font-mono tracking-normal text-[8px] text-[#bcfe00]',
    cssText: `:root {\n  --theme-name: "Acid Tech";\n  --bg-color: #000000;\n  --card-bg: #09120e;\n  --border: 1.5px dashed #bcfe00;\n  --radius: 0px;\n  --font: "JetBrains Mono";\n  --glow: 0 0 15px #bcfe00;\n}`
  },
  noir: {
    name: 'Midnight Emulsion',
    bg: 'from-[#050505] to-[#0c0c0c]',
    gridColor: 'rgba(255, 255, 255, 0.01)',
    floorFill: '#1e1e1e',
    floorStroke: '#333333',
    floorStrokeWidth: 1.5,
    wallLeftFill: '#141414',
    wallLeftStroke: '#262626',
    wallRightFill: '#141414',
    wallRightStroke: '#262626',
    deskFill: '#221a15',
    deskStroke: '#3a2d24',
    deskStrokeWidth: 1.5,
    deskLegsStroke: '#222222',
    screenFill: '#080808',
    screenStroke: '#333333',
    screenContentFill: '#0f0f0f',
    posterFill: '#0c0c0c',
    posterStroke: '#222222',
    windowFill: 'rgba(255, 255, 255, 0.01)',
    windowStroke: '#222222',
    lampFill: '#ff9e00',
    lampBeamFill: 'url(#noir-beam-grad)',
    lampBeamOpacity: 0.35,
    accentColor: '#ff9e00',
    fontClass: 'font-serif tracking-wide italic text-[9px] text-[#f5f5f5]',
    cssText: `:root {\n  --theme-name: "Midnight Emulsion";\n  --bg-color: #050505;\n  --card-bg: #141414;\n  --border: 1px solid #262626;\n  --radius: 6px;\n  --font: "Playfair Display";\n  --accent: #ff9e00;\n}`
  },
  brutalist: {
    name: 'Monolith Vanguard',
    bg: 'from-[#d2d1c9] to-[#bfbeb4]',
    gridColor: 'rgba(0, 0, 0, 0.06)',
    floorFill: '#f5f4eb',
    floorStroke: '#000000',
    floorStrokeWidth: 1.5,
    wallLeftFill: '#e2e1d9',
    wallLeftStroke: '#000000',
    wallRightFill: '#e2e1d9',
    wallRightStroke: '#000000',
    deskFill: '#ef4444',
    deskStroke: '#000000',
    deskStrokeWidth: 1.5,
    deskLegsStroke: '#000000',
    screenFill: '#ffde00',
    screenStroke: '#000000',
    screenContentFill: '#ffde00',
    posterFill: '#ffffff',
    posterStroke: '#000000',
    windowFill: 'rgba(59, 130, 246, 0.3)',
    windowStroke: '#000000',
    lampFill: '#000000',
    lampBeamFill: 'url(#brutalist-beam-grad)',
    lampBeamOpacity: 0.3,
    accentColor: '#ef4444',
    fontClass: 'font-sans font-black tracking-tighter uppercase text-[10px] text-black',
    cssText: `:root {\n  --theme-name: "Monolith Vanguard";\n  --bg-color: #f5f4eb;\n  --card-bg: #ef4444;\n  --border: 4px solid #000000;\n  --radius: 0px;\n  --shadow: 8px 8px 0px #000000;\n  --font: "Impact";\n}`
  }
};

export function ThemeHoverShowcase() {
  const [activeTheme, setActiveTheme] = useState<ThemeType>('noir');
  const t = THEME_DATA[activeTheme];

  const springTransition = { type: 'spring' as const, stiffness: 90, damping: 16 };

  useEffect(() => {
    const themes: ThemeType[] = ['noir', 'spatial', 'cyber', 'brutalist'];
    const interval = setInterval(() => {
      setActiveTheme((prev) => {
        const idx = themes.indexOf(prev);
        return themes[(idx + 1) % themes.length];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 p-5 md:p-6 rounded-[2rem] overflow-hidden" translate="no">
      
      {/* HEADER: Controls & Presets (Indicators Only) */}
      <div className="w-full flex justify-end items-center mb-2 shrink-0">
        {/* Active indicators */}
        <div className="flex items-center gap-2">
          {(['noir', 'spatial', 'cyber', 'brutalist'] as ThemeType[]).map((themeKey) => {
            const isSelected = activeTheme === themeKey;
            return (
              <div 
                key={themeKey}
                className="h-1 rounded-full transition-all duration-[600ms] ease-out"
                style={{ 
                  width: isSelected ? '24px' : '6px',
                  backgroundColor: isSelected ? 
                    (themeKey === 'spatial' ? '#60a5fa' :
                     themeKey === 'cyber' ? '#bcfe00' :
                     themeKey === 'noir' ? '#ff9e00' : '#ef4444') : 'rgba(255, 255, 255, 0.15)'
                }}
              />
            );
          })}
        </div>
      </div>

      <div 
        className="flex-1 min-h-[250px] relative rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center"
      >
          {/* Background Gradients (Cross-faded based on active theme) */}
          {(Object.keys(THEME_DATA) as ThemeType[]).map((themeKey) => {
            const isActive = activeTheme === themeKey;
            return (
              <motion.div
                key={themeKey}
                className={`absolute inset-0 bg-gradient-to-br ${THEME_DATA[themeKey].bg} pointer-events-none`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              />
            );
          })}

          {/* Subtle grid background overlay */}
          <div 
            className="absolute inset-0 transition-colors duration-700 pointer-events-none z-10"
            style={{
              backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* SVG Canvas */}
          <svg viewBox="0 0 400 300" className="w-full h-full max-w-[420px] max-h-[300px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative z-20">
            <defs>
              <linearGradient id="spatial-beam-grad" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="cyber-beam-grad" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#ff007f" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#00ffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="noir-beam-grad" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#ff9e00" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#ff9e00" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ff9e00" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="brutalist-beam-grad" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#ffde00" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#ffde00" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ffde00" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Back Spotlight Beam (Rendered behind furniture) */}
            <motion.polygon
              points="200,55 120,215 280,215"
              initial={{ strokeWidth: 0 }}
              animate={{
                fill: t.lampBeamFill,
                opacity: t.lampBeamOpacity,
                stroke: activeTheme === 'cyber' ? '#ff007f' : 'rgba(0,0,0,0)',
                strokeWidth: activeTheme === 'cyber' ? 1 : 0,
                strokeDasharray: activeTheme === 'cyber' ? '3 3' : 'none'
              }}
              transition={springTransition}
            />

            {/* Room Shell: Walls & Floor */}
            {/* Left Wall */}
            <motion.polygon
              points="50,200 50,70 200,10 200,140"
              animate={{
                fill: t.wallLeftFill,
                stroke: t.wallLeftStroke,
                strokeWidth: t.floorStrokeWidth
              }}
              transition={springTransition}
            />

            {/* Right Wall */}
            <motion.polygon
              points="200,140 200,10 350,70 350,200"
              animate={{
                fill: t.wallRightFill,
                stroke: t.wallRightStroke,
                strokeWidth: t.floorStrokeWidth
              }}
              transition={springTransition}
            />

            {/* Floor */}
            <motion.polygon
              points="50,200 200,140 350,200 200,260"
              animate={{
                fill: t.floorFill,
                stroke: t.floorStroke,
                strokeWidth: t.floorStrokeWidth
              }}
              transition={springTransition}
            />

            {/* Poster on Left Wall */}
            <g>
              <motion.polygon
                points="80,67 80,117 120,133 120,83"
                animate={{
                  fill: activeTheme === 'spatial' ? 'rgba(96, 165, 250, 0.2)' :
                        activeTheme === 'cyber' ? '#000000' :
                        activeTheme === 'noir' ? '#0e0e0e' : '#ffffff',
                  stroke: t.posterStroke,
                  strokeWidth: t.floorStrokeWidth
                }}
                transition={springTransition}
              />
              
              {/* Poster Content details */}
              <AnimatePresence mode="wait">
                {activeTheme === 'spatial' && (
                  <motion.circle
                    key="spatial-poster-art"
                    cx="100" cy="100" r="10"
                    fill="url(#spatial-beam-grad)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                {activeTheme === 'cyber' && (
                  <motion.path
                    key="cyber-poster-art"
                    d="M 85,90 L 115,110 M 85,110 L 115,90"
                    stroke="#ff007f"
                    strokeWidth="1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                {activeTheme === 'noir' && (
                  <motion.path
                    key="noir-poster-art"
                    d="M 90,85 L 110,95 M 90,105 L 110,115"
                    stroke="#888888"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                {activeTheme === 'brutalist' && (
                  <motion.polygon
                    key="brutalist-poster-art"
                    points="85,75 115,90 100,120"
                    fill="#ef4444"
                    stroke="#000000"
                    strokeWidth="2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </g>

            {/* Window on Right Wall */}
            <motion.polygon
              points="260,82 260,142 320,118 320,58"
              animate={{
                fill: t.windowFill,
                stroke: t.windowStroke,
                strokeWidth: t.floorStrokeWidth
              }}
              transition={springTransition}
            />

            {/* Table Legs */}
            {/* Back Leg */}
            <motion.line
              x1="200" y1="175" x2="200" y2="210"
              animate={{ stroke: t.deskLegsStroke, strokeWidth: t.deskStrokeWidth }}
              transition={springTransition}
            />
            {/* Left Leg */}
            <motion.line
              x1="130" y1="203" x2="130" y2="238"
              animate={{ stroke: t.deskLegsStroke, strokeWidth: t.deskStrokeWidth }}
              transition={springTransition}
            />
            {/* Right Leg */}
            <motion.line
              x1="270" y1="203" x2="270" y2="238"
              animate={{ stroke: t.deskLegsStroke, strokeWidth: t.deskStrokeWidth }}
              transition={springTransition}
            />
            {/* Front Leg */}
            <motion.line
              x1="200" y1="231" x2="200" y2="266"
              animate={{ stroke: t.deskLegsStroke, strokeWidth: t.deskStrokeWidth }}
              transition={springTransition}
            />

            {/* Desk Board Left Rim */}
            <motion.polygon
              points="130,195 200,223 200,231 130,203"
              animate={{
                fill: activeTheme === 'spatial' ? 'rgba(255, 255, 255, 0.05)' :
                      activeTheme === 'cyber' ? '#040806' :
                      activeTheme === 'noir' ? '#14100e' : '#ef4444',
                stroke: t.deskStroke,
                strokeWidth: t.deskStrokeWidth
              }}
              transition={springTransition}
            />

            {/* Desk Board Right Rim */}
            <motion.polygon
              points="200,223 270,195 270,203 200,231"
              animate={{
                fill: activeTheme === 'spatial' ? 'rgba(255, 255, 255, 0.03)' :
                      activeTheme === 'cyber' ? '#020403' :
                      activeTheme === 'noir' ? '#0f0b09' : '#ef4444',
                stroke: t.deskStroke,
                strokeWidth: t.deskStrokeWidth
              }}
              transition={springTransition}
            />

            {/* Desk Top */}
            <motion.polygon
              points="130,195 200,167 270,195 200,223"
              animate={{
                fill: t.deskFill,
                stroke: t.deskStroke,
                strokeWidth: t.deskStrokeWidth
              }}
              transition={springTransition}
            />

            {/* Keyboard flat on desk */}
            <motion.polygon
              points="185,205 200,199 215,205 200,211"
              animate={{
                fill: activeTheme === 'spatial' ? 'rgba(255,255,255,0.2)' :
                      activeTheme === 'cyber' ? '#000000' :
                      activeTheme === 'noir' ? '#080808' : '#ffffff',
                stroke: t.deskStroke,
                strokeWidth: t.floorStrokeWidth
              }}
              transition={springTransition}
            />

            {/* Laptop/Monitor Neck */}
            <motion.path
              d="M 198,185 L 202,185 L 202,170 L 198,170 Z"
              initial={{ strokeWidth: 0 }}
              animate={{
                fill: t.deskStroke,
                stroke: activeTheme === 'brutalist' ? '#000000' : 'rgba(0,0,0,0)',
                strokeWidth: activeTheme === 'brutalist' ? 2 : 0
              }}
              transition={springTransition}
            />

            {/* Monitor Back / Screen Base */}
            <motion.polygon
              points="180,130 180,154 220,170 220,146"
              animate={{
                fill: t.screenFill,
                stroke: t.screenStroke,
                strokeWidth: t.floorStrokeWidth
              }}
              transition={springTransition}
            />

            {/* Monitor Screen Panel Content */}
            <motion.polygon
              points="183,133 183,151 217,165 217,147"
              animate={{
                fill: t.screenContentFill
              }}
              transition={springTransition}
            />

            {/* Screen Content Details */}
            <g>
              <foreignObject x="183" y="132" width="34" height="34" transform="rotate(21.8 183 132)">
                <div className="w-full h-full flex items-center justify-center overflow-hidden leading-none select-none">
                  <AnimatePresence mode="wait">
                    {activeTheme === 'spatial' && (
                      <motion.div
                        key="spatial-screen-text"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 blur-[2px]"
                      />
                    )}
                    {activeTheme === 'cyber' && (
                      <motion.span
                        key="cyber-screen-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.8, 1] }}
                        exit={{ opacity: 0 }}
                        className="font-mono text-[5px] text-[#bcfe00] font-black"
                      >
                        [01]
                      </motion.span>
                    )}
                    {activeTheme === 'noir' && (
                      <motion.span
                        key="noir-screen-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        exit={{ opacity: 0 }}
                        className="font-serif text-[6px] text-neutral-300 font-bold"
                      >
                        P.01
                      </motion.span>
                    )}
                    {activeTheme === 'brutalist' && (
                      <motion.span
                        key="brutalist-screen-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-sans font-black text-[7px] text-black"
                      >
                        ART
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </foreignObject>
            </g>

            {/* Plant Pot on Floor */}
            <g>
              {/* Pot Base */}
              <motion.polygon
                points="94,228 106,228 103,240 97,240"
                animate={{
                  fill: activeTheme === 'spatial' ? 'rgba(255, 255, 255, 0.15)' :
                        activeTheme === 'cyber' ? '#111827' :
                        activeTheme === 'noir' ? '#1c1917' : '#000000',
                  stroke: t.deskStroke,
                  strokeWidth: t.floorStrokeWidth
                }}
                transition={springTransition}
              />
              {/* Leaves */}
              <motion.path
                d="M 100,228 C 96,215 88,218 84,215 C 88,222 96,224 100,228 Z"
                animate={{
                  fill: activeTheme === 'spatial' ? '#93c5fd' :
                        activeTheme === 'cyber' ? '#00ffff' :
                        activeTheme === 'noir' ? '#44403c' : '#ef4444'
                }}
                transition={springTransition}
              />
              <motion.path
                d="M 100,228 C 104,215 112,218 116,215 C 112,222 104,224 100,228 Z"
                animate={{
                  fill: activeTheme === 'spatial' ? '#a78bfa' :
                        activeTheme === 'cyber' ? '#ff007f' :
                        activeTheme === 'noir' ? '#57534e' : '#f5f4eb'
                }}
                transition={springTransition}
              />
            </g>

            {/* Lamp Wire & Shade */}
            <motion.line
              x1="200" y1="10" x2="200" y2="50"
              animate={{
                stroke: activeTheme === 'brutalist' ? '#000000' : t.lampFill,
                strokeWidth: t.floorStrokeWidth
              }}
              transition={springTransition}
            />

            {/* Lamp Dome Shade */}
            <motion.path
              d="M 190,50 Q 200,42 210,50 Z"
              initial={{ strokeWidth: 0 }}
              animate={{
                fill: t.lampFill,
                stroke: activeTheme === 'brutalist' ? '#000000' : 'rgba(0,0,0,0)',
                strokeWidth: activeTheme === 'brutalist' ? 2 : 0
              }}
              transition={springTransition}
            />

            {/* Front Light Source Ring/Glow (Rendered over lamp dome) */}
            <motion.circle
              cx="200" cy="50" r="2.5"
              animate={{
                fill: activeTheme === 'spatial' ? '#60a5fa' :
                      activeTheme === 'cyber' ? '#ff007f' :
                      activeTheme === 'noir' ? '#ff9e00' : '#ffffff'
              }}
              transition={springTransition}
            />
          </svg>

          {/* Floating UI tags */}
          <div className="absolute top-4 left-4 font-mono text-[9px] text-white/30 tracking-widest pointer-events-none uppercase">
            [ Workspace Preview ]
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 pointer-events-none">
            <span className="font-mono text-[9px] text-white/40 tracking-wider uppercase">{activeTheme}</span>
            <div 
              className="w-1.5 h-1.5 rounded-full animate-ping"
              style={{ 
                backgroundColor: activeTheme === 'spatial' ? '#60a5fa' :
                                activeTheme === 'cyber' ? '#bcfe00' :
                                activeTheme === 'noir' ? '#ff9e00' : '#ef4444' 
              }}
            />
          </div>
        </div>

    </div>
  );
}
