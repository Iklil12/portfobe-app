"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MidnightEmulsionProvider, useMidnightEmulsion } from './MidnightEmulsionContext';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { EditableText } from '@/components/ui/EditableText';
import { useEscapeKey } from '@/hooks/useEscapeKey';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

function MidnightEmulsionShellContent({ children, theme, isEditor, isCardPreview }: any) {
  const { selectedMedia, setSelectedMedia } = useMidnightEmulsion();
  useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';
  const fontHeading = theme?.fontHeading || 'Cormorant Garamond';
  const fontBody = theme?.fontBody || 'Inter';

  const getFontFamily = (f: string) => {
    if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
    if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair') || f?.toLowerCase().includes('cormorant')) return `'${f}', serif`;
    return "'Inter', sans-serif";
  };
  const customHeadingFont = getFontFamily(fontHeading);
  const customBodyFont = getFontFamily(fontBody);

  const rawHighlightColor = theme?.themeColor || '#4fd1c5';
  const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#4fd1c5';

  return (
    <div className="relative min-h-screen bg-[#030508] text-[#e2e8f0] font-sans selection:bg-[var(--hl)] selection:text-[#030508] @container flex flex-col midnight-theme" style={{ '--hl': highlightColor } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .midnight-theme .font-serif { font-family: ${customHeadingFont}; }
        .midnight-theme .font-sans { font-family: ${customBodyFont}; }
        .film-grain { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.05; }
        .text-stroke { -webkit-text-stroke: 1px rgba(255,255,255,0.2); color: transparent; }
        .text-stroke-hover:hover { -webkit-text-stroke: 1px var(--hl); }
      `}} />
      <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} inset-0 z-50 pointer-events-none film-grain mix-blend-overlay`}></div>

      {/* The main content area */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-full flex flex-col">
          {children}
        </div>
      </div>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
          >
            <div className="absolute inset-0 bg-[#030508]/95 backdrop-blur-md" onClick={() => setSelectedMedia(null)}></div>
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className={`relative w-full max-w-5xl bg-[#05070a] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col overflow-hidden ${radiusClass}`}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-3 @md:px-6 border-b border-white/5 bg-black/20">
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)]">
                    <EditableText value={theme?.customTexts?.midnight_modal_top || 'Developing Room'} field="midnight_modal_top" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                  </span>
                  <h3 className="font-serif text-lg @md:text-xl text-white leading-tight">{selectedMedia.title}</h3>
                </div>
                <button onClick={() => setSelectedMedia(null)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:rotate-90 transition-all duration-300 shrink-0">
                  <i className="fas fa-times text-base"></i>
                </button>
              </div>

              {/* Video / Image */}
              <div className="w-full relative overflow-hidden bg-black" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                <div className="absolute inset-0 film-grain opacity-10 pointer-events-none"></div>
                {selectedMedia.type === 'video' ? (
                  <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                ) : (
                  <div className="w-full flex items-center justify-center p-4 @md:p-8">
                    <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 ease-out" />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-5 py-2.5 @md:px-6 bg-black/40 border-t border-white/5 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-5">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--hl)]"></span> <EditableText value={theme?.customTexts?.midnight_modal_f1 || 'Focus: Active'} field="midnight_modal_f1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                  <span className="hidden @md:inline"><EditableText value={theme?.customTexts?.midnight_modal_f2 || 'Emulsion: Fixed'} field="midnight_modal_f2" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                </div>
                <button onClick={() => setSelectedMedia(null)} className="hover:text-[var(--hl)] transition-colors tracking-[0.4em]">
                  <EditableText value={theme?.customTexts?.midnight_modal_close || '/ Close_Scene'} field="midnight_modal_close" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MidnightEmulsionShell(props: any) {
  return (
    <MidnightEmulsionProvider>
      <MidnightEmulsionShellContent {...props} />
    </MidnightEmulsionProvider>
  );
}
