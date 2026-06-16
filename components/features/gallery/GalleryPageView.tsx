"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Film, Image as ImageIcon, Terminal, Layers, Activity, Cpu, Clock, Sparkles, AlertOctagon } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { EditableText } from '@/components/ui/EditableText';

interface GalleryPageViewProps {
  projects: any[];
  subdomain: string;
  galleryTemplate?: string;
  galleryDesign?: string;
  isEditor?: boolean;
  customTexts?: any;
}

const premiumEase = [0.16, 1, 0.3, 1] as const;

// Asymmetrical Grid Pattern Generator (Editorial)
const getEditorialClass = (index: number) => {
  const pattern = index % 7;
  switch (pattern) {
    case 0: return 'md:col-span-12 aspect-[16/9] md:aspect-[21/9]';
    case 1: return 'md:col-span-5 aspect-[4/5]';
    case 2: return 'md:col-span-7 aspect-[16/9] md:aspect-auto';
    case 3: return 'md:col-span-4 aspect-square';
    case 4: return 'md:col-span-4 aspect-square';
    case 5: return 'md:col-span-4 aspect-square';
    case 6: return 'md:col-span-8 md:col-start-3 aspect-[16/9]';
    default: return 'md:col-span-6 aspect-video';
  }
};

// Standard Grid Pattern Generator
const getGridClass = (index: number) => {
  return 'md:col-span-4 aspect-square'; // 3 columns square
};

// Masonry Pattern Generator
const getMasonryClass = (index: number) => {
  const heights = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-[3/5]', 'aspect-square'];
  return `md:col-span-4 ${heights[index % heights.length]}`; 
};

export default function GalleryPageView({ 
  projects, 
  subdomain, 
  galleryTemplate = 'editorial',
  galleryDesign = 'classic',
  isEditor = false,
  customTexts = {}
}: GalleryPageViewProps) {
  const router = useRouter();
  const [systemTime, setSystemTime] = useState("");

  // Clock effect for Cyber design
  useEffect(() => {
    if (isEditor) {
      setSystemTime("17:00:00 (PREVIEW)");
      return;
    }
    setSystemTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, [isEditor]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(`/${subdomain}`);
    }
  };

  const getLayoutClass = (index: number) => {
    if (galleryTemplate === 'masonry') return getMasonryClass(index);
    if (galleryTemplate === 'grid') return getGridClass(index);
    return getEditorialClass(index);
  };

  // Separates column-span from aspect-ratio so custom cards don't clip height
  const getLayoutParts = (index: number) => {
    const fullClass = getLayoutClass(index);
    const parts = fullClass.split(/\s+/);
    const spanClass = parts.filter(p => p.includes('col-span') || p.includes('col-start') || p.includes('col-end')).join(' ');
    let aspectClass = parts.filter(p => p.includes('aspect')).join(' ');
    if (!aspectClass) {
      aspectClass = "aspect-video";
    }
    return { spanClass, aspectClass };
  };

  // Determine styles based on galleryDesign selection
  const isClassic = galleryDesign === 'classic';
  const isEditorialMag = galleryDesign === 'editorial';
  const isGlass = galleryDesign === 'glass';
  const isCyber = galleryDesign === 'cyber';
  const isBrutalist = galleryDesign === 'brutalist';

  // Background Class
  let bgClass = "bg-[#030303] text-[#F3F3F3]";
  if (isEditorialMag) bgClass = "bg-[#0a0a0c] text-[#f8f9fa]";
  if (isGlass) bgClass = "bg-[#080b11] text-[#f1f3f9]";
  if (isCyber) bgClass = "bg-[#050508] text-[#e2e8f0]";
  if (isBrutalist) bgClass = "bg-[#0a0a0a] text-[#ffffff]";

  return (
    <main className={`min-h-screen ${bgClass} selection:bg-[#F3F3F3] selection:text-[#030303] overflow-x-hidden relative transition-colors duration-500`}>
      
      {/* Premium Typography and Dynamic Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 20s linear infinite;
        }
        .font-gallery-serif {
          font-family: 'Playfair Display', Georgia, serif !important;
        }
        .font-gallery-sans {
          font-family: 'Satoshi', 'Inter', sans-serif !important;
        }
        .font-gallery-display {
          font-family: 'Cabinet Grotesk', 'Space Grotesk', sans-serif !important;
        }
        .font-gallery-mono {
          font-family: 'Space Mono', 'Ubuntu Mono', monospace !important;
        }
      ` }} />

      {/* NOISE OVERLAY */}
      {!isBrutalist && (
        <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.25] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" style={{ mixBlendMode: 'overlay' }}></div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex items-center justify-between pointer-events-none">
        <button 
          onClick={(e) => {
            if (isEditor) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            handleBack(e);
          }}
          className={`group flex items-center gap-4 text-[10px] md:text-xs font-gallery-sans font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white/70 transition-all cursor-pointer appearance-none bg-transparent p-0 outline-none pointer-events-auto
            ${isBrutalist ? 'border-2 border-white bg-black px-4 py-2 hover:bg-white hover:text-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none translate-y-0 active:translate-y-[3px] active:translate-x-[3px] duration-100 rounded-none font-gallery-mono text-white' : ''}
          `}
        >
          {!isBrutalist && (
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
              <ArrowLeft className="w-4 h-4" />
            </div>
          )}
          <span className="block w-full h-full">
            {isBrutalist ? (
              <EditableText 
                value={customTexts?.brutalistBackLabel || '← KEMBALI'} 
                field="brutalistBackLabel" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={25} 
                as="span"
                className="text-white group-hover:text-black transition-colors duration-100"
              />
            ) : (
              <EditableText 
                value={customTexts?.generalBackLabel || 'Back to Portfolio'} 
                field="generalBackLabel" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={25} 
                as="span"
                className="text-white/90 group-hover:text-white/70 transition-colors"
              />
            )}
          </span>
        </button>
        
        <div className="text-[10px] md:text-xs font-gallery-mono font-bold uppercase tracking-[0.4em] text-white/50 pointer-events-auto flex items-center gap-2">
          {isCyber && <Terminal className="w-3.5 h-3.5 text-[#ff9e00] animate-pulse" />}
          <span>
            {isCyber ? (
              <EditableText 
                value={customTexts?.cyberNavLabel || 'SYS_MONITOR.ACTIVE'} 
                field="cyberNavLabel" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={30} 
                as="span"
              />
            ) : isBrutalist ? (
              <EditableText 
                value={customTexts?.brutalistNavLabel || 'EXHIBITION // RAW'} 
                field="brutalistNavLabel" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={30} 
                as="span"
              />
            ) : (
              <EditableText 
                value={customTexts?.generalNavLabel || 'EXHIBITION.SYS'} 
                field="generalNavLabel" 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={30} 
                as="span"
              />
            )}
          </span>
        </div>
      </nav>

      {/* ---------------------------------------------------- */}
      {/* 1. STRUCTURE: CLASSIC (MINIMAL MUSEUM) */}
      {/* ---------------------------------------------------- */}
      {isClassic && (
        <div className="relative z-10 font-gallery-sans">
          {/* Classic Hero */}
          <section className="pt-48 pb-20 px-6 md:px-12 lg:px-24 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: premiumEase }}
              className="max-w-4xl w-full flex flex-col items-center"
            >
              <span className="text-[10px] md:text-xs font-gallery-mono text-[#ff9e00] uppercase tracking-[0.3em] mb-6 block">
                <EditableText 
                  value={customTexts?.classicSubtitle || '[ 01 ] Selected Works'} 
                  field="classicSubtitle" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={50} 
                  as="span"
                />
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-gallery-serif italic font-light tracking-tight leading-[1.2] mb-10 text-white max-w-3xl text-center">
                <EditableText 
                  value={customTexts?.classicTitle || 'Curated Visual Narratives.'} 
                  field="classicTitle" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={100} 
                  as="span"
                />
              </h1>
              
              <div className="flex items-center gap-10 text-left bg-white/[0.02] border border-white/5 p-4 rounded-md">
                <div>
                  <p className="text-[9px] font-gallery-mono text-white/40 uppercase tracking-widest mb-1">
                    <EditableText 
                      value={customTexts?.classicCreatorLabel || 'Creator'} 
                      field="classicCreatorLabel" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={30} 
                      as="span"
                    />
                  </p>
                  <p className="text-xs md:text-sm font-medium">{subdomain}</p>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <div>
                  <p className="text-[9px] font-gallery-mono text-white/40 uppercase tracking-widest mb-1">
                    <EditableText 
                      value={customTexts?.classicAssetsLabel || 'Total Assets'} 
                      field="classicAssetsLabel" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={30} 
                      as="span"
                    />
                  </p>
                  <p className="text-xs md:text-sm font-medium">{projects.length} Masterpieces</p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Classic Grid */}
          <section className="px-6 md:px-12 lg:px-24 pb-40">
            {projects.length === 0 ? (
              <div className="w-full py-40 flex flex-col items-center justify-center text-center border border-white/5 bg-white/[0.01]">
                <p className="font-gallery-mono uppercase tracking-[0.3em] text-xs text-white/30 animate-pulse">The exhibition is currently empty.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: premiumEase, delay: 0.2 }}
                className={`grid grid-cols-1 md:grid-cols-12 ${galleryTemplate === 'masonry' ? 'gap-6' : 'gap-8'} auto-rows-min items-start`}
              >
                {projects.map((project, index) => {
                  const isVideo = project.projectType === 'video';
                  const thumbnailUrl = isVideo ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
                  const { spanClass, aspectClass } = getLayoutParts(index);
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.8, ease: premiumEase, delay: (index % 3) * 0.08 }}
                      onClick={() => router.push(`/${subdomain}/project/${project.id}`)}
                      className={`group relative flex flex-col cursor-pointer ${spanClass}`}
                    >
                      <div className="w-full h-full flex flex-col">
                        <div className={`w-full relative overflow-hidden bg-[#111] rounded transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${aspectClass}`}>
                          <LazyImage 
                            src={thumbnailUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                          />
                          
                          {/* Clean category badge on image */}
                          <div className="absolute top-3 left-3 z-10">
                            <span className="text-[8px] font-gallery-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-black/60 border border-white/10 text-white/80">
                              {isVideo ? 'FILM' : 'STILL'}
                            </span>
                          </div>

                          {/* Arrow overlay */}
                          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center shadow-lg">
                              <ArrowUpRight className="w-4.5 h-4.5" />
                            </div>
                          </div>
                        </div>

                        {/* Clean Gallery Description Below Image */}
                        <div className="mt-4 pb-2 flex items-start justify-between text-left">
                          <div className="flex flex-col gap-1 max-w-[80%]">
                            <h3 className="text-sm md:text-base font-gallery-serif italic font-bold text-white tracking-tight leading-tight group-hover:text-[#ff9e00] transition-colors">
                              {project.title}
                            </h3>
                            {project.description && (
                              <p className="text-white/40 text-[11px] font-gallery-sans line-clamp-2 mt-0.5 leading-relaxed">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <span className="text-[9px] font-gallery-mono text-white/30 pt-1">
                            NO. {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </section>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. STRUCTURE: EDITORIAL MAGAZINE (FULL WIDTH COVER DESIGN) */}
      {/* ---------------------------------------------------- */}
      {isEditorialMag && (
        <div className="relative z-10 font-gallery-serif">
          
          {/* Editorial Magazine Title & Editorial Column Header */}
          <section className="pt-48 pb-16 px-6 md:px-12 lg:px-24 border-b border-white/10 bg-[#09090b]">
            <div className="w-full flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: premiumEase }}
                className="flex-1"
              >
                <div className="flex items-center gap-4 text-[10px] font-gallery-mono tracking-widest text-[#ff9e00] mb-4">
                  <EditableText 
                    value={customTexts?.editorialVol || 'EST. 2026 // VOL III'} 
                    field="editorialVol" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={35} 
                    as="span"
                  />
                  <span>•</span>
                  <EditableText 
                    value={customTexts?.editorialVolTag || 'MANIFESTO'} 
                    field="editorialVolTag" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={20} 
                    as="span"
                  />
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-gallery-display font-black tracking-tighter leading-[0.85] text-white uppercase max-w-2xl break-words">
                  <EditableText 
                    value={customTexts?.editorialTitle || 'THE GALLERY.'} 
                    field="editorialTitle" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={50} 
                    as="span"
                  />
                </h1>
              </motion.div>
 
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
                className="w-full md:w-[350px] shrink-0 pt-4"
              >
                <p className="text-sm text-white/60 font-gallery-serif italic leading-relaxed mb-6">
                  <EditableText 
                    value={customTexts?.editorialDesc || 'Sebuah arsip digital visual yang memadukan estetika editorial cetak dengan interaktivitas modern.'} 
                    field="editorialDesc" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={250} 
                    as="span"
                  />
                </p>
                <div className="w-12 h-[1px] bg-[#ff9e00]"></div>
              </motion.div>
            </div>
 
            {/* Bottom metadata row inside header */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap justify-between items-center text-[10px] font-gallery-mono text-white/40 tracking-wider gap-4">
              <div className="flex gap-8">
                <div>
                  <span className="text-white/20 mr-1.5">
                    <EditableText 
                      value={customTexts?.editorialCreativeNodeLabel || 'CREATIVE NODE:'} 
                      field="editorialCreativeNodeLabel" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={20} 
                      as="span"
                    />
                  </span>
                  <span className="text-white/80 font-bold uppercase">{subdomain}</span>
                </div>
                <div>
                  <span className="text-white/20 mr-1.5">
                    <EditableText 
                      value={customTexts?.editorialTotalIndexLabel || 'TOTAL INDEX:'} 
                      field="editorialTotalIndexLabel" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={20} 
                      as="span"
                    />
                  </span>
                  <span className="text-white/80 font-bold">
                    {projects.length}{' '}
                    <EditableText 
                      value={customTexts?.editorialTotalIndexSuffix || 'ITEMS'} 
                      field="editorialTotalIndexSuffix" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={15} 
                      as="span"
                    />
                  </span>
                </div>
              </div>
              <div>
                <span className="text-white/20 mr-1.5">
                  <EditableText 
                    value={customTexts?.editorialSystemAccessLabel || 'SYSTEM ACCESS:'} 
                    field="editorialSystemAccessLabel" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={25} 
                    as="span"
                  />
                </span>
                <span className="text-[#ff9e00] font-bold">
                  <EditableText 
                    value={customTexts?.editorialSystemAccessVal || 'PUBLIC'} 
                    field="editorialSystemAccessVal" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={20} 
                    as="span"
                  />
                </span>
              </div>
            </div>
          </section>

          {/* Full Width Grid Column */}
          <section className="px-6 md:px-12 lg:px-24 pt-20 pb-40">
            {projects.length === 0 ? (
              <div className="w-full py-40 flex flex-col items-center justify-center text-center border border-white/5 bg-white/[0.01]">
                <p className="font-gallery-mono uppercase tracking-[0.3em] text-xs text-white/30">The exhibition is empty.</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-12 gap-10 items-start`}>
                {projects.map((project, index) => {
                  const isVideo = project.projectType === 'video';
                  const thumbnailUrl = isVideo ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
                  const { spanClass, aspectClass } = getLayoutParts(index);
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, ease: premiumEase }}
                      onClick={() => router.push(`/${subdomain}/project/${project.id}`)}
                      className={`group relative flex flex-col cursor-pointer ${spanClass}`}
                    >
                      <div className="w-full h-full flex flex-col group text-left">
                        <div className={`w-full relative overflow-hidden bg-[#16161a] border border-white/5 transition-all duration-500 ${aspectClass}`}>
                          <LazyImage 
                            src={thumbnailUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                          />
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center">
                              {isVideo ? <Film className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </div>
                        
                        {/* Editorial Metadata Below Image */}
                        <div className="mt-3.5 pb-2 border-b border-white/10 flex items-start justify-between">
                          <div className="flex flex-col gap-1 max-w-[80%]">
                            <span className="text-[10px] font-gallery-mono text-[#ff9e00] uppercase tracking-wider">
                              NO. {String(index + 1).padStart(2, '0')} // {isVideo ? 'VIDEO' : 'STILL'}
                            </span>
                            <h3 className="text-lg md:text-xl font-gallery-serif font-bold text-white tracking-tight leading-tight group-hover:text-[#ff9e00] transition-colors">
                              {project.title}
                            </h3>
                            {project.description && (
                              <p className="text-white/50 text-[11px] font-gallery-serif italic line-clamp-1 mt-0.5">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] font-gallery-mono text-white/30 pt-1">
                            {isVideo ? '[MP4]' : '[JPG]'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. STRUCTURE: FROSTED GLASS (FLOATING CARDS & AMBIENT SHADOWS) */}
      {/* ---------------------------------------------------- */}
      {isGlass && (
        <div className="relative z-10 font-gallery-sans">
          
          {/* Ambient Background Blobs (Motion-drifting) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <motion.div 
              animate={{ 
                x: [0, 90, -50, 0],
                y: [0, -70, 50, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-[10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-violet-600/15 blur-[160px]" 
            />
            <motion.div 
              animate={{ 
                x: [0, -110, 70, 0],
                y: [0, 90, -60, 0],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-[55%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/10 blur-[150px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.25, 0.85, 1],
                opacity: [0.3, 0.65, 0.4, 0.3]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[35%] left-[30%] w-[35vw] h-[35vw] rounded-full bg-indigo-500/10 blur-[180px]" 
            />
          </div>

          {/* Glass Hero card */}
          <section className="pt-48 pb-20 px-6 md:px-12 lg:px-24 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: premiumEase }}
              className="max-w-4xl w-full bg-white/[0.01] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-violet-600/5 via-transparent to-teal-500/5"></div>
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#ff9e00]" />
                <span className="text-[10px] font-gallery-sans font-bold uppercase tracking-wider text-white/80">
                  <EditableText 
                    value={customTexts?.glassPill || 'Glass Showcase'} 
                    field="glassPill" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={30} 
                    as="span"
                  />
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-gallery-display font-extrabold tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                <EditableText 
                  value={customTexts?.glassTitle || 'Visual Exhibition Space'} 
                  field="glassTitle" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={60} 
                  as="span"
                />
              </h1>
              
              <p className="text-xs md:text-sm text-white/50 max-w-md mx-auto leading-relaxed mb-8">
                <EditableText 
                  value={customTexts?.glassDesc || 'Jelajahi karya terbaik kami dalam wadah transparan modern dengan gradasi ambient yang hidup.'} 
                  field="glassDesc" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={200} 
                  as="span"
                />
              </p>
              
              <div className="flex justify-center gap-8 text-center text-xs">
                <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-md">
                  <span className="block text-white/40 text-[9px] uppercase font-gallery-mono">
                    <EditableText 
                      value={customTexts?.glassCuratedByLabel || 'Curated By'} 
                      field="glassCuratedByLabel" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={20} 
                      as="span"
                    />
                  </span>
                  <span className="font-semibold text-white/90 mt-0.5 block">{subdomain}</span>
                </div>
                <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-md">
                  <span className="block text-white/40 text-[9px] uppercase font-gallery-mono">
                    <EditableText 
                      value={customTexts?.glassElementsLabel || 'Elements'} 
                      field="glassElementsLabel" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={20} 
                      as="span"
                    />
                  </span>
                  <span className="font-semibold text-white/90 mt-0.5 block">
                    {projects.length}{' '}
                    <EditableText 
                      value={customTexts?.glassElementsSuffix || 'Items'} 
                      field="glassElementsSuffix" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={15} 
                      as="span"
                    />
                  </span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Glass floating Cards Grid */}
          <section className="px-6 md:px-12 lg:px-24 pb-40">
            {projects.length === 0 ? (
              <div className="w-full py-40 flex flex-col items-center justify-center text-center bg-white/[0.01] border border-white/10 rounded-2xl">
                <p className="font-gallery-mono uppercase tracking-[0.3em] text-xs text-white/30">The exhibition is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {projects.map((project, index) => {
                  const isVideo = project.projectType === 'video';
                  const thumbnailUrl = isVideo ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
                  const { spanClass, aspectClass } = getLayoutParts(index);
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-85px" }}
                      transition={{ duration: 0.8 }}
                      onClick={() => router.push(`/${subdomain}/project/${project.id}`)}
                      className={`group relative flex flex-col cursor-pointer ${spanClass}`}
                    >
                      <div className="w-full h-full bg-white/[0.01] backdrop-blur-xl border border-white/10 p-3 rounded-[24px] hover:bg-white/[0.04] hover:border-white/25 hover:shadow-[0_20px_50px_rgba(31,38,135,0.2)] hover:scale-[1.02] transition-all duration-500 flex flex-col relative overflow-hidden group/card shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                        {/* Specular Shimmer gloss reflection overlay */}
                        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover/card:animate-[shimmer_1.8s_infinite] pointer-events-none z-10"></div>
                        
                        {/* Image container inside the card */}
                        <div className={`w-full relative overflow-hidden rounded-[18px] bg-zinc-950/80 shrink-0 ${aspectClass}`}>
                          <LazyImage 
                            src={thumbnailUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-108"
                          />
                          
                          {/* Top category Pill floating */}
                          <div className="absolute top-3 left-3 z-10">
                            <span className="text-[8px] font-gallery-mono uppercase tracking-[0.25em] px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white/90 backdrop-blur-md">
                              {isVideo ? 'FILM' : 'STILL'}
                            </span>
                          </div>
                        </div>

                        {/* Text block below image, inside the glass capsule */}
                        <div className="mt-4 px-2 pb-2 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base md:text-lg font-gallery-display font-extrabold text-white tracking-tight leading-snug group-hover/card:text-[#ff9e00] transition-colors duration-300">
                              {project.title}
                            </h3>
                            {project.description && (
                              <p className="text-white/40 text-[11px] font-gallery-sans line-clamp-2 mt-1 leading-relaxed">
                                {project.description}
                              </p>
                            )}
                          </div>

                          {/* Micro interactive indicator */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[9px] font-gallery-mono text-white/30 uppercase tracking-widest">
                            <span>NO. {String(index + 1).padStart(2, '0')}</span>
                            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover/card:bg-white group-hover/card:text-black transition-all duration-300">
                              <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover/card:text-black transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. STRUCTURE: CYBER TECH / HUD (FULL CONSOLE COMMAND UI) */}
      {/* ---------------------------------------------------- */}
      {isCyber && (
        <div className="relative z-10 flex flex-col min-h-screen font-gallery-mono">
                 {/* Top Info HUD Bar */}
          <div className="w-full border-b border-[#ff9e00]/25 bg-[#07070d]/95 py-3 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-gallery-mono text-[#ff9e00]/70 gap-2 shrink-0 pt-24 md:pt-6 relative">
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff9e00]/40 to-transparent"></div>
            <div className="flex items-center gap-4">
              <span className="text-[#ff9e00] font-black tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff9e00] animate-ping"></span>
                <EditableText 
                  value={customTexts?.cyberSystemActive || 'CORE_SYSTEM_ACTIVE'} 
                  field="cyberSystemActive" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                />
              </span>
              <span className="text-white/30">|</span>
              <span className="text-white/60 tracking-wider">
                <EditableText 
                  value={customTexts?.cyberIndexLabel || 'INDEX: //'} 
                  field="cyberIndexLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={20} 
                  as="span"
                />{' '}
                {subdomain.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#ff9e00]" /> {systemTime}</span>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase">
                <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> 
                <EditableText 
                  value={customTexts?.cyberNetworkLabel || 'NETWORK_OK'} 
                  field="cyberNetworkLabel" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={20} 
                  as="span"
                />
              </span>
            </div>
          </div>
 
          {/* Full Width Diagnostics Dashboard Header */}
          <section className="pt-32 pb-8 px-6 md:px-12 lg:px-24">
            <div className="border border-[#ff9e00]/20 bg-[#07070d]/60 p-6 rounded relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="absolute top-0 right-0 w-24 h-24 bg-radial-gradient from-[#ff9e00]/5 to-transparent pointer-events-none"></div>
              
              <div className="flex-1 flex flex-col md:flex-row gap-8 items-start md:items-center w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#ff9e00] uppercase tracking-wider">
                    <Cpu className="w-4 h-4" /> 
                    <EditableText 
                      value={customTexts?.cyberCoreDiagLabel || 'CORE_DIAGNOSTICS'} 
                      field="cyberCoreDiagLabel" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={30} 
                      as="span"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-[10px] text-white/50 leading-relaxed">
                    <p>
                      &gt;{' '}
                      <EditableText 
                        value={customTexts?.cyberVerifiedLabel || 'VERIFIED'} 
                        field="cyberVerifiedLabel" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={15} 
                        as="span"
                      />{' '}
                      {projects.length}{' '}
                      <EditableText 
                        value={customTexts?.cyberNodesLabel || 'ACTIVE MEDIA NODES'} 
                        field="cyberNodesLabel" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={30} 
                        as="span"
                      />
                    </p>
                    <p>
                      &gt;{' '}
                      <EditableText 
                        value={customTexts?.cyberSysStreamLabel || 'SYS_STREAM: EMITTING DATA PORTAL FEED'} 
                        field="cyberSysStreamLabel" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={60} 
                        as="span"
                      />
                    </p>
                  </div>
                </div>
                
                <div className="hidden md:block w-[1px] h-12 bg-[#ff9e00]/20"></div>
 
                {/* Simulated connection metrics */}
                <div className="grid grid-cols-2 md:flex items-center gap-6 text-[10px] text-white/50">
                  <div>
                    <span className="block text-white/20 text-[8px] uppercase font-bold mb-0.5">
                      <EditableText 
                        value={customTexts?.cyberNodePingLabel || 'NODE_PING'} 
                        field="cyberNodePingLabel" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={20} 
                        as="span"
                      />
                    </span>
                    <span className="font-bold text-white/90">
                      <EditableText 
                        value={customTexts?.cyberNodePingVal || '14 ms [STABLE]'} 
                        field="cyberNodePingVal" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={25} 
                        as="span"
                      />
                    </span>
                  </div>
                  <div>
                    <span className="block text-white/20 text-[8px] uppercase font-bold mb-0.5">
                      <EditableText 
                        value={customTexts?.cyberEncryptionTitle || 'ENCRYPTION'} 
                        field="cyberEncryptionTitle" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={20} 
                        as="span"
                      />
                    </span>
                    <span className="font-bold text-white/90">
                      <EditableText 
                        value={customTexts?.cyberEncryptionLabel || 'AES-256-GCM'} 
                        field="cyberEncryptionLabel" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={25} 
                        as="span"
                      />
                    </span>
                  </div>
                  <div>
                    <span className="block text-white/20 text-[8px] uppercase font-bold mb-0.5">
                      <EditableText 
                        value={customTexts?.cyberClusterAddrTitle || 'CLUSTER_ADDR'} 
                        field="cyberClusterAddrTitle" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={20} 
                        as="span"
                      />
                    </span>
                    <span className="font-bold text-[#ff9e00]">
                      <EditableText 
                        value={customTexts?.cyberClusterAddrLabel || 'US-WEST-GRID-90X'} 
                        field="cyberClusterAddrLabel" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={25} 
                        as="span"
                      />
                    </span>
                  </div>
                </div>
              </div>
 
              {/* Animated status wave visualizer */}
              <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-1.5">
                <span className="text-[8px] text-white/30 uppercase tracking-widest block font-bold">
                  <EditableText 
                    value={customTexts?.cyberOscLabel || 'FEED_SIGNAL_OSC'} 
                    field="cyberOscLabel" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={25} 
                    as="span"
                  />
                </span>
                <div className="h-8 border border-[#ff9e00]/15 bg-black/50 rounded flex items-end justify-between px-3 py-1 gap-0.5 w-full">
                  {Array.from({ length: 22 }).map((_, i) => (
                    <span 
                      key={i}
                      className="w-1 bg-[#ff9e00]/60 rounded-t-sm"
                      style={{ 
                        height: `${10 + Math.sin(i * 0.8) * 8 + Math.random() * 6}%`,
                        animation: `pulse 1.${(i % 5) + 2}s infinite alternate`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* MAIN MANIFEST GRID AREA (FULL WIDTH) */}
          <section className="px-6 md:px-12 lg:px-24 pb-40">
            {projects.length === 0 ? (
              <div className="w-full py-40 flex flex-col items-center justify-center text-center border border-[#ff9e00]/20 bg-[#07070d]/30">
                <AlertOctagon className="w-8 h-8 text-[#ff9e00] mb-4 animate-bounce" />
                <p className="font-gallery-mono text-xs text-[#ff9e00] uppercase tracking-[0.2em]">&gt;&gt; LOG_ERR: MANIFEST EMPTY</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {projects.map((project, index) => {
                  const isVideo = project.projectType === 'video';
                  const thumbnailUrl = isVideo ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
                  const { spanClass, aspectClass } = getLayoutParts(index);
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      onClick={() => router.push(`/${subdomain}/project/${project.id}`)}
                      className={`group relative flex flex-col cursor-pointer border border-[#ff9e00]/20 bg-[#07070f]/50 hover:bg-[#0e0e1a]/80 hover:border-[#ff9e00] hover:shadow-[0_0_20px_rgba(255,158,0,0.15)] transition-all duration-300 p-3 ${spanClass}`}
                    >
                      {/* HUD corner indicator bracket overlays */}
                      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#ff9e00]"></div>
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#ff9e00]"></div>
                      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#ff9e00]"></div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#ff9e00]"></div>

                      <div className="w-full h-full flex flex-col font-gallery-mono text-left relative">
                        
                        {/* Image box */}
                        <div className={`w-full relative overflow-hidden border border-[#ff9e00]/15 group-hover:border-[#ff9e00]/40 transition-colors duration-300 bg-[#0c0c14] shrink-0 ${aspectClass}`}>
                          <LazyImage 
                            src={thumbnailUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-102 group-hover:opacity-85"
                          />
                          
                          {/* CRT screen lines overlay */}
                          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,158,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[size:100%_4px,6px_100%]"></div>
                          
                          {/* HUD brackets on image frame */}
                          <div className="absolute top-1.5 left-1.5 text-[7px] text-[#ff9e00]/55 font-bold">[ NODE_ID: 0{index + 1} ]</div>
                          <div className="absolute top-1.5 right-1.5 text-[7px] text-[#ff9e00]/55 font-bold">[ {isVideo ? 'VIDEO_STREAM' : 'STATIC_NODE'} ]</div>
                          
                          {/* Animated Sci-Fi targeting crosshair overlay */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#07070d]/30">
                            <div className="w-16 h-16 border border-dashed border-[#ff9e00] rounded-full animate-spin [animation-duration:8s] flex items-center justify-center relative">
                              <div className="w-8 h-8 border border-solid border-[#ff9e00] rounded-full flex items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-[#ff9e00] rounded-full"></span>
                              </div>
                            </div>
                            <span className="absolute bottom-4 bg-[#ff9e00] text-black text-[7px] font-black px-1.5 py-0.5 tracking-wider animate-pulse uppercase">LOCK_ON</span>
                          </div>
                        </div>

                        {/* Tech descriptions and details below image */}
                        <div className="mt-3.5 pt-2 border-t border-dashed border-[#ff9e00]/25 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white group-hover:text-[#ff9e00] transition-colors uppercase tracking-wider truncate max-w-[70%]">
                              {project.title}
                            </h3>
                            <span className="text-[8px] text-[#ff9e00] bg-[#ff9e00]/10 px-1.5 py-0.5 border border-[#ff9e00]/20 rounded font-bold">
                              {isVideo ? 'MP4_STRM' : 'IMG_STILL'}
                            </span>
                          </div>
                          {project.description && (
                            <p className="text-white/40 text-[10px] line-clamp-1 leading-normal">
                              {project.description}
                            </p>
                          )}
                          
                          {/* Coordinates and physical address info */}
                          <div className="flex items-center justify-between text-[8px] text-white/30 font-mono mt-1 pt-1.5 border-t border-[#ff9e00]/5">
                            <span>SECTOR: 0{index + 1} // ADDR: 0x{index * 8}F</span>
                            <span className="group-hover:text-[#ff9e00] transition-colors">[ ACCESS_NODE ]</span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. STRUCTURE: NEO-BRUTALIST (POSTER INTERCONNECTED CHESSBOARD GRID) */}
      {/* ---------------------------------------------------- */}
      {isBrutalist && (
        <div className="relative z-10 flex flex-col font-gallery-sans">
          
          {/* Marquee sliding ribbon header */}
          <div className="w-full bg-[#ff9e00] text-black border-y-[3px] border-white py-3.5 overflow-hidden flex whitespace-nowrap font-gallery-mono font-black uppercase tracking-widest text-xs z-30 shrink-0 mt-20">
            <div className={`animate-marquee flex gap-16 shrink-0 ${isEditor ? '[animation-play-state:paused]' : ''}`}>
              <span>
                <EditableText 
                  value={customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} 
                  field="brutalistMarquee" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={50} 
                  as="span"
                />{' '}
                // {subdomain.toUpperCase()}
              </span>
              <span>{customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} // {subdomain.toUpperCase()}</span>
              <span>{customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} // {subdomain.toUpperCase()}</span>
            </div>
            <div className={`animate-marquee flex gap-16 shrink-0 ${isEditor ? '[animation-play-state:paused]' : ''}`} aria-hidden="true">
              <span>{customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} // {subdomain.toUpperCase()}</span>
              <span>{customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} // {subdomain.toUpperCase()}</span>
              <span>{customTexts?.brutalistMarquee || 'RAW VISUAL ARCHIVE'} // {subdomain.toUpperCase()}</span>
            </div>
          </div>

          {/* Brutalist Bold Banner */}
          <section className="pt-24 pb-16 px-6 md:px-12 lg:px-24 flex justify-start">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase }}
              className="max-w-4xl w-full text-left relative"
            >
              <div className="inline-block bg-[#ff9e00] text-black text-[10px] font-gallery-mono font-black uppercase px-3.5 py-1.5 border-[3px] border-white mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <EditableText 
                  value={customTexts?.brutalistSticker || 'KARYA PILIHAN // ARCHIVE'} 
                  field="brutalistSticker" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={40} 
                  as="span"
                />
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-gallery-display font-black uppercase tracking-tighter leading-[0.85] text-white mb-8">
                <EditableText 
                  value={customTexts?.brutalistTitleFirst || 'CREATIVE'} 
                  field="brutalistTitleFirst" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={20} 
                  as="span"
                />
                <br/>
                <span className="bg-white text-black px-4 py-1.5 inline-block border-[5px] border-[#ff9e00] shadow-[6px_6px_0px_0px_#ffffff] mt-2">
                  <EditableText 
                    value={customTexts?.brutalistTitleSecond || 'MANIFESTO.'} 
                    field="brutalistTitleSecond" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={20} 
                    as="span"
                  />
                </span>
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[3px] border-white max-w-md mt-12 shadow-[5px_5px_0px_0px_#ff9e00] font-gallery-mono">
                <div className="p-4 border-b-[3px] md:border-b-0 md:border-r-[3px] border-white bg-[#ff9e00] text-black flex flex-col justify-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-black/50">
                    <EditableText 
                      value={customTexts?.brutalistNodeLabel || 'CREATOR NODE'} 
                      field="brutalistNodeLabel" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={30} 
                      as="span"
                    />
                  </span>
                  <span className="text-base font-black uppercase tracking-tight">{subdomain}</span>
                </div>
                <div className="p-4 bg-black text-white flex flex-col justify-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                    <EditableText 
                      value={customTexts?.brutalistIndexLabel || 'TOTAL INDEX'} 
                      field="brutalistIndexLabel" 
                      entity="appearance" 
                      isEditor={isEditor} 
                      maxLength={30} 
                      as="span"
                    />
                  </span>
                  <span className="text-base font-black uppercase tracking-tight">{projects.length} RECORDS</span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Connected Grid */}
          <section className="px-6 md:px-12 lg:px-24 pb-40">
            {projects.length === 0 ? (
              <div className="w-full py-40 flex flex-col items-center justify-center text-center border-4 border-white bg-black">
                <p className="font-gallery-mono uppercase tracking-[0.3em] text-xs text-white/50 animate-pulse">NO ENTRIES IN MANIFEST.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {projects.map((project, index) => {
                  const isVideo = project.projectType === 'video';
                  const thumbnailUrl = isVideo ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
                  const { spanClass, aspectClass } = getLayoutParts(index);
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6 }}
                      onClick={() => router.push(`/${subdomain}/project/${project.id}`)}
                      className={`group relative flex flex-col cursor-pointer ${spanClass}`}
                    >
                      <div className="w-full h-full flex flex-col group text-left bg-black border-[3px] border-white shadow-[6px_6px_0px_0px_#ff9e00] hover:shadow-[10px_10px_0px_0px_#ffffff] hover:-translate-x-1 hover:-translate-y-1 hover:rotate-[0.5deg] transition-all duration-200">
                        {/* Image section wrapper that dynamically controls aspect ratio height */}
                        <div className={`relative w-full overflow-hidden border-b-[3px] border-white bg-zinc-950 shrink-0 ${aspectClass}`}>
                          <LazyImage 
                            src={thumbnailUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                          
                          {/* Hard sticker tag */}
                          <div className="absolute top-3 left-3 bg-black border-2 border-white text-white text-[9px] font-gallery-mono font-black uppercase px-2 py-0.5 shadow-[2px_2px_0px_0px_#ff9e00] z-20">
                            {isVideo ? 'FILM' : 'STILL'}
                          </div>

                          {/* Floating label inside the image overlay (immune to aspect ratio overflow!) */}
                          <div className="absolute bottom-3 left-3 right-3 bg-white border-2 border-black p-2.5 text-black flex items-center justify-between shadow-[3px_3px_0px_0px_#000000] group-hover:bg-[#ff9e00] transition-all duration-300 z-20">
                            <div className="min-w-0 pr-2">
                              <span className="text-[8px] font-gallery-mono font-black uppercase text-[#ff9e00] tracking-wider block mb-0.5 leading-none">
                                {isVideo ? 'VIDEO RECORD' : 'IMAGE STILL'}
                              </span>
                              <h3 className="text-xs md:text-sm font-gallery-display font-black uppercase tracking-tight text-black truncate leading-tight">
                                {project.title}
                              </h3>
                            </div>
                            <div className="w-6 h-6 border-2 border-black flex items-center justify-center bg-black text-white shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

    </main>
  );
}