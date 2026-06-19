"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsionAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const awardItems = data?.certificates || data?.user?.certificates || [];

  const canvasEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: canvasEase } }
  };

  if (!awardItems.length) return null;

  return (
    <div id="awards" className="w-full py-16 @md:py-32 px-4 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508] relative @container overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[var(--hl)] opacity-5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-10 @md:mb-16">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2 @md:mb-4 block">
            <EditableText value={theme?.customTexts?.midnight_awards_top || 'Accolades'} field="midnight_awards_top" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </span>
          <h2 className="font-serif text-3xl @xs:text-4xl @md:text-6xl text-white uppercase tracking-wide">
            <EditableText value={theme?.customTexts?.midnight_awards_title || 'Recognitions'} field="midnight_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </h2>
        </motion.div>
        
        <motion.div 
          initial="hidden" 
          {...{ [animationTrigger]: "visible" }} 
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="flex flex-col border-t border-white/10"
        >
          {awardItems.map((award: any, i: number) => {
            const isExpanded = expandedIndex === i;
            const yearStr = award.year || (award.createdAt ? new Date(award.createdAt).getFullYear() : '2026');

            return (
              <div
                key={i}
                className="border-b border-white/10 flex flex-col w-full"
              >
                {/* Header Row */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
                  }}
                  onClick={() => award.mediaUrl && setExpandedIndex(isExpanded ? null : i)}
                  className="group flex flex-col @md:flex-row @md:items-center justify-between py-5 @md:py-10 cursor-pointer relative overflow-hidden transition-all duration-300 hover:bg-white/[0.015] px-2 @md:px-4"
                >
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--hl)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-0"></div>
                  
                  <div className="relative z-10 flex flex-col @md:flex-row @md:items-center gap-2 @md:gap-12 w-full @md:w-3/4 mb-4 @md:mb-0">
                    <span className="font-mono text-xs @md:text-sm tracking-widest text-[var(--hl)] font-bold w-20 shrink-0">
                      {yearStr}
                    </span>
                    <div className="flex flex-col gap-1 @md:gap-2">
                      <h3 className="font-serif text-lg @xs:text-xl @md:text-3xl text-white group-hover:text-[var(--hl)] transition-colors duration-300">
                        {award.title}
                      </h3>
                      <span className="font-sans text-[8px] @xs:text-[9px] @md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {award.issuer}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex justify-between items-center w-full @md:w-auto gap-4 @md:gap-8">
                    <span className="font-mono text-[8px] @md:text-[9px] uppercase tracking-wider border border-[var(--hl)]/20 text-[var(--hl)] bg-[var(--hl)]/5 px-2 py-0.5 @md:px-3 @md:py-1 rounded">
                      {award.status || 'Verified'}
                    </span>
                    {award.mediaUrl && (
                      <i className={`fas fa-arrow-right text-slate-500 group-hover:text-[var(--hl)] transition-all duration-500 text-sm @md:text-lg ${
                        isExpanded ? 'rotate-90' : '-rotate-45'
                      }`} />
                    )}
                  </div>
                </motion.div>

                {/* Inline Dropdown Panel using GPU-accelerated CSS Grid transition */}
                <div 
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden bg-[#05070a]/80">
                    <div className="p-3 @md:p-10 border-t border-white/5 flex flex-col items-center">
                      <div className="relative w-full max-w-3xl aspect-[4/3] @md:aspect-[16/10] bg-black/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center group/view">
                        {/* Scanlines overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0))] bg-[length:100%_4px] z-10 pointer-events-none opacity-20"></div>

                        {/* Corner brackets */}
                        <div className="absolute inset-2 @md:inset-4 pointer-events-none z-10 opacity-60">
                          <div className="absolute top-0 left-0 border-t border-l border-[var(--hl)] w-3 h-3"></div>
                          <div className="absolute top-0 right-0 border-t border-r border-[var(--hl)] w-3 h-3"></div>
                          <div className="absolute bottom-0 left-0 border-b border-l border-[var(--hl)] w-3 h-3"></div>
                          <div className="absolute bottom-0 right-0 border-b border-r border-[var(--hl)] w-3 h-3"></div>
                        </div>

                        {award.mediaUrl && (
                          <img 
                            src={award.mediaUrl} 
                            alt={award.title} 
                            className="max-w-full max-h-[50vh] object-contain shadow-2xl z-20 group-hover/view:scale-[1.02] transition-transform duration-700 ease-out" 
                          />
                        )}
                      </div>

                      {/* Dropdown Action Buttons */}
                      <div className="mt-4 @md:mt-6 flex gap-3 @md:gap-4">
                        <a 
                          href={award.mediaUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-3 py-1.5 @md:px-5 @md:py-2.5 font-mono text-[8px] @md:text-[9px] uppercase tracking-widest text-[#030508] bg-[var(--hl)] hover:bg-[var(--hl)]/80 transition-all duration-300 rounded font-bold"
                        >
                          Open Original File
                        </a>
                        <button
                          onClick={() => setExpandedIndex(null)}
                          className="px-3 py-1.5 @md:px-5 @md:py-2.5 font-mono text-[8px] @md:text-[9px] uppercase tracking-widest text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300 rounded"
                        >
                          Collapse View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
