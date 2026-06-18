"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpatialProvider, useSpatialMedia } from './SpatialContext';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { EditableText } from '@/components/ui/EditableText';
import { useEscapeKey } from '@/hooks/useEscapeKey';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export function SpatialShellContent({ data, theme, isMobileView, isCardPreview, isEditor, children }: any) {
  const { selectedMedia, setSelectedMedia } = useSpatialMedia();
  useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  // Theme Setup
  const rawHighlightColor = theme?.themeColor || '#6366f1';
  const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#6366f1';

  // Font Sync
  const fontHeading = theme?.fontHeading || 'Inter';
  const fontBody = theme?.fontBody || 'Inter';
  const getFontFamily = (f: string) => {
      if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
      if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
      return "'Inter', sans-serif";
  };
  const customHeadingFont = getFontFamily(fontHeading);
  const customBodyFont = getFontFamily(fontBody);

  // Button Shape Sync
  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';
  const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';
  const xlCardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[48px]' : 'rounded-[32px]';

  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
  const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
  const firstName = fullName.split(' ')[0];

  return (
    <main className={`min-h-screen bg-[#020202] text-slate-200 font-sans selection:bg-[var(--hl)] selection:text-white relative overflow-x-hidden pb-20 spatial-theme`} style={{ '--hl': highlightColor } as React.CSSProperties}>

      <style dangerouslySetInnerHTML={{
          __html: `
  .spatial-theme *:not(i):not(.fa):not(.fas):not(.far):not(.fab) { font-family: ${customBodyFont} !important; }
  .spatial-theme h1, .spatial-theme h2, .spatial-theme h3, .spatial-theme h1 *:not(i):not(.fa), .spatial-theme h2 *:not(i):not(.fa), .spatial-theme h3 *:not(i):not(.fa) { font-family: ${customHeadingFont} !important; }
  /* Glassmorphism Mewah */
  .glass-panel {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  
  .glass-panel:hover {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .glass-nav {
    background: rgba(10, 10, 10, 0.5);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* Animasi Latar Belakang Aura */
  @keyframes aura-float {
      0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
      33% { transform: translate(30px, -50px) scale(1.1); opacity: 0.5; }
      66% { transform: translate(-20px, 20px) scale(0.9); opacity: 0.4; }
      100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  }
  .aura-1 { animation: aura-float 15s ease-in-out infinite; }
  .aura-2 { animation: aura-float 20s ease-in-out infinite reverse; }

  /* Kustomisasi Teks Gradien */
  .text-gradient {
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-image: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.5) 100%);
  }
`}} />

      {/* DYNAMIC AURA BACKGROUND */}
      <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} inset-0 pointer-events-none z-0 overflow-hidden bg-[#020202] @container`}>
          {/* Gunakan % bukan vw agar tidak glitch di card preview scale */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] mix-blend-screen aura-1" style={{ background: `radial-gradient(circle, ${highlightColor}40 0%, transparent 70%)` }}></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] mix-blend-screen aura-2" style={{ background: `radial-gradient(circle, ${highlightColor}30 0%, transparent 70%)` }}></div>
          {/* Noise Overlay for texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* FLOATING NAVBAR */}
      <motion.nav
          initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
          className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} top-0 left-0 w-full z-50 glass-nav flex justify-center py-4 px-6`}
      >
          <div className="w-full max-w-6xl flex justify-between items-center">
              <span className="font-semibold tracking-tight text-white">
                  <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} /> <EditableText value={theme?.customTexts?.spatial_nav_portfolio || 'Portfolio'} field="spatial_nav_portfolio" entity="appearance" isEditor={isEditor} as="span" className="opacity-40" maxLength={15} />
              </span>
              <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
                  <a href="#projects" className="hover:text-white transition-colors">Projects</a>
                  <a href="#awards" className="hover:text-white transition-colors hidden @md:block">Awards</a>
                  <a href={`mailto:${userEmail}`} className="text-white hover:opacity-80 transition-opacity">Contact</a>
              </div>
          </div>
      </motion.nav>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col pt-32 @md:pt-40">
        {children}
      </div>

      {/* --- SPATIAL MEDIA MODAL --- */}
      <AnimatePresence>
          {selectedMedia && (
              <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
              >
                  {/* Backdrop with Aura Glow */}
                  <div className="absolute inset-0 bg-[#020202]/90 backdrop-blur-2xl" onClick={() => setSelectedMedia(null)}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[180px] opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle, ${highlightColor} 0%, transparent 70%)` }}></div>
                  </div>

                  <motion.div 
                      initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      className={`relative w-full max-w-5xl glass-panel p-4 @md:p-8 ${xlCardRadiusClass} border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col gap-6 overflow-hidden`}
                      style={{ border: `1px solid ${highlightColor}20` } as any}
                  >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[1px] opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${highlightColor}, transparent)` }}></div>
                      <div className="flex justify-between items-center relative z-10 px-2">
                          <div className="flex flex-col text-left">
                              <h3 className="text-2xl font-semibold tracking-tight text-white">{selectedMedia.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--hl)]"></div>
                                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-left">
                                      {selectedMedia.type === 'video' ? 
                                          <EditableText value={theme?.customTexts?.spatial_video_label || 'Spatial Video Stream'} field="spatial_video_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> 
                                          : 
                                          <EditableText value={theme?.customTexts?.spatial_photo_label || 'Visual Masterpiece'} field="spatial_photo_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                      }
                                  </p>
                              </div>
                          </div>
                          <button 
                              onClick={() => setSelectedMedia(null)}
                              className={`w-12 h-12 ${radiusClass} glass-panel flex items-center justify-center hover:bg-white/10 transition-colors group`}
                          >
                              <i className="fas fa-times text-slate-400 group-hover:text-white transition-colors"></i>
                          </button>
                      </div>
                      <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                          className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} ${cardRadiusClass} overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center`}
                      >
                          {selectedMedia.type === 'video' ? (
                              <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center p-2">
                                  <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[55vh] object-contain rounded-lg" />
                              </div>
                          )}
                      </motion.div>
                      <div className="flex justify-center relative z-10 pb-2">
                          <button 
                              onClick={() => setSelectedMedia(null)}
                              className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 hover:text-[var(--hl)] transition-colors"
                          >
                              <EditableText value={theme?.customTexts?.spatial_close_btn || 'CLOSE ESCAPE'} field="spatial_close_btn" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                          </button>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

    </main>
  );
}

export function SpatialShell(props: any) {
  return (
    <SpatialProvider>
      <SpatialShellContent {...props} />
    </SpatialProvider>
  );
}
