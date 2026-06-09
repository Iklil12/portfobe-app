//app/dashboard/appearance/page.tsx
"use client";

import React, { Suspense } from 'react';
import { useThemeEditor } from '@/hooks/useThemeEditor';
import { EditorPanel } from '@/components/features/appearance/EditorPanel';
import { PreviewPanel } from '@/components/features/appearance/PreviewPanel';
import { OfflineModal } from '@/components/features/appearance/OfflineModal';
import { PublishSuccessModal } from '@/components/features/appearance/PublishSuccessModal';
import { Loader2 } from 'lucide-react';

function AppearanceEditor() {
  const { state, actions } = useThemeEditor();

  if (state.isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 animate-in fade-in duration-500 m-0 p-0 absolute inset-0 z-[999999]">
        <Loader2 className="w-10 h-10 text-[#ff9e00] animate-spin mb-4" />
        <p className="text-white/40 text-[9px] font-mono font-bold uppercase tracking-widest animate-pulse">Memuat Editor Canvas...</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen m-0 p-0 flex flex-col lg:flex-row bg-zinc-950 font-mono overflow-hidden fixed inset-0 z-[99999]">

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 0px; }
        
        .bg-grid-slate {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
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

      {/* PANEL KIRI: EDITOR TATA LETAK */}
      <EditorPanel state={state} actions={actions} />

      {/* PANEL KANAN: LIVE PREVIEW AREA */}
      <PreviewPanel state={state} actions={actions} />
      
    </main>
  );
}

export default function AppearancePage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950">
        <Loader2 className="w-10 h-10 text-[#ff9e00] animate-spin mb-4" />
        <p className="text-white/40 text-[9px] font-mono font-bold uppercase tracking-widest">Sinkronisasi Canvas...</p>
      </div>
    }>
      <AppearanceEditor />
    </Suspense>
  );
}