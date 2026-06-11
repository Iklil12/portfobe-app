//app/dashboard/appearance/page.tsx
"use client";

import React, { Suspense } from 'react';
import { useThemeEditor } from '@/hooks/useThemeEditor';
import Link from 'next/link';
import { EditorPanel } from '@/components/features/appearance/EditorPanel';
import { PreviewPanel } from '@/components/features/appearance/PreviewPanel';
import { OfflineModal } from '@/components/features/appearance/OfflineModal';
import { PublishSuccessModal } from '@/components/features/appearance/PublishSuccessModal';
import { Loader2, ArrowLeft, Undo2, Redo2, Monitor, Smartphone, ExternalLink, Minus, Plus } from 'lucide-react';

function AppearanceEditor() {
  const { state, actions } = useThemeEditor();

  if (state.isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 animate-in fade-in duration-500 m-0 p-0 absolute inset-0 z-[999999]">
        {/* Clean Enterprise Spinner */}
        <div className="relative w-12 h-12 flex items-center justify-center mb-6">
          <svg className="animate-spin w-10 h-10 text-white/20" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <path className="opacity-90 text-white" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-white/40 text-[9px] font-mono font-bold uppercase tracking-widest animate-pulse">Memuat Editor Canvas...</p>
      </div>
    );
  }

  const isCurrentlyLive = state.activeDraftId ? state.activeDraftId === state.publishedDraftId : state.publishedDraftId === null;
  const canPublish = state.isDirty || !isCurrentlyLive || state.hasUnpublishedChanges;

  return (
    <main className="h-screen w-screen m-0 p-0 flex flex-col bg-zinc-950 font-sans overflow-hidden fixed inset-0 z-[99999]">

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
        />
      )}

      {/* FULL WIDTH NAVBAR */}
      <div className="w-full h-14 bg-zinc-950 border-b border-white/10 shrink-0 flex items-center justify-between px-4 lg:px-6 z-[100] relative">
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
            className="w-8 h-8 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#ff9e00] hover:bg-zinc-850 transition-all duration-200" 
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Website Builder</span>
            <span className="px-1.5 py-0.5 bg-zinc-900 border border-white/10 text-white/40 text-[9px] uppercase tracking-widest font-bold">Pro</span>
          </div>
        </div>

        {/* Center: Mode & Undo & Zoom */}
        <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
          {/* Mode Switcher */}
          <div className="hidden lg:flex items-center bg-zinc-950 border border-white/10 p-1 rounded-none shadow-md">
            <button
              onClick={() => actions.setPreviewMode('desktop')}
              className={`px-4 py-1.5 text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-2 rounded-none ${
                state.previewMode === 'desktop' ? 'bg-[#ff9e00] text-black shadow-sm' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => actions.setPreviewMode('mobile')}
              className={`px-4 py-1.5 text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-2 rounded-none ${
                state.previewMode === 'mobile' ? 'bg-[#ff9e00] text-black shadow-sm' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>

          <div className="w-[1px] h-5 bg-white/10 hidden lg:block"></div>

          {/* Undo / Redo */}
          <div className="flex items-center bg-zinc-950 border border-white/10 p-1 rounded-none shadow-md">
            <button
              onClick={actions.undo}
              disabled={!state.canUndo}
              className={`w-8 h-7 flex items-center justify-center transition-all rounded-none ${
                state.canUndo ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={actions.redo}
              disabled={!state.canRedo}
              className={`w-8 h-7 flex items-center justify-center transition-all rounded-none ${
                state.canRedo ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls (Always rendered but faded out in Mobile to prevent layout shifts) */}
          <div className={`hidden lg:flex items-center gap-3 transition-opacity duration-300 ${state.previewMode === 'desktop' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-[1px] h-5 bg-white/10"></div>
            
            <div className="flex items-center bg-zinc-950 border border-white/10 p-1 rounded-none shadow-md">
              <button
                onClick={actions.zoomOut}
                disabled={state.desktopZoom <= state.ZOOM_MIN}
                className="w-8 h-7 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all rounded-none"
                title="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-[#ff9e00] w-12 text-center tabular-nums border-x border-white/5 mx-0.5">
                {Math.round(state.desktopZoom * 100)}%
              </span>
              <button
                onClick={actions.zoomIn}
                disabled={state.desktopZoom >= state.ZOOM_MAX}
                className="w-8 h-7 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all rounded-none"
                title="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="hidden xl:flex px-3 py-1.5 bg-zinc-900 border border-white/10 text-[10px] font-mono text-white/40 items-center gap-2">
            portfo.be/{state.subdomain || 'username'}
            <a href={`/${state.subdomain || 'username'}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            onClick={() => {
              if (state.activeDraftId) actions.saveDraft();
              else actions.setIsSaveDraftModalOpen(true);
            }}
            disabled={state.isSavingDraft || state.isPublishing || (state.activeDraftId ? !state.isDirty : false)}
            className="px-4 py-1.5 bg-zinc-900 border border-white/10 text-white/80 hover:bg-white/5 hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {state.isSavingDraft ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            Simpan
          </button>

          <button
            onClick={actions.publishDesign}
            disabled={state.isSavingDraft || state.isPublishing || !canPublish}
            className="px-4 py-1.5 bg-[#ff9e00] hover:bg-[#ffaa22] text-black text-[10px] font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {state.isPublishing ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            Publish
          </button>
        </div>
      </div>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* PANEL KIRI: EDITOR TATA LETAK */}
        <EditorPanel state={state} actions={actions} />

        {/* PANEL KANAN: LIVE PREVIEW AREA */}
        <PreviewPanel state={state} actions={actions} />
      </div>

    </main>
  );
}

export default function AppearancePage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950">
        <Loader2 className="w-10 h-10 text-[#ff9e00] animate-spin mb-4" />
        <p className="text-white/40 text-[9px] font-sans font-bold uppercase ">Sinkronisasi Canvas...</p>
      </div>
    }>
      <AppearanceEditor />
    </Suspense>
  );
}