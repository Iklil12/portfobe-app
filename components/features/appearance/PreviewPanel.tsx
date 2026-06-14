//components/features/appearance/PreviewPanel.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, ChevronLeft, Undo2, Redo2, Monitor, 
  Smartphone, Minus, Plus, Save, ExternalLink, Lock, Loader2, GripHorizontal 
} from 'lucide-react';
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion';

export function PreviewPanel({ state, actions }: { state: any, actions: any }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dragControls = useDragControls();
  const iframeReady = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileScale, setMobileScale] = useState(1);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const prevThemeRef = useRef<string | null>(null);

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

  // Reset posisi ketika pindah mode
  useEffect(() => {
    if (previewMode !== 'mobile') {
      x.set(0);
      y.set(0);
    }
  }, [previewMode, x, y]);

  const { setIsEditorCollapsed, saveDesign } = actions;

  // Pantau perubahan BASE THEME untuk memunculkan loading state
  // (Kita HANYA memunculkan loading saat Tema Dasar berganti, BUKAN saat ganti warna/font)
  useEffect(() => {
    const currentTemplate = livePreviewTheme?.themeTemplate;
    
    if (prevThemeRef.current !== null && currentTemplate !== prevThemeRef.current) {
      setIsChangingTheme(true);
      
      // Safety Fallback: Jika sinyal dari iframe hilang, paksa buka setelah 3 detik (3000ms)
      const timer = setTimeout(() => {
        setIsChangingTheme(false);
      }, 3000); 
      
      return () => clearTimeout(timer);
    }
    prevThemeRef.current = currentTemplate || null;
  }, [livePreviewTheme?.themeTemplate]);

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
      if (event.origin !== window.location.origin && !event.origin.includes('localhost') && !event.origin.includes('127.0.0.1')) return;

      if (event.data?.type === 'PREVIEW_READY') {
        iframeReady.current = true;
        sendDataToIframe();
      }
      
      // Terima sinyal "Selesai Dirakit" dari iframe
      if (event.data?.type === 'PREVIEW_RENDERED') {
        // Beri tambahan delay sangat sedikit (200ms) untuk memastikan transisi masuk React mulus
        setTimeout(() => setIsChangingTheme(false), 200);
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
        const availableHeight = containerRef.current.clientHeight - 40;
        const availableWidth = containerRef.current.clientWidth - 40;
        const scaleH = availableHeight / targetHeight;
        const scaleW = availableWidth / targetWidth;
        setMobileScale(Math.min(1.1, scaleH, scaleW));
      } else {
        setMobileScale(1);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [previewMode]);


  return (
    <div ref={containerRef} className={`flex-1 h-full w-full relative flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-10 ${previewMode === 'mobile' ? 'p-0 lg:p-4 lg:sm:p-6 lg:md:p-10' : 'p-0'}`}>



      {/* Editor Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 hidden lg:block"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />


      {/* DRAGGABLE WRAPPER FOR MOBILE MOCKUP */}
      <motion.div
        drag={!isMobileDevice && previewMode === 'mobile'}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={containerRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className={`z-10 flex flex-col shrink-0 ${
          !isMobileDevice && previewMode === 'mobile' 
            ? 'relative origin-top-left' 
            : 'absolute inset-0 w-full h-full items-center justify-center'
        }`}
        style={!isMobileDevice && previewMode === 'mobile' ? {
          x, y,
          width: 454 * mobileScale,
          height: 932 * mobileScale,
          touchAction: 'none'
        } : { x, y }}
      >
        {/* CONTAINER MOCKUP DEVICE */}
        <div
          className={`flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-visible relative
            ${isMobileDevice && previewMode === 'desktop' ? 'w-[90vw] h-[60vh]' : 'w-full h-full'}
            ${isMobileDevice && previewMode === 'mobile' ? 'bg-zinc-950' : ''}
            ${isMobileDevice && previewMode === 'desktop' ? 'bg-zinc-950 rounded-none shadow-2xl border border-white/10' : ''}
            ${!isMobileDevice ? (
                previewMode === 'desktop' 
                  ? 'bg-zinc-950 border-0 rounded-none' 
                  : 'shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-[12px] border-zinc-900 bg-black rounded-[2.5rem]'
              ) : ''
            }
          `}
          style={!isMobileDevice && previewMode === 'mobile' ? {
            width: '454px',
            height: '932px',
            transform: `scale(${mobileScale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0
          } : undefined}
        >
          {/* DRAG HANDLE (DYNAMIC ISLAND STYLE) */}
          {!isMobileDevice && previewMode === 'mobile' && (
            <div 
              className="absolute top-4 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-white/30 hover:bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors shadow-md z-[60] pointer-events-auto"
              onPointerDown={(e) => dragControls.start(e)}
              title="Tarik untuk memindahkan"
            />
          )}

          {/* DRAG OVERLAY TO PREVENT IFRAME SWALLOWING */}
          {isDragging && (
            <div className="absolute inset-0 z-50 rounded-[2rem] cursor-grabbing" />
          )}

          <div className="shrink-0 transition-all duration-700 z-20">
          </div>

          {/* IFRAME PREVIEW */}
          <div className={`flex-1 relative z-0 transition-all duration-700 overflow-hidden ${!isMobileDevice && previewMode === 'mobile' ? 'rounded-[1.5rem]' : ''} ${previewMode === 'desktop' || isMobileDevice ? 'bg-zinc-950' : 'bg-transparent'}`}>
          
          {/* THEME TRANSITION OVERLAY */}
          <AnimatePresence>
            {isChangingTheme && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 z-50 flex flex-col items-center justify-center ${previewMode === 'mobile' ? 'bg-[#050505]' : 'bg-zinc-950'}`}
              >
                {/* Clean Enterprise Spinner */}
                <div className="relative w-12 h-12 flex items-center justify-center mb-6">
                  <svg className="animate-spin w-10 h-10 text-white/20" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
                    <path className="opacity-90 text-white" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <p className="text-white/40 text-[9px] font-mono font-bold uppercase tracking-widest animate-pulse">
                  Menerapkan Tema...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <iframe
            ref={iframeRef}
            src="/preview"
            title="Portfolio Preview"
            sandbox="allow-scripts allow-same-origin allow-popups"
            style={!isMobileDevice && previewMode === 'desktop' ? {
              border: 'none',
              transformOrigin: 'top left',
              transform: `scale(${state.desktopZoom})`,
              width: `${(1 / state.desktopZoom) * 100}%`,
              height: `${(1 / state.desktopZoom) * 100}%`,
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
      </motion.div>


    </div>
  );
}
