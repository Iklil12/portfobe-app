"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedLazyImage } from '@/shared/ui/OptimizedLazyImage';
import { Lock, Play, ArrowRight, ZoomIn, RefreshCw, Box, Star, GitBranch, ChevronDown, ExternalLink } from 'lucide-react';

// ============================================================================
// ARTISTIC CONCEPT: THE LIQUID CANVAS (DIMENSIONAL SHIFTER)
// High-end cinematic exterior wrapping the meticulously crafted simulated portfolio.
// ============================================================================

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PenpotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22 4.5L37.5 12.25V31.75L22 39.5L6.5 31.75V12.25L22 4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 39.5V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M37.5 12.25L22 22L6.5 12.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 12V6M22 15V4M30 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function DeviceResizerSection() {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <section className="relative min-h-[130vh] w-full bg-[#050505] text-white overflow-hidden pt-12 pb-32 sm:pt-16 md:pt-20 flex flex-col items-center justify-center font-mono border-t border-white/10">

      {/* ================= BACKGROUND ART ================= */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          layout
          className="absolute rounded-full opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, currentColor 0%, transparent 70%)' }}
          animate={{
            width: previewMode === 'desktop' ? '80vw' : '40vw',
            height: previewMode === 'desktop' ? '40vw' : '80vw',
            color: previewMode === 'desktop' ? '#ff9e00' : '#ffffff',
          }}
          transition={{ duration: 1.5, ease: EASE }}
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] mix-blend-overlay">
          <AnimatePresence mode="wait">
            <motion.h1
              key={previewMode}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
              transition={{ duration: 1 }}
              className="text-[20vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap font-mono"
            >
              {previewMode}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* ================= POETIC HEADER ================= */}
        <div
          className="text-center mb-16 space-y-6"
        >
          <span className="font-mono text-[#ff9e00] text-[10px] tracking-[0.5em] uppercase block border-b border-[#ff9e00]/30 pb-4 inline-block">
            [ DIMENSIONAL FLUIDITY ]
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight">
            Liquid <span className="text-[#ff9e00]">Architecture</span>
          </h2>
          <p className="text-white/40 font-mono text-[9px] md:text-xs tracking-[0.2em] max-w-lg mx-auto uppercase leading-relaxed">
            The interface bends to the vessel. Complete responsive precision without breaking the artistic narrative.
          </p>
        </div>

        {/* ================= THE CONTROLLER ================= */}
        <div
          className="flex gap-2 mb-20 p-1 bg-black border border-white/10 rounded-md"
        >
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`relative px-8 py-3 rounded-md transition-colors duration-500 z-10 ${previewMode === 'desktop' ? 'text-black font-medium' : 'text-white/40 hover:text-white/80 font-normal'}`}
          >
            <span className="relative z-20 font-mono text-[10px] uppercase tracking-widest font-medium">Desktop Layout</span>
            {previewMode === 'desktop' && (
              <motion.div layoutId="pill-active" className="absolute inset-0 bg-[#ff9e00] rounded-md z-10" />
            )}
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`relative px-8 py-3 rounded-md transition-colors duration-500 z-10 ${previewMode === 'mobile' ? 'text-black font-medium' : 'text-white/40 hover:text-white/80 font-normal'}`}
          >
            <span className="relative z-20 font-mono text-[10px] uppercase tracking-widest font-medium">Mobile View</span>
            {previewMode === 'mobile' && (
              <motion.div layoutId="pill-active" className="absolute inset-0 bg-[#ff9e00] rounded-md z-10" />
            )}
          </button>
        </div>

        {/* ================= THE LIVING CANVAS (MOCKUP) ================= */}
        <div className="relative w-full flex justify-center items-center min-h-[600px] perspective-[2000px]">

          {/* The Morphing Container */}
          <motion.div
            layout
            className={`bg-[#050505] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden relative flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-md border border-white/10 ${previewMode === 'desktop'
                ? 'w-full max-w-[960px] h-[480px] md:h-[640px]'
                : 'w-[325px] h-[600px] border-[1px] border-white/20'
              }`}
          >
            {/* Browser Header / Notch bar */}
            <div className="shrink-0 z-20">
              {previewMode === 'desktop' ? (
                <div className="h-12 flex items-center px-4 gap-3 bg-black/60 backdrop-blur-sm border-b border-white/10 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-md bg-white/20"></div>
                    <div className="w-2.5 h-2.5 rounded-md bg-white/20"></div>
                    <div className="w-2.5 h-2.5 rounded-md bg-white/20"></div>
                  </div>
                  <div className="mx-auto px-6 py-1 bg-[#0a0a0a] text-[9px] font-mono text-white/40 border border-white/10 rounded-md flex items-center gap-2 font-medium truncate max-w-[250px]">
                    <Lock className="w-2 h-2 text-[#ff9e00]" />portfo.be/jamal
                  </div>
                </div>
              ) : (
                <div className="absolute top-0 left-0 h-6 bg-transparent flex justify-center w-full z-50 pointer-events-none">
                  <div className="w-20 h-4 bg-white/10 border-b border-x border-white/15"></div>
                </div>
              )}
            </div>

            {/* SIMULATED MINIMALIST THEME PAGE WRAPPER FOR MOBILE SCALING */}
            <div className="flex-1 relative overflow-hidden w-full bg-white">
              <div
                data-lenis-prevent="true"
                className={`absolute top-0 left-0 origin-top-left w-[125%] h-[125%] scale-[0.8] md:w-full md:h-full md:scale-100 bg-white text-black text-xs flex simulated-theme ${
                  previewMode === 'desktop' ? 'flex-row overflow-hidden' : 'flex-col overflow-y-auto custom-scrollbar'
                  }`}
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
              <style dangerouslySetInnerHTML={{
                __html: `
                  .simulated-theme *:not(i):not(.fa):not(.fas):not(.far):not(.fab) {
                    font-family: var(--font-space-mono), 'Space Mono', monospace !important;
                  }
                  .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.15);
                    border-radius: 99px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.35);
                  }
                `}} />

              {/* --- SIDEBAR SECTION --- */}
              <div data-lenis-prevent="true" className={`
                  bg-gray-50 border-gray-200 flex flex-col justify-between shrink-0
                  ${previewMode === 'desktop'
                  ? 'w-[35%] border-r h-full overflow-y-auto custom-scrollbar p-3 md:p-6'
                  : 'w-full border-b pt-9 p-4 sm:p-6'}
                `}>
                <div>
                  {/* Name Header & Availability Status */}
                  <div className="flex justify-between items-start mb-6">
                    <h1 className="font-medium text-sm leading-none tracking-tight">
                      JAMAL<br />ARIFIN
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-[#ff9e00] rounded-full animate-pulse"></span>
                      <span className="text-[7px] font-medium uppercase tracking-widest text-[#ff9e00]">Available</span>
                    </div>
                  </div>

                  {/* Grayscale Profile Avatar (Square, Full Width) */}
                  <div className="w-full aspect-square mb-6 overflow-hidden border border-gray-200 rounded-md relative group">
                    <OptimizedLazyImage
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      alt="avatar"
                    />
                  </div>

                  {/* Profession & Bio */}
                  <div className={previewMode === 'desktop' ? 'text-left' : 'text-center'}>
                    <h2 className="text-[9px] font-medium uppercase tracking-wider text-gray-400 mb-2">
                      Director & Editor
                    </h2>
                    <p className="text-gray-600 text-[9px] sm:text-[10px] leading-relaxed mb-4">
                      A visual storyteller based in Jakarta. I craft meticulous, high-end visual narratives for commercial brands.
                    </p>

                    <ul className="text-[8px] text-gray-500 space-y-1 opacity-80 list-none pl-0">
                      <li>→ Minimalist Layout</li>
                      <li>→ Clean Typography</li>
                      <li>→ High-end Visuals</li>
                    </ul>
                  </div>
                </div>

                {/* Links / Contact Info & Socials */}
                <div className="pt-6 border-t border-gray-200 mt-6 text-left pointer-events-none select-none">
                  <div className="block text-xs font-medium tracking-tight mb-3 text-black">
                    hello@jamal.co
                  </div>
                  <div className="flex flex-wrap gap-3 text-[8px] font-medium uppercase tracking-wider text-gray-400">
                    <span>Instagram</span>
                    <span>Behance</span>
                    <span>Vimeo</span>
                    <span>YouTube</span>
                  </div>
                </div>
              </div>

              {/* --- MAIN CONTENT SECTION --- */}
              <div data-lenis-prevent="true" className={`bg-white flex-1 ${
                previewMode === 'desktop' 
                  ? 'h-full overflow-y-auto custom-scrollbar p-3 md:p-6 pb-12 md:pb-16' 
                  : 'p-4 sm:p-6 pb-16'
                }`}>

                {/* Stats Counter Section */}
                <div className="grid grid-cols-2 border-b border-gray-200 pb-3 mb-6">
                  <div>
                    <p className="text-[7px] font-medium uppercase text-gray-400 mb-0.5">Projects</p>
                    <p className="text-xs font-medium">8 Total</p>
                  </div>
                  <div className="border-l border-gray-200 pl-3">
                    <p className="text-[7px] font-medium uppercase text-gray-400 mb-0.5">Recognition</p>
                    <p className="text-xs font-medium">3 Awards</p>
                  </div>
                </div>

                {/* Projects Index Header */}
                <div className="flex justify-between items-end mb-4 pb-2 border-b border-gray-100">
                  <h3 className="text-[10px] uppercase font-medium">Selected Index</h3>
                  <span className="text-[7px] text-gray-400">Archive</span>
                </div>

                {/* Projects Grid */}
                <div className={`
                    grid mb-8
                    ${previewMode === 'mobile' ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-3 md:gap-4'}
                  `}>

                  {/* Project 1 */}
                  <div className="group">
                    <div className="aspect-[4/3] w-full overflow-hidden relative bg-white border border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] rounded-md">
                      <OptimizedLazyImage
                        src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=200&auto=format&fit=crop"
                        className="w-full h-full object-cover grayscale"
                        alt="work"
                      />
                      {/* Play Button Icon */}
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white border border-black text-black flex items-center justify-center rounded-md shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                          <Play className="w-2 h-2 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start mt-3">
                      <div>
                        <h4 className="text-[9px] font-medium">Commercial Film</h4>
                        <p className="text-[7px] font-medium uppercase tracking-wider text-gray-400 mt-0.5">Video</p>
                      </div>
                      <span className="text-[7px] text-gray-400">01</span>
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div className="group">
                    <div className="aspect-[4/3] w-full overflow-hidden relative bg-white border border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] rounded-md">
                      <OptimizedLazyImage
                        src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=200&auto=format&fit=crop"
                        className="w-full h-full object-cover grayscale"
                        alt="work"
                      />
                      {/* Arrow Icon */}
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white border border-black text-black flex items-center justify-center rounded-md shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                          <ArrowRight className="w-2 h-2 -rotate-45" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start mt-3">
                      <div>
                        <h4 className="text-[9px] font-medium">Architectural Series</h4>
                        <p className="text-[7px] font-medium uppercase tracking-wider text-gray-400 mt-0.5">Photo</p>
                      </div>
                      <span className="text-[7px] text-gray-400">02</span>
                    </div>
                  </div>

                </div>

                {/* Explore Archive Button */}
                <div className="flex justify-center mb-12">
                  <div className="inline-flex items-center gap-3 border border-gray-200 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-gray-400">EXPLORE ARCHIVE</span>
                    <div className="w-6 h-6 border border-gray-200 flex items-center justify-center bg-white">
                      <ArrowRight className="w-2 h-2 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* --- 3D SHOWCASE SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <div className="flex justify-between items-baseline mb-4">
                    <div>
                      <h3 className="text-[10px] uppercase font-medium">3D Showcase</h3>
                      <p className="text-[6px] text-gray-400 uppercase tracking-widest mt-0.5">Interactive Models</p>
                    </div>
                    <span className="text-[7px] font-mono text-gray-400 uppercase flex items-center gap-1"><Box className="w-2 h-2" /> 1 Model</span>
                  </div>

                  {/* Simulated 3D Viewer box */}
                  <div className="w-full aspect-[16/9] bg-zinc-50 border border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex flex-col justify-between p-3 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                      <OptimizedLazyImage
                        src="/minimalist_chair_3d.webp"
                        className="w-full h-full object-cover grayscale opacity-95"
                        alt="3D Industrial Chair Render"
                      />
                    </div>

                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:10px_10px] opacity-30 z-10 pointer-events-none"></div>

                    <div className="flex justify-between z-20">
                      <span className="text-[7px] font-medium bg-black text-white px-1.5 py-0.5">Interactive</span>
                      <div className="flex gap-1">
                        <span className="w-4 h-4 bg-white border border-black flex items-center justify-center"><ZoomIn className="w-2 h-2" /></span>
                        <span className="w-4 h-4 bg-white border border-black flex items-center justify-center"><RefreshCw className="w-2 h-2" /></span>
                      </div>
                    </div>

                    <div className="flex-1 z-20"></div>

                    <div className="flex justify-between items-end z-20">
                      <span className="text-[6px] text-gray-400 font-medium uppercase">[ Drag to Orbit ]</span>
                      <span className="text-[6px] text-gray-500 font-medium">Scale: 1.0</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mt-3">
                    <div>
                      <h4 className="text-[9px] font-medium">Industrial Chair Concept</h4>
                      <p className="text-[7px] font-medium uppercase tracking-wider text-gray-400 mt-0.5">3D Model</p>
                    </div>
                  </div>
                </div>

                {/* --- PENPOT SHOWCASE SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-[10px] uppercase font-medium">Design Index</h3>
                    <div className="flex items-center gap-1.5 text-[7px] font-medium text-gray-400">
                      <PenpotIcon className="w-3.5 h-3.5 text-black" />
                      <span>Penpot</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 border border-black bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                      <div className="w-8 h-8 shrink-0 bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <PenpotIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[9px] font-medium uppercase truncate">Mobile UI Dashboard</h4>
                        <span className="text-[7px] text-gray-500">View on Penpot</span>
                      </div>
                      <ArrowRight className="w-2 h-2 -rotate-45 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* --- CANVA SHOWCASE SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <div className="flex justify-between items-baseline mb-6 pb-2 border-b border-gray-100">
                    <h3 className="text-[10px] uppercase font-medium">Canva Showcase</h3>
                    <span className="text-[7px] font-medium uppercase tracking-widest text-gray-400">Canva</span>
                  </div>

                  <div>
                    <h4 className="text-[9px] font-medium mb-3 flex items-center gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Logo Portfo.be
                    </h4>

                    <div className="w-full aspect-video bg-[#18191b] border border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] rounded-md flex items-center justify-center p-4 relative overflow-hidden">
                      <div className="w-3/5 h-auto flex items-center justify-center relative min-h-[100px]">
                        <OptimizedLazyImage
                          src="/portfo.be.webp"
                          className="max-h-full max-w-full object-contain invert brightness-200"
                          alt="Portfo.be Logo Slide"
                        />
                      </div>

                      <div className="absolute bottom-2 right-2 z-10 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[6px] font-medium uppercase tracking-widest flex items-center gap-1">
                        <ExternalLink className="w-1.5 h-1.5" /> Use Template
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- GITHUB STATS SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-[10px] uppercase font-medium">Open Source</h3>
                    <span className="text-[7px] font-medium text-gray-400">GitHub</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4">
                    {/* Top Repo */}
                    <div className="p-3 border border-black bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        <h4 className="text-[9px] font-medium">portfobe-app</h4>
                      </div>
                      <p className="text-[8px] text-gray-500 mb-2">Automated premium developer portfolio builder engine.</p>
                      <div className="flex items-center gap-3 text-[7px] font-medium text-gray-400">
                        <span className="flex items-center gap-0.5"><Star className="w-2 h-2" fill="currentColor" /> 12</span>
                        <span className="flex items-center gap-0.5"><GitBranch className="w-2 h-2" /> 4</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> TypeScript</span>
                      </div>
                    </div>
                  </div>

                  {/* Language Segmented Bar */}
                  <div className="mb-4">
                    <p className="text-[7px] font-medium text-gray-400 uppercase mb-1">Top Languages</p>
                    <div className="w-full h-2 flex bg-gray-100 mb-2">
                      <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                      <div className="h-full bg-yellow-500" style={{ width: '20%' }}></div>
                      <div className="h-full bg-red-500" style={{ width: '15%' }}></div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[7px] font-medium text-gray-500">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-500"></span> TypeScript 65%</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-yellow-500"></span> JavaScript 20%</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500"></span> HTML/CSS 15%</span>
                    </div>
                  </div>

                  {/* Mock Git contribution squares calendar */}
                  <div className="mb-4">
                    <p className="text-[7px] font-medium text-gray-400 uppercase mb-1">Activity Grid</p>
                    <div className="grid gap-0.5 p-1 bg-gray-50 border border-gray-200" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                      {Array.from({ length: 48 }).map((_, i) => {
                        const level = i % 4 === 0 ? 'bg-green-700' : i % 3 === 0 ? 'bg-green-500' : i % 5 === 0 ? 'bg-green-300' : 'bg-gray-200';
                        return <div key={i} className={`aspect-square w-full ${level}`}></div>;
                      })}
                    </div>
                  </div>

                  {/* Mock Github Activity Feed Timeline */}
                  <div>
                    <p className="text-[7px] font-medium text-[#ff9e00] uppercase tracking-widest mb-3">Recent Activity</p>
                    <div className="space-y-3 relative">
                      {/* Vertical line */}
                      <div className="absolute left-[2.5px] top-1 bottom-[-8px] w-[1px] bg-slate-900" />

                      {[
                        { desc: "Made a push to", repo: "iklil12/portfobe-app", time: "7H AGO", highlight: false },
                        { desc: "Made a push to", repo: "iklil12/portfobe-app", time: "1D AGO", highlight: false },
                        { desc: "Made a push to", repo: "iklil12/portfobe-app", time: "1D AGO", highlight: true },
                        { desc: "Made a push to", repo: "iklil12/portfobe-app", time: "2D AGO", highlight: false },
                        { desc: "Made a push to", repo: "iklil12/portfobe-app", time: "3D AGO", highlight: false }
                      ].map((act, idx) => (
                        <div key={idx} className="flex gap-3 items-center relative">
                          {/* Dot */}
                          <div className="relative z-10">
                            <div className={`w-1.5 h-1.5 rounded-full bg-[#ff9e00] transition-all duration-300 ${act.highlight ? 'scale-150 shadow-[0_0_8px_rgba(255,158,0,0.6)]' : ''}`} />
                          </div>
                          {/* Content */}
                          <div className="flex-1 flex justify-between items-center text-[7px] text-gray-500">
                            <p className="font-medium">
                              <span className="opacity-60">{act.desc}</span>{" "}
                              <span className="text-gray-900 font-medium">{act.repo}</span>
                            </p>
                            <span className="text-[6px] font-medium text-gray-400">{act.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- HONORS & AWARDS SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <h3 className="text-[10px] uppercase font-medium mb-4">Honors & Awards</h3>
                  <div className="border-t border-gray-200">
                    {/* Award Row 1 */}
                    <div className="py-2.5 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-3 w-2/3">
                        <span className="text-[8px] text-gray-400">2026</span>
                        <h4 className="text-[9px] font-medium truncate">Best Cinematography</h4>
                      </div>
                      <div className="flex items-center justify-end gap-2 w-1/3 text-[7px] text-gray-500 font-medium">
                        <span className="truncate">JFF</span>
                        <ChevronDown className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    {/* Award Row 2 */}
                    <div className="py-2.5 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-3 w-2/3">
                        <span className="text-[8px] text-gray-400">2025</span>
                        <h4 className="text-[9px] font-medium truncate">Commercial of the Year</h4>
                      </div>
                      <div className="flex items-center justify-end gap-2 w-1/3 text-[7px] text-gray-500 font-medium">
                        <span className="truncate">IAA</span>
                        <ChevronDown className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- TESTIMONIALS SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <h3 className="text-[10px] uppercase font-medium mb-6">Testimonials</h3>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Simulated Testimonial Card */}
                    <div className="p-4 rounded-md bg-gray-50 border border-gray-200 text-left">
                      <div className="flex items-center gap-3 mb-3">
                        {/* Circle Avatar (First Letter) */}
                        <div className="w-8 h-8 rounded-md bg-black/10 flex items-center justify-center font-medium text-[10px] text-black">
                          S
                        </div>
                        <div>
                          <h4 className="font-medium text-[9px] text-black leading-tight">Sarah Chen</h4>
                          <p className="text-[7px] text-gray-500 leading-none mt-0.5">Creative Director, Velo</p>
                        </div>
                      </div>

                      {/* Star Ratings */}
                      <div className="flex gap-0.5 mb-2.5 text-[#ff9e00]">
                        <Star className="w-2 h-2" fill="currentColor" />
                        <Star className="w-2 h-2" fill="currentColor" />
                        <Star className="w-2 h-2" fill="currentColor" />
                        <Star className="w-2 h-2" fill="currentColor" />
                        <Star className="w-2 h-2" fill="currentColor" />
                      </div>

                      <p className="text-[9px] text-gray-600 italic leading-relaxed">
                        "Jamal's attention to detail is exceptional. He brought our brand's vision to life with stunning visuals and seamless execution."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-[7px] text-gray-400">
                  <span>© 2026 Jamal. All Rights Reserved.</span>
                  <span className="font-medium text-black uppercase">portfo.be/jamal</span>
                </div>

              </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
