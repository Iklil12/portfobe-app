"use client";

import React, { useRef, useState, useEffect } from 'react';

export function LazyMobilePillar({ children, height = '400px' }: { children: React.ReactNode; height?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect(); // Once visible, stop observing — component stays mounted
        }
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: hasEnteredView ? undefined : height }}>
      {hasEnteredView ? (
        children
      ) : (
        <div className="w-full flex items-center justify-center" style={{ height }}>
          <div className="flex flex-col items-center gap-3 opacity-30">
            <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
            <div className="w-24 h-1.5 rounded-full bg-white/5 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
