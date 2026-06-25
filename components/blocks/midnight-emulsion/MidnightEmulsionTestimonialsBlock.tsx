"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';

export function MidnightEmulsionTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const getCardShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-3xl';
  };
  const cardShape = getCardShapeClass(theme?.buttonShape);

  const getCardStyleClass = (style?: string) => {
      if (style === 'hard' || style === 'hard-shadow') return 'border border-white/20 bg-[#030508] shadow-[4px_4px_0_0_rgba(255,255,255,0.1)]';
      if (style === 'flat') return 'border border-white/10 bg-transparent';
      if (style === 'soft-shadow' || style === 'soft') return 'border border-white/5 bg-[#080b11] shadow-[0_10px_40px_rgba(0,0,0,0.5)]';
      return 'border border-white/10 bg-[#06080c] shadow-2xl';
  };
  const cardStyleClass = getCardStyleClass(theme?.cardStyle);

  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

  const canvasEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: canvasEase } }
  };

  if (!testimonials.length) return null;

  return (
    <div className="w-full py-24 @md:py-32 px-8 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508] relative overflow-hidden @container">
      {/* Decorative ambient lights */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-[var(--hl)] opacity-5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-16">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-4 block">
            <EditableText value={theme?.customTexts?.midnight_testi_top || 'Client Experience'} field="midnight_testi_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
          </span>
          <h2 className="font-serif text-4xl @md:text-6xl text-white uppercase tracking-wide">
            <EditableText value={theme?.customTexts?.midnight_testi_title || 'Endorsements'} field="midnight_testi_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </h2>
        </motion.div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-8 @md:gap-12">
          {testimonials.map((t: any, i: number) => {
            const indexStr = (i + 1).toString().padStart(2, '0');
            return (
              <motion.div
                key={t.id || i}
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                className={`group flex flex-col p-8 @md:p-12 ${cardStyleClass} ${cardShape} hover:border-[var(--hl)]/20 transition-all duration-700 relative overflow-hidden`}
              >
                {/* Scanning line sweep on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--hl)]/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-out pointer-events-none z-0" />
                
                {/* Viewfinder brackets inside the card */}
                <div className="absolute inset-2 pointer-events-none z-10 opacity-30 group-hover:opacity-60 transition-opacity duration-700">
                  <div className="absolute top-0 left-0 border-t border-l border-white/20 group-hover:border-[var(--hl)] w-2.5 h-2.5 transition-colors"></div>
                  <div className="absolute top-0 right-0 border-t border-r border-white/20 group-hover:border-[var(--hl)] w-2.5 h-2.5 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 border-b border-l border-white/20 group-hover:border-[var(--hl)] w-2.5 h-2.5 transition-colors"></div>
                  <div className="absolute bottom-0 right-0 border-b border-r border-white/20 group-hover:border-[var(--hl)] w-2.5 h-2.5 transition-colors"></div>
                </div>

                {/* Card Header metadata */}
                <div className="flex justify-between items-center mb-8 relative z-10 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                  <span>LOG // REC_{indexStr}</span>
                  <span className="flex items-center gap-1.5 text-[var(--hl)] bg-[var(--hl)]/5 px-2.5 py-0.5 rounded border border-[var(--hl)]/10 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--hl)] animate-pulse"></span>
                    Verified Client
                  </span>
                </div>
                
                <p className="font-serif italic text-lg @md:text-xl text-slate-200 leading-relaxed mb-12 relative z-10">
                  "{t.content}"
                </p>
                
                {/* Client Profile details footer */}
                <div className="flex items-center gap-4 relative z-10 mt-auto border-t border-white/5 pt-8">
                  <div className={`w-12 h-12 ${btnShape} overflow-hidden shrink-0 border border-white/10 group-hover:border-white/20 transition-colors shadow-lg`}>
                    {t.avatarUrl ? (
                      <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center font-sans font-bold text-white text-lg">
                        {t.clientName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h4 className="font-sans font-bold text-white group-hover:text-[var(--hl)] transition-colors duration-300 tracking-wide truncate">
                      {t.clientName}
                    </h4>
                    {t.company && (
                      <p className="font-sans text-[9px] uppercase tracking-widest text-slate-500 truncate">
                        {t.company}
                      </p>
                    )}
                  </div>
                  
                  {/* Rating Blocks */}
                  <div className="ml-auto flex items-center gap-1.5 shrink-0 bg-white/[0.02] border border-white/5 rounded px-2.5 py-1 font-mono text-[9px] text-slate-400">
                    <span className="text-[8px] uppercase tracking-wider text-slate-500 mr-1 font-bold">RATING</span>
                    {[...Array(5)].map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-1.5 h-3 rounded-[1px] transition-all duration-500 ${
                          idx < t.rating ? 'bg-[var(--hl)] shadow-[0_0_6px_var(--hl)]' : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
