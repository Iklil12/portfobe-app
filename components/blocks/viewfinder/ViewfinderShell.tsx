"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewfinderProvider, useViewfinder } from './ViewfinderContext';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { EditableText } from '@/components/ui/EditableText';
import { useEscapeKey } from '@/hooks/useEscapeKey';

function ViewfinderShellContent({ children, theme, isEditor, isCardPreview, data }: any) {
  const { selectedMedia, setSelectedMedia } = useViewfinder();
  useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  const primaryColor = theme?.themeColor || '#FF0033';
  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-sm';

  const fontHeading = theme?.fontHeading || 'Bebas Neue';
  const fontBody = theme?.fontBody || 'Space Mono';
  const getFontFamily = (f: string) => {
      if (!f) return "'Space Mono', monospace";
      if (f.toLowerCase().includes('space') || f.toLowerCase().includes('mono')) return "'Space Mono', monospace";
      if (f.toLowerCase().includes('serif') || f.toLowerCase().includes('elegant') || f.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
      if (f.toLowerCase().includes('bebas')) return "'Bebas Neue', sans-serif";
      return "'Inter', sans-serif";
  };
  const customBodyFont = getFontFamily(fontBody);
  const customHeadingFont = getFontFamily(fontHeading);

  const fullName = data?.profile?.fullName || data?.fullName || "JAMAL ARIFIN";
  const location = data?.profile?.location || data?.location || "JAKARTA, IDN";
  const email = data?.email || data?.user?.email || "hello@example.com";

  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const [timecode] = useState("00:04:26:15");

  return (
    <div
      style={{ '--primary': primaryColor } as React.CSSProperties}
      className="viewfinder-theme antialiased bg-[#050505] text-[#F3F3F1] relative w-full h-full overflow-hidden @container"
    >
      <style dangerouslySetInnerHTML={{
          __html: `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
      
      .viewfinder-theme { font-family: ${customBodyFont} !important; }
      .vf-body, .vf-hud-text { font-family: ${customBodyFont} !important; }
      .viewfinder-theme ::selection { background-color: var(--primary); color: #fff; }
      .viewfinder-theme .font-cinema { font-family: ${customHeadingFont} !important; }
      .viewfinder-theme .font-sans { font-family: ${customBodyFont} !important; }
      .viewfinder-theme .font-serif { font-family: ${customHeadingFont} !important; }
      .viewfinder-theme .font-heading { font-family: ${customHeadingFont} !important; }
      .viewfinder-theme .font-body { font-family: ${customBodyFont} !important; }

      .viewfinder-theme .film-strip::-webkit-scrollbar { display: none; }
      .viewfinder-theme .film-strip { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; }
      .viewfinder-theme .film-frame { scroll-snap-align: center; }
      .viewfinder-theme .no-scrollbar::-webkit-scrollbar { display: none; }
      .viewfinder-theme .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      .viewfinder-theme .viewfinder-tl { border-top: 2px solid #F3F3F1; border-left: 2px solid #F3F3F1; }
      .viewfinder-theme .viewfinder-tr { border-top: 2px solid #F3F3F1; border-right: 2px solid #F3F3F1; }
      .viewfinder-theme .viewfinder-bl { border-bottom: 2px solid #F3F3F1; border-left: 2px solid #F3F3F1; }
      .viewfinder-theme .viewfinder-br { border-bottom: 2px solid #F3F3F1; border-right: 2px solid #F3F3F1; }

      .viewfinder-theme .cine-img { transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1); }
      .viewfinder-theme .cine-img:hover { transform: scale(1.05); }

      .viewfinder-theme .vf-crosshair::before, .viewfinder-theme .vf-crosshair::after {
          content: ''; position: absolute; background: rgba(255,255,255,0.15);
          top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
      }
      .viewfinder-theme .vf-crosshair::before { width: 100%; height: 1px; }
      .viewfinder-theme .vf-crosshair::after { width: 1px; height: 100%; }

      .viewfinder-theme .vf-scroll::-webkit-scrollbar { width: 6px; }
      .viewfinder-theme .vf-scroll::-webkit-scrollbar-track { background: #050505; }
      .viewfinder-theme .vf-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      .viewfinder-theme .vf-scroll::-webkit-scrollbar-thumb:hover { background: var(--primary); }

      .viewfinder-theme .vf-scanline {
          width: 100%; height: 100px; z-index: 10; pointer-events: none;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.03), transparent);
          position: absolute; left: 0; top: -100px;
          animation: scanline 8s linear infinite;
      }
      @keyframes scanline {
          0% { top: -100px; }
          100% { top: 100%; }
      }

      /* Responsive Sizing */
      .viewfinder-theme .vf-hud-text { font-size: 10px; }
      .viewfinder-theme .vf-hud-padding { padding: 1rem; }
      .viewfinder-theme .vf-hud-brackets { inset: 1.5rem; }

      @container (min-width: 600px) {
          .viewfinder-theme .vf-hud-text { font-size: 14px; }
          .viewfinder-theme .vf-hud-padding { padding: 3rem; }
          .viewfinder-theme .vf-hud-brackets { inset: 10rem; }
      }
      `}} />

      {/* ===== STICKY HUD OVERLAY ===== */}
      <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} inset-0 z-50 pointer-events-none vf-hud-padding flex flex-col justify-between @container`} style={{ mixBlendMode: 'difference' }}>
          <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5, ease: cinematicEase }}
              className="flex justify-between items-start vf-hud-text font-bold tracking-widest text-white"
          >
              <div className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary)', mixBlendMode: 'normal' }}></span>
                      <EditableText value={theme?.customTexts?.vf_hud_rec || 'REC'} field="vf_hud_rec" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                  </span>
                  <span><EditableText value={theme?.customTexts?.vf_hud_tc || 'TC'} field="vf_hud_tc" entity="appearance" isEditor={isEditor} as="span" maxLength={5} /> {timecode}</span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                  <span className={`border border-current px-1.5 py-0.5 ${radiusClass} text-[9px]`}>100% 🔋</span>
                  <span><EditableText value={theme?.customTexts?.vf_hud_iso || 'ISO 800 | 24FPS'} field="vf_hud_iso" entity="appearance" isEditor={isEditor} as="span" maxLength={25} /></span>
              </div>
          </motion.div>

          <motion.div
              initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 0.2 }} transition={{ duration: 2, ease: cinematicEase }}
              className="absolute vf-hud-brackets flex items-center justify-center pointer-events-none"
          >
              <div className="w-full h-full relative">
                  <div className="absolute top-0 left-0 w-8 h-8 viewfinder-tl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 viewfinder-tr"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 viewfinder-bl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 viewfinder-br"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-px bg-white"></div>
                      <div className="w-px h-6 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
              </div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5, ease: cinematicEase }}
              className="flex justify-between items-end vf-hud-text font-bold tracking-widest text-white"
          >
              <div className="leading-snug">
                  <span><EditableText value={theme?.customTexts?.vf_dir || 'DIR.'} field="vf_dir" entity="appearance" isEditor={isEditor} as="span" maxLength={10} /> <EditableText value={fullName.toUpperCase()} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={30} /></span>
                  <br /><EditableText value={location.toUpperCase()} field="vf_location" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
              </div>
              <div className="text-right pointer-events-auto flex flex-col gap-0.5" style={{ mixBlendMode: 'normal' }}>
                  <a href="#projects" className="hover:opacity-70 transition">/ <EditableText value={theme?.customTexts?.vf_nav_1 || 'REEL'} field="vf_nav_1" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></a>
                  <a href="#stats" className="hover:opacity-70 transition">/ <EditableText value={theme?.customTexts?.vf_nav_2 || 'LOG'} field="vf_nav_2" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></a>
                  <a href={`mailto:${email}`} className="hover:opacity-70 transition">/ <EditableText value={theme?.customTexts?.vf_nav_3 || 'CONTACT'} field="vf_nav_3" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></a>
              </div>
          </motion.div>
      </div>

      <div className="w-full h-full overflow-y-auto overflow-x-hidden vf-scroll">
        <div className="w-full flex flex-col relative z-20">
          {children}
        </div>
      </div>

      <AnimatePresence>
        {selectedMedia && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
            >
                <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md" onClick={() => setSelectedMedia(null)}></div>
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.4, ease: cinematicEase }}
                    className={`relative w-full max-w-5xl bg-[#111] border border-[#333] flex flex-col overflow-hidden ${radiusClass}`}
                >
                    <div className="flex justify-between items-center px-4 py-3 border-b border-[#333] bg-black">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                            <span className="vf-hud-text font-bold tracking-[0.2em] text-white opacity-70 uppercase">{selectedMedia.title}</span>
                        </div>
                        <button onClick={() => setSelectedMedia(null)} className="text-white opacity-50 hover:opacity-100 transition-opacity">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="w-full bg-black relative" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                        {selectedMedia.type === 'video' ? (
                            <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                        ) : (
                            <div className="w-full flex items-center justify-center p-4 @md:p-8">
                                <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain" />
                            </div>
                        )}
                        {/* Scanline overlay in modal */}
                        <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-10 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.1)_50%,rgba(255,255,255,0))] bg-[length:100%_4px]"></div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ViewfinderShell(props: any) {
  return (
    <ViewfinderProvider>
      <ViewfinderShellContent {...props} />
    </ViewfinderProvider>
  );
}
