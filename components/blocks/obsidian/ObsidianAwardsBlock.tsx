"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function ObsidianAwardsBlock({ data, theme, isEditor }: any) {
  const awardItems = data?.certificates || data?.user?.certificates || [];

  const [expandedIndices, setExpandedIndices] = useState<{ [key: number]: boolean }>({});

  const toggleExpand = (index: number) => {
    setExpandedIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (awardItems.length === 0 && !isEditor) return null;
  const displayItems = awardItems.length > 0 ? awardItems : [{ title: 'Best Design Award', issuer: 'Awwwards', year: '2023' }];

  const revealVariants: any = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };
  
  const staggerReveal: any = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  const accentColor = theme?.themeColor || '#ff0055';

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-md';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const getCardShapeClass = (style?: string) => {
      if (style === 'hard-shadow' || style === 'hard') {
          return 'rounded-none';
      }
      if (style === 'flat') {
          return 'rounded-none';
      }
      if (style === 'soft-shadow' || style === 'soft') {
          return 'rounded-2xl';
      }
      return 'rounded-xl';
  };
  const cardShape = getCardShapeClass(theme?.cardStyle);

  return (
    <section className="py-16 md:py-24 px-6 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-4">
                <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                    <EditableText value={theme?.customTexts?.obs_awards_label || 'Recognition'} field="obs_awards_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </span>
                <h2 className="font-heading text-4xl md:text-5xl font-medium">
                    <EditableText value={theme?.customTexts?.obs_awards_title || 'Awards'} field="obs_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </h2>
            </motion.div>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="md:col-span-8 flex flex-col">
                {displayItems.map((award: any, i: number) => {
                    const isExpanded = !!expandedIndices[i];
                    const hasMedia = !!award.mediaUrl;

                    return (
                        <div key={i} className="border-b border-[rgba(255,255,255,0.1)]">
                            <motion.div 
                                variants={revealVariants} 
                                className="flex flex-row items-center justify-between py-6 group hover:pl-4 transition-all duration-300 cursor-pointer w-full gap-4"
                                onClick={() => hasMedia && toggleExpand(i)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-1 min-w-0 pr-2 gap-2 sm:gap-4">
                                    <h3 className="font-heading text-xl md:text-2xl font-medium group-hover:text-[var(--brand-accent)] transition-colors truncate">{award.title}</h3>
                                    <p className="font-body text-[#8a8a93] text-sm shrink-0 sm:text-right">{award.issuer} {award.year ? `(${award.year})` : ''}</p>
                                </div>
                                {hasMedia && (
                                    <div className={`w-8 h-8 ${btnShape} border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-all`}>
                                        <i className={`fas fa-chevron-down text-slate-400 group-hover:text-white transition-transform duration-300 ${
                                            isExpanded ? 'rotate-180 text-[var(--brand-accent)]' : ''
                                        }`} style={{ color: isExpanded ? accentColor : undefined }}></i>
                                    </div>
                                )}
                            </motion.div>

                            <AnimatePresence initial={false}>
                                {isExpanded && hasMedia && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden w-full flex flex-col items-center justify-center pb-6"
                                    >
                                        <div className={`relative w-full max-w-2xl aspect-[1.414/1] ${cardShape} border border-white/10 bg-white/[0.02] p-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group/cert overflow-hidden mt-2`}>
                                            <div className="absolute inset-0 bg-[var(--brand-accent)]/5 blur-[40px] opacity-0 group-hover/cert:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: `${accentColor}10` }}></div>
                                            <img 
                                                src={award.mediaUrl} 
                                                alt={award.title} 
                                                className={`w-full h-full ${cardShape} object-contain transition-transform duration-500 group-hover/cert:scale-[1.01]`}
                                            />
                                            <div className="absolute bottom-4 right-4 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300">
                                                <a 
                                                    href={award.mediaUrl} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className={`px-3 py-1.5 bg-black/80 border border-white/15 hover:border-white/30 text-[10px] font-mono text-white ${btnShape} flex items-center gap-2 backdrop-blur-md shadow-lg`}
                                                >
                                                    <span>VIEW FULL IMAGE</span>
                                                    <i className="fas fa-external-link-alt text-[8px]"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    </section>
  );
}
