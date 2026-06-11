// components/PortfolioView.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { DynamicBlockRenderer } from './blocks/DynamicBlockRenderer';

export default function PortfolioView({ data, theme, isMobileView = false, isCardPreview = false, isEditor }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
  const pathname = usePathname();
  const effectiveIsEditor = isEditor !== undefined ? isEditor : pathname?.includes('/dashboard');

  // PARSING CUSTOM TEXTS
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

  // Semua rendering diserahkan sepenuhnya kepada arsitektur Block-based (DynamicBlockRenderer)
  // Tema-tema lama berbentuk Monolith telah resmi ditinggalkan dan dibersihkan untuk optimasi Bundle Size.
  return (
    <div className="relative w-full h-full" style={{ containerType: 'inline-size' }}>
      <DynamicBlockRenderer 
        blocks={data.pageBlocks || data.blocks || []} 
        data={data} 
        theme={processedTheme} 
        isMobileView={isMobileView} 
        isCardPreview={isCardPreview} 
        isEditor={effectiveIsEditor} 
      />
    </div>
  );
}
