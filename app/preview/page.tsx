"use client";

import React, { useState, useEffect } from 'react';
import PortfolioView from '@/components/PortfolioView';
import { GalleryPageView } from '@/features/gallery';

export default function PreviewPage() {
  const [data, setData] = useState<any>(null);
  const [theme, setTheme] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'theme' | 'pages'>('theme');
  const [selectedPage, setSelectedPage] = useState<'home' | 'gallery'>('home');
  const [isOrphaned, setIsOrphaned] = useState(false);

  useEffect(() => {
    // Deteksi jika halaman ini dibuka langsung (bukan dari dalam iframe editor)
    if (typeof window !== 'undefined' && window === window.parent) {
      setIsOrphaned(true);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      // SECURITY: Cegah injeksi dari domain asing
      if (event.origin !== window.location.origin && !event.origin.includes('localhost') && !event.origin.includes('127.0.0.1')) return;

      if (event.data?.type === 'PREVIEW_UPDATE') {
        setData(event.data.data);
        setTheme(event.data.theme);
        setIsMobileView(!!event.data.isMobileView);
        if (event.data.activeTab) setActiveTab(event.data.activeTab);
        if (event.data.selectedPage) setSelectedPage(event.data.selectedPage);
        setIsReady(true);
      }
    };

    window.addEventListener('message', handleMessage);

    // Beritahu parent (PreviewPanel) bahwa iframe sudah siap menerima data
    if (window.parent) {
      window.parent.postMessage({ type: 'PREVIEW_READY' }, window.location.origin);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Sinyal "Handshake" ke parent bahwa tema telah selesai di-render
  useEffect(() => {
    if (isReady && theme?.themeTemplate) {
      // Memberi sedikit waktu (buffer) agar React & Framer Motion selesai merakit DOM
      const timer = setTimeout(() => {
        if (window.parent) {
          window.parent.postMessage({ 
            type: 'PREVIEW_RENDERED', 
            templateId: theme.themeTemplate 
          }, window.location.origin);
        }
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [theme?.themeTemplate, isReady]);

  if (isOrphaned) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-6 text-center font-sans">
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
          <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Preview Canvas</h1>
        <p className="text-white/50 text-sm mb-8 max-w-sm leading-relaxed">This page is a live preview canvas for the Theme Editor and is not meant to be viewed directly.</p>
        <a href="/dashboard" className="px-6 py-3 bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-white/90 transition-colors">
          Go To Dashboard
        </a>
      </div>
    );
  }

  if (!isReady || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="w-6 h-6 border-2 border-slate-700 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const isGalleryView = activeTab === 'pages' && selectedPage === 'gallery';

  if (isGalleryView) {
    const rawProjects = data.projects || [];
    const projects = rawProjects.filter((p: any) => p.projectType !== '3d');
    const subdomain = data.profile?.subdomain || 'preview';
    
    let galleryTemplate = 'editorial';
    let galleryDesign = 'classic';
    let customTextsObj: any = {};
    if (theme?.customTexts) {
      try {
        customTextsObj = typeof theme.customTexts === 'string'
          ? JSON.parse(theme.customTexts)
          : theme.customTexts;
        if (customTextsObj.galleryTemplate) {
          galleryTemplate = customTextsObj.galleryTemplate;
        }
        if (customTextsObj.galleryDesign) {
          galleryDesign = customTextsObj.galleryDesign;
        }
      } catch (e) {
        console.error("Failed to parse customTexts in gallery preview", e);
      }
    }

    return (
      <main className="min-h-screen relative overflow-x-clip bg-transparent">
        <style dangerouslySetInnerHTML={{ __html: `
          body { background: transparent !important; }
        ` }} />
        <GalleryPageView 
          projects={projects} 
          subdomain={subdomain} 
          galleryTemplate={galleryTemplate}
          galleryDesign={galleryDesign}
          isEditor={true}
          customTexts={customTextsObj}
          profile={data.profile}
          links={data.links}
          email={data.email || (data.user && data.user.email)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-clip bg-transparent">
      <style dangerouslySetInnerHTML={{ __html: `
        body { background: transparent !important; }
        
        /* Subtle Glass Noise Texture */
        .glass-noise {
           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E");
        }
      ` }} />
      <PortfolioView data={data} theme={theme} isMobileView={isMobileView} isCardPreview={false} isEditor={true} />
    </main>
  );
}
