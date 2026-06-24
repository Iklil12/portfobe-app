"use client";
import { BlockDictionary } from './BlockDictionary';

import {
  FaqRenderer,
  PenpotShowcase,
  CanvaShowcase,
  GithubStats,
  NexusNoirMarqueeBlock,
  NexusNoirProjectsBlock,
  VideoShowcaseRenderer,
  SpatialShell,
  ObsidianShell,
  AuraKineticShell,
  EditorialShell,
  MidnightEmulsionShell,
  ViewfinderShell,
  CinematicGalleryShell,
  NexusSplitShell,
  MonolithShell,
  LayeredMonolithShell,
  AbsoluteNoirShell,
  CinematicShell,
  AcidTechShell,
  BentoGridShell,
  BrutalismShell,
  KineticAvantGardeShell,
  NexusNoirShell,
  HorizontalFlowShell,
  SplitScreenStudioShell,
  BlockEditorWrapper,
  UniversalPlayer,
  MinimalistHeroBlock
} from './ThemeRegistry';


import React, { useState, useEffect } from 'react';
import { Eye, ChevronRight, Play, Maximize2, X, GitBranch, ExternalLink, Calendar, Code, Star, GitFork, Crown, Type, User, Zap, Briefcase, Layers, LayoutGrid, Box, PenTool, Paintbrush, Trophy, MessageSquare, BarChart, PanelBottom } from 'lucide-react';
import type { PageBlock } from '@/features/appearance';
import { FORBIDDEN_BLOCKS_PER_THEME } from '@/features/appearance';
import Script from 'next/script';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import { GlobalCursor } from '@/features/appearance';
import { BlockErrorBoundary } from '@/components/errors/BlockErrorBoundary';
export const BlockMapper = ({ block, data, theme, isEditor, setSelectedMedia, isMobileView = false }: any) => {
  const commonProps = { data, theme, isEditor, blockConfig: block, setSelectedMedia };
  const userId = data?.userId || data?.user?.id || data?.id || "";
  const themeColor = theme?.themeColor;

  if (!block.isVisible && !isEditor) return null;

  let content: React.ReactNode | undefined = undefined;
  const activeThemeTemplate = theme?.themeTemplate || theme?.id || 'minimalist';

  // Ambil tipe dasar blok, contoh: 'SPATIAL_HERO' -> 'HERO'
  const baseParts = block.blockType.split('_');
  const baseBlockType = baseParts.length > 1 ? baseParts.slice(1).join('_') : block.blockType;

  // HARD IGNORE LEGACY BLOCKS
  if (baseBlockType === 'INTEGRATIONS') {
    return null;
  }

  // GLOBAL SMART BLOCKS
  if (baseBlockType === 'FAQ' || block.blockType === 'FAQ') {
    content = <FaqRenderer themeId={activeThemeTemplate} data={data} theme={theme} isEditor={isEditor} />;
  } else if (baseBlockType === 'SHOWCASE' || block.blockType === 'VIDEO_SHOWCASE') {
    content = <VideoShowcaseRenderer themeId={activeThemeTemplate} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />;
  }

  // 1. SMART MAPPING: Render blok sesuai dengan tema yang sedang aktif
  if (!content) {
  // 1. Coba ambil komponen standar dari Dictionary
  const StandardBlock = BlockDictionary[activeThemeTemplate]?.[baseBlockType];
  
  if (StandardBlock === null) {
    content = null; // Explicitly null (locked block)
  } else if (StandardBlock) {
    content = <StandardBlock {...commonProps} />;
  } else {
    // 2. Tangani special cases (penpot, canva, github, custom wrappers)
    switch (activeThemeTemplate) {
      case 'minimalist':
        switch(baseBlockType) {
          case 'PENPOT': content = <PenpotShowcase userId={userId} variant="minimalist" themeColor={themeColor} />; break;
          case 'CANVA': content = <CanvaShowcase userId={userId} variant="minimalist" themeColor={themeColor} />; break;
          case 'GITHUB': content = <GithubStats userId={userId} variant="minimalist" themeColor={themeColor} />; break;
        }
        break;
      case 'spatial':
        switch(baseBlockType) {
          case 'PENPOT': content = <PenpotShowcase userId={userId} variant="spatial" />; break;
          case 'CANVA': content = <CanvaShowcase userId={userId} variant="spatial" />; break;
        }
        break;
      case 'obsidian-reel':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
        }
        break;
      case 'aura-kinetic':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <div className="w-full px-6 md:px-12"><div className="max-w-[1400px] mx-auto"><PenpotShowcase userId={userId} variant="aura" themeColor={themeColor} /></div></div> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <div className="w-full px-6 md:px-12"><div className="max-w-[1400px] mx-auto"><CanvaShowcase userId={userId} variant="aura" themeColor={themeColor} /></div></div> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <div className="w-full px-6 md:px-12"><div className="max-w-[1400px] mx-auto"><GithubStats userId={userId} variant="aura" themeColor={themeColor} /></div></div> : null; break;
        }
        break;
      case 'editorial':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="editorial" themeColor={themeColor} /> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="editorial" themeColor={themeColor} /> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="editorial" themeColor={themeColor} /> : null; break;
        }
        break;
      case 'nexus-noir':
        switch(baseBlockType) {
          case 'MARQUEE': content = <NexusNoirMarqueeBlock />; break;
          case 'PROJECTS': content = <NexusNoirProjectsBlock {...commonProps} setSelectedMedia={setSelectedMedia} />; break;
          case 'PENPOT': content = data?.id || data?.userId ? <div className="w-full bg-[#030303] text-white"><PenpotShowcase userId={userId} variant="nexus-noir" /></div> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <div className="w-full bg-[#030303] text-white"><CanvaShowcase userId={userId} variant="nexus-noir" /></div> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <div className="w-full bg-[#030303] text-white"><GithubStats userId={userId} variant="nexus-noir" /></div> : null; break;
        }
        break;
      case 'horizontal-flow':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <div className="border-t border-white/10 py-10 px-6"><PenpotShowcase userId={userId} variant="horizontal-flow" /></div> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <div className="border-t border-white/10 py-10 px-6"><CanvaShowcase userId={userId} variant="horizontal-flow" /></div> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <div className="border-t border-white/10 py-10 px-6"><GithubStats userId={userId} variant="horizontal-flow" /></div> : null; break;
        }
        break;
      case 'midnight-emulsion':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="midnight" themeColor={themeColor} /> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="midnight" themeColor={themeColor} /> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="midnight" themeColor={themeColor} /> : null; break;
        }
        break;
      case 'viewfinder':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="viewfinder" themeColor={themeColor} /> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="viewfinder" themeColor={themeColor} /> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="viewfinder" themeColor={themeColor} /> : null; break;
        }
        break;
      case 'split-screen-studio':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <div className="w-full bg-[#050505] p-8 md:p-12"><PenpotShowcase userId={userId} variant="split-screen-studio" themeColor={themeColor} /></div> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <div className="w-full bg-[#050505] p-8 md:p-12"><CanvaShowcase userId={userId} variant="split-screen-studio" themeColor={themeColor} /></div> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <div className="w-full bg-[#050505] p-8 md:p-12"><GithubStats userId={userId} variant="split-screen-studio" themeColor={themeColor} /></div> : null; break;
        }
        break;
      case 'split':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="split" themeColor={themeColor} /> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="split" themeColor={themeColor} /> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="split" themeColor={themeColor} /> : null; break;
        }
        break;
      case 'monolith':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="split" themeColor={themeColor} /> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="split" themeColor={themeColor} /> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="split" themeColor={themeColor} /> : null; break;
        }
        break;
      case 'layered-monolith':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <section className="stack-card bg-[#111] text-white p-8 md:p-16 flex flex-col min-h-[100vh] justify-center overflow-y-auto relative"><div className="noise mix-blend-overlay opacity-10"></div><div className="w-full max-w-6xl mx-auto relative z-10 pb-24"><PenpotShowcase userId={userId} variant="layered-monolith" themeColor={themeColor} /></div></section> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <section className="stack-card bg-[#111] text-white p-8 md:p-16 flex flex-col min-h-[100vh] justify-center overflow-y-auto relative"><div className="noise mix-blend-overlay opacity-10"></div><div className="w-full max-w-6xl mx-auto relative z-10 pb-24"><CanvaShowcase userId={userId} variant="layered-monolith" themeColor={themeColor} /></div></section> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <section className="stack-card bg-[#111] text-white p-8 md:p-16 flex flex-col min-h-[100vh] justify-center overflow-y-auto relative"><div className="noise mix-blend-overlay opacity-10"></div><div className="w-full max-w-6xl mx-auto relative z-10 pb-32"><GithubStats userId={userId} variant="layered-monolith" themeColor={themeColor} /></div></section> : null; break;
        }
        break;
      case 'absolute-noir':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="noir" /> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="noir" /> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="noir" /> : null; break;
        }
        break;
      case 'cinematic':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <PenpotShowcase userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <CanvaShowcase userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <GithubStats userId={userId} variant="cinematic" themeColor={themeColor} /> : null; break;
        }
        break;
      case 'cinematic-gallery':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <section className="panel w-[100vw] h-[100vh] flex flex-col items-center bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="w-full max-w-5xl mx-auto z-10 pt-[8vh] h-full overflow-y-auto cinematic-scrollbar pointer-events-auto px-6 md:px-12 [&>section]:border-t-0 [&>section]:pt-8">
          <PenpotShowcase userId={userId} variant="cinematic" themeColor="#ffffff" />
        </div>
      </section> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <section className="panel w-[100vw] h-[100vh] flex flex-col items-center bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="w-full max-w-5xl mx-auto z-10 pt-[8vh] h-full overflow-y-auto cinematic-scrollbar pointer-events-auto px-6 md:px-12 [&>section]:border-t-0 [&>section]:pt-8">
          <CanvaShowcase userId={userId} variant="cinematic" themeColor="#ffffff" />
        </div>
      </section> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <section className="panel w-[100vw] h-[100vh] flex flex-col items-center bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="w-full max-w-5xl mx-auto z-10 pt-[8vh] h-full overflow-y-auto cinematic-scrollbar pointer-events-auto px-6 md:px-12 [&>section]:border-t-0 [&>section]:pt-8">
          <GithubStats userId={userId} variant="cinematic" themeColor="#ffffff" />
        </div>
      </section> : null; break;
        }
        break;
      case 'bentogrid':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <div className="bento-card p-0 mb-6"><PenpotShowcase userId={userId} variant="bento" themeColor={themeColor} /></div> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <div className="bento-card p-0 mb-6"><CanvaShowcase userId={userId} variant="bento" themeColor={themeColor} /></div> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <div className="bento-card p-0"><GithubStats userId={userId} variant="bento" themeColor={themeColor} /></div> : null; break;
        }
        break;
      case 'brutalism':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <section className="w-full bg-white border-b-[3px] border-black"><PenpotShowcase userId={userId} variant="brutalism" themeColor={themeColor} /></section> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <section className="w-full bg-white border-b-[3px] border-black"><CanvaShowcase userId={userId} variant="brutalism" themeColor={themeColor} /></section> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <section className="w-full bg-white border-b-[3px] border-black"><GithubStats userId={userId} variant="brutalism" themeColor={themeColor} /></section> : null; break;
        }
        break;
      case 'kinetic-avant-garde':
        switch(baseBlockType) {
          case 'PENPOT': content = data?.id || data?.userId ? <div className="kag-bg-void kag-text-bone w-full border-t-8 border-black"><PenpotShowcase userId={userId} variant="kinetic-avant-garde" /></div> : null; break;
          case 'CANVA': content = data?.id || data?.userId ? <div className="kag-bg-void kag-text-bone w-full border-t-8 border-black"><CanvaShowcase userId={userId} variant="kinetic-avant-garde" /></div> : null; break;
          case 'GITHUB': content = data?.id || data?.userId ? <div className="kag-bg-void kag-text-bone w-full border-t-8 border-black"><GithubStats userId={userId} variant="kinetic-avant-garde" /></div> : null; break;
        }
        break;
    }
  }
  } // End of if (!content)
  if (content === undefined) {
    if (isEditor) {
      return (
        <div className="w-full h-32 bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 font-bold">
          [DEBUG] Content is NULL for blockType: {block.blockType} / baseBlockType: {baseBlockType}
        </div>
      );
    }
    return null;
  }

  const isHero = block.blockType.includes('HERO');

  const isHorizontalFlow = activeThemeTemplate === 'cinematic-gallery';
  const customStyle = (isHorizontalFlow && isHero) ? { width: '100vw' } : undefined;

  return (
    <BlockEditorWrapper key={block.id} block={block} isEditor={isEditor} isHero={isHero} isHorizontalFlow={isHorizontalFlow} style={customStyle}>
      <BlockErrorBoundary>
        {content}
      </BlockErrorBoundary>
    </BlockEditorWrapper>
  );
};

export const DynamicBlockRenderer = ({ blocks, data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: any) => {
  const [selectedMedia, setSelectedMediaState] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);

  const setSelectedMedia = (media: any) => {
    setSelectedMediaState(media);
    if (media && !isEditor) {
      const allProjects = data?.projects || data?.user?.projects || [];
      const matchedProject = allProjects.find((p: any) => p.mediaUrl === media.url || p.title === media.title);
      if (matchedProject && matchedProject.id) {
        const subdomain = data?.profile?.subdomain || data?.subdomain || "";
        if (subdomain) {
          import('@/features/analytics').then(({ trackProjectClick }) => {
            trackProjectClick(subdomain, matchedProject.id, matchedProject.title);
          }).catch(err => console.error('Failed to track project click:', err));
        }
      }
    }
  };

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // SECURITY: Cegah injeksi dari domain asing
      if (event.origin !== window.location.origin && !event.origin.includes('localhost') && !event.origin.includes('127.0.0.1')) return;

      if (event.data?.type === 'OPEN_LIBRARY') {
        setInsertIndex(event.data.insertIndex);
        setIsLibraryOpen(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (isEditor) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      console.log("[Analytics Debug] Click target:", target);

      const subdomain = data?.profile?.subdomain || data?.subdomain || "";
      if (!subdomain) {
        console.log("[Analytics Debug] Subdomain not found, skipping event tracking.");
        return;
      }

      // ── 1. DETEKSI KLIK LINK SOSIAL MEDIA, KONTAK, DAN TOMBOL GALERI ──────────
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        
        // a. Klik Tombol Galeri
        if (href.includes('/gallery')) {
          console.log("[Analytics Debug] Gallery button link clicked:", href);
          import('@/features/analytics').then(({ trackCustomEvent }) => {
            trackCustomEvent(subdomain, 'GALLERY_CLICK', undefined, { url: href });
          }).catch(err => console.error('[Analytics Debug] Failed to track gallery click:', err));
          return; // Stop di sini agar tidak memicu deteksi proyek
        }
        
        // b. Klik Kontak (Email, Telepon, WhatsApp)
        if (href.startsWith('mailto:')) {
          console.log("[Analytics Debug] Contact Email clicked:", href);
          import('@/features/analytics').then(({ trackCustomEvent }) => {
            trackCustomEvent(subdomain, 'CONTACT_CLICK', undefined, { platform: 'Email', value: href });
          }).catch(err => console.error('[Analytics Debug] Failed to track contact email click:', err));
          return;
        }
        
        if (href.startsWith('tel:')) {
          console.log("[Analytics Debug] Contact Phone clicked:", href);
          import('@/features/analytics').then(({ trackCustomEvent }) => {
            trackCustomEvent(subdomain, 'CONTACT_CLICK', undefined, { platform: 'Phone', value: href });
          }).catch(err => console.error('[Analytics Debug] Failed to track contact phone click:', err));
          return;
        }
        
        if (href.includes('wa.me') || href.includes('api.whatsapp.com') || href.includes('whatsapp:')) {
          console.log("[Analytics Debug] Contact WhatsApp clicked:", href);
          import('@/features/analytics').then(({ trackCustomEvent }) => {
            trackCustomEvent(subdomain, 'CONTACT_CLICK', undefined, { platform: 'WhatsApp', value: href });
          }).catch(err => console.error('[Analytics Debug] Failed to track contact whatsapp click:', err));
          return;
        }
        
        // c. Klik Outbound Link Sosmed
        if (href.startsWith('http') && !href.includes(window.location.host)) {
          const getSocialPlatform = (url: string): string => {
            const lowercaseUrl = url.toLowerCase();
            if (lowercaseUrl.includes('instagram.com')) return 'Instagram';
            if (lowercaseUrl.includes('linkedin.com')) return 'LinkedIn';
            if (lowercaseUrl.includes('github.com')) return 'GitHub';
            if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) return 'Twitter / X';
            if (lowercaseUrl.includes('tiktok.com')) return 'TikTok';
            if (lowercaseUrl.includes('facebook.com')) return 'Facebook';
            if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) return 'YouTube';
            if (lowercaseUrl.includes('dribbble.com')) return 'Dribbble';
            if (lowercaseUrl.includes('behance.net')) return 'Behance';
            return 'External Link';
          };
          const platform = getSocialPlatform(href);
          console.log(`[Analytics Debug] Social Outbound Link (${platform}) clicked:`, href);
          import('@/features/analytics').then(({ trackCustomEvent }) => {
            trackCustomEvent(subdomain, 'SOCIAL_CLICK', undefined, { platform, url: href });
          }).catch(err => console.error('[Analytics Debug] Failed to track social click:', err));
          return;
        }
      }

      // ── 2. DETEKSI KLIK KARTU PROYEK (KARYA) ──────────────────────────────────
      const card = target.closest('.cursor-pointer, [class*="cursor-pointer"], .group, button, a');
      if (!card) {
        console.log("[Analytics Debug] No clickable card parent found.");
        return;
      }
      console.log("[Analytics Debug] Found card:", card);

      const isProjectArea = card.closest('[id*="project" i], [id*="work" i], [class*="project" i], [class*="work" i], [class*="gallery" i], [id*="gallery" i]');
      if (!isProjectArea) {
        console.log("[Analytics Debug] Click is outside project area.");
        return;
      }
      console.log("[Analytics Debug] Click is inside project area:", isProjectArea);

      let projectTitle = '';

      const imgEl = card.querySelector('img');
      if (imgEl) {
        projectTitle = imgEl.getAttribute('alt') || '';
        console.log("[Analytics Debug] Extracted title from image alt:", projectTitle);
      }

      if (!projectTitle) {
        const headingEl = card.querySelector('h2, h3, h4');
        if (headingEl) {
          projectTitle = headingEl.textContent?.trim() || '';
          console.log("[Analytics Debug] Extracted title from heading:", projectTitle);
        }
      }

      if (!projectTitle && target.tagName === 'IMG') {
        projectTitle = target.getAttribute('alt') || '';
        console.log("[Analytics Debug] Extracted title from direct img target:", projectTitle);
      }

      if (projectTitle) {
        projectTitle = projectTitle.replace(/^(PRJ\s+)?\d+\.\s*/i, '').trim();
      }

      console.log("[Analytics Debug] Final processed title:", projectTitle);

      if (projectTitle) {
        const allProjects = data?.projects || data?.user?.projects || [];
        console.log("[Analytics Debug] Total database projects available:", allProjects.length);

        const matchedProject = allProjects.find((p: any) => {
          const dbTitle = p.title.trim().toLowerCase();
          const clickTitle = projectTitle.toLowerCase();
          return dbTitle === clickTitle || clickTitle.includes(dbTitle) || dbTitle.includes(clickTitle);
        });

        if (matchedProject && matchedProject.id) {
          console.log("[Analytics Debug] Match found in DB:", matchedProject);
          import('@/features/analytics').then(({ trackProjectClick }) => {
            console.log("[Analytics Debug] Triggering tracking client for project:", subdomain, matchedProject.id);
            trackProjectClick(subdomain, matchedProject.id, matchedProject.title);
          }).catch(err => console.error('[Analytics Debug] Failed to track project click globally:', err));
        } else {
          console.log("[Analytics Debug] No matching project found in database.");
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [data, isEditor]);

  // Filter available blocks that are not currently in the layout
  const allAvailableBlocks = [
    { type: 'HERO', name: 'Hero / Utama', icon: 'fa-star' },
    { type: 'MARQUEE', name: 'Teks Berjalan', icon: 'fa-exchange-alt' },
    { type: 'ABOUT', name: 'Tentang Saya', icon: 'fa-user' },
    { type: 'SERVICES', name: 'Layanan', icon: 'fa-briefcase' },
    { type: 'STATS', name: 'Statistik', icon: 'fa-chart-bar' },
    { type: 'SKILLS', name: 'Keahlian', icon: 'fa-tools' },
    { type: 'EXPERIENCE', name: 'Pengalaman', icon: 'fa-history' },
    { type: 'PROJECTS', name: 'Portofolio', icon: 'fa-images' },
    { type: 'AWARDS', name: 'Penghargaan', icon: 'fa-trophy' },
    { type: 'TESTIMONIALS', name: 'Testimoni', icon: 'fa-comment-alt' },
    { type: '3D', name: 'Showcase 3D', icon: 'fa-cube' },
    { type: 'FAQ', name: 'Tanya Jawab', icon: 'fa-question-circle' },
    { type: 'VIDEO_SHOWCASE', name: 'Video Showcase', icon: 'fa-play-circle' },
    { type: 'FOOTER', name: 'Footer', icon: 'fa-shoe-prints' },
  ];

  const existingBlockTypes = new Set(blocks.map((b: any) => {
    if (b.blockType === 'VIDEO_SHOWCASE') return 'VIDEO_SHOWCASE';
    const parts = b.blockType.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : b.blockType;
  }));

  const activeThemeTemplate = theme?.themeTemplate || theme?.id || 'minimalist';
  const forbiddenBlocksForCurrentTheme = FORBIDDEN_BLOCKS_PER_THEME[activeThemeTemplate] || [];

  const addableBlocks = allAvailableBlocks.filter(b => 
    !existingBlockTypes.has(b.type) && !forbiddenBlocksForCurrentTheme.includes(b.type)
  );

  const handleAddBlock = (blockType: string) => {
    window.parent.postMessage({ type: 'BLOCK_ADD', blockType, insertIndex }, window.location.origin);
    setIsLibraryOpen(false);
    setInsertIndex(null);
  };

  const LibraryUI = isEditor && isLibraryOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 lg:p-6 border-b border-white/10 flex justify-between items-center bg-black">
              <h3 className="text-white font-mono font-bold text-xs uppercase tracking-widest">Library Seksi</h3>
              <button onClick={() => setIsLibraryOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-none border border-white/10 bg-zinc-900 text-white/50 hover:text-[#ff9e00] hover:border-[#ff9e00]/50 transition-colors">
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            <div className="p-4 lg:p-6 overflow-y-auto flex-1 grid grid-cols-2 gap-4 custom-scrollbar bg-zinc-950">
              {addableBlocks.length > 0 ? addableBlocks.map(b => (
                <button 
                  key={b.type}
                  onClick={() => handleAddBlock(b.type)}
                  className="flex flex-col items-center justify-center p-6 rounded-none border border-white/10 bg-zinc-900/30 hover:bg-[#ff9e00]/5 hover:border-[#ff9e00]/50 transition-all text-white/70 hover:text-[#ff9e00] gap-3 group"
                >
                  <i className={`fas ${b.icon} text-2xl mb-1 text-white/30 group-hover:text-[#ff9e00] transition-colors`}></i>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-center leading-relaxed">{b.name}</span>
                </button>
              )) : (
                <div className="col-span-2 py-16 flex flex-col items-center justify-center text-white/20 border border-dashed border-white/10">
                  <i className="fas fa-check-circle text-4xl mb-4"></i>
                  <p className="text-xs font-mono uppercase tracking-widest font-bold">Semua Seksi Telah Digunakan</p>
                </div>
              )}
            </div>
          </div>
        </div>
  ) : null;

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

  // Urutkan blok berdasarkan orderIndex dan filter yang tersembunyi
  let sortedBlocks = [...(blocks || [])].sort((a, b) => a.orderIndex - b.orderIndex);

  if (!isEditor) {
    sortedBlocks = sortedBlocks.filter(b => b.isVisible !== false);

    // Fallback: Jika pengguna belum pernah menyimpan blok (database kosong),
    // berikan blok standar agar halaman tidak kosong melompong.
    if (sortedBlocks.length === 0) {
      const DEFAULT_ORDER = ['HERO', 'MARQUEE', 'ABOUT', 'SKILLS', 'EXPERIENCE', 'SERVICES', 'STATS', 'PROJECTS', '3D', 'AWARDS', 'TESTIMONIALS', 'FOOTER'];
      sortedBlocks = DEFAULT_ORDER.map((type, i) => ({
        id: `fallback-${i}`,
        blockType: type,
        orderIndex: i,
        isVisible: true
      }));
    }
  }

  const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll === 'true');

  const renderBlock = (b: any) => (
    <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} isMobileView={isMobileView} />
  );

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
            .min-theme .font-sans { font-family: ${bodyFont} !important; }
            .min-theme .font-serif { font-family: ${headingFont} !important; }
            .min-theme .font-heading { font-family: ${headingFont} !important; }
            .min-theme .font-body { font-family: ${bodyFont} !important; }
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
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (activeThemeTemplate === 'spatial') {
      return (
        <SpatialShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </SpatialShell>
      );
    }

    if (activeThemeTemplate === 'obsidian-reel') {
      return (
        <ObsidianShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </ObsidianShell>
      );
    }

    if (activeThemeTemplate === 'aura-kinetic') {
      return (
        <AuraKineticShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </AuraKineticShell>
      );
    }

    if (activeThemeTemplate === 'editorial') {
      return (
        <EditorialShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </EditorialShell>
      );
    }

    if (activeThemeTemplate === 'midnight-emulsion') {
      return (
        <MidnightEmulsionShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </MidnightEmulsionShell>
      );
    }

    if (activeThemeTemplate === 'viewfinder') {
      return (
        <ViewfinderShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </ViewfinderShell>
      );
    }

    if (activeThemeTemplate === 'cinematic-gallery') {
      return (
        <CinematicGalleryShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <React.Fragment key={b.id}>
              {renderBlock(b)}
            </React.Fragment>
          ))}
        </CinematicGalleryShell>
      );
    }

    if (activeThemeTemplate === 'split') {
      const heroBlockData = sortedBlocks.find((b: any) => b.blockType.includes('HERO'));
      const otherBlocks = sortedBlocks.filter((b: any) => b.id !== heroBlockData?.id);

      return (
        <NexusSplitShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor} heroBlock={heroBlockData}>
          {otherBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </NexusSplitShell>
      );
    }

    if (activeThemeTemplate === 'monolith') {
      return (
        <MonolithShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </MonolithShell>
      );
    }

    if (activeThemeTemplate === 'layered-monolith') {
      return (
        <LayeredMonolithShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia}>
          {sortedBlocks.map(b => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </LayeredMonolithShell>
      );
    }

    if (activeThemeTemplate === 'absolute-noir') {
      return (
        <AbsoluteNoirShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </AbsoluteNoirShell>
      );
    }

    if (activeThemeTemplate === 'cinematic') {
      return (
        <CinematicShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </CinematicShell>
      );
    }

    if (activeThemeTemplate === 'acid-tech' || activeThemeTemplate === 'acid') {
      return (
        <AcidTechShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </AcidTechShell>
      );
    }

    if (activeThemeTemplate === 'bentogrid') {
      return (
        <BentoGridShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </BentoGridShell>
      );
    }

    if (activeThemeTemplate === 'brutalism') {
      return (
        <BrutalismShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </BrutalismShell>
      );
    }

    if (activeThemeTemplate === 'kinetic-avant-garde') {
      return (
        <KineticAvantGardeShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </KineticAvantGardeShell>
      );
    }

    if (activeThemeTemplate === 'nexus-noir') {
      return (
        <NexusNoirShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </NexusNoirShell>
      );
    }

    if (activeThemeTemplate === 'horizontal-flow') {
      return (
        <HorizontalFlowShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor}>
          {sortedBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </HorizontalFlowShell>
      );
    }

    if (activeThemeTemplate === 'split-screen-studio') {
      const heroBlockData = sortedBlocks.find((b: any) => b.blockType.includes('HERO'));
      const otherBlocks = sortedBlocks.filter((b: any) => b.id !== heroBlockData?.id);

      return (
        <SplitScreenStudioShell data={data} theme={theme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={isEditor} heroBlock={heroBlockData}>
          {otherBlocks.map((b: any) => (
            <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
          ))}
        </SplitScreenStudioShell>
      );
    }

    // Default Minimalist
    return (
      <div className="flex flex-col w-full min-h-screen">
        {sortedBlocks.map(b => (
          <BlockMapper key={b.id} block={b} data={data} theme={theme} isEditor={isEditor} setSelectedMedia={setSelectedMedia} />
        ))}
      </div>
    );
  };

  const content = renderLayout();

  const finalContent = isEditor ? (
    <div className="flex flex-col w-full min-h-screen">
      {content}
      {LibraryUI}
      <GlobalCursor enabled={theme?.customTexts?.custom_cursor_enabled === 'true'} type={theme?.customTexts?.custom_cursor_type || 'circle-dot'} />
    </div>
  ) : (
    <>
      {content}
      <GlobalCursor enabled={theme?.customTexts?.custom_cursor_enabled === 'true'} type={theme?.customTexts?.custom_cursor_type || 'circle-dot'} />
    </>
  );

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
          {finalContent}
        </ReactLenis>
      </>
    );
  }

  return finalContent;
};

