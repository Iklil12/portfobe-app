"use client";

import React, { useState } from 'react';
import Script from 'next/script';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';

// Minimalist Blocks
import { MinimalistHeroBlock } from './minimalist/MinimalistHeroBlock';
import { MinimalistStatsBlock } from './minimalist/MinimalistStatsBlock';
import { MinimalistProjectsBlock } from './minimalist/MinimalistProjectsBlock';
import { Minimalist3DBlock } from './minimalist/Minimalist3DBlock';
import { MinimalistAwardsBlock } from './minimalist/MinimalistAwardsBlock';
import { MinimalistTestimonialsBlock } from './minimalist/MinimalistTestimonialsBlock';
import { MinimalistFooterBlock } from './minimalist/MinimalistFooterBlock';

// Spatial Theme Blocks
import { SpatialShell } from './spatial/SpatialShell';
import { SpatialHeroBlock } from './spatial/SpatialHeroBlock';
import { SpatialProjectsBlock } from './spatial/SpatialProjectsBlock';
import { Spatial3DBlock } from './spatial/Spatial3DBlock';
import { SpatialIntegrationsBlock } from './spatial/SpatialIntegrationsBlock';
import { SpatialGithubBlock } from './spatial/SpatialGithubBlock';
import { SpatialTestimonialsBlock } from './spatial/SpatialTestimonialsBlock';
import { SpatialAwardsBlock } from './spatial/SpatialAwardsBlock';
import { SpatialFooterBlock } from './spatial/SpatialFooterBlock';

// Shared Widgets
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { GithubStats } from '@/components/themes/widgets/GithubStats';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { BlockEditorWrapper } from '@/components/features/appearance/BlockEditorWrapper';

export const BlockMapper = ({ block, data, theme, isEditor, setSelectedMedia }: any) => {
  const commonProps = { data, theme, isEditor, blockConfig: block, setSelectedMedia };
  const userId = data?.userId || data?.user?.id || data?.id || "";
  const themeColor = theme?.themeColor;

  if (!block.isVisible && !isEditor) return null;

  let content = null;
  const activeThemeTemplate = theme?.themeTemplate || 'minimalist';
  
  // Ambil tipe dasar blok, contoh: 'SPATIAL_HERO' -> 'HERO'
  const baseParts = block.blockType.split('_');
  const baseBlockType = baseParts.length > 1 ? baseParts.slice(1).join('_') : block.blockType;

  // 1. SMART MAPPING: Render blok sesuai dengan tema yang sedang aktif
  if (activeThemeTemplate === 'minimalist') {
      switch (baseBlockType) {
        case 'HERO': content = <MinimalistHeroBlock {...commonProps} />; break;
        case 'STATS': content = <MinimalistStatsBlock {...commonProps} />; break;
        case 'PROJECTS': content = <MinimalistProjectsBlock {...commonProps} />; break;
        case '3D': content = <Minimalist3DBlock {...commonProps} />; break;
        case 'AWARDS': content = <MinimalistAwardsBlock {...commonProps} />; break;
        case 'TESTIMONIALS': content = <MinimalistTestimonialsBlock {...commonProps} />; break;
        case 'FOOTER': content = <MinimalistFooterBlock {...commonProps} />; break;
        case 'PENPOT': content = <PenpotShowcase userId={userId} variant="minimalist" themeColor={themeColor} />; break;
        case 'CANVA': content = <CanvaShowcase userId={userId} variant="minimalist" themeColor={themeColor} />; break;
        case 'GITHUB': content = <GithubStats userId={userId} variant="minimalist" themeColor={themeColor} />; break;
      }
  } else if (activeThemeTemplate === 'spatial') {
      switch (baseBlockType) {
        case 'HERO': content = <SpatialHeroBlock {...commonProps} />; break;
        case 'PROJECTS': content = <SpatialProjectsBlock {...commonProps} />; break;
        case '3D': content = <Spatial3DBlock {...commonProps} />; break;
        case 'INTEGRATIONS': content = <SpatialIntegrationsBlock {...commonProps} />; break;
        case 'GITHUB': content = <SpatialGithubBlock {...commonProps} />; break;
        case 'TESTIMONIALS': content = <SpatialTestimonialsBlock {...commonProps} />; break;
        case 'AWARDS': content = <SpatialAwardsBlock {...commonProps} />; break;
        case 'FOOTER': content = <SpatialFooterBlock {...commonProps} />; break;
      }
  }

  // 2. FALLBACK MAPPING: Jika tidak ada versi dari tema saat ini, gunakan blok aslinya
  if (!content) {
    switch (block.blockType) {
      // Minimalist
      case 'MINIMALIST_STATS': content = <MinimalistStatsBlock {...commonProps} />; break;
      case 'MINIMALIST_PROJECTS': content = <MinimalistProjectsBlock {...commonProps} />; break;
      case 'MINIMALIST_3D': content = <Minimalist3DBlock {...commonProps} />; break;
      case 'MINIMALIST_AWARDS': content = <MinimalistAwardsBlock {...commonProps} />; break;
      case 'MINIMALIST_TESTIMONIALS': content = <MinimalistTestimonialsBlock {...commonProps} />; break;
      case 'MINIMALIST_FOOTER': content = <MinimalistFooterBlock {...commonProps} />; break;
      
      // Widgets mapped to Minimalist
      case 'MINIMALIST_PENPOT': content = <PenpotShowcase userId={userId} variant="minimalist" themeColor={themeColor} />; break;
      case 'MINIMALIST_CANVA': content = <CanvaShowcase userId={userId} variant="minimalist" themeColor={themeColor} />; break;
      case 'MINIMALIST_GITHUB': content = <GithubStats userId={userId} variant="minimalist" themeColor={themeColor} />; break;

      // Spatial
      case 'SPATIAL_HERO': content = <SpatialHeroBlock {...commonProps} />; break;
      case 'SPATIAL_PROJECTS': content = <SpatialProjectsBlock {...commonProps} />; break;
      case 'SPATIAL_3D': content = <Spatial3DBlock {...commonProps} />; break;
      case 'SPATIAL_INTEGRATIONS': content = <SpatialIntegrationsBlock {...commonProps} />; break;
      case 'SPATIAL_GITHUB': content = <SpatialGithubBlock {...commonProps} />; break;
      case 'SPATIAL_TESTIMONIALS': content = <SpatialTestimonialsBlock {...commonProps} />; break;
      case 'SPATIAL_AWARDS': content = <SpatialAwardsBlock {...commonProps} />; break;
      case 'SPATIAL_FOOTER': content = <SpatialFooterBlock {...commonProps} />; break;
    }
  }

  if (!content) return null;

  const isHero = block.blockType.includes('HERO');

  return (
    <BlockEditorWrapper key={block.id} block={block} isEditor={isEditor} isHero={isHero}>
      {content}
    </BlockEditorWrapper>
  );
};

export const DynamicBlockRenderer = ({ blocks, data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: any) => {
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);

  const getFontFamily = (fontName: string) => {
    if (!fontName) return "'Inter', sans-serif";
    if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
    if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
    return "'Inter', sans-serif";
  };

  const headingFont = getFontFamily(theme?.fontHeading);
  const bodyFont = getFontFamily(theme?.fontBody);
  const buttonShape = theme?.buttonShape || 'rounded';
  const radiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-lg';

  // Urutkan blok berdasarkan orderIndex
  const sortedBlocks = [...(blocks || [])].sort((a, b) => a.orderIndex - b.orderIndex);

  const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll === 'true');

  const renderLayout = () => {
    // Jika tema minimalist, kita gunakan Layout Shell khusus
    if (theme?.themeTemplate === 'minimalist') {
      const heroBlockData = sortedBlocks.find(b => b.blockType.includes('HERO'));
      const otherBlocks = sortedBlocks.filter(b => b.id !== heroBlockData?.id);

      return (
        <div className={`flex w-full min-h-screen bg-white text-black relative min-body flex-col @lg:flex-row min-theme`}>
          <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />
          <style dangerouslySetInnerHTML={{
            __html: `
            .min-heading { font-family: ${headingFont} !important; }
            .min-body { font-family: ${bodyFont} !important; }
            .min-theme ::-webkit-scrollbar { width: 5px; height: 5px; }
            .min-theme ::-webkit-scrollbar-track { background: transparent; }
            .min-theme ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
            .min-theme ::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
            .min-theme * { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
            .min-theme ::selection { background: #000000; color: #ffffff; }
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />

          {/* Layout Shell: Sidebar Kiri (Hero) */}
          {heroBlockData && (
            <BlockEditorWrapper key={heroBlockData.id} block={heroBlockData} isEditor={isEditor} isHero={true}>
              <MinimalistHeroBlock data={data} theme={theme} isEditor={isEditor} blockConfig={heroBlockData} />
            </BlockEditorWrapper>
          )}

          {/* Layout Shell: Konten Kanan (Semua blok lain yang bisa diurutkan bebas) */}
          <main className={`bg-white w-full @lg:w-[65%] ${!heroBlockData ? '@lg:w-full' : ''} ${heroBlockData ? '@lg:ml-[35%]' : ''}`}>
            {otherBlocks.map(b => (
              <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
            ))}
          </main>

          {/* MEDIA PLAYER MODAL */}
          <AnimatePresence>
            {selectedMedia && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 @md:p-10"
              >
                <div className="max-w-5xl w-full flex flex-col gap-6">
                  <div className="flex justify-between items-center px-2">
                    <div>
                      <h3 className="text-xl font-black tracking-tighter uppercase min-heading">{selectedMedia.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                        {selectedMedia.type === 'video' ? 'Cinematic Presentation' : 'Visual Showcase'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className={`w-12 h-12 bg-black text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-lg ${radiusClass}`}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className={`w-full ${selectedMedia.type === 'video' ? 'aspect-video bg-black' : 'max-h-[70vh] overflow-hidden bg-gray-50'} shadow-2xl relative flex items-center justify-center border border-gray-100 ${radiusClass}`}
                  >
                    {selectedMedia.type === 'video' ? (
                      <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[65vh] object-contain shadow-sm" />
                      </div>
                    )}
                  </motion.div>

                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
                    >
                      [ CLOSE {selectedMedia.type === 'video' ? 'PLAYER' : 'PREVIEW'} ]
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (theme?.themeTemplate === 'spatial') {
      return (
        <SpatialShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </SpatialShell>
      );
    }

    // Generic flat layout fallback untuk tema lain
    return (
      <div className="flex flex-col w-full min-h-screen">
        {sortedBlocks.map(b => (
          <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
        ))}
      </div>
    );
  };

  const content = renderLayout();

  if (isSmoothScroll) {
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
          {content}
        </ReactLenis>
      </>
    );
  }

  return content;
};


