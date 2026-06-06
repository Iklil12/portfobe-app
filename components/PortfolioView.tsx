
// components/PortfolioView.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

// 1. IMPORT SEMUA TEMA DARI FOLDER THEMES
import BrutalismTheme from './themes/BrutalismTheme';
import { DynamicBlockRenderer } from './blocks/DynamicBlockRenderer';
import CinematicTheme from './themes/CinematicTheme';
import AcidTheme from './themes/AcidTheme';
import BentoTheme from './themes/BentoGrid';
import AbsoluteNoirTheme from './themes/AbsoluteNoirTheme';
import KineticAvantGardeTheme from './themes/KineticAvantGardeTheme';
import NexusNoirTheme from './themes/NexusNoirTheme';
import HorizontalFlowTheme from './themes/HorizontalFlowTheme';
import SplitScreenStudioTheme from './themes/SplitScreenStudioTheme';
import CinematicGalleryTheme from './themes/CinematicGalleryTheme';
import LayeredMonolithTheme from './themes/LayeredMonolithTheme';

// 2. DAFTARKAN TEMA KE DALAM "THEME REGISTRY"
const THEME_MAP: Record<string, React.FC<any>> = {
  'brutalism': BrutalismTheme,
  'cinematic': CinematicTheme,
  'acid': AcidTheme,
  'bentogrid': BentoTheme,
  'absolute-noir': AbsoluteNoirTheme,
  'kinetic-avant-garde': KineticAvantGardeTheme,
  'nexus-noir': NexusNoirTheme,
  'horizontal-flow': HorizontalFlowTheme,
  'split-screen-studio': SplitScreenStudioTheme,
  'cinematic-gallery': CinematicGalleryTheme,
  'layered-monolith': LayeredMonolithTheme,

  // Nanti tinggal tambah: 'elegant': ElegantTheme, dst...
};

export default function PortfolioView({ data, theme, isMobileView = false, isCardPreview = false, isEditor }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
  const pathname = usePathname();
  const effectiveIsEditor = isEditor !== undefined ? isEditor : pathname?.includes('/dashboard');

  // PENYESUAIAN BARU: Ambil subdomain dari dalam objek profile
  const subdomain = data?.profile?.subdomain || data?.subdomain || "";

  // 3. CEK TEMA APA YANG SEDANG DIPILIH USER DI DATABASE ATAU REGISTRY
  // Jika dari registry (di ThemeGrid), gunakan theme.id. Jika dari DB, gunakan theme.themeTemplate.
  const activeThemeName = theme?.themeTemplate || theme?.id || 'brutalism';

  // 4. PILIH KOMPONEN YANG SESUAI DARI REGISTRY
  const SelectedThemeComponent = THEME_MAP[activeThemeName] || THEME_MAP['brutalism'];

  // 5. PARSING CUSTOM TEXTS
  // Di Editor (livePreviewTheme), customTexts adalah Object.
  // Tapi di halaman publik (dari database API), kadang theme atau customTexts adalah JSON String.
  let parsedTheme = theme;
  if (typeof theme === 'string') {
    try {
      parsedTheme = JSON.parse(theme);
    } catch (e) {
      parsedTheme = {};
    }
  }

  const processedTheme = { ...parsedTheme };
  if (typeof processedTheme.customTexts === 'string') {
    try {
      processedTheme.customTexts = JSON.parse(processedTheme.customTexts);
    } catch (e) {
      processedTheme.customTexts = {};
    }
  }

  // Jika tema yang aktif adalah minimalist, spatial, obsidian-reel, aura-kinetic, editorial, midnight-emulsion, viewfinder, split, split-screen-studio, monolith, absolute-noir, cinematic, acid, bentogrid, brutalism, cinematic-gallery, layered-monolith, kinetic-avant-garde, nexus-noir, atau horizontal-flow, kita gunakan DynamicBlockRenderer
  if (activeThemeName === 'minimalist' || activeThemeName === 'spatial' || activeThemeName === 'obsidian-reel' || activeThemeName === 'aura-kinetic' || activeThemeName === 'editorial' || activeThemeName === 'midnight-emulsion' || activeThemeName === 'viewfinder' || activeThemeName === 'split' || activeThemeName === 'split-screen-studio' || activeThemeName === 'monolith' || activeThemeName === 'absolute-noir' || activeThemeName === 'cinematic' || activeThemeName === 'acid' || activeThemeName === 'acid-tech' || activeThemeName === 'bentogrid' || activeThemeName === 'brutalism' || activeThemeName === 'cinematic-gallery' || activeThemeName === 'layered-monolith' || activeThemeName === 'kinetic-avant-garde' || activeThemeName === 'nexus-noir' || activeThemeName === 'horizontal-flow') {
    return (
      <div className="relative w-full h-full" style={{ containerType: 'inline-size' }}>
        <DynamicBlockRenderer blocks={data.pageBlocks || data.blocks || []} data={data} theme={processedTheme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={effectiveIsEditor} />
      </div>
    );
  }



  return (
    <div className="relative w-full h-full" style={{ containerType: 'inline-size' }}>
      {/* RENDER TEMA YANG DIPILIH SECARA DINAMIS */}
      <SelectedThemeComponent data={data} theme={processedTheme} isMobileView={isMobileView} isCardPreview={isCardPreview} isEditor={effectiveIsEditor} />
    </div>
  );
}
