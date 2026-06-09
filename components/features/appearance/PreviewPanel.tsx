//components/features/appearance/PreviewPanel.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, ChevronLeft, Undo2, Redo2, Monitor, 
  Smartphone, Minus, Plus, Save, ExternalLink, Lock, Loader2 
} from 'lucide-react';

export function PreviewPanel({ state, actions }: { state: any, actions: any }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeReady = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileScale, setMobileScale] = useState(1);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 1024);
      setWindowWidth(window.innerWidth);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    isEditorCollapsed,
    isSaving,
    subdomain,
    isLive,
    livePreviewData,
    livePreviewTheme,
    previewMode
  } = state;

  const { setIsEditorCollapsed, saveDesign } = actions;

  // Kirim data ke iframe setiap kali livePreviewData atau livePreviewTheme berubah
  const sendDataToIframe = useCallback(() => {
    if (iframeRef.current?.contentWindow && iframeReady.current) {
      iframeRef.current.contentWindow.postMessage({
        type: 'PREVIEW_UPDATE',
        data: livePreviewData,
        theme: livePreviewTheme,
        isMobileView: previewMode === 'mobile'
      }, window.location.origin);
    }
  }, [livePreviewData, livePreviewTheme, previewMode]);

  // Listener untuk sinyal PREVIEW_READY dari iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'PREVIEW_READY') {
        iframeReady.current = true;
        sendDataToIframe();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendDataToIframe]);

  // Kirim update setiap kali data berubah
  useEffect(() => {
    sendDataToIframe();
  }, [sendDataToIframe]);

  // Kalkulasi scale untuk mobile mockup agar tidak kotak/terpotong
  useEffect(() => {
    const calculateScale = () => {
      if (previewMode === 'mobile' && containerRef.current) {
        const targetWidth = 454;
        const targetHeight = 932;
        const availableHeight = containerRef.current.clientHeight - 180;
        const availableWidth = containerRef.current.clientWidth - 80;
        const scaleH = availableHeight / targetHeight;
        const scaleW = availableWidth / targetWidth;
        setMobileScale(Math.min(1, scaleH, scaleW));
      } else {
        setMobileScale(1);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [previewMode]);

  // Desktop zoom controls
  const ZOOM_MIN = 0.4;
  const ZOOM_MAX = 1.0;
  const ZOOM_STEP = 0.1;
  const [desktopZoom, setDesktopZoom] = useState(0.75);

  const zoomIn  = () => setDesktopZoom(z => Math.min(ZOOM_MAX, parseFloat((z + ZOOM_STEP).toFixed(2))));
  const zoomOut = () => setDesktopZoom(z => Math.max(ZOOM_MIN, parseFloat((z - ZOOM_STEP).toFixed(2))));

  return (
    <div ref={containerRef} className="flex-1 h-full w-full relative flex flex-col items-center justify-center p-0 lg:p-4 lg:sm:p-6 lg:md:p-10 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-10">

      {/* Tombol Re-open Panel Editor */}
      <div className={`hidden lg:block absolute top-1/2 left-0 -translate-y-1/2 z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isEditorCollapsed ? 'translate-x-0' : '-translate-x-full'}`}>
        <button 
          onClick={() => setIsEditorCollapsed(false)} 
          className="w-7 h-20 bg-zinc-900 border border-white/10 border-l-0 rounded-r-2xl shadow-[5px_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center text-white/50 hover:text-[#ff9e00] hover:w-9 transition-all active:scale-95" 
          title="Tampilkan Panel Editor"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 hidden lg:block"></div>

      {/* DESKTOP FLOATING CONTROLS */}
      <div className="hidden lg:flex absolute top-6 left-1/2 -translate-x-1/2 z-[80] items-center gap-3 transition-all duration-700">
        
        {/* Undo / Redo */}
        <div className="bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-none border border-white/10 flex items-center shadow-none">
          <button
            onClick={actions.undo}
            disabled={!state.canUndo}
            className={`w-9 h-9 rounded-none flex items-center justify-center transition-all ${
              state.canUndo ? 'text-white/60 hover:bg-zinc-800 hover:text-white active:scale-95' : 'text-white/20 cursor-not-allowed'
            }`}
            title="Undo (Kembali)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
          <button
            onClick={actions.redo}
            disabled={!state.canRedo}
            className={`w-9 h-9 rounded-none flex items-center justify-center transition-all ${
              state.canRedo ? 'text-white/60 hover:bg-zinc-800 hover:text-white active:scale-95' : 'text-white/20 cursor-not-allowed'
            }`}
            title="Redo (Maju)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-none border border-white/10 flex items-center gap-1 shadow-none">
          <button
            onClick={() => actions.setPreviewMode('desktop')}
            className={`px-4 py-2 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              previewMode === 'desktop' 
                ? 'bg-[#ff9e00] text-black shadow-none font-bold' 
                : 'text-white/40 hover:bg-zinc-850 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" /> Desktop
          </button>
          <button
            onClick={() => actions.setPreviewMode('mobile')}
            className={`px-4 py-2 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              previewMode === 'mobile' 
                ? 'bg-[#ff9e00] text-black shadow-none font-bold' 
                : 'text-white/40 hover:bg-zinc-850 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Mobile
          </button>
        </div>

        {/* Save & Preview (when collapsed) */}
        {isEditorCollapsed && (
          <div className="bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-none border border-white/10 flex items-center gap-1 shadow-none animate-in fade-in zoom-in duration-300">
            <button
              onClick={saveDesign}
              disabled={isSaving}
              className="px-4 py-2 bg-[#ff9e00] text-black rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Simpan</span>
            </button>
            {subdomain && isLive && (
              <a
                href={`/${subdomain}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#ff9e00] hover:bg-zinc-900 transition-all shadow-none"
                title="Buka Portofolio di Tab Baru"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

      </div>

      {/* Desktop Zoom Controls */}
      {previewMode === 'desktop' && !isMobileDevice && (
        <div className="absolute top-6 right-6 z-40 bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-none border border-white/10 flex items-center gap-2 shadow-none">
          <button
            onClick={zoomOut}
            disabled={desktopZoom <= ZOOM_MIN}
            title="Zoom Out"
            className="w-7 h-7 rounded-none flex items-center justify-center text-white/60 hover:bg-zinc-850 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono font-bold text-white/70 w-8 text-center tabular-nums">
            {Math.round(desktopZoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={desktopZoom >= ZOOM_MAX}
            title="Zoom In"
            className="w-7 h-7 rounded-none flex items-center justify-center text-white/60 hover:bg-zinc-850 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* CONTAINER MOCKUP DEVICE */}
      <div
        className={`relative z-10 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden shrink-0
          ${isMobileDevice && previewMode === 'mobile' ? 'w-full h-full bg-zinc-950 absolute inset-0' : ''}
          ${isMobileDevice && previewMode === 'desktop' ? 'bg-zinc-950 w-[90vw] h-[60vh] -translate-y-12 rounded-none shadow-2xl border border-white/10' : ''}
          ${!isMobileDevice ? `mt-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 ${
              previewMode === 'desktop' ? 'bg-zinc-950 w-full max-w-6xl h-full max-h-[85vh] rounded-none' : 'bg-black border-[12px] border-zinc-900 rounded-[2.5rem] origin-center'
            }` : ''
          }
        `}
        style={!isMobileDevice && previewMode === 'mobile' ? {
          width: '454px',
          height: '932px',
          transform: `scale(${mobileScale})`
        } : undefined}
      >
        <div className="shrink-0 transition-all duration-700 z-20">
          {previewMode === 'desktop' && (
            <div className="h-10 flex items-center px-4 gap-3 bg-zinc-900/90 backdrop-blur-sm border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
              <div className="mx-auto px-4 py-1 bg-zinc-950 text-[9px] font-mono text-white/30 rounded-none flex items-center gap-1.5 font-bold shadow-none border border-white/10 truncate max-w-[200px]">
                <Lock className="w-2.5 h-2.5" />
                <span>portfo.be/{subdomain || 'username'}</span>
              </div>
            </div>
          )}
          {!isMobileDevice && previewMode === 'mobile' && (
            <div className="absolute top-0 left-0 h-7 bg-transparent flex justify-center w-full z-50 pointer-events-none transition-all duration-700">
              <div className="w-28 h-6 bg-zinc-900 rounded-b-3xl"></div>
            </div>
          )}
        </div>

        {/* IFRAME PREVIEW */}
        <div className={`flex-1 relative z-0 transition-all duration-700 overflow-hidden ${previewMode === 'desktop' || isMobileDevice ? 'bg-zinc-950' : 'bg-transparent'}`}>
          <iframe
            ref={iframeRef}
            src="/preview"
            title="Portfolio Preview"
            sandbox="allow-scripts allow-same-origin allow-popups"
            style={!isMobileDevice && previewMode === 'desktop' ? {
              border: 'none',
              transformOrigin: 'top left',
              transform: `scale(${desktopZoom})`,
              width: `${(1 / desktopZoom) * 100}%`,
              height: `${(1 / desktopZoom) * 100}%`,
            } : isMobileDevice && previewMode === 'desktop' ? {
              border: 'none',
              transformOrigin: 'top left',
              transform: `scale(${(windowWidth * 0.9) / 1024})`,
              width: `${(1 / ((windowWidth * 0.9) / 1024)) * 100}%`,
              height: `${(1 / ((windowWidth * 0.9) / 1024)) * 100}%`,
            } : {
              border: 'none',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>

      {/* FLOATING LIVE PREVIEW BUTTON (DESKTOP ONLY) */}
      {subdomain && (
        <a
          href={`/${subdomain}`}
          target="_blank"
          rel="noreferrer"
          className="hidden lg:flex absolute bottom-6 right-6 z-50 px-6 py-3.5 bg-[#ff9e00] text-black font-mono font-bold uppercase text-[10px] tracking-widest rounded-none shadow-none hover:scale-105 hover:-translate-y-1 transition-all duration-300 items-center gap-2 border-[2px] border-black"
        >
          <ExternalLink className="w-4 h-4" /> 
          <span>Live Preview</span>
        </a>
      )}
    </div>
  );
}
