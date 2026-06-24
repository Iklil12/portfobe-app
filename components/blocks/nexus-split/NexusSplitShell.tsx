"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';
import { NexusSplitProvider, useNexusSplit } from './NexusSplitContext';
import { BlockEditorWrapper } from '@/features/appearance';
import { NexusSplitHeroBlock } from './NexusSplitHeroBlock';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

function NexusSplitInner({ children, data, theme, isMobileView, isCardPreview, isEditor, heroBlock }: any) {
  const { selectedMedia, setSelectedMedia } = useNexusSplit();
  useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  const rawHighlightColor = theme?.themeColor || '#4f46e5';
  const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#4f46e5';
  const fontHeading = theme?.fontHeading || 'Cabinet Grotesk';
  const fontBody = theme?.fontBody || 'Inter';
  
  const buttonShape = theme?.buttonShape || 'rounded';
  const radiusClass = buttonShape === 'square' || buttonShape === 'hard' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';

  const getFontFamily = (f: string) => {
      if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
      if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
      return `'${f}', sans-serif`;
  };
  const customHeadingFont = getFontFamily(fontHeading);
  const customBodyFont = getFontFamily(fontBody);

  return (
    <div className="w-full bg-black text-[#f4f4f5] selection:bg-[var(--hl)] selection:text-white font-sans overflow-x-hidden @container nexus-theme" style={{ '--hl': highlightColor } as React.CSSProperties}>
        <style dangerouslySetInnerHTML={{
            __html: `
    .nexus-theme { font-family: ${customBodyFont} !important; }
    .nexus-theme .font-display { font-family: ${customHeadingFont} !important; }
    .nexus-theme .font-sans { font-family: ${customBodyFont} !important; }
    .nexus-theme .font-serif { font-family: ${customHeadingFont} !important; }
    .nexus-theme .font-heading { font-family: ${customHeadingFont} !important; }
    .nexus-theme .font-body { font-family: ${customBodyFont} !important; }
    
    /* Hilangkan Scrollbar untuk tampilan bersih — scoped ke nexus-theme */
    .nexus-theme ::-webkit-scrollbar { width: 6px; }
    .nexus-theme ::-webkit-scrollbar-track { background: #050505; }
    .nexus-theme ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
    .nexus-theme ::-webkit-scrollbar-thumb:hover { background: var(--hl); }

    .nexus-border { border-color: rgba(255, 255, 255, 0.08); }
    .nexus-panel { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(12px); }
    
    /* Link Hover Underline Animation */
    .hover-underline { position: relative; }
    .hover-underline::after {
        content: ''; position: absolute; width: 100%; transform: scaleX(0);
        height: 1px; bottom: 0; left: 0; background-color: var(--hl);
        transform-origin: bottom right; transition: transform 0.3s ease-out;
    }
    .hover-underline:hover::after { transform: scaleX(1); transform-origin: bottom left; }
    `}} />

        <div className="flex w-full min-h-screen flex-col @md:flex-row bg-black">
            
            {/* =========================================
                LEFT COLUMN: STICKY IDENTITY PANEL 
            ========================================= */}
            {heroBlock && (
                <div className="w-full relative bg-black @md:w-[40%] @lg:w-[35%] @md:h-[100svh] @md:fixed @md:top-0 @md:left-0 @md:flex @md:flex-col @md:justify-between @md:z-30 hide-scrollbar overflow-y-auto">
                    <BlockEditorWrapper block={heroBlock} isEditor={isEditor} isHero={true}>
                        <NexusSplitHeroBlock data={data} theme={theme} isEditor={isEditor} blockConfig={heroBlock} />
                    </BlockEditorWrapper>
                </div>
            )}

            {/* =========================================
                RIGHT COLUMN: SCROLLING CONTENT 
            ========================================= */}
            <div className={`flex flex-col w-full ${heroBlock ? '@md:w-[60%] @lg:w-[65%] @md:ml-[40%] @lg:ml-[35%]' : ''} @md:min-h-screen bg-black`}>
                {/* Floating Gradient for ambience */}
                <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} top-0 right-0 w-[40cqi] h-[40cqi] rounded-full blur-[150px] opacity-10 pointer-events-none mix-blend-screen z-0`} style={{ backgroundColor: highlightColor }}></div>

                <div className="relative z-10 w-full flex flex-col">
                    {children}
                </div>
            </div>
        </div>

        {/* MODAL MEDIA */}
        <AnimatePresence>
            {selectedMedia && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-12"
                >
                    <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md" onClick={() => setSelectedMedia(null)}></div>
                    
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                        className={`relative w-full max-w-6xl bg-[#0a0a0a] border nexus-border shadow-2xl flex flex-col overflow-hidden ${radiusClass}`}
                    >
                        {/* Blueprint Header */}
                        <div className="flex justify-between items-center px-5 py-3 @md:px-8 border-b nexus-border bg-white/5">
                            <div className="flex flex-col gap-0.5">
                                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">Technical_Overlay // 0.1</span>
                                <h3 className="font-display font-bold text-xl @md:text-2xl text-white uppercase tracking-tight">{selectedMedia.title}</h3>
                            </div>
                            <button 
                                onClick={() => setSelectedMedia(null)} 
                                className="w-10 h-10 flex items-center justify-center border nexus-border text-white hover:bg-white hover:text-black transition-all duration-300 shrink-0"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Main Content Area */}
                        <div 
                            className="w-full bg-black relative overflow-hidden"
                            style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}
                        >
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                            {selectedMedia.type === 'video' ? (
                                <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                            ) : (
                                <div className="w-full flex items-center justify-center p-4 @md:p-12">
                                    <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl border nexus-border" />
                                </div>
                            )}
                        </div>

                        {/* Industrial Footer */}
                        <div className="px-4 py-3 @md:px-6 flex justify-between items-center bg-white/5 border-t nexus-border font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <div className="flex items-center gap-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[var(--hl)] shadow-[0_0_10px_var(--hl)]"></div>
                                    <span>System_Active</span>
                                </div>
                                <span className="hidden @md:inline opacity-40">Blueprint_Ref: #{Math.floor(Math.random() * 90000) + 10000}</span>
                            </div>
                            <button onClick={() => setSelectedMedia(null)} className="text-white hover:text-[var(--hl)] transition-colors">/ Close_Stream</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}

export function NexusSplitShell(props: any) {
  return (
    <NexusSplitProvider>
      <NexusSplitInner {...props} />
    </NexusSplitProvider>
  );
}
