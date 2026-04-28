"use client";

import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
        entry.target.classList.remove('opacity-0', 'translate-y-12', 'scale-[0.98]');
      }
    }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

    el.classList.add(
      'transition-all', 
      'duration-[1000ms]', 
      'ease-[cubic-bezier(0.22,1,0.36,1)]', 
      'opacity-0', 
      'translate-y-12', 
      'scale-[0.98]', 
      'will-change-transform', 
      'will-change-opacity'
    );
    
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return ref;
}
