import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

const ModelViewer = 'model-viewer' as any;

export function Viewfinder3DViewer({ mediaUrl, bgColor }: { mediaUrl: string, bgColor?: string }) {
  const [exposure, setExposure] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '1500px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Controls are always visible and interactive in the Viewfinder theme.
  const controlsClass = "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-full z-30 pointer-events-auto transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]";

  return (
    <div ref={containerRef} className="w-full h-full relative group/mv" style={bgColor ? { backgroundColor: bgColor } : {}}>
      {/* Load library in background regardless of view state for better performance */}
      <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" strategy="lazyOnload" />
      
      {inView ? (
        <>
          <ModelViewer
            src={mediaUrl}
            auto-rotate={autoRotate ? "" : null}
            camera-controls
            shadow-intensity="1"
            environment-image="neutral"
            exposure={exposure}
            loading="eager"
            reveal="auto"
            touch-action="pan-y"
            interaction-prompt="none"
            style={{ width: '100%', height: '100%', '--poster-color': 'transparent' } as any}
          >
            {/* Premium Loading Poster */}
            <div slot="poster" className="mv3d-loader absolute inset-0 flex flex-col items-center justify-center gap-4 z-10" style={{ background: bgColor || 'transparent' }}>
              <div className="mv3d-cube w-10 h-10 perspective-[200px]">
                <div className="mv3d-cube-inner w-full h-full relative" style={{ transformStyle: 'preserve-3d', animation: 'mv3d-spin 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite' }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="mv3d-face absolute w-full h-full border border-white/25 rounded-sm bg-white/5" style={{
                      transform: i === 0 ? 'rotateY(0deg) translateZ(20px)' :
                        i === 1 ? 'rotateY(90deg) translateZ(20px)' :
                          i === 2 ? 'rotateY(180deg) translateZ(20px)' :
                            i === 3 ? 'rotateY(270deg) translateZ(20px)' :
                              i === 4 ? 'rotateX(90deg) translateZ(20px)' :
                                'rotateX(-90deg) translateZ(20px)'
                    }}></div>
                  ))}
                </div>
              </div>
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase opacity-50 text-white">Loading 3D</span>
            </div>

            {/* Viewfinder-specific Floating Controls */}
            <div className={controlsClass}>
              {/* Exposure Control */}
              <div className="flex items-center gap-2 px-2 border-r border-white/10 select-none">
                {/* SVG Sun Icon */}
                <svg className="w-3.5 h-3.5 text-white/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <input
                  type="range" min="0.5" max="2" step="0.1"
                  value={exposure}
                  onChange={(e) => setExposure(parseFloat(e.target.value))}
                  className="w-14 @md:w-24 h-[3px] bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
              
              {/* Auto Rotate Control */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAutoRotate(!autoRotate);
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer pointer-events-auto ${autoRotate ? 'bg-white text-black' : 'bg-white/15 text-white hover:bg-white/25'}`}
                title="Toggle Auto-Rotate"
              >
                {/* SVG Rotate Icon */}
                <svg className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89" />
                </svg>
              </button>
            </div>
          </ModelViewer>
        </>
      ) : (
        /* Static Placeholder before viewport entrance */
        <div className="mv3d-loader absolute inset-0 flex flex-col items-center justify-center gap-4 z-10" style={{ background: bgColor || 'transparent' }}>
          <div className="mv3d-cube w-10 h-10 perspective-[200px]">
            <div className="mv3d-cube-inner w-full h-full relative" style={{ transformStyle: 'preserve-3d', animation: 'mv3d-spin 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mv3d-face absolute w-full h-full border border-white/20 rounded-sm bg-white/5" style={{
                  transform: i === 0 ? 'rotateY(0deg) translateZ(20px)' :
                    i === 1 ? 'rotateY(90deg) translateZ(20px)' :
                      i === 2 ? 'rotateY(180deg) translateZ(20px)' :
                        i === 3 ? 'rotateY(270deg) translateZ(20px)' :
                          i === 4 ? 'rotateX(90deg) translateZ(20px)' :
                            'rotateX(-90deg) translateZ(20px)'
                }}></div>
              ))}
            </div>
          </div>
          <span className="text-[9px] font-bold tracking-[0.25em] uppercase opacity-50 text-white">Ready to Load 3D</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes mv3d-spin { 0% { transform: rotateX(35deg) rotateY(0deg); } 100% { transform: rotateX(35deg) rotateY(360deg); } }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `
      }} />
    </div>
  );
}
