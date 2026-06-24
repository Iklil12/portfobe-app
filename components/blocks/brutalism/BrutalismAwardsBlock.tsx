"use client";

import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { hardShadow, radiusClass } = useContext(BrutalismContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const [openAward, setOpenAward] = useState<string | null>(null);

    const awardItems = data?.certificates || data?.user?.certificates || [];

    if (awardItems.length === 0) return null;

    const brutalEase = [0, 0, 0, 1] as any;

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    return (
        <section id="awards" className="w-full bg-[#f4f4f0] border-b-[3px] border-black">
            {/* Title Bar - Cyber Retro Window Style */}
            <div className="p-6 border-b-[3px] border-black bg-[var(--hl)] flex justify-between items-center text-black font-mono">
                <h2 className="custom-heading text-xl @xs:text-2xl @sm:text-4xl @md:text-5xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 @sm:w-8 @sm:h-8 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/>
                    </svg>
                    <EditableText value={theme?.customTexts?.brutal_awards_title || 'VERIFIED_RECORDS'} field="brutal_awards_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
                {/* Retro controls window */}
                <div className="flex items-center gap-1.5 hidden @sm:flex font-mono text-xs font-bold border-[3px] border-black bg-white p-1.5 shadow-[3px_3px_0px_0px_#000] select-none">
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">_</span>
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">⧠</span>
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-100">X</span>
                </div>
            </div>

            {/* Sub-bar / Info Toolbar */}
            <div className="w-full bg-white border-b-[3px] border-black px-4 @sm:px-6 py-2 flex justify-between items-center text-[9px] @sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-neutral-50">
                <div className="flex items-center gap-2 @sm:gap-4">
                    <span><span className="hidden @xs:inline">DB: </span><span className="text-black">CERTIFICATIONS</span></span>
                    <span>|</span>
                    <span>COUNT: <span className="text-black">{awardItems.length}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse border border-black"></span>
                    <span className="text-black">READY</span>
                </div>
            </div>

            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                className="flex flex-col bg-white"
            >
                {awardItems.map((award: any, idx: number) => (
                    <motion.div
                        variants={starkReveal}
                        key={award.id || idx}
                        className="flex flex-col border-b-[3px] border-black last:border-b-0"
                    >
                        <div
                            className="p-4 @sm:p-6 flex flex-col @sm:flex-row justify-between items-stretch @sm:items-center cursor-pointer hover:bg-[var(--hl)]/15 transition-colors font-mono"
                            onClick={() => { setOpenAward(openAward === award.id ? null : award.id) }}
                        >
                            <div className="flex items-center gap-3 @sm:gap-8 w-full @sm:w-auto min-w-0">
                                <span className="font-mono text-base @sm:text-2xl font-black shrink-0">
                                    {openAward === award.id ? '[-]' : '[+]'}
                                </span>
                                <span className="font-mono text-[10px] @sm:text-sm font-bold px-2 py-0.5 bg-black text-white shrink-0">
                                    {award.year || new Date(award.createdAt || new Date()).getFullYear()}
                                </span>
                                <h3 className="custom-heading text-lg @sm:text-3xl @md:text-4xl font-black uppercase tracking-tighter truncate flex-1">
                                    {award.title}
                                </h3>
                            </div>
                            <div className="mt-2 @sm:mt-0 pl-7 @sm:pl-0 font-mono text-[9px] @sm:text-xs font-bold uppercase text-slate-600 @sm:text-right flex flex-col items-start @sm:items-end">
                                <span>{award.issuer || 'ISSUER UNKNOWN'}</span>
                                <span className="bg-black text-[var(--hl)] px-1.5 py-0.5 mt-1 inline-block text-[8px] border border-black uppercase font-black">{award.status || 'VALID'}</span>
                            </div>
                        </div>

                        {/* Konten Expand */}
                        <div className={`overflow-hidden transition-all duration-300 font-mono bg-[#f4f4f0] ${openAward === award.id ? 'max-h-[800px] border-t-[3px] border-black' : 'max-h-0'}`}>
                            <div className="p-4 @sm:p-10 flex flex-col @md:flex-row gap-6 @sm:gap-10">
                                <div className={`w-full @md:w-1/3 aspect-[4/3] bg-white border-[3px] border-black p-2 shadow-[6px_6px_0px_0px_#000] ${radiusClass}`}>
                                    <LazyImage src={award.mediaUrl || "https://via.placeholder.com/400x300?text=NO+IMAGE"} className={`w-full h-full object-cover grayscale contrast-125 ${radiusClass}`} alt="Certificate" />
                                </div>
                                <div className="w-full @md:w-2/3 flex flex-col justify-center">
                                    <p className={`text-xs @sm:text-sm font-bold uppercase mb-6 leading-relaxed bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#000] ${radiusClass}`}>
                                        &gt; {award.description || 'Details of the certification are secured in the main databank.'}
                                    </p>
                                    <a 
                                        href={award.mediaUrl || '#'} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        onClick={(e) => { if(isEditor) e.preventDefault(); }} 
                                        className={`w-max bg-black text-white font-bold text-xs @sm:text-sm px-6 py-3 border-[3px] border-black hover:bg-[var(--hl)] hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_0px_#000] ${radiusClass}`}
                                    >
                                        ACCESS ATTACHMENT_
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
