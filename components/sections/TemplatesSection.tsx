// app/components/sections/TemplatesSection.tsx
"use client";

import Link from 'next/link';
import { OptimizedLazyImage } from '@/shared/ui/OptimizedLazyImage';
import { TEMPLATE_LIST } from '@/shared/constants/constants';
import { useState, useRef, useEffect, useCallback } from 'react';

export function TemplatesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track active card on mobile scroll with IntersectionObserver
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('[data-card-index]');
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.cardIndex);
            if (!isNaN(idx)) setActiveCardIndex(idx);
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  // Scroll to a specific card when dot is clicked
  const scrollToCard = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>(`[data-card-index="${index}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, []);

  return (
    <section id="templates" className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-[#050505] overflow-hidden border-t border-white/10">
      
      {/* Subtle Background Glow (Absolute Noir Style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff9e00]/[0.015] blur-[150px] rounded-full pointer-events-none"></div>

      {/* Subtle Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      ></div>

      <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col h-full">
        
        {/* Clean Centered Header with Absolute Noir Style */}
        <div className="text-center mb-12 md:mb-20 px-6">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-4">[ ARCHITECTURES ]</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 uppercase">
            Engineered for <span className="text-[#ff9e00]">Brilliance.</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed font-mono uppercase tracking-tight">
            Swipe to explore on mobile, hover on desktop. Each architectural canvas is fully customizable.
          </p>
        </div>

        {/* Template Counter - Mobile Only */}
        <div className="flex md:hidden justify-between items-center px-6 mb-4">
          <span className="text-white/30 text-xs font-mono">
            <span className="text-[#ff9e00] text-sm font-bold">{String(activeCardIndex + 1).padStart(2, '0')}</span>
            <span className="mx-1">/</span>
            {String(TEMPLATE_LIST.length).padStart(2, '0')}
          </span>
          <span className="text-white/30 text-xs font-mono uppercase tracking-widest">
            {TEMPLATE_LIST[activeCardIndex]?.category}
          </span>
        </div>

        {/* Snap Scroll for Mobile, Accordion for Desktop */}
        <div 
          ref={scrollContainerRef}
          className="
            flex w-full gap-4 md:gap-3 
            overflow-x-auto md:overflow-visible snap-x snap-mandatory px-6 md:px-8 pb-4 md:pb-0
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            md:h-[65vh] md:min-h-[480px] md:max-h-[650px]
          "
        >
          {TEMPLATE_LIST.map((item, index) => {
            const isActive = hoveredIndex === index;
            const isMobileActive = activeCardIndex === index;
            
            return (
              <div 
                key={item.id}
                data-card-index={index}
                onMouseEnter={() => setHoveredIndex(index)}
                className={`
                  group relative rounded-none overflow-hidden cursor-pointer shrink-0
                  flex flex-col justify-end border transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]
                  
                  /* MOBILE: Card dimensions & snapping */
                  w-[85vw] sm:w-[65vw] aspect-square snap-center
                  
                  /* DESKTOP: Accordion logic override */
                  md:w-auto md:h-auto md:aspect-auto
                  ${isActive ? 'md:flex-[6] border-[#ff9e00]' : 'md:flex-[1.2] border-white/10'}
                  ${isMobileActive ? 'border-[#ff9e00]' : 'border-white/10'}
                `}
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                {/* Inner Container with bg */}
                <div className="absolute inset-0 rounded-none overflow-hidden bg-[#0a0a0a]">
                  
                  {/* Background Image with enhanced transitions */}
                  <OptimizedLazyImage 
                    src={item.image} 
                    alt={item.title} 
                    className={`
                      absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)]
                      grayscale contrast-[1.1]
                      /* Default (Mobile): Clear and visible with subtle zoom on active */
                      ${isMobileActive ? 'opacity-80 scale-102 grayscale-0' : 'opacity-40 scale-100'}
                      /* Desktop Logic: Conditional based on hover */
                      ${isActive ? 'md:opacity-85 md:scale-102 md:grayscale-0' : 'md:opacity-20 md:scale-105 md:grayscale'}
                    `}
                  />

                  {/* Multi-layer Gradient Overlay */}
                  <div className={`
                    absolute inset-0 transition-opacity duration-700
                    bg-gradient-to-t from-black via-black/80 to-transparent
                    ${isMobileActive ? 'opacity-90' : 'opacity-95'}
                    ${isActive ? 'md:opacity-90' : 'md:opacity-100'}
                  `}></div>

                  {/* Floating Card Number */}
                  <div className={`
                    absolute top-5 left-5 md:top-6 md:left-6 z-10 font-mono
                    transition-all duration-700
                    ${isMobileActive ? 'opacity-80' : 'opacity-30'}
                    ${isActive ? 'md:opacity-80 md:translate-y-0' : 'md:opacity-0 md:translate-y-4'}
                  `}>
                    <span className="text-[#ff9e00] text-xs font-mono tracking-widest font-bold">
                      [{String(index + 1).padStart(2, '0')}]
                    </span>
                  </div>

                  {/* State 1: Compressed (Desktop ONLY, completely hidden on mobile) */}
                  <div className={`
                    absolute inset-0 hidden md:flex items-center justify-center
                    transition-all duration-700
                    ${isActive ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100 delay-200'}
                  `}>
                    <h3 className="text-white/60 font-mono text-xs uppercase tracking-[0.35em] -rotate-90 whitespace-nowrap group-hover:text-[#ff9e00] transition-colors duration-500">
                      {item.title}
                    </h3>
                  </div>

                  {/* State 2: Expanded Details */}
                  <div className={`
                    absolute bottom-0 inset-x-0 z-30
                    /* MOBILE: Translucent bottom bar for clean layout separation */
                    bg-[#050505]/95 border-t border-white/10 p-4 flex items-center justify-between gap-4
                    /* DESKTOP: Traditional absolute spacious overlay */
                    md:absolute md:inset-0 md:bg-transparent md:border-t-0 md:p-10 md:flex md:flex-col md:justify-end md:h-full md:w-full md:gap-0
                    
                    transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]
                    /* Desktop Logic */
                    ${isActive ? 'md:opacity-100 md:translate-y-0 md:delay-100' : 'md:opacity-0 md:translate-y-12 md:pointer-events-none md:absolute md:bottom-0'}
                  `}>
                    <div className="flex flex-row md:flex-col justify-between items-center md:items-stretch md:justify-end gap-3 md:gap-0 w-full md:h-full">
                      <div className="max-w-xl min-w-0 flex-1 md:flex-none">
                        {/* Category Tag */}
                        <p className="text-[#ff9e00] font-mono text-[9px] uppercase tracking-[0.2em] mb-1 md:mb-3 flex items-center gap-1.5 md:gap-2.5">
                          <span className={`
                            h-[1px] bg-gradient-to-r from-[#ff9e00] to-transparent transition-all duration-700
                            ${isMobileActive ? 'w-6' : 'w-4'}
                            ${isActive ? 'md:w-10' : 'md:w-0'}
                          `}></span>
                          {item.category}
                        </p>
                        
                        {/* Title */}
                        <h3 className={`
                          text-base md:text-2xl font-black uppercase tracking-widest mb-0.5 md:mb-2 leading-snug
                          transition-all duration-500 truncate md:whitespace-normal
                          ${isMobileActive ? 'text-white' : 'text-white/70'}
                          md:text-white
                        `}>
                          {item.title}
                        </h3>
                        
                        {/* Description - Desktop only */}
                        <p className={`
                          text-white/40 text-xs hidden md:block max-w-sm leading-relaxed mt-2 font-mono uppercase tracking-tight
                          transition-all duration-500 delay-100
                          ${isActive ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-4'}
                        `}>
                          Architectural template design context. Click button to explore layout parameters.
                        </p>
                      </div>
                      
                      {/* Action Button */}
                      <Link 
                        href={`/templates`} 
                        className={`
                          shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-none 
                          flex items-center justify-center border
                          transition-all duration-300 
                          ${isMobileActive 
                            ? 'bg-[#ff9e00] border-[#ff9e00] text-black scale-100' 
                            : 'bg-black border-white/10 text-white/40 scale-90'}
                          md:bg-black md:border-white/10 md:text-white md:scale-100
                          md:hover:bg-[#ff9e00] md:hover:border-[#ff9e00] md:hover:text-black
                          group/btn
                        `}
                      >
                        <i className="fas fa-arrow-right -rotate-45 group-hover/btn:rotate-0 transition-transform duration-500 text-sm"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Dot Indicators */}
        <div className="flex md:hidden justify-center items-center gap-2 mt-6 px-6">
          {TEMPLATE_LIST.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              aria-label={`Go to template ${index + 1}`}
              className={`
                h-1.5 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-none
                ${activeCardIndex === index 
                  ? 'w-8 bg-[#ff9e00]' 
                  : 'w-2 bg-white/15 hover:bg-white/30'}
              `}
            />
          ))}
        </div>

        {/* Global Action Button */}
        <div className="mt-10 md:mt-16 flex justify-center pb-0 px-6">
            <Link href="/templates" className="group relative flex items-center gap-4 px-8 py-4 rounded-none border border-white/10 text-white font-mono text-xs uppercase tracking-widest font-bold hover:border-white hover:bg-white hover:text-black transition-all duration-300 w-full md:w-auto justify-center overflow-hidden">
              <span className="relative z-10">View Template Gallery</span>
              <i className="fas fa-arrow-right relative z-10 group-hover:translate-x-1 transition-transform"></i>
            </Link>
        </div>
        
      </div>
    </section>
  );
}