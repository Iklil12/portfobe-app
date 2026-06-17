"use client";

import React, { useEffect, useState, useRef } from 'react';

interface GlobalCursorProps {
  enabled?: boolean;
  type?: string; // 'circle-dot' | 'solid-dot'
}

export function GlobalCursor({ enabled = false, type = 'circle-dot' }: GlobalCursorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(true);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  // Simpan posisi mouse terbaru
  const mouseRef = useRef({ x: 0, y: 0 });
  // Simpan posisi ring saat ini (untuk efek delay)
  const ringRef = useRef({ x: 0, y: 0 });
  // Ref untuk hover state agar terbaca instan di render loop
  const isHoveredRef = useRef(false);

  // Ref untuk animasi scale kursor yang smooth menggunakan LERP
  const scaleDotRef = useRef(1);
  const scaleRingRef = useRef(1);

  // 1. Deteksi apakah perangkat memiliki mouse/trackpad (fine pointer) secara dinamis
  useEffect(() => {
    const mediaQuery = window.matchMedia('(any-pointer: fine)');
    setHasFinePointer(mediaQuery.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setHasFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', handlePointerChange);
    return () => {
      mediaQuery.removeEventListener('change', handlePointerChange);
    };
  }, []);

  const isCursorActive = enabled && hasFinePointer;

  useEffect(() => {
    if (!isCursorActive) {
      document.documentElement.style.cursor = 'auto';
      return;
    }

    // Terapkan cursor: none ke document element
    document.documentElement.style.cursor = 'none';
    
    // Tambahkan style global untuk menyembunyikan kursor bawaan pada semua elemen
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      * {
        cursor: none !important;
      }
      iframe {
        cursor: auto !important; /* Biarkan iframe default jika ada */
      }
    `;
    document.head.appendChild(styleEl);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Deteksi hover menggunakan closest match
      const target = e.target as Element;
      const hoverActive = !!target?.closest('a, button, [role="button"], input, textarea, select, .interactive-hover');
      if (hoverActive !== isHoveredRef.current) {
        setIsHovered(hoverActive);
        isHoveredRef.current = hoverActive;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animasi lerp (smooth follow) untuk ring kursor
    let animationFrameId: number;
    const render = () => {
      const isCircleDot = type === 'circle-dot';
      const isNeonPointer = type === 'neon-pointer';
      const isPaperPlane = type === 'paper-plane';
      
      const targetScaleDot = isHoveredRef.current 
        ? (isCircleDot ? 2.5 : (isNeonPointer || isPaperPlane) ? 1.25 : 2) 
        : 1;
      const targetScaleRing = isHoveredRef.current ? 1.5 : 1;

      // LERP untuk transisi scale kursor agar super smooth
      scaleDotRef.current += (targetScaleDot - scaleDotRef.current) * 0.2;
      scaleRingRef.current += (targetScaleRing - scaleRingRef.current) * 0.2;
      
      // Posisi dot (instan)
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0) scale(${scaleDotRef.current})`;
      }

      // Posisi ring (lerp/lambat)
      if (cursorRingRef.current) {
        const ease = 0.15; // Kecepatan follow (makin kecil makin lambat/smooth)
        ringRef.current.x += (mouseRef.current.x - ringRef.current.x) * ease;
        ringRef.current.y += (mouseRef.current.y - ringRef.current.y) * ease;
        cursorRingRef.current.style.transform = `translate3d(${ringRef.current.x}px, ${ringRef.current.y}px, 0) scale(${scaleRingRef.current})`;
        
        // Update warna & border ring
        cursorRingRef.current.style.backgroundColor = isHoveredRef.current ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
        cursorRingRef.current.style.borderColor = isHoveredRef.current ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)';
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
      document.documentElement.style.cursor = 'auto';
      if (styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [isCursorActive, isVisible, type]);

  if (!isCursorActive || !isVisible) return null;

  const isCircleDot = type === 'circle-dot';
  const isSolidDot = type === 'solid-dot';
  const isNeonPointer = type === 'neon-pointer';
  const isPaperPlane = type === 'paper-plane';

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* 1. KURSOR UTAMA (DOT) */}
      {(isCircleDot || isSolidDot) && (
        <div
          ref={cursorDotRef}
          className={`fixed top-0 left-0 rounded-full bg-white border border-black/20 shadow-sm ${
            isCircleDot 
              ? 'w-1.5 h-1.5 -ml-0.75 -mt-0.75' 
              : 'w-3 h-3 -ml-1.5 -mt-1.5'
          }`}
          style={{
            transform: `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0)`,
          }}
        />
      )}

      {/* 1b. KURSOR UTAMA (NEON POINTER) */}
      {isNeonPointer && (
        <div
          ref={cursorDotRef}
          className="fixed top-0 left-0"
          style={{
            transform: `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0)`,
            marginLeft: '-3px',
            marginTop: '-3px',
            width: '32px',
            height: '32px',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" style={{ overflow: 'visible' }}>
            <defs>
              <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Glow layer (Red neon glow) */}
            <path 
              d="M3 3 L13.5 13.5 L8.5 13.5 L11.5 20 L9.5 21 L6.5 14.5 L3 17 Z" 
              fill="transparent" 
              stroke="#ff0000" 
              strokeWidth="3" 
              filter="url(#neon-glow)"
            />
            {/* Foreground path (Black fill, Red stroke) */}
            <path 
              d="M3 3 L13.5 13.5 L8.5 13.5 L11.5 20 L9.5 21 L6.5 14.5 L3 17 Z" 
              fill="#000000" 
              stroke="#ff0000" 
              strokeWidth="1.5" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* 1c. KURSOR UTAMA (RETRO PAPER PLANE) */}
      {isPaperPlane && (
        <div
          ref={cursorDotRef}
          className="fixed top-0 left-0"
          style={{
            transform: `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0)`,
            marginLeft: '-2px',
            marginTop: '-2px',
            width: '32px',
            height: '32px',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ overflow: 'visible' }}>
            {/* 1. Badan pesawat kertas utama (putih dengan border hitam tebal) */}
            <path 
              d="M2 2 L20 8 L12 12 L8 20 Z" 
              fill="white" 
              stroke="black" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
            />
            {/* 2. Bagian bawah sayap / keel (hitam) di atas badan */}
            <path 
              d="M2 2 L8 20 L5 12 Z" 
              fill="black" 
              stroke="black" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
            />
            {/* Garis lipatan tengah */}
            <path 
              d="M2 2 L12 12" 
              stroke="black" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
            />
          </svg>
        </div>
      )}

      {/* 2. RING KURSOR (Hanya jika tipe 'circle-dot') */}
      {isCircleDot && (
        <div
          ref={cursorRingRef}
          className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-white/60 shadow-[0_0_0_1px_rgba(0,0,0,0.15)] rounded-full"
          style={{
            transform: `translate3d(${ringRef.current.x}px, ${ringRef.current.y}px, 0)`,
          }}
        />
      )}
    </div>
  );
}
