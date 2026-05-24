"use client";

import { useState, useRef, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type PreviewMode = 'desktop' | 'mobile';

const DEVICE_TIPS: Record<PreviewMode, { title: string; desc: string; icon: string }> = {
  desktop: {
    title: "Minimalist Desktop Layout",
    desc: "Renders a premium split-screen layout: a static sidebar column on the left (35% width) and a scrollable main content area on the right (65% width).",
    icon: "fa-desktop"
  },
  mobile: {
    title: "Thumb-Optimized Mobile View",
    desc: "Renders a streamlined mobile version featuring a unified top header and a single linear layout column.",
    icon: "fa-mobile-alt"
  }
};

const PenpotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22 4.5L37.5 12.25V31.75L22 39.5L6.5 31.75V12.25L22 4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 39.5V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M37.5 12.25L22 22L6.5 12.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 12V6M22 15V4M30 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CanvaIcon = ({ className }: { className?: string }) => (
  <span className={`font-black tracking-tight text-[9px] border border-current px-1 py-0.5 rounded-none ${className}`}>CANVA</span>
);

export function DeviceResizerSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  
  const [parentWidth, setParentWidth] = useState(960);
  const [isMobileWindow, setIsMobileWindow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const updateWidth = () => {
      if (wrapperRef.current) {
        setParentWidth(wrapperRef.current.offsetWidth);
        setIsMobileWindow(window.innerWidth < 1024);
      }
    };
    
    updateWidth();
    
    const observer = new ResizeObserver(updateWidth);
    observer.observe(wrapperRef.current);
    
    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const scale = previewMode === 'desktop' && isMobileWindow ? (parentWidth / 960) : 1;

  const currentTip = DEVICE_TIPS[previewMode];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 md:py-32 bg-[#08080a] overflow-hidden border-y border-white/10 animate-fade-in"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanner-sweep {
          0% { top: 0%; opacity: 0.1; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 100%; opacity: 0.1; }
        }
        @keyframes blueprint-pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.3; }
        }
        .grid-masked {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse at center, black 50%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 50%, transparent 100%);
        }
      `}} />

      {/* OVERHAULED CONCEPT: CAD Layout Blueprint Scanner Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Dotted/Grid mesh with radial center focus fade */}
        <div className="absolute inset-0 grid-masked" />

        {/* Dynamic Sweeping Laser Scanner */}
        <div 
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff9e00]/40 to-transparent z-10"
          style={{
            animation: 'scanner-sweep 8s infinite linear',
            boxShadow: '0 0 12px rgba(255, 158, 0, 0.5), 0 0 25px rgba(255, 158, 0, 0.25)'
          }}
        />

        {/* Soft ambient background glows behind the grid to add depth */}
        <div className="absolute top-[25%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#ff9e00]/[0.05] blur-[140px]" />
        <div className="absolute bottom-[25%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#3b82f6]/[0.03] blur-[140px]" />

        {/* Floating Blueprint Markers */}
        <div className="absolute top-12 left-12 font-mono text-[8px] text-white tracking-widest" style={{ animation: 'blueprint-pulse 4s infinite ease-in-out' }}>
          [X: 00.00, Y: 00.00] // GRID_ORIGIN
        </div>
        <div className="absolute top-24 right-16 font-mono text-[8px] text-white tracking-widest" style={{ animation: 'blueprint-pulse 5s infinite ease-in-out 1s' }}>
          viewport: 100vw x 100vh
        </div>
        <div className="absolute bottom-20 left-16 font-mono text-[8px] text-white tracking-widest" style={{ animation: 'blueprint-pulse 6s infinite ease-in-out 2s' }}>
          media_queries: [min-width: 1024px]
        </div>
        <div className="absolute bottom-32 right-12 font-mono text-[8px] text-white tracking-widest" style={{ animation: 'blueprint-pulse 4s infinite ease-in-out 3s' }}>
          grid-template: repeat(12, 1fr)
        </div>
        <div className="absolute top-1/2 left-8 font-mono text-[8px] text-white tracking-widest -rotate-90 origin-left" style={{ animation: 'blueprint-pulse 7s infinite ease-in-out' }}>
          flexbox_alignment: stretch
        </div>

        {/* Technical Coordinate Crosshairs (+) */}
        <div className="absolute top-16 left-[20%] font-mono text-sm text-[#ff9e00]/30 select-none animate-pulse">+</div>
        <div className="absolute top-48 right-[25%] font-mono text-sm text-white/20 select-none animate-pulse" style={{ animationDelay: '1.5s' }}>+</div>
        <div className="absolute bottom-48 left-[30%] font-mono text-sm text-white/20 select-none animate-pulse" style={{ animationDelay: '0.8s' }}>+</div>
        <div className="absolute bottom-16 right-[20%] font-mono text-sm text-[#ff9e00]/30 select-none animate-pulse" style={{ animationDelay: '2.2s' }}>+</div>

      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            <span className="text-[#ff9e00]">100%</span> Fluid. <span className="text-white/40">0% Layout Break.</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
            One smart canvas that precisely reshapes layout rules for comfortable reading across all screen dimensions.
          </p>
        </div>

        {/* CONTROLS BAR */}
        <div className="flex justify-center items-center mb-16">
          <div className="bg-white/[0.03] backdrop-blur-xl p-1 rounded-full border border-white/10 flex items-center relative w-[280px] h-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            
            {/* Sliding Pill Indicator */}
            <div 
              className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-[#ff9e00] to-[#ffb700] shadow-[0_0_20px_rgba(255,158,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                left: previewMode === 'desktop' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 6px)',
              }}
            />

            {/* Desktop Button */}
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`w-1/2 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-500 flex items-center justify-center gap-2 cursor-pointer z-10 relative ${
                previewMode === 'desktop' 
                  ? 'text-black' 
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              <i className="fas fa-desktop text-[12px]"></i> Desktop
            </button>

            {/* Mobile Button */}
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`w-1/2 h-full rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-500 flex items-center justify-center gap-2 cursor-pointer z-10 relative ${
                previewMode === 'mobile' 
                  ? 'text-black' 
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              <i className="fas fa-mobile-alt text-[12px]"></i> Mobile
            </button>

          </div>
        </div>

        {/* MAIN CANVAS GRID */}
        <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[580px]">
          
          {/* MOCKUP VIEWER PANEL (LEFT COLUMN) */}
          <div ref={wrapperRef} className="lg:col-span-8 flex justify-center items-center h-full w-full overflow-visible">
            
            <div 
              style={{ 
                width: '100%', 
                height: previewMode === 'desktop' 
                  ? (isMobileWindow ? `${520 * scale}px` : '520px') 
                  : '600px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'visible',
                position: 'relative',
                transition: isMobileWindow ? 'none' : 'height 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              {/* Device Container Frame */}
              <div
                className={`relative z-10 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden shrink-0 shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-slate-200/80
                  ${previewMode === 'desktop' 
                    ? 'bg-white rounded-2xl max-w-4xl' 
                    : 'bg-black border-[12px] border-slate-900 rounded-[3rem]'}
                `}
                style={isMobileWindow ? {
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: previewMode === 'desktop' ? '960px' : '315px',
                  height: previewMode === 'desktop' ? '520px' : '600px',
                  minWidth: previewMode === 'desktop' ? '960px' : '315px',
                  flexShrink: 0,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: 'none'
                } : {
                  position: 'relative',
                  width: previewMode === 'desktop' ? '100%' : '315px',
                  height: previewMode === 'desktop' ? '520px' : '600px',
                  transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), width 0.7s ease, height 0.7s ease'
                }}
              >
              {/* Browser Header / Notch bar */}
              <div className="shrink-0 z-20">
                {previewMode === 'desktop' ? (
                  <div className="h-12 flex items-center px-4 gap-3 bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="mx-auto px-6 py-1.5 bg-white text-[10px] font-mono text-slate-400 rounded-md flex items-center gap-2 font-bold shadow-sm border border-slate-200/50 truncate max-w-[250px]">
                      <i className="fas fa-lock text-[8px]"></i>portfo.be/jamal
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-0 left-0 h-7 bg-transparent flex justify-center w-full z-50 pointer-events-none">
                    <div className="w-24 h-5.5 bg-slate-900 rounded-b-2xl"></div>
                  </div>
                )}
              </div>

              {/* SIMULATED MINIMALIST THEME PAGE */}
              {/* SIMULATED MINIMALIST THEME PAGE */}
              <div 
                className={`flex-1 bg-white text-black text-xs flex relative simulated-theme ${
                  previewMode === 'desktop' ? 'flex-row overflow-hidden' : 'flex-col overflow-y-auto custom-scrollbar'
                }`}
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
                  .simulated-theme *:not(i):not(.fa):not(.fas):not(.far):not(.fab) {
                    font-family: 'Space Mono', monospace !important;
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
                
                {/* --- SIDEBAR SECTION (Kiri Desktop, Atas Mobile) --- */}
                <div className={`
                  bg-gray-50 border-gray-200 p-4 sm:p-6 flex flex-col justify-between shrink-0
                  ${previewMode === 'desktop' 
                    ? 'w-[35%] border-r h-full overflow-y-auto custom-scrollbar' 
                    : 'w-full border-b pt-9'}
                `}>
                  <div>
                    {/* Name Header & Availability Status */}
                    <div className="flex justify-between items-start mb-6">
                      <h1 className="font-bold text-sm leading-none tracking-tight">
                        JAMAL<br />ARIFIN
                      </h1>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[7px] font-bold uppercase tracking-widest text-gray-500">Available</span>
                      </div>
                    </div>

                    {/* Grayscale Profile Avatar (Square, Full Width) */}
                    <div className="w-full aspect-square mb-6 overflow-hidden border border-gray-200 rounded-none relative group">
                      <img 
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                        alt="avatar" 
                      />
                    </div>

                    {/* Profession & Bio */}
                    <div className={previewMode === 'desktop' ? 'text-left' : 'text-center'}>
                      <h2 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">
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

                  {/* Links / Contact Info & Socials (Static & non-clickable for preview) */}
                  <div className="pt-6 border-t border-gray-200 mt-6 text-left pointer-events-none select-none">
                    <div className="block text-xs font-bold tracking-tight mb-3 text-black">
                      hello@jamal.co
                    </div>
                    <div className="flex flex-wrap gap-3 text-[8px] font-bold uppercase tracking-wider text-gray-400">
                      <span>Instagram</span>
                      <span>Behance</span>
                      <span>Vimeo</span>
                      <span>YouTube</span>
                    </div>
                  </div>
                </div>

                {/* --- MAIN CONTENT SECTION (Kanan Desktop, Bawah Mobile) --- */}
                <div className={`bg-white flex-1 p-4 sm:p-6 pb-16 ${
                  previewMode === 'desktop' ? 'h-full overflow-y-auto custom-scrollbar' : ''
                }`}>
                  
                  {/* Stats Counter Section */}
                  <div className="grid grid-cols-2 border-b border-gray-200 pb-3 mb-6">
                    <div>
                      <p className="text-[7px] font-bold uppercase text-gray-400 mb-0.5">Projects</p>
                      <p className="text-xs font-bold">8 Total</p>
                    </div>
                    <div className="border-l border-gray-200 pl-3">
                      <p className="text-[7px] font-bold uppercase text-gray-400 mb-0.5">Recognition</p>
                      <p className="text-xs font-bold">3 Awards</p>
                    </div>
                  </div>

                  {/* Projects Index Header */}
                  <div className="flex justify-between items-end mb-4 pb-2 border-b border-gray-100">
                    <h3 className="text-[10px] uppercase font-bold">Selected Index</h3>
                    <span className="text-[7px] text-gray-400">Archive</span>
                  </div>

                  {/* Projects Grid (Video & Photo types) */}
                  <div className={`
                    grid gap-4 mb-8
                    ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}
                  `}>
                    
                    {/* Project 1: Video type */}
                    <div className="group">
                      <div className="aspect-[4/3] w-full overflow-hidden relative bg-white border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] rounded-none">
                        <img 
                          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=200&auto=format&fit=crop" 
                          className="w-full h-full object-cover grayscale" 
                          alt="work" 
                        />
                        {/* Play Button Icon for Video */}
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white border border-black text-black flex items-center justify-center rounded-none shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                            <i className="fas fa-play text-[8px] ml-0.5"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-start mt-3">
                        <div>
                          <h4 className="text-[9px] font-bold">Commercial Film</h4>
                          <p className="text-[7px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">Video</p>
                        </div>
                        <span className="text-[7px] text-gray-400">01</span>
                      </div>
                    </div>

                    {/* Project 2: Photo type */}
                    <div className="group">
                      <div className="aspect-[4/3] w-full overflow-hidden relative bg-white border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] rounded-none">
                        <img 
                          src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=200&auto=format&fit=crop" 
                          className="w-full h-full object-cover grayscale" 
                          alt="work" 
                        />
                        {/* Arrow Icon for Photo */}
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white border border-black text-black flex items-center justify-center rounded-none shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                            <i className="fas fa-arrow-right -rotate-45 text-[8px]"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-start mt-3">
                        <div>
                          <h4 className="text-[9px] font-bold">Architectural Series</h4>
                          <p className="text-[7px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">Photo</p>
                        </div>
                        <span className="text-[7px] text-gray-400">02</span>
                      </div>
                    </div>

                  </div>

                  {/* Explore Archive Button */}
                  <div className="flex justify-center mb-12">
                    <div className="inline-flex items-center gap-3 border border-gray-200 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">EXPLORE ARCHIVE</span>
                      <div className="w-6 h-6 border border-gray-200 flex items-center justify-center bg-white">
                        <i className="fas fa-arrow-right text-[8px] text-gray-400"></i>
                      </div>
                    </div>
                  </div>

                  {/* --- 3D SHOWCASE SECTION --- */}
                  <div className="border-t border-gray-200 pt-6 mb-12">
                    <div className="flex justify-between items-baseline mb-4">
                      <div>
                        <h3 className="text-[10px] uppercase font-bold">3D Showcase</h3>
                        <p className="text-[6px] text-gray-400 uppercase tracking-widest mt-0.5">Interactive Models</p>
                      </div>
                      <span className="text-[7px] font-mono text-gray-400 uppercase"><i className="fas fa-cube mr-1"></i> 1 Model</span>
                    </div>

                    {/* Simulated 3D Viewer box */}
                    <div className="w-full aspect-[16/9] bg-zinc-50 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex flex-col justify-between p-3 relative overflow-hidden">
                      {/* 3D Static Render Image */}
                      <div className="absolute inset-0 z-0">
                        <img 
                          src="/minimalist_chair_3d.png" 
                          className="w-full h-full object-cover grayscale opacity-95" 
                          alt="3D Industrial Chair Render" 
                        />
                      </div>

                      {/* Grid background for 3D simulation */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:10px_10px] opacity-30 z-10 pointer-events-none"></div>
                      
                      <div className="flex justify-between z-20">
                        <span className="text-[7px] font-bold bg-black text-white px-1.5 py-0.5">Interactive</span>
                        <div className="flex gap-1">
                          <span className="w-4 h-4 bg-white border border-black flex items-center justify-center text-[8px]"><i className="fas fa-search-plus"></i></span>
                          <span className="w-4 h-4 bg-white border border-black flex items-center justify-center text-[8px]"><i className="fas fa-sync"></i></span>
                        </div>
                      </div>

                      {/* Spacer/Empty container for centering */}
                      <div className="flex-1 z-20"></div>

                      <div className="flex justify-between items-end z-20">
                        <span className="text-[6px] text-gray-400 font-bold uppercase">[ Drag to Orbit ]</span>
                        <span className="text-[6px] text-gray-500 font-bold">Scale: 1.0</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start mt-3">
                      <div>
                        <h4 className="text-[9px] font-bold">Industrial Chair Concept</h4>
                        <p className="text-[7px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">3D Model</p>
                      </div>
                    </div>
                  </div>

                  {/* --- PENPOT SHOWCASE SECTION --- */}
                  <div className="border-t border-gray-200 pt-6 mb-12">
                    <div className="flex justify-between items-baseline mb-4">
                      <h3 className="text-[10px] uppercase font-bold">Design Index</h3>
                      <div className="flex items-center gap-1.5 text-[7px] font-bold text-gray-400">
                        <PenpotIcon className="w-3.5 h-3.5 text-black" />
                        <span>Penpot</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 p-3 border-2 border-black bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                        <div className="w-8 h-8 shrink-0 bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                          <PenpotIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[9px] font-bold uppercase truncate">Mobile UI Dashboard</h4>
                          <span className="text-[7px] text-gray-500">View on Penpot</span>
                        </div>
                        <i className="fas fa-arrow-right -rotate-45 text-[8px] text-gray-400"></i>
                      </div>
                    </div>
                  </div>

                  {/* --- CANVA SHOWCASE SECTION --- */}
                  <div className="border-t border-gray-200 pt-6 mb-12">
                    <div className="flex justify-between items-baseline mb-6 pb-2 border-b border-gray-100">
                      <h3 className="text-[10px] uppercase font-bold">Canva Showcase</h3>
                      <span className="text-[7px] font-bold uppercase tracking-widest text-gray-400">Canva</span>
                    </div>

                    <div>
                      <h4 className="text-[9px] font-bold mb-3 flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Logo Portfo.be
                      </h4>

                      <div className="w-full aspect-video bg-[#18191b] border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] rounded-none flex items-center justify-center p-4 relative overflow-hidden">
                        {/* Slide center logo */}
                        <div className="w-3/5 h-auto flex items-center justify-center">
                          <img 
                            src="/portfo.be.png" 
                            className="max-h-full max-w-full object-contain invert brightness-200" 
                            alt="Portfo.be Logo Slide" 
                          />
                        </div>
                        
                        {/* Mock Canva interactive button overlay */}
                        <div className="absolute bottom-2 right-2 z-10 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[6px] font-bold uppercase tracking-widest flex items-center gap-1">
                          <i className="fas fa-external-link-alt text-[5px]"></i> Use Template
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- GITHUB STATS SECTION --- */}
                  <div className="border-t border-gray-200 pt-6 mb-12">
                    <div className="flex justify-between items-baseline mb-4">
                      <h3 className="text-[10px] uppercase font-bold">Open Source</h3>
                      <span className="text-[7px] font-bold text-gray-400">GitHub</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                      {/* Top Repo */}
                      <div className="p-3 border-2 border-black bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-1.5 mb-1">
                          <i className="fab fa-github text-[10px]"></i>
                          <h4 className="text-[9px] font-bold">portfobe-app</h4>
                        </div>
                        <p className="text-[8px] text-gray-500 mb-2">Automated premium developer portfolio builder engine.</p>
                        <div className="flex items-center gap-3 text-[7px] font-bold text-gray-400">
                          <span><i className="fas fa-star text-[7px]"></i> 12</span>
                          <span><i className="fas fa-code-branch text-[7px]"></i> 4</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> TypeScript</span>
                        </div>
                      </div>
                    </div>

                    {/* Language Segmented Bar */}
                    <div className="mb-4">
                      <p className="text-[7px] font-bold text-gray-400 uppercase mb-1">Top Languages</p>
                      <div className="w-full h-2 flex bg-gray-100 mb-2">
                        <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                        <div className="h-full bg-yellow-500" style={{ width: '20%' }}></div>
                        <div className="h-full bg-red-500" style={{ width: '15%' }}></div>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[7px] font-bold text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-500"></span> TypeScript 65%</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-yellow-500"></span> JavaScript 20%</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500"></span> HTML/CSS 15%</span>
                      </div>
                    </div>

                    {/* Mock Git contribution squares calendar */}
                    <div className="mb-4">
                      <p className="text-[7px] font-bold text-gray-400 uppercase mb-1">Activity Grid</p>
                      <div className="grid gap-0.5 p-1 bg-gray-50 border border-gray-200" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                        {Array.from({ length: 48 }).map((_, i) => {
                          const level = i % 4 === 0 ? 'bg-green-700' : i % 3 === 0 ? 'bg-green-500' : i % 5 === 0 ? 'bg-green-300' : 'bg-gray-200';
                          return <div key={i} className={`aspect-square w-full ${level}`}></div>;
                        })}
                      </div>
                    </div>

                    {/* Mock Github Activity Feed Timeline */}
                    <div>
                      <p className="text-[7px] font-bold text-amber-500 uppercase tracking-widest mb-3">Recent Activity</p>
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
                              <div className={`w-1.5 h-1.5 rounded-full bg-amber-500 transition-all duration-300 ${act.highlight ? 'scale-150 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : ''}`} />
                            </div>
                            {/* Content */}
                            <div className="flex-1 flex justify-between items-center text-[7px] text-gray-500">
                              <p className="font-medium">
                                <span className="opacity-60">{act.desc}</span>{" "}
                                <span className="text-gray-900 font-bold">{act.repo}</span>
                              </p>
                              <span className="text-[6px] font-bold text-gray-400">{act.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* --- HONORS & AWARDS SECTION --- */}
                  <div className="border-t border-gray-200 pt-6 mb-12">
                    <h3 className="text-[10px] uppercase font-bold mb-4">Honors & Awards</h3>
                    <div className="border-t border-gray-200">
                      {/* Award Row 1 */}
                      <div className="py-2.5 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-3 w-2/3">
                          <span className="text-[8px] text-gray-400">2026</span>
                          <h4 className="text-[9px] font-bold truncate">Best Cinematography</h4>
                        </div>
                        <div className="flex items-center justify-end gap-2 w-1/3 text-[7px] text-gray-500 font-bold">
                          <span className="truncate">JFF</span>
                          <i className="fas fa-chevron-down"></i>
                        </div>
                      </div>
                      
                      {/* Award Row 2 */}
                      <div className="py-2.5 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-3 w-2/3">
                          <span className="text-[8px] text-gray-400">2025</span>
                          <h4 className="text-[9px] font-bold truncate">Commercial of the Year</h4>
                        </div>
                        <div className="flex items-center justify-end gap-2 w-1/3 text-[7px] text-gray-500 font-bold">
                          <span className="truncate">IAA</span>
                          <i className="fas fa-chevron-down"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- TESTIMONIALS SECTION --- */}
                  <div className="border-t border-gray-200 pt-6 mb-12">
                    <h3 className="text-[10px] uppercase font-bold mb-6">Testimonials</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Simulated Testimonial Card */}
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left">
                        <div className="flex items-center gap-3 mb-3">
                          {/* Circle Avatar (First Letter) */}
                          <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center font-bold text-[10px] text-black">
                            S
                          </div>
                          <div>
                            <h4 className="font-bold text-[9px] text-black leading-tight">Sarah Chen</h4>
                            <p className="text-[7px] text-gray-500 leading-none mt-0.5">Creative Director, Velo</p>
                          </div>
                        </div>

                        {/* Star Ratings */}
                        <div className="flex gap-0.5 mb-2.5 text-amber-400 text-[8px]">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
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
                    <span className="font-bold text-black uppercase">portfo.be/jamal</span>
                  </div>

                </div>



              </div>

            </div>
          </div>
        </div>

          {/* DYNAMIC BLUEPRINT PANEL (RIGHT COLUMN) */}
          <div className="lg:col-span-4 flex flex-col justify-between items-stretch text-left space-y-6 self-stretch">
            
            {/* 1. Header with Active Viewport Stats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Live Viewport Engine
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/25 text-[8px] font-bold text-green-400 uppercase tracking-wider">
                  <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                  Active
                </span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-baseline gap-2">
                <span>{previewMode === 'desktop' ? '1280px' : '390px'}</span>
                <span className="text-xs font-normal text-white/40">Viewport Width</span>
              </h3>
            </div>

            {/* 2. Visual Layout Minimap (CSS Grid Wireframe) */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9e00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center justify-between text-[9px] font-bold text-white/50 tracking-wider uppercase relative z-10">
                <span>Layout Minimap</span>
                <span className="text-[#ff9e00] font-mono font-bold">
                  {previewMode === 'desktop' ? 'display: flex' : 'flex-direction: column'}
                </span>
              </div>

              {/* Minimap Box Visualizer */}
              <div className="h-28 w-full border border-white/10 rounded-xl relative z-10 p-2 flex gap-2 transition-all duration-500 bg-black/40">
                {previewMode === 'desktop' ? (
                  <>
                    {/* Desktop Sidebar */}
                    <div className="w-[35%] h-full border border-[#ff9e00]/30 bg-[#ff9e00]/10 rounded-lg flex flex-col justify-between p-2 transition-all duration-500 animate-pulse">
                      <div className="w-5 h-5 rounded-full bg-white/20"></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-white/30 rounded w-full"></div>
                        <div className="h-1 bg-white/20 rounded w-2/3"></div>
                      </div>
                    </div>
                    {/* Desktop Content */}
                    <div className="w-[65%] h-full border border-white/10 bg-white/[0.02] rounded-lg p-2 flex flex-col gap-2 transition-all duration-500">
                      <div className="flex gap-2 h-1/2">
                        <div className="w-1/2 h-full border border-white/5 bg-white/[0.03] rounded"></div>
                        <div className="w-1/2 h-full border border-white/5 bg-white/[0.03] rounded"></div>
                      </div>
                      <div className="h-1/2 border border-white/5 bg-white/[0.03] rounded"></div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col gap-2 transition-all duration-500">
                    {/* Mobile Sidebar (Header) */}
                    <div className="h-[30%] border border-[#ff9e00]/30 bg-[#ff9e00]/10 rounded-lg flex items-center justify-between px-3 py-1 transition-all duration-500 animate-pulse">
                      <div className="w-3 h-3 rounded-full bg-white/20"></div>
                      <div className="w-12 h-1 bg-white/30 rounded"></div>
                    </div>
                    {/* Mobile Content */}
                    <div className="h-[70%] border border-white/10 bg-white/[0.02] rounded-lg p-2 flex flex-col gap-1.5 transition-all duration-500">
                      <div className="h-3 border border-white/5 bg-white/[0.03] rounded"></div>
                      <div className="h-3 border border-white/5 bg-white/[0.03] rounded"></div>
                      <div className="h-3 border border-white/5 bg-white/[0.03] rounded"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Code Config Terminal Visualizer */}
            <div className="bg-[#0b0c10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono">
              {/* Terminal Window Header */}
              <div className="bg-white/5 px-4 py-2.5 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                </div>
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
                  minimalist-theme.json
                </span>
                <span className="w-10"></span>
              </div>

              {/* Terminal Content */}
              <div className="p-4 text-[10px] sm:text-xs leading-relaxed space-y-1 select-none overflow-x-auto text-white/95">
                <div>
                  <span className="text-[#f47067] font-bold">{"{"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-[#8ddb8c]">"theme"</span>: <span className="text-[#6cb6ff]">"minimalist"</span>,
                </div>
                <div className="pl-4">
                  <span className="text-[#8ddb8c]">"typography"</span>: <span className="text-[#6cb6ff]">"Space Mono"</span>,
                </div>
                
                {/* Dynamically changes state based on active layout */}
                <div className="pl-4 py-0.5 px-2 bg-white/[0.03] border-l-2 border-[#ff9e00] my-1 transition-all">
                  <span className="text-[#8ddb8c]">"layout"</span>: <span className="text-[#ffb454] font-bold">
                    {previewMode === 'desktop' ? '"split-screen"' : '"stacked-column"'}
                  </span>,
                </div>
                
                <div className="pl-4">
                  <span className="text-[#8ddb8c]">"sidebarWidth"</span>: <span className="text-[#ffb454]">
                    {previewMode === 'desktop' ? '"35%"' : '"100%"'}
                  </span>,
                </div>
                <div className="pl-4">
                  <span className="text-[#8ddb8c]">"contentWidth"</span>: <span className="text-[#ffb454]">
                    {previewMode === 'desktop' ? '"65%"' : '"100%"'}
                  </span>,
                </div>
                <div className="pl-4">
                  <span className="text-[#8ddb8c]">"independentScroll"</span>: <span className="text-[#ffb454]">
                    {previewMode === 'desktop' ? 'true' : 'false'}
                  </span>
                </div>
                <div>
                  <span className="text-[#f47067] font-bold">{"}"}</span>
                </div>
              </div>
            </div>

            {/* 4. Active Media Queries Hint */}
            <div className="text-[10px] text-white/35 flex items-center justify-between font-mono bg-white/[0.01] border border-white/5 px-4 py-2 rounded-xl">
              <span>CSS Rules:</span>
              <span className="text-[#ff9e00]">
                {previewMode === 'desktop' ? '@media (min-width: 1024px)' : '@media (max-width: 1023px)'}
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
