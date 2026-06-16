//app/dashboard/appearance/page.tsx
"use client";

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useThemeEditor } from '@/hooks/useThemeEditor';
import Link from 'next/link';
import { LeftPanel } from '@/components/features/appearance/LeftPanel';
import { RightPanel } from '@/components/features/appearance/RightPanel';
import { PreviewPanel } from '@/components/features/appearance/PreviewPanel';
import { SeoSettingsModal } from '@/components/features/appearance/SeoSettingsModal';
import { OfflineModal } from '@/components/features/appearance/OfflineModal';
import { PublishSuccessModal } from '@/components/features/appearance/PublishSuccessModal';
import { Loader2, ArrowLeft, Undo2, Redo2, Monitor, Smartphone, Columns, ExternalLink, Minus, Plus, Maximize, Minimize, Globe, ChevronDown, Layers, FileText, Settings, Search, SlidersHorizontal, Layout, Crop } from 'lucide-react';

function AppearanceEditor() {
  const { state, actions } = useThemeEditor();
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  
  // Dock & Page States
  const [activeTab, setActiveTab] = useState<'theme' | 'pages'>('theme');
  const [selectedPage, setSelectedPage] = useState<'home' | 'gallery'>('gallery');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) {
        setIsModeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Sinkronisasi Keyboard Shortcut untuk Undo / Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Jangan trigger jika user sedang mengetik di dalam input atau textarea
      if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
        return;
      }

      const modifier = e.ctrlKey || e.metaKey; // Mendukung Windows (Ctrl) & Mac (Cmd)
      
      if (modifier && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (state.canUndo) actions.undo();
      } else if (modifier && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (state.canRedo) actions.redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.canUndo, state.canRedo, actions]);

  if (state.isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#111111] animate-in fade-in duration-500 m-0 p-0 absolute inset-0 z-[999999]">
        {/* Clean Enterprise Spinner */}
        <div className="relative w-12 h-12 flex items-center justify-center mb-6">
          <svg className="animate-spin w-10 h-10 text-white/20" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <path className="opacity-90 text-white" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-white/40 text-[9px] font-medium tracking-wide animate-pulse">Memuat Editor Canvas...</p>
      </div>
    );
  }

  const isCurrentlyLive = state.activeDraftId === state.publishedDraftId;
  const canPublish = state.isDirty || (state.activeDraftId && state.activeDraftId !== state.publishedDraftId) || state.hasUnpublishedChanges;

  return (
    <main className="h-screen w-screen m-0 p-0 flex flex-col bg-[#111111] font-sans overflow-hidden fixed inset-0 z-[99999]">

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 0px; }
        
        .bg-grid-slate {
            background-image: none;
        }

        :global(body > aside),
        :global(body > header),
        :global(main.layout-content-wrapper > header) { display: none !important; }
        :global(main.layout-content-wrapper) { padding: 0 !important; margin: 0 !important; max-width: 100vw !important; }
      `}} />

      {state.showOfflineModal && (
        <OfflineModal setShowOfflineModal={actions.setShowOfflineModal} />
      )}

      {state.isPublishModalOpen && (
        <PublishSuccessModal
          isOpen={state.isPublishModalOpen}
          onClose={() => actions.setIsPublishModalOpen(false)}
          subdomain={state.subdomain}
          isLive={state.isLive}
        />
      )}

      {/* FULL WIDTH NAVBAR */}
      <div className="w-full h-14 bg-[#111111] border-b border-white/5 shrink-0 flex items-center justify-between px-4 lg:px-6 z-[100] relative">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            onClick={(e) => {
              if (state.isDirty) {
                if (!window.confirm("Keluar dari Editor? Perubahan yang Anda lakukan mungkin tidak disimpan.")) {
                  e.preventDefault();
                }
              }
            }}
            className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200" 
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[13px] font-medium text-white/90">Website Builder</span>
            <span className="px-1.5 py-0.5 bg-white/10 text-white/60 text-[9px] rounded font-medium">PRO</span>
          </div>
        </div>

        {/* Center: Mode & Undo & Zoom */}
        <div className="flex items-center gap-3 lg:gap-6 absolute left-1/2 -translate-x-1/2">
          {/* Mode Switcher */}
          <div className="relative flex items-center justify-center" ref={modeDropdownRef}>
            <button 
              onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
              className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg transition-all text-[11px] font-medium w-[140px] ${isModeDropdownOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/80'}`}
            >
              <div className="flex items-center gap-2">
                {state.previewMode === 'desktop' && <Monitor className="w-3.5 h-3.5 shrink-0" />}
                {state.previewMode === 'mobile' && <Smartphone className="w-3.5 h-3.5 shrink-0" />}
                {state.previewMode === 'split' && <Columns className="w-3.5 h-3.5 shrink-0" />}
                <span className="whitespace-nowrap text-left flex-1">Device: {state.previewMode.charAt(0).toUpperCase() + state.previewMode.slice(1)}</span>
              </div>
              <ChevronDown className={`w-3 h-3 opacity-50 shrink-0 transition-transform duration-200 ${isModeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`absolute top-[calc(100%-2px)] left-0 w-32 pt-2 transition-all duration-200 z-50 ${isModeDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}>
              <div className="py-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl flex flex-col">
                <button onClick={() => { actions.setPreviewMode('desktop'); setIsModeDropdownOpen(false); }} className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium hover:bg-white/5 w-full text-left transition-colors ${state.previewMode === 'desktop' ? 'text-white' : 'text-white/50'}`}>
                  <Monitor className="w-3.5 h-3.5" /> Desktop
                </button>
                <button onClick={() => { actions.setPreviewMode('mobile'); setIsModeDropdownOpen(false); }} className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium hover:bg-white/5 w-full text-left transition-colors ${state.previewMode === 'mobile' ? 'text-white' : 'text-white/50'}`}>
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
                <button onClick={() => { actions.setPreviewMode('split'); setIsModeDropdownOpen(false); }} className={`hidden lg:flex items-center gap-2 px-3 py-2 text-[11px] font-medium hover:bg-white/5 w-full text-left transition-colors ${state.previewMode === 'split' ? 'text-white' : 'text-white/50'}`}>
                  <Columns className="w-3.5 h-3.5" /> Split
                </button>
              </div>
            </div>
          </div>

          {/* Split Mode Toggle - Removed as per user request to default to Fixed */}

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={actions.undo}
              disabled={!state.canUndo}
              className={`w-7 h-7 flex items-center justify-center transition-all rounded-md ${
                state.canUndo ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={actions.redo}
              disabled={!state.canRedo}
              className={`w-7 h-7 flex items-center justify-center transition-all rounded-md ${
                state.canRedo ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls (Always present but invisible when not needed to prevent layout shift) */}
          <div className={`hidden lg:flex items-center gap-1 transition-all duration-300 ${state.previewMode === 'desktop' ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
            <div className="w-px h-4 bg-white/10 mx-2"></div>
            <button
              onClick={actions.zoomOut}
              disabled={state.previewMode === 'desktop' ? state.desktopZoom <= state.ZOOM_MIN : state.mobileZoom <= state.ZOOM_MIN}
              className="w-7 h-7 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all rounded-md"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-medium text-white/60 w-10 text-center tabular-nums">
              {Math.round((state.previewMode === 'desktop' || state.previewMode === 'split' ? state.desktopZoom : state.mobileZoom) * 100)}%
            </span>
            <button
              onClick={actions.zoomIn}
              disabled={state.previewMode === 'desktop' ? state.desktopZoom >= state.ZOOM_MAX : state.mobileZoom >= (state.ZOOM_MAX_MOBILE || 1.5)}
              className="w-7 h-7 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all rounded-md"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a 
            href={`/${state.subdomain || 'username'}`} 
            target="_blank" 
            rel="noreferrer" 
            className="w-8 h-8 rounded-md flex items-center justify-center transition-all text-white/50 hover:bg-white/5 hover:text-white"
            title={`Preview Live: portfo.be/${state.subdomain || 'username'}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => actions.setIsSeoModalOpen(true)}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-all text-white/50 hover:bg-white/5 hover:text-white"
            title="Pengaturan SEO & Social Card"
          >
            <Globe className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-white/10 hidden lg:block mx-1"></div>

          <button
            onClick={() => actions.setIsEditorCollapsed(!state.isEditorCollapsed)}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${state.isEditorCollapsed ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            title={state.isEditorCollapsed ? "Tampilkan Panel Editor" : "Sembunyikan Panel Editor (Full Screen)"}
          >
            {state.isEditorCollapsed ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              if (state.activeDraftId) actions.saveDraft();
              else actions.setIsSaveDraftModalOpen(true);
            }}
            disabled={state.isSavingDraft || state.isPublishing || (state.activeDraftId ? !state.isDirty : false)}
            className="px-3 py-1.5 bg-transparent hover:bg-white/5 text-white/70 hover:text-white text-[11px] font-medium transition-all disabled:opacity-50 flex items-center gap-2 rounded-md"
          >
            {state.isSavingDraft && <Loader2 className="w-3 h-3 animate-spin" />}
            Save
          </button>

          <button
            onClick={actions.publishDesign}
            disabled={state.isSavingDraft || state.isPublishing || !canPublish}
            className="px-4 py-1.5 bg-[#0099ff] hover:bg-[#0077cc] text-white text-[11px] font-medium transition-all disabled:opacity-50 flex items-center gap-2 rounded-md shadow-sm"
          >
            {state.isPublishing && <Loader2 className="w-3 h-3 animate-spin" />}
            Publish
          </button>
        </div>
      </div>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFTMOST DOCK NAV (MATCHES REFERENCE IMAGE EXACTLY, ONLY THEME & PAGES) */}
        {!state.isEditorCollapsed && (
          <div className="hidden lg:flex flex-col w-[56px] border-r border-white/5 bg-[#18181c] z-[101] shrink-0 items-center py-6 gap-5">
            {/* Layers Button (Theme Settings) */}
            <button 
              onClick={() => setActiveTab('theme')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition-all group ${
                activeTab === 'theme' ? 'bg-[#2c2c35] text-white' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
              }`}
              title="Theme Settings"
            >
              <Layers className="w-[18px] h-[18px] stroke-[1.5]" />
              <div className="absolute left-full ml-3 px-2 py-1 bg-[#222] border border-white/10 text-white text-[10px] whitespace-nowrap rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">Theme Settings</div>
            </button>

            {/* Layout Button (Pages) */}
            <button 
              onClick={() => setActiveTab('pages')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition-all group ${
                activeTab === 'pages' ? 'bg-[#2c2c35] text-white' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
              }`}
              title="Layout / Pages"
            >
              <Layout className="w-[18px] h-[18px] stroke-[1.5]" />
              <div className="absolute left-full ml-3 px-2 py-1 bg-[#222] border border-white/10 text-white text-[10px] whitespace-nowrap rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">Pages</div>
            </button>
          </div>
        )}

        {/* PANEL KIRI: TEMA & DRAFTS */}
        <LeftPanel 
          state={state} 
          actions={actions} 
          // @ts-ignore
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          selectedPage={selectedPage} 
          setSelectedPage={setSelectedPage} 
        />

        {/* PANEL TENGAH: LIVE PREVIEW AREA */}
        <PreviewPanel 
          state={state} 
          actions={actions} 
          // @ts-ignore
          activeTab={activeTab}
          selectedPage={selectedPage}
        />

        {/* PANEL KANAN: PROPERTIES */}
        <RightPanel 
          state={state} 
          actions={actions} 
          // @ts-ignore
          activeTab={activeTab} 
          selectedPage={selectedPage} 
        />
      </div>

      {state.isSeoModalOpen && <SeoSettingsModal state={state} actions={actions} />}

    </main>
  );
}

export default function AppearancePage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#111111]">
        <Loader2 className="w-10 h-10 text-[#ff9e00] animate-spin mb-4" />
        <p className="text-white/40 text-[9px] font-sans font-bold uppercase ">Sinkronisasi Canvas...</p>
      </div>
    }>
      <AppearanceEditor />
    </Suspense>
  );
}