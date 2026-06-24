"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function AuraKineticAwardsBlock({ data, theme, isEditor }: any) {
  const awardItems = data?.certificates || data?.user?.certificates || [];
  const [activeAwardId, setActiveAwardId] = useState<number | null>(null);

  if (awardItems.length === 0 && !isEditor) return null;

  const displayAwards = isEditor && awardItems.length === 0 ? [
      { title: "Awwwards Site of the Day", issuer: "Awwwards", year: "2024", status: "Winner", mediaUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800" },
      { title: "FWA of the Month", issuer: "FWA", year: "2023", status: "Nominee", mediaUrl: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800" }
  ] : awardItems;

  const cardRadiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-3xl';
  const highlightColor = theme?.themeColor || '#8b5cf6';

  const fadeUp = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const toggleAward = (index: number) => {
      setActiveAwardId(activeAwardId === index ? null : index);
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <section id="awards" className="relative z-10 w-full max-w-[1000px] mx-auto px-6 py-24 md:py-32">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
                <EditableText value={theme?.customTexts?.aura_awards_title || 'Recognitions'} field="aura_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
            </h2>
            <p className="font-sans text-white/50 mt-4 text-sm">
                <EditableText value={theme?.customTexts?.aura_awards_subtitle || 'Validations of quality and expertise.'} field="aura_awards_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={45} />
            </p>
        </motion.div>

        <div className="flex flex-col gap-4">
            {displayAwards.map((award: any, i: number) => {
                const isExpanded = activeAwardId === i;
                const hasMedia = !!award.mediaUrl;
                
                return (
                    <motion.div
                        key={i}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                        className={`group flex flex-col p-6 md:p-8 bg-white/5 border border-white/10 hover:border-[var(--hl)]/50 backdrop-blur-md hover:bg-white/10 transition-all duration-500 ${cardRadiusClass} relative overflow-hidden cursor-pointer`}
                        onClick={() => toggleAward(i)}
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-[var(--hl)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                            <div className="flex items-center gap-6 mb-4 md:mb-0">
                                <span className="font-serif text-white/30 text-xl font-bold">{award.year || new Date(award.createdAt || new Date()).getFullYear()}</span>
                                <div>
                                    <h3 className="font-sans font-bold text-lg md:text-xl text-white group-hover:text-[var(--hl)] transition-colors">{award.title}</h3>
                                    <span className="font-sans text-sm text-white/50">{award.issuer}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                <span className="font-sans text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-white/5 rounded-full text-white/50 group-hover:text-white transition-colors">{award.status || 'Verified'}</span>
                                <div className="flex items-center gap-2">
                                    {hasMedia && (
                                        <span className="text-xs font-mono text-[var(--hl)] opacity-80 group-hover:opacity-100 transition-opacity mr-1.5 hidden md:inline">
                                            {isExpanded ? 'Collapse' : 'View Cert'}
                                        </span>
                                    )}
                                    <motion.i 
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="fas fa-chevron-down text-white/30 group-hover:text-white text-xs"
                                    ></motion.i>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence initial={false}>
                            {isExpanded && hasMedia && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden w-full flex flex-col items-center"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="relative w-full max-w-2xl border border-white/10 rounded-2xl overflow-hidden bg-black/40 group/img shadow-2xl">
                                        <img 
                                            src={award.mediaUrl} 
                                            alt={award.title} 
                                            className="w-full h-auto max-h-[500px] object-contain mx-auto"
                                        />
                                        
                                        {/* Action Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                            <a 
                                                href={award.mediaUrl} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="px-4 py-2 bg-white text-black font-sans text-xs font-bold rounded-full hover:bg-[var(--hl)] hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <i className="fas fa-external-link-alt"></i>
                                                Open in New Tab
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
    </section>
  );
}

