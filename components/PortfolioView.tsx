// components/PortfolioView.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { DynamicBlockRenderer } from './blocks/DynamicBlockRenderer';
import Script from 'next/script';

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

  // FASE 3: Ekstrak designTokens jika ada dan timpa properti usang
  if (typeof processedTheme.designTokens === 'string') {
    try {
      const tokens = JSON.parse(processedTheme.designTokens);
      Object.assign(processedTheme, tokens); 
    } catch (e) {
      // safe fallback
    }
  } else if (processedTheme.designTokens && typeof processedTheme.designTokens === 'object') {
    Object.assign(processedTheme, processedTheme.designTokens);
  }

  // FASE 4: Filter Projects berdasarkan Curated Selection
  let finalProjects = data.projects || data.user?.projects || [];
  
  if (data.selectedProjects && Array.isArray(data.selectedProjects) && data.selectedProjects.length > 0) {
    // Editor mode uses flat array of IDs
    finalProjects = data.selectedProjects
      .map((id: string) => finalProjects.find((p: any) => p.id === id))
      .filter(Boolean);
  } else if (data.siteAppearance?.projects && Array.isArray(data.siteAppearance.projects) && data.siteAppearance.projects.length > 0) {
    // Live mode uses relation objects { projectId, orderIndex }
    finalProjects = [...data.siteAppearance.projects]
      .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
      .map((lp: any) => finalProjects.find((p: any) => p.id === lp.projectId))
      .filter(Boolean);
  } else if (data.themeDraft?.projects && Array.isArray(data.themeDraft.projects) && data.themeDraft.projects.length > 0) {
    // Draft mode fallback
    finalProjects = [...data.themeDraft.projects]
      .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
      .map((lp: any) => finalProjects.find((p: any) => p.id === lp.projectId))
      .filter(Boolean);
  }

  // Inject the filtered projects back into data so all Blocks receive the curated list
  const processedData = {
    ...data,
    projects: finalProjects,
    ...(data.user ? { user: { ...data.user, projects: finalProjects } } : {})
  };

  // Semua rendering diserahkan sepenuhnya kepada arsitektur Block-based (DynamicBlockRenderer)
  // Tema-tema lama berbentuk Monolith telah resmi ditinggalkan dan dibersihkan untuk optimasi Bundle Size.
  return (
    <>
      {/* Inject Global Icon Dependencies for Portfolio Blocks */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="lazyOnload" />
      
      <div className="relative w-full h-full" style={{ containerType: 'inline-size' }}>
        <DynamicBlockRenderer 
          blocks={processedData.pageBlocks || processedData.blocks || []} 
          data={processedData} 
          theme={processedTheme} 
          isMobileView={isMobileView} 
          isCardPreview={isCardPreview} 
          isEditor={effectiveIsEditor} 
        />
      </div>
    </>
  );
}
