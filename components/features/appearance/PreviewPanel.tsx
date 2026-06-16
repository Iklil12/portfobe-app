//components/features/appearance/PreviewPanel.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, ChevronLeft, Undo2, Redo2, Monitor, 
  Smartphone, Minus, Plus, Save, ExternalLink, Lock, Loader2, GripHorizontal 
} from 'lucide-react';
import { motion, AnimatePresence, useDragControls, useMotionValue, MotionValue } from 'framer-motion';

const ResizeHandle = ({ 
  corner, 
  currentScale, 
  onScaleChange,
  motionX,
  motionY
}: { 
  corner: 'tl' | 'tr' | 'bl' | 'br', 
  currentScale: number, 
  onScaleChange: (scale: number) => void,
  motionX: MotionValue<number>,
  motionY: MotionValue<number>
}) => {
  const [isResizing, setIsResizing] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    
    setIsResizing(true);
    const startY = e.clientY;
    const startX = e.clientX;
    const startScale = currentScale;
    const initialMotionX = motionX.get();
    const initialMotionY = motionY.get();

    const handlePointerMove = (moveEvent: PointerEvent) => {
      let deltaY = moveEvent.clientY - startY;
      let deltaX = moveEvent.clientX - startX;
      
      if (corner === 'tr' || corner === 'tl') deltaY = -deltaY;
      if (corner === 'bl' || corner === 'tl') deltaX = -deltaX;
      
      const scaleChangeY = deltaY / 932;
      const scaleChangeX = deltaX / 454;
      const scaleChange = Math.abs(scaleChangeX) > Math.abs(scaleChangeY) ? scaleChangeX : scaleChangeY;
      
      let newScale = startScale + scaleChange;
      if (newScale < 0.25) newScale = 0.25;
      if (newScale > 1.5) newScale = 1.5;
      
      onScaleChange(newScale);

      const diffW = (newScale - startScale) * 454;
      const diffH = (newScale - startScale) * 932;

      if (corner === 'tl') {
        motionX.set(initialMotionX - diffW);
        motionY.set(initialMotionY - diffH);
      } else if (corner === 'tr') {
        motionY.set(initialMotionY - diffH);
      } else if (corner === 'bl') {
        motionX.set(initialMotionX - diffW);
      }
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      target.releasePointerCapture(upEvent.pointerId);
      setIsResizing(false);
      target.removeEventListener('pointermove', handlePointerMove);
      target.removeEventListener('pointerup', handlePointerUp);
    };

    target.addEventListener('pointermove', handlePointerMove);
    target.addEventListener('pointerup', handlePointerUp);
  };

  const getPositionClass = () => {
    switch (corner) {
      case 'tl': return '-top-4 -left-4 cursor-nwse-resize';
      case 'tr': return '-top-4 -right-4 cursor-nesw-resize';
      case 'bl': return '-bottom-4 -left-4 cursor-nesw-resize';
      case 'br': return '-bottom-4 -right-4 cursor-nwse-resize';
    }
  }

  return (
    <div 
      className={`absolute w-8 h-8 z-[80] ${getPositionClass()}`}
      onPointerDown={handlePointerDown}
    />
  )
}
import type { ThemeEditorState, ThemeEditorActions } from '@/hooks/useThemeEditor';

export function PreviewPanel({ 
  state, 
  actions,
  activeTab = 'theme',
  selectedPage = 'gallery'
}: { 
  state: ThemeEditorState, 
  actions: ThemeEditorActions,
  activeTab?: 'theme' | 'pages',
  selectedPage?: 'home' | 'gallery'
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mobileIframeRef = useRef<HTMLIFrameElement>(null);
  const dragControls = useDragControls();
  const splitMobileDragControls = useDragControls();
  const iframeReady = useRef(false);
  const mobileIframeReady = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileScale, setMobileScale] = useState(1);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringHandle, setIsHoveringHandle] = useState(false);
  const [isHoveringSplitHandle, setIsHoveringSplitHandle] = useState(false);
  const [userMobileScale, setUserMobileScale] = useState<number | null>(null);
  const [userSplitMobileScale, setUserSplitMobileScale] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const splitMobileX = useMotionValue(0);
  const splitMobileY = useMotionValue(0);
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
    subdomain,
    isLive,
    livePreviewData,
    livePreviewTheme,
    previewMode
  } = state;

  useEffect(() => {
    if (previewMode === 'desktop') {
      x.set(0);
      y.set(0);
    }
    if (previewMode !== 'split' || state.splitModeType === 'fixed') {
      x.set(0);
      y.set(0);
      splitMobileX.set(0);
      splitMobileY.set(0);
    }
  }, [previewMode, state.splitModeType, x, y, splitMobileX, splitMobileY]);

  const { setIsEditorCollapsed } = actions;

  useEffect(() => {
    const currentTemplate = livePreviewTheme?.themeTemplate;
    
    if (prevThemeRef.current !== null && currentTemplate !== prevThemeRef.current) {
      setIsChangingTheme(true);
      
      // Limit spinner to 5 seconds max if iframe rendering gets stuck
      const timer = setTimeout(() => {
        setIsChangingTheme(false);
      }, 5000); 
      
      return () => clearTimeout(timer);
    }
    prevThemeRef.current = currentTemplate || null;
  }, [livePreviewTheme?.themeTemplate]);

  const dataRef = useRef(livePreviewData);
  const themeRef = useRef(livePreviewTheme);
  const activeTabRef = useRef(activeTab);
  const selectedPageRef = useRef(selectedPage);

  useEffect(() => {
    dataRef.current = livePreviewData;
    themeRef.current = livePreviewTheme;
    activeTabRef.current = activeTab;
    selectedPageRef.current = selectedPage;
  }, [livePreviewData, livePreviewTheme, activeTab, selectedPage]);

  const sendDataToIframe = useCallback(() => {
    if (iframeRef.current?.contentWindow && iframeReady.current) {
      iframeRef.current.contentWindow.postMessage({
        type: 'PREVIEW_UPDATE',
        data: dataRef.current,
        theme: themeRef.current,
        activeTab: activeTabRef.current,
        selectedPage: selectedPageRef.current,
        isMobileView: false
      }, window.location.origin);
    }
    if (mobileIframeRef.current?.contentWindow && mobileIframeReady.current) {
      mobileIframeRef.current.contentWindow.postMessage({
        type: 'PREVIEW_UPDATE',
        data: dataRef.current,
        theme: themeRef.current,
        activeTab: activeTabRef.current,
        selectedPage: selectedPageRef.current,
        isMobileView: true
      }, window.location.origin);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin && !event.origin.includes('localhost') && !event.origin.includes('127.0.0.1')) return;

      if (event.data?.type === 'PREVIEW_READY') {
        if (event.source === mobileIframeRef.current?.contentWindow) {
          mobileIframeReady.current = true;
        } else {
          iframeReady.current = true;
        }
        sendDataToIframe();
      }
      
      if (event.data?.type === 'PREVIEW_RENDERED') {
        setTimeout(() => setIsChangingTheme(false), 200);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendDataToIframe]);

  useEffect(() => {
    const timer = setTimeout(() => {
      sendDataToIframe();
    }, 100);
    return () => clearTimeout(timer);
  }, [livePreviewData, livePreviewTheme, activeTab, selectedPage, sendDataToIframe]);

  useEffect(() => {
    const calculateScale = () => {
      if ((previewMode === 'mobile' || previewMode === 'split') && containerRef.current) {
        const targetWidth = 454;
        const targetHeight = 932;
        const availableHeight = containerRef.current.clientHeight - 40;
        let availableWidth = containerRef.current.clientWidth - 40;
        
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

  const activeMobileScale = userMobileScale !== null ? userMobileScale : mobileScale;
  const activeSplitMobileScale = userSplitMobileScale !== null ? userSplitMobileScale : 1;

  return (
    <div ref={containerRef} className={`flex-1 h-full w-full relative flex flex-row items-center justify-center overflow-hidden z-10 ${previewMode === 'mobile' || (previewMode === 'split' && state.splitModeType === 'flexible') ? 'p-0 lg:p-4 lg:sm:p-6 lg:md:p-10' : 'p-0'}`}>

      <div 
        className="absolute inset-0 pointer-events-none z-0 hidden lg:block"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <motion.div
        drag={!isMobileDevice && ((previewMode === 'mobile') || (previewMode === 'split' && state.splitModeType === 'flexible'))}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={containerRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        tabIndex={-1}
        className={`z-10 flex flex-col shrink-0 outline-none focus:outline-none focus-visible:outline-none select-none ${
          !isMobileDevice && previewMode === 'mobile' 
            ? 'relative origin-top-left' 
            : !isMobileDevice && previewMode === 'split' && state.splitModeType === 'flexible'
            ? `relative rounded-2xl overflow-hidden shrink-0 border ${isHoveringHandle || isDragging ? 'shadow-[0_0_0_2px_#007bff] border-[#007bff]' : 'shadow-2xl border-white/10'}`
            : !isMobileDevice && previewMode === 'split' && state.splitModeType === 'fixed'
            ? 'relative flex-1 h-full items-center justify-center overflow-hidden'
            : 'absolute inset-0 w-full h-full items-center justify-center'
        }`}
        style={!isMobileDevice && previewMode === 'mobile' ? {
          x, y,
          width: 454 * activeMobileScale,
          height: 932 * activeMobileScale,
          touchAction: 'none',
          outline: 'none'
        } : !isMobileDevice && previewMode === 'split' && state.splitModeType === 'flexible' ? {
          x, y,
          width: 1280,
          height: 800,
          touchAction: 'none',
          outline: 'none'
        } : { x, y, outline: 'none' }}
      >
        <div
          className={`flex flex-col overflow-visible relative
            ${isMobileDevice && previewMode === 'desktop' ? 'w-[90vw] h-[60vh]' : 'w-full h-full'}
            ${isMobileDevice && previewMode === 'mobile' ? 'bg-zinc-950' : ''}
            ${isMobileDevice && previewMode === 'desktop' ? 'bg-zinc-950 rounded-none shadow-2xl border border-white/10' : ''}
            ${!isMobileDevice ? (
                previewMode === 'mobile' 
                  ? `group border-[12px] border-zinc-900 bg-black rounded-[2.5rem] transition-shadow duration-300 ${isHoveringHandle || isDragging ? 'shadow-[0_0_0_2px_#007bff,0_20px_60px_rgba(0,0,0,0.6)]' : 'shadow-[0_20px_60px_rgba(0,0,0,0.6)]'}`
                  : previewMode === 'split'
                  ? 'bg-zinc-950 border-0 rounded-none' 
                  : 'bg-zinc-950 border-0 rounded-none' 
              ) : ''
            }
          `}
          style={!isMobileDevice && previewMode === 'mobile' ? {
            width: '454px',
            height: '932px',
            transform: `scale(${activeMobileScale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0
          } : !isMobileDevice && previewMode === 'split' ? {
            width: '100%',
            height: '100%',
          } : undefined}
        >
          {!isMobileDevice && previewMode === 'mobile' && (
            <div 
              className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black hover:bg-zinc-950 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[60] pointer-events-auto outline-none focus:outline-none ring-1 ring-white/5"
              onPointerDown={(e) => dragControls.start(e)}
              onPointerEnter={() => setIsHoveringHandle(true)}
              onPointerLeave={() => setIsHoveringHandle(false)}
              title="Tarik untuk memindahkan"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full pointer-events-none absolute left-1/2 -translate-x-1/2" />
              <div className="absolute right-2.5 w-3 h-3 rounded-full bg-[#111] border border-white/[0.03] shadow-[inset_0_0_4px_rgba(255,255,255,0.1)] pointer-events-none" />
            </div>
          )}
          {!isMobileDevice && previewMode === 'split' && state.splitModeType === 'flexible' && (
            <div 
              className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black hover:bg-zinc-950 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[60] pointer-events-auto outline-none focus:outline-none ring-1 ring-white/5"
              onPointerDown={(e) => dragControls.start(e)}
              onPointerEnter={() => setIsHoveringHandle(true)}
              onPointerLeave={() => setIsHoveringHandle(false)}
              title="Tarik untuk memindahkan"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full pointer-events-none absolute left-1/2 -translate-x-1/2" />
              <div className="absolute right-2.5 w-3 h-3 rounded-full bg-[#111] border border-white/[0.03] shadow-[inset_0_0_4px_rgba(255,255,255,0.1)] pointer-events-none" />
            </div>
          )}

          {isDragging && (
            <div className="absolute inset-0 z-50 rounded-[2rem] cursor-grabbing" />
          )}

          {!isMobileDevice && previewMode === 'mobile' && (
            <>
              <ResizeHandle corner="tl" currentScale={activeMobileScale} onScaleChange={setUserMobileScale} motionX={x} motionY={y} />
              <ResizeHandle corner="tr" currentScale={activeMobileScale} onScaleChange={setUserMobileScale} motionX={x} motionY={y} />
              <ResizeHandle corner="bl" currentScale={activeMobileScale} onScaleChange={setUserMobileScale} motionX={x} motionY={y} />
              <ResizeHandle corner="br" currentScale={activeMobileScale} onScaleChange={setUserMobileScale} motionX={x} motionY={y} />
            </>
          )}

          <div className={`flex-1 relative z-0 overflow-hidden ${!isMobileDevice && previewMode === 'mobile' ? 'rounded-[1.5rem]' : ''} ${previewMode === 'desktop' || isMobileDevice ? 'bg-zinc-950' : 'bg-transparent'}`}>
          
          <AnimatePresence>
            {isChangingTheme && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 z-50 flex flex-col items-center justify-center ${previewMode === 'mobile' ? 'bg-[#050505]' : 'bg-zinc-950'}`}
              >
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
              transform: `scale(${Math.max(0.1, state.desktopZoom)})`,
              width: `${(1 / Math.max(0.1, state.desktopZoom)) * 100}%`,
              height: `${(1 / Math.max(0.1, state.desktopZoom)) * 100}%`,
            } : !isMobileDevice && previewMode === 'split' ? {
              border: 'none',
              transformOrigin: 'top left',
              transform: `scale(1)`,
              width: state.splitModeType === 'fixed' ? `100%` : '1280px',
              height: state.splitModeType === 'fixed' ? `100%` : '800px',
            } : isMobileDevice && (previewMode === 'desktop' || previewMode === 'split') ? {
              border: 'none',
              transformOrigin: 'top left',
              transform: `scale(${Math.max(0.1, (windowWidth * 0.9) / 1024)})`,
              width: `${(1 / Math.max(0.1, (windowWidth * 0.9) / 1024)) * 100}%`,
              height: `${(1 / Math.max(0.1, (windowWidth * 0.9) / 1024)) * 100}%`,
            } : {
              border: 'none',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
        </div>
      </motion.div>

      <motion.div
        drag={state.splitModeType === 'flexible'}
        dragControls={splitMobileDragControls}
        dragListener={false}
        dragConstraints={containerRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        tabIndex={-1}
        className={`z-10 outline-none focus:outline-none focus-visible:outline-none select-none ${state.splitModeType === 'fixed' ? 'relative h-full border-l border-white/10 bg-zinc-950' : `group relative ml-8 border-[12px] border-zinc-900 bg-black rounded-[2.5rem] transition-shadow duration-300 ${isHoveringSplitHandle || isDragging ? 'shadow-[0_0_0_2px_#007bff,0_20px_60px_rgba(0,0,0,0.6)]' : 'shadow-[0_20px_60px_rgba(0,0,0,0.6)]'}`} shrink-0 overflow-hidden ${!isMobileDevice && previewMode === 'split' ? '' : 'absolute pointer-events-none -z-[100] opacity-[0.01] -left-[9999px]'}`}
        style={state.splitModeType === 'fixed' ? {
          width: 454,
          height: '100%',
          touchAction: 'auto',
          outline: 'none'
        } : {
          x: splitMobileX,
          y: splitMobileY,
          width: 454 * activeSplitMobileScale,
          height: 932 * activeSplitMobileScale,
          touchAction: 'none',
          outline: 'none'
        }}
      >
        {state.splitModeType === 'flexible' && (
          <div 
            className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black hover:bg-zinc-950 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[60] pointer-events-auto outline-none focus:outline-none ring-1 ring-white/5"
            onPointerDown={(e) => splitMobileDragControls.start(e)}
            onPointerEnter={() => setIsHoveringSplitHandle(true)}
            onPointerLeave={() => setIsHoveringSplitHandle(false)}
            title="Tarik untuk memindahkan"
          >
            <div className="w-10 h-1 bg-white/20 rounded-full pointer-events-none absolute left-1/2 -translate-x-1/2" />
            <div className="absolute right-2.5 w-3 h-3 rounded-full bg-[#111] border border-white/[0.03] shadow-[inset_0_0_4px_rgba(255,255,255,0.1)] pointer-events-none" />
          </div>
        )}
        
        {state.splitModeType === 'flexible' && (
          <>
            <ResizeHandle corner="tl" currentScale={activeSplitMobileScale} onScaleChange={setUserSplitMobileScale} motionX={splitMobileX} motionY={splitMobileY} />
            <ResizeHandle corner="tr" currentScale={activeSplitMobileScale} onScaleChange={setUserSplitMobileScale} motionX={splitMobileX} motionY={splitMobileY} />
            <ResizeHandle corner="bl" currentScale={activeSplitMobileScale} onScaleChange={setUserSplitMobileScale} motionX={splitMobileX} motionY={splitMobileY} />
            <ResizeHandle corner="br" currentScale={activeSplitMobileScale} onScaleChange={setUserSplitMobileScale} motionX={splitMobileX} motionY={splitMobileY} />
          </>
        )}

        {isDragging && state.splitModeType === 'flexible' && (
          <div className="absolute inset-0 z-50 rounded-[2rem] cursor-grabbing" />
        )}
        <div className="w-full h-full relative" style={{
          transform: state.splitModeType === 'flexible' ? `scale(${activeSplitMobileScale})` : 'scale(1)',
          transformOrigin: 'top left',
          width: state.splitModeType === 'fixed' ? `100%` : '454px',
          height: state.splitModeType === 'fixed' ? `100%` : '932px'
        }}>
           <iframe
             ref={mobileIframeRef}
             src="/preview"
             title="Mobile Preview Split"
             sandbox="allow-scripts allow-same-origin allow-popups"
             className="w-full h-full pointer-events-auto"
             style={{
               pointerEvents: isDragging ? 'none' : 'auto',
               border: 'none'
             }}
           />
        </div>
      </motion.div>
    </div>
  );
}
