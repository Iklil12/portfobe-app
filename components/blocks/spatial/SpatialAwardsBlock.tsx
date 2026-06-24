"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function SpatialAwardsBlock({ data, theme, isMobileView, isCardPreview, isEditor }: any) {
  const awardItems = data?.certificates || data?.user?.certificates || [];

  // Track expanded certificates
  const [expandedIndices, setExpandedIndices] = useState<{ [key: number]: boolean }>({});

  const toggleExpand = (index: number) => {
    setExpandedIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (awardItems.length === 0 && !isEditor) return null;

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
  const xlCardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[48px]' : 'rounded-[32px]';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0f1115] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[8px_8px_0_0_#ffffff]' : 'glass-panel border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]';

  const auraAnim = isCardPreview
      ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
      : { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const staggerContainer = isCardPreview
      ? { initial: "visible" as const, animate: "visible" as const }
      : { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, amount: 0.1 }, variants: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } } };

  return (
    <motion.div id="awards" {...staggerContainer} className={`flex flex-col w-full mt-24 @md:mt-32 px-8`}>
        <motion.div variants={auraAnim} className="mb-8">
            <h2 className={`font-medium tracking-tight text-white text-4xl`}>
                <EditableText value={theme?.customTexts?.spatial_awards_title || 'Recognitions'} field="spatial_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
            </h2>
        </motion.div>

        {awardItems.length === 0 && isEditor && (
            <div className={`w-full p-12 ${cardStyleClass} ${xlCardRadiusClass} flex flex-col items-center justify-center text-center opacity-70`}>
                <i className="fas fa-award text-4xl text-slate-500 mb-4"></i>
                <p className="text-slate-400">Tambahkan sertifikat/penghargaan untuk menampilkannya di sini.</p>
            </div>
        )}

        <div className="flex flex-col border-t border-white/10">
            {awardItems.slice(0, 5).map((award: any, i: number) => {
                const isExpanded = !!expandedIndices[i];
                const hasMedia = !!award.mediaUrl;

                return (
                    <motion.div
                        key={i}
                        variants={auraAnim}
                        className="flex flex-col border-b border-white/5 group cursor-pointer"
                        onClick={() => hasMedia && toggleExpand(i)}
                    >
                        {/* Header Row */}
                        <div className="flex flex-row items-center justify-between py-6 gap-4 w-full">
                            <div className="flex items-center gap-4 @md:gap-6 min-w-0">
                                <span className="text-xs font-mono text-slate-500 w-10 shrink-0 select-none">
                                    {award.year || new Date(award.createdAt).getFullYear()}
                                </span>
                                <div className="flex flex-col min-w-0">
                                    <h4 className="text-base @md:text-xl font-medium text-white group-hover:text-[var(--hl)] transition-colors truncate">
                                        {award.title}
                                    </h4>
                                    <span className="text-xs text-slate-400 mt-1 truncate">{award.issuer}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center shrink-0">
                                <p className="text-sm text-slate-500 line-clamp-1 max-w-xs hidden @lg:block mr-6">
                                    {award.description}
                                </p>
                                
                                {hasMedia ? (
                                    <div className={`w-10 h-10 ${radiusClass} border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all`}>
                                        <i className={`fas fa-chevron-down text-slate-400 group-hover:text-white transition-transform duration-300 ${
                                            isExpanded ? 'rotate-180 text-[var(--hl, #6366f1)]' : ''
                                        }`}></i>
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center opacity-20">
                                        <i className="fas fa-minus text-slate-500 text-xs"></i>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Collapsible Certificate Photo Dropdown */}
                        <AnimatePresence initial={false}>
                            {isExpanded && hasMedia && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden w-full flex flex-col items-center justify-center pb-6"
                                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                                >
                                    <div className="relative w-full max-w-2xl aspect-[1.414/1] rounded-2xl border border-white/10 bg-white/[0.02] p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group/cert overflow-hidden mt-2">
                                        {/* Neon Glow overlay */}
                                        <div className="absolute inset-0 bg-[var(--hl, #6366f1)]/5 blur-[40px] opacity-0 group-hover/cert:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                        
                                        <img 
                                            src={award.mediaUrl} 
                                            alt={award.title} 
                                            className="w-full h-full rounded-xl object-contain transition-transform duration-500 group-hover/cert:scale-[1.01]"
                                        />
                                        
                                        {/* Full Image Link Tag */}
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300">
                                            <a 
                                                href={award.mediaUrl} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="px-3.5 py-1.5 bg-black/80 border border-white/15 hover:border-white/30 text-[10px] font-mono text-white rounded-lg flex items-center gap-2 backdrop-blur-md shadow-lg"
                                            >
                                                <span>VIEW FULL IMAGE</span>
                                                <i className="fas fa-external-link-alt text-[8px]"></i>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    </motion.div>
  );
}
