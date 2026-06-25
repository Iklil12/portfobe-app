"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function MidnightEmulsionStatsBlock({ data, theme, isEditor, isCardPreview }: any) {

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
  const canvasEase = [0.16, 1, 0.3, 1] as any;
  
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
  };

  const defaultStats = [
    { label: "Scenes Directed", value: "142" },
    { label: "Awards Won", value: "18" },
    { label: "Years Active", value: "12" },
    { label: "Global Clients", value: "50+" }
  ];

  const stats = data?.stats?.length ? data.stats : defaultStats;

  return (
    <div className="w-full py-8 @md:py-20 px-3 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508] relative overflow-hidden @container">
      {/* HUD Viewport Brackets for the whole section */}
      <div className="absolute inset-x-4 inset-y-2 pointer-events-none z-10 border border-white/[0.03]">
        <div className="absolute top-0 left-0 border-t border-l border-white/10 w-2 h-2"></div>
        <div className="absolute top-0 right-0 border-t border-r border-white/10 w-2 h-2"></div>
        <div className="absolute bottom-0 left-0 border-b border-l border-white/10 w-2 h-2"></div>
        <div className="absolute bottom-0 right-0 border-b border-r border-white/10 w-2 h-2"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-row items-stretch justify-between divide-x divide-white/5">
        {stats.slice(0, 4).map((stat: any, index: number) => {
          const itemIndex = (index + 1).toString().padStart(2, '0');
          return (
            <motion.div 
              key={index}
              initial="hidden" 
              {...{ [animationTrigger]: "visible" }} 
              viewport={{ once: true, amount: 0 }} 
              variants={fadeUp}
              className="flex-1 flex flex-col items-center justify-center text-center px-1 @md:px-4 group"
            >
              {/* Stat metadata index */}
              <span className="font-mono text-[7px] @md:text-[8px] text-slate-600 group-hover:text-[var(--hl)] transition-colors duration-300 mb-1 @md:mb-2 tracking-widest">
                [{itemIndex}]
              </span>

              {/* Large Stat Value */}
              <span className="font-serif text-2xl @xs:text-3xl @md:text-6xl @lg:text-7xl text-white group-hover:text-[var(--hl)] transition-all duration-500 font-medium select-none group-hover:drop-shadow-[0_0_8px_var(--hl)]">
                <EditableText 
                  value={theme?.customTexts?.[`midnight_stat_val_${index}`] || stat.value} 
                  field={`midnight_stat_val_${index}`} 
                  entity="appearance" 
                  isEditor={isEditor} 
                  as="span" 
                  maxLength={10} 
                />
              </span>

              {/* Stat Label */}
              <span className="font-sans text-[7px] @xs:text-[8px] @md:text-[10px] font-bold uppercase tracking-[0.15em] @md:tracking-[0.2em] text-slate-500 mt-1.5 @md:mt-2 block max-w-[120px] leading-tight select-none">
                <EditableText 
                  value={theme?.customTexts?.[`midnight_stat_lbl_${index}`] || stat.label} 
                  field={`midnight_stat_lbl_${index}`} 
                  entity="appearance" 
                  isEditor={isEditor} 
                  as="span" 
                  maxLength={30} 
                />
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
