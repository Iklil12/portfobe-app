"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';

export function MonolithAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const awardItems = data?.certificates || data?.user?.certificates || [];

    if (awardItems.length === 0) return null;

    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    const toggleExpand = (i: number) => {
        setExpandedIndex(expandedIndex === i ? null : i);
    };

    const buttonShape = theme?.buttonShape || 'rounded';
    const imgRadiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-3xl' : 'rounded-xl @md:rounded-2xl';

    return (
        <section id="awards" className={`relative z-[100] w-full bg-[#f4f4f5] text-black mt-[-20px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] rounded-t-[30px] @md:rounded-t-[40px] py-10 px-4 @md:py-24 @md:py-32 @md:px-12`}>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-6 @md:mb-16">
                <h2 className={`font-serif font-bold text-2xl @md:text-7xl`}>
                    <EditableText value={theme?.customTexts?.monolith_awards_title || 'Honors &'} field="monolith_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /><br/><span className="italic text-slate-400"><EditableText value={theme?.customTexts?.monolith_awards_subtitle || 'Recognitions'} field="monolith_awards_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                </h2>
            </motion.div>

            <div className="w-full flex flex-col border-t border-black">
                {awardItems.map((award: any, i: number) => {
                    const isExpanded = expandedIndex === i;
                    const hasMedia = !!award.mediaUrl;

                    return (
                        <motion.div 
                            key={i}
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                            className="w-full border-b border-black flex flex-col"
                        >
                            {/* Main Row */}
                            <div 
                                onClick={() => hasMedia ? toggleExpand(i) : undefined}
                                className={`w-full flex flex-col gap-2 py-4 px-2 -mx-2 @md:flex-row @md:items-center @md:gap-6 @md:py-10 @md:px-8 @md:-mx-8 group rounded-xl @md:rounded-2xl transition-all duration-500 ${hasMedia ? 'cursor-pointer hover:bg-black hover:text-white' : 'hover:bg-black hover:text-white'}`}
                            >
                                <div className={`flex w-full flex-col gap-1 @md:flex-row @md:items-center @md:gap-12 @md:w-1/2`}>
                                    <span className={`font-serif text-slate-400 group-hover:text-slate-300 text-sm @md:text-3xl w-16 shrink-0`}>{award.year || new Date(award.createdAt).getFullYear()}</span>
                                    <h3 className={`font-sans font-bold tracking-tight leading-tight text-base @md:text-4xl`}>{award.title}</h3>
                                </div>
                                <div className={`w-full flex flex-col @md:w-1/4`}>
                                    <span className={`font-sans font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-400 mb-0.5 text-[9px] @md:text-xs`}>
                                        <EditableText value={theme?.customTexts?.monolith_awards_issuer || 'Issuer'} field="monolith_awards_issuer" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                                    </span>
                                    <span className={`font-serif italic text-xs @md:text-lg @lg:text-xl`}>{award.issuer}</span>
                                </div>
                                <div className={`w-full flex justify-between items-center @md:w-1/4`}>
                                    <span className={`font-sans font-bold uppercase tracking-widest rounded-full border border-black group-hover:border-white text-[9px] px-3 py-1 @md:text-xs @md:px-4 @md:py-1 transition-colors`}>{award.status || 'Verified'}</span>
                                    
                                    {hasMedia ? (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); toggleExpand(i); }}
                                            className={`w-7 h-7 @md:w-9 @md:h-9 flex items-center justify-center border transition-all duration-300 rounded-full ${isExpanded ? 'border-black bg-black text-white group-hover:border-white group-hover:bg-white group-hover:text-black' : 'border-black/20 text-black/40 group-hover:border-white/40 group-hover:text-white/60 hover:border-black hover:text-black'}`}
                                        >
                                            <svg 
                                                className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <i className="fas fa-external-link-alt transform group-hover:scale-125 transition-transform text-xs @md:text-base"></i>
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
                                        transition={{ duration: 0.5, ease: cinematicEase }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-0 @md:px-4 pb-4 pt-1">
                                            <div className={`relative w-full max-w-3xl overflow-hidden border border-black/10 bg-white ${imgRadiusClass} shadow-[0_20px_60px_rgba(0,0,0,0.08)] group/img`}>
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
                                                        className="w-full h-auto max-h-[400px] object-contain bg-neutral-100" 
                                                    />
                                                    {/* Hover overlay */}
                                                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                                        <div className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black/50 backdrop-blur-sm px-5 py-2.5 rounded-full">
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                            View Full Size
                                                        </div>
                                                    </div>
                                                </a>

                                                {/* Description bar */}
                                                {award.description && (
                                                    <div className={`px-5 py-3.5 border-t border-black/5 bg-neutral-50`}>
                                                        <p className="font-sans text-[12px] text-black/40 leading-relaxed line-clamp-2">
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
        </section>
    );
}
