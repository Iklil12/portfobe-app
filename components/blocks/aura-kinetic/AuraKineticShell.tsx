"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuraKineticProvider, useAuraKineticMedia } from './AuraKineticContext';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';
import { EditableText } from '@/shared/ui/EditableText';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

const AuraKineticNavbar = ({ data, theme, isEditor, isCardPreview }: any) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // Matikan scroll detection di editor dan preview untuk menghindari jitter!
        if (isCardPreview || isEditor) return; 

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsScrolled(!entry.isIntersecting);
            },
            { root: null, rootMargin: '0px', threshold: 0 }
        );

        const sentinel = document.getElementById('aura-scroll-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, [isCardPreview, isEditor]);

    const fullName = data?.profile?.fullName || data?.fullName || "Aura Studio";
    const firstName = fullName.split(' ')[0];
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            // Jika di editor, gunakan absolute agar menempel di atas kanvas dan tidak bergetar.
            // Jika di generated site, gunakan fixed agar bisa sticky mengikuti layar.
            className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} left-0 w-full z-50 flex justify-center pointer-events-none transition-all duration-500 ease-in-out ${isScrolled ? 'top-6 px-4' : 'top-0 px-6 md:px-12 py-6'}`}
        >
            <nav
                className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-in-out ${isScrolled ? 'gap-4 md:gap-10 px-4 md:px-10 py-2 md:py-4 bg-white/10 border border-white/20 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-[95%] md:w-full max-w-[1200px] hover:bg-white/15' : 'gap-4 md:gap-10 px-0 py-0 bg-transparent border-transparent w-[95%] md:w-full max-w-[1400px]'}`}
            >
                <span className={`font-sans font-bold tracking-tight text-white transition-all duration-500 ease-in-out ${isScrolled ? 'text-base md:text-2xl' : 'text-xl md:text-4xl'}`}>
                    <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} /><span className="text-[var(--hl)]">.</span>
                </span>

                <div className={`hidden md:flex font-sans font-semibold text-white/50 transition-all duration-500 ease-in-out ${isScrolled ? 'gap-8 text-sm' : 'gap-10 text-base'}`}>
                    <a href="#work" className="hover:text-white transition-colors">
                        <EditableText value={theme?.customTexts?.aura_nav_work || 'Work'} field="aura_nav_work" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                    </a>
                    <a href="#awards" className="hover:text-white transition-colors">
                        <EditableText value={theme?.customTexts?.aura_nav_awards || 'Awards'} field="aura_nav_awards" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                    </a>
                </div>

                <a href={`mailto:${userEmail}`} className={`font-sans font-bold uppercase tracking-widest text-black bg-[var(--hl)] hover:scale-105 transition-all duration-500 ease-in-out whitespace-nowrap ${isScrolled ? 'text-[10px] md:text-xs px-4 md:px-6 py-2 md:py-3 rounded-full' : 'text-[10px] md:text-sm px-5 md:px-8 py-2.5 md:py-4 rounded-full'}`}>
                    <EditableText value={theme?.customTexts?.aura_nav_cta || 'Hire Me'} field="aura_nav_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                </a>
            </nav>
        </motion.div>
    );
};

export function AuraKineticShellContent({ data, theme, isMobileView, isCardPreview, isEditor, children }: any) {
  const { selectedMedia, setSelectedMedia } = useAuraKineticMedia();
  
  useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  const fontHeading = theme?.fontHeading || 'outfit';
  const fontBody = theme?.fontBody || 'inter';

  const getFontFamily = (f?: string) => {
      if (f?.toLowerCase().includes('mono')) return "'Space Mono', monospace";
      if (f?.toLowerCase().includes('outfit')) return "'Outfit', sans-serif";
      if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
      return "'Inter', sans-serif";
  };

  const customHeadingFont = getFontFamily(fontHeading);
  const customBodyFont = getFontFamily(fontBody);
  
  const rawHighlightColor = theme?.themeColor || '#8b5cf6';
  const accentColor = rawHighlightColor.startsWith('#') || rawHighlightColor.startsWith('rgb') ? rawHighlightColor : '#8b5cf6';
  const accentText = theme?.buttonTextColor || '#ffffff';
  
  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] overflow-x-clip text-white w-full aura-theme aura-kinetic-theme font-sans selection:bg-[var(--hl)] selection:text-white" style={{ '--hl': accentColor } as React.CSSProperties}>
      <div id="aura-scroll-sentinel" className="absolute top-0 left-0 w-full h-[60px] pointer-events-none opacity-0"></div>
      
      <style dangerouslySetInnerHTML={{__html: `
          .aura-kinetic-theme {
              --brand-bg: #0a0a0c;
              --brand-text: #ffffff;
              --brand-muted: #9ca3af;
              --brand-border: rgba(255, 255, 255, 0.1);
              --brand-accent: ${accentColor};
              --accent-text: ${accentText};
              --hl: ${accentColor};
          }
          .aura-theme { font-family: ${customBodyFont} !important; }
          .aura-theme .font-outfit { font-family: ${customHeadingFont} !important; }
          .aura-theme .font-serif { font-family: ${customHeadingFont} !important; }
          .aura-theme .font-heading { font-family: ${customHeadingFont} !important; }
          .aura-theme .font-sans { font-family: ${customBodyFont} !important; }
          .aura-theme .font-body { font-family: ${customBodyFont} !important; }
          
          @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
              animation: blob 10s infinite;
          }
          .animation-delay-2000 {
              animation-delay: 2s;
          }
          .animation-delay-4000 {
              animation-delay: 4s;
          }
      `}} />

      {/* BACKGROUND EFFECTS (STATIC) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--hl)] opacity-[0.15] rounded-full blur-[100px] mix-blend-screen animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-blue-500 opacity-[0.1] rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
          <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-purple-500 opacity-[0.1] rounded-full blur-[90px] mix-blend-screen animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]"></div>
      </div>

      <AuraKineticNavbar data={data} theme={theme} isEditor={isEditor} isCardPreview={isCardPreview} />

      <div className="relative z-10 w-full flex flex-col pt-20 flex-1 [&>*:last-child]:mt-auto">
        {children}
      </div>

      <AnimatePresence>
          {selectedMedia && (
              <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
              >
                  <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/80" onClick={() => setSelectedMedia(null)}
                  ></motion.div>

                  <motion.div
                      initial={{ scale: 0.8, opacity: 0, rotateX: 20 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 150, damping: 20 }}
                      className={`relative w-full max-w-5xl flex flex-col overflow-hidden ${btnShape} bg-[#18181b] border-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
                  >
                      <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/5 relative z-10">
                          <div className="flex flex-col text-left">
                              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2">
                                  <EditableText value={theme?.customTexts?.aura_modal_player || 'Aura Kinetic Player'} field="aura_modal_player" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                              </span>
                              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">{selectedMedia.title}</h3>
                          </div>
                          <button
                              onClick={() => setSelectedMedia(null)}
                              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group hover:bg-[var(--hl)] hover:border-[var(--hl)] transition-all duration-300"
                          >
                              <i className="fas fa-times text-white group-hover:rotate-90 transition-transform duration-300"></i>
                          </button>
                      </div>

                      <motion.div
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                          className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} overflow-hidden bg-black`}
                      >
                          {selectedMedia.type === 'video' ? (
                              <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                  <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[55vh] object-contain" />
                              </div>
                          )}
                      </motion.div>

                      <div className="p-4 flex justify-center bg-white/[0.02]">
                          <button
                              onClick={() => setSelectedMedia(null)}
                              className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 hover:text-[var(--hl)] transition-colors"
                          >
                              <EditableText value={theme?.customTexts?.aura_close_btn || 'CLOSE KINETIC'} field="aura_close_btn" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                          </button>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

export function AuraKineticShell(props: any) {
  return (
    <AuraKineticProvider>
      <AuraKineticShellContent {...props} />
    </AuraKineticProvider>
  );
}
