"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Terminal, X } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { GlobalCursor } from '@/features/appearance';
import { ReactLenis } from '@studio-freight/react-lenis';

// Import design layouts
import ClassicGallery from './designs/ClassicGallery';
import EditorialGallery from './designs/EditorialGallery';
import GlassGallery from './designs/GlassGallery';
import CyberGallery from './designs/CyberGallery';
import BrutalistGallery from './designs/BrutalistGallery';

interface GalleryPageViewProps {
  projects: any[];
  subdomain: string;
  galleryTemplate?: string;
  galleryDesign?: string;
  isEditor?: boolean;
  customTexts?: any;
  profile?: any;
  links?: any[];
  email?: string;
}

const premiumEase = [0.16, 1, 0.3, 1] as const;

// Asymmetrical Grid Pattern Generator (Editorial)
const getEditorialClass = (index: number) => {
  const pattern = index % 7;
  switch (pattern) {
    case 0: return 'md:col-span-12 aspect-[16/9] md:aspect-[21/9]';
    case 1: return 'md:col-span-5 aspect-[4/5]';
    case 2: return 'md:col-span-7 aspect-[16/9]';
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

interface SmoothScrollWrapperProps {
  enabled: boolean;
  children: any;
}

function SmoothScrollWrapper({ enabled, children }: SmoothScrollWrapperProps) {
  if (!enabled) return <>{children}</>;
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          html.lenis, html.lenis body { height: auto; }
          .lenis.lenis-smooth { scroll-behavior: auto !important; }
          .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
          .lenis.lenis-stopped { overflow: hidden; }
        `
      }} />
      <ReactLenis root options={{ smoothWheel: true, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}>
        {children}
      </ReactLenis>
    </>
  );
}

export default function GalleryPageView({
  projects,
  subdomain,
  galleryTemplate = 'editorial',
  galleryDesign = 'classic',
  isEditor = false,
  customTexts = {},
  profile = null,
  links = [],
  email = ""
}: GalleryPageViewProps) {
  const router = useRouter();
  const [systemTime, setSystemTime] = useState("");
  const [activeProject, setActiveProjectState] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isSmoothScroll = !isMobile && (customTexts?.smooth_scroll === 'true');

  const handleSelectProject = (project: any) => {
    setActiveProjectState(project);
    if (project && project.id && !isEditor) {
      import('@/features/analytics').then(({ trackProjectClick }) => {
        trackProjectClick(subdomain, project.id, project.title);
      }).catch(err => console.error('Failed to track gallery project click:', err));
    }
  };

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
    if (galleryTemplate === 'fluid') return 'md:col-span-4 aspect-auto';
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

  // Gather layout props
  const layoutProps = {
    projects,
    subdomain,
    isEditor,
    customTexts,
    setActiveProject: handleSelectProject,
    getLayoutParts,
    premiumEase,
    systemTime,
    profile,
    links,
    email
  };

  return (
    <SmoothScrollWrapper enabled={isSmoothScroll}>
      <main className={`min-h-screen ${bgClass} selection:bg-[#F3F3F3] selection:text-[#030303] overflow-x-hidden relative transition-colors duration-500`}>

      {/* Premium Typography and Dynamic Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap');
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
          font-family: 'Cormorant Garamond', Georgia, serif !important;
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
                value={customTexts?.brutalistBackLabel || '← BACK'}
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

      {/* RENDER DYNAMIC LAYOUTS */}
      {isClassic && <ClassicGallery {...layoutProps} />}
      {isEditorialMag && <EditorialGallery {...layoutProps} />}
      {isGlass && <GlassGallery {...layoutProps} />}
      {isCyber && <CyberGallery {...layoutProps} />}
      {isBrutalist && <BrutalistGallery {...layoutProps} />}

      {/* MEDIA PLAYER & VIEWER MODAL OVERLAY */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProjectState(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl relative z-10 border border-white/10 flex flex-col bg-zinc-950
                ${isClassic ? 'border-white/10' : ''}
                ${isEditorialMag ? 'border-[#ff9e00]/30 shadow-[#ff9e00]/5' : ''}
                ${isGlass ? 'border-white/20 bg-white/[0.02] backdrop-blur-2xl shadow-[0_20px_50px_rgba(31,38,135,0.3)]' : ''}
                ${isCyber ? 'border-[#ff9e00]/30 font-mono text-[#ff9e00]' : ''}
                ${isBrutalist ? 'border-[4px] border-white shadow-[8px_8px_0px_0px_#ff9e00] rounded-none' : ''}
              `}
            >
              {/* Header Bar */}
              <div className={`p-4 flex justify-between items-center border-b border-white/10
                ${isCyber ? 'border-[#ff9e00]/20 bg-[#07070d]/90' : 'bg-black/40'}
                ${isBrutalist ? 'border-b-[4px] border-white bg-black' : ''}
              `}>
                <div className="flex flex-col min-w-0 pr-4 text-left">
                  <span className={`text-[9px] uppercase font-mono tracking-widest text-[#ff9e00] mb-0.5
                    ${isClassic ? 'text-white/40 font-gallery-mono' : ''}
                    ${isGlass ? 'text-violet-400 font-sans' : ''}
                    ${isBrutalist ? 'text-[#ff9e00] font-gallery-mono font-black' : ''}
                  `}>
                    {isCyber ? (
                      activeProject.projectType === 'video' ? '[ MEDIA_STREAM_ACTIVE // 0x22F ]' : '[ STATIC_NODE_ACTIVE // 0x22F ]'
                    ) : (
                      activeProject.projectType === 'video' ? 'Now Playing // Video Showcase' : 'Viewing Media // Photo Showcase'
                    )}
                  </span>
                  <h3 className={`text-sm md:text-base font-bold text-white truncate
                    ${isClassic ? 'font-gallery-serif italic' : ''}
                    ${isEditorialMag ? 'font-gallery-serif font-black' : ''}
                    ${isGlass ? 'font-gallery-display font-extrabold' : ''}
                    ${isCyber ? 'font-gallery-mono text-white' : ''}
                    ${isBrutalist ? 'font-gallery-display font-black uppercase text-white' : ''}
                  `}>
                    {activeProject.title}
                  </h3>
                </div>

                {/* Close Button inside header */}
                <button
                  onClick={() => setActiveProjectState(null)}
                  className={`flex items-center justify-center transition-all duration-300
                    ${isClassic ? 'w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/10' : ''}
                    ${isEditorialMag ? 'px-3 py-1 bg-black border border-white/10 hover:border-[#ff9e00] text-[#ff9e00] font-gallery-mono text-[9px] uppercase tracking-widest' : ''}
                    ${isGlass ? 'w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/30 text-white' : ''}
                    ${isCyber ? 'px-2 py-0.5 bg-black hover:bg-[#ff9e00] text-[#ff9e00] hover:text-black border border-[#ff9e00]/30 font-gallery-mono text-[8px] font-bold tracking-widest' : ''}
                    ${isBrutalist ? 'px-3 py-1 bg-[#ff9e00] text-black border-[3px] border-white font-gallery-mono font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]' : ''}
                  `}
                >
                  {isCyber ? (
                    <span className="flex items-center gap-1"><X className="w-3.5 h-3.5" /> [ ESC_DISCON ]</span>
                  ) : isEditorialMag ? (
                    <span className="flex items-center gap-1"><X className="w-3.5 h-3.5" /> CLOSE</span>
                  ) : isBrutalist ? (
                    <span className="flex items-center gap-1.5"><X className="w-3.5 h-3.5 stroke-[3]" /> CLOSE</span>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Media Content Container (Video or Photo) */}
              <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
                {activeProject.projectType === 'video' ? (
                  <UniversalPlayer
                    mediaUrl={activeProject.mediaUrl}
                    title={activeProject.title}
                    autoPlayMode={false}
                  />
                ) : (
                  <LazyImage
                    src={activeProject.mediaUrl}
                    alt={activeProject.title}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>

              {/* Optional Footer/Description Bar */}
              {activeProject.description && (
                <div className={`p-4 text-xs text-white/60 text-left border-t border-white/5 bg-black/20 max-h-24 overflow-y-auto custom-scrollbar
                  ${isCyber ? 'font-mono text-[#ff9e00]/70 border-[#ff9e00]/10 bg-black/40' : ''}
                  ${isBrutalist ? 'border-t-[3px] border-white bg-black text-white/80 font-mono' : ''}
                `}>
                  {isCyber && <span className="text-white/40 mr-1">&gt;&gt; STREAM_META_DESC:</span>}
                  {activeProject.description}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <GlobalCursor enabled={customTexts?.custom_cursor_enabled === 'true'} type={customTexts?.custom_cursor_type || 'circle-dot'} />
    </main>
  </SmoothScrollWrapper>
);
}