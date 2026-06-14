//app/dashboard/appearance/page.tsx
"use client";

import React, { Suspense, useEffect } from 'react';
import { useThemeEditor } from '@/hooks/useThemeEditor';
import Link from 'next/link';
import { LeftPanel } from '@/components/features/appearance/LeftPanel';
import { RightPanel } from '@/components/features/appearance/RightPanel';
import { PreviewPanel } from '@/components/features/appearance/PreviewPanel';
import { SeoSettingsModal } from '@/components/features/appearance/SeoSettingsModal';
import { OfflineModal } from '@/components/features/appearance/OfflineModal';
import { PublishSuccessModal } from '@/components/features/appearance/PublishSuccessModal';
import { Loader2, ArrowLeft, Undo2, Redo2, Monitor, Smartphone, ExternalLink, Minus, Plus, Maximize, Minimize, Globe } from 'lucide-react';

function AppearanceEditor() {
  const { state, actions } = useThemeEditor();

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

  const isCurrentlyLive = state.activeDraftId ? state.activeDraftId === state.publishedDraftId : state.publishedDraftId === null;
  const canPublish = state.isDirty || !isCurrentlyLive || state.hasUnpublishedChanges;

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
          <div className="flex items-center bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => actions.setPreviewMode('desktop')}
              className={`px-2.5 lg:px-3 py-1 text-[11px] font-medium transition-all flex items-center gap-1.5 rounded-md ${
                state.previewMode === 'desktop' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Desktop</span>
            </button>
            <button
              onClick={() => actions.setPreviewMode('mobile')}
              className={`px-2.5 lg:px-3 py-1 text-[11px] font-medium transition-all flex items-center gap-1.5 rounded-md ${
                state.previewMode === 'mobile' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Mobile</span>
            </button>
          </div>

          <div className="w-px h-4 bg-white/10 hidden lg:block"></div>

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

          {/* Zoom Controls */}
          <div className={`hidden lg:flex items-center gap-1 transition-opacity duration-300 ${state.previewMode === 'desktop' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-px h-4 bg-white/10 mx-2"></div>
            <button
              onClick={actions.zoomOut}
              disabled={state.desktopZoom <= state.ZOOM_MIN}
              className="w-7 h-7 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all rounded-md"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-medium text-white/60 w-10 text-center tabular-nums">
              {Math.round(state.desktopZoom * 100)}%
            </span>
            <button
              onClick={actions.zoomIn}
              disabled={state.desktopZoom >= state.ZOOM_MAX}
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
        {/* PANEL KIRI: TEMA & DRAFTS */}
        <LeftPanel state={state} actions={actions} />

        {/* PANEL TENGAH: LIVE PREVIEW AREA */}
        <PreviewPanel state={state} actions={actions} />

        {/* PANEL KANAN: PROPERTIES */}
        <RightPanel state={state} actions={actions} />
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