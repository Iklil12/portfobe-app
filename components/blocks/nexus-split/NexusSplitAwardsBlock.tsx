"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

export function NexusSplitAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const awardItems = data?.certificates || data?.user?.certificates || [];

  if (awardItems.length === 0) return null;

  const nexusEase = [0.16, 1, 0.3, 1] as any;
  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemFadeUp = {
      hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: nexusEase } }
  };
  const rowVariants = {
      hidden: { opacity: 0, x: -20, filter: 'blur(5px)' },
      visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: nexusEase } }
  };

  const toggleExpand = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <motion.section 
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        id="awards" className="flex flex-col pt-10 @lg:pt-24 pb-10 @lg:pb-16 border-b nexus-border"
    >
        {/* Section Header */}
        <motion.div variants={itemFadeUp} className="flex justify-between items-end mb-6 @md:mb-10 px-4 @md:px-12">
            <h2 className="font-display font-extrabold text-2xl @md:text-4xl @lg:text-6xl text-white">
                <EditableText value={theme?.customTexts?.nexus_awards_title || 'Recognition'} field="nexus_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </h2>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] hidden @sm:block">
                {String(awardItems.length).padStart(2, '0')} <span className="text-white/20">entries</span>
            </span>
        </motion.div>

        {/* Award List */}
        <div className="flex flex-col w-full">
            {awardItems.map((award: any, i: number) => {
                const isExpanded = expandedIndex === i;
                const hasMedia = !!award.mediaUrl;
                const yearDisplay = award.year || (award.createdAt ? new Date(award.createdAt).getFullYear() : '—');

                return (
                    <motion.div 
                        key={i}
                        variants={rowVariants}
                        className="w-full border-t nexus-border flex flex-col"
                    >
                        {/* Main Row — clickable */}
                        <div 
                            onClick={() => hasMedia ? toggleExpand(i) : undefined}
                            className={`w-full flex flex-col @md:flex-row @md:items-center justify-between group transition-colors px-4 py-4 gap-3 @md:px-12 @md:py-8 ${hasMedia ? 'cursor-pointer hover:bg-white/[0.02]' : ''}`}
                        >
                            {/* Left: Index + Title + Status */}
                            <div className="flex items-start @md:items-center gap-4 @md:gap-6 flex-1 min-w-0">
                                {/* Year Pill */}
                                <span className="shrink-0 font-mono text-[9px] @md:text-[10px] font-bold text-white/30 border border-white/5 px-2 py-0.5 @md:px-2.5 @md:py-1 bg-white/[0.02] tabular-nums">
                                    {yearDisplay}
                                </span>

                                <div className="flex flex-col gap-1 min-w-0">
                                    <h3 className="font-display font-bold text-sm @md:text-lg @lg:text-xl text-white group-hover:text-[var(--hl)] transition-colors truncate">
                                        {award.title}
                                    </h3>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {award.issuer && (
                                            <span className="font-sans text-[9px] @md:text-[10px] font-medium text-white/30">
                                                {award.issuer}
                                            </span>
                                        )}
                                        {award.status && (
                                            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--hl)]/70 border border-[var(--hl)]/10 bg-[var(--hl)]/[0.04] px-2 py-0.5">
                                                {award.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Expand toggle / External link */}
                            <div className="flex items-center gap-4 shrink-0 @md:ml-4">
                                {hasMedia && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); toggleExpand(i); }}
                                        className={`w-7 h-7 @md:w-9 @md:h-9 flex items-center justify-center border transition-all duration-300 ${isExpanded ? 'border-[var(--hl)]/30 bg-[var(--hl)]/10 text-[var(--hl)]' : 'border-white/10 text-white/30 hover:text-white hover:border-white/20'}`}
                                    >
                                        <svg 
                                            className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Expandable Photo Dropdown */}
                        <AnimatePresence>
                            {isExpanded && hasMedia && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: nexusEase }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 @md:px-12 pb-6 @md:pb-8 pt-1 @md:pt-2">
                                        <div className="relative w-full max-w-2xl overflow-hidden border border-white/5 bg-white/[0.01] group/img">
                                            {/* Image */}
                                            <a 
                                                href={award.mediaUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="block relative"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <LazyImage 
                                                    src={award.mediaUrl} 
                                                    alt={award.title} 
                                                    className="w-full h-auto max-h-[400px] object-contain bg-black/50" 
                                                />
                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                                    <div className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/80 border border-white/20 px-4 py-2 bg-black/40 backdrop-blur-sm">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        Open Full
                                                    </div>
                                                </div>
                                            </a>

                                            {/* Description bar */}
                                            {award.description && (
                                                <div className="px-4 py-3 border-t border-white/5 bg-white/[0.02]">
                                                    <p className="font-sans text-[11px] text-white/40 leading-relaxed line-clamp-2">
                                                        {award.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    </motion.section>
  );
}
