"use client";

import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
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
        <section id="awards" className="w-full bg-white border-b-[3px] border-black">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className="p-6 border-b-[3px] border-black bg-black text-white">
                <h2 className={"custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter"}>
                    <EditableText value={theme?.customTexts?.brutal_awards_title || 'VERIFIED_RECORDS'} field="brutal_awards_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
            </motion.div>

            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                className="flex flex-col"
            >
                {awardItems.map((award: any, idx: number) => (
                    <motion.div
                        variants={starkReveal}
                        key={award.id || idx}
                        className={`flex flex-col border-b-[3px] border-black last:border-b-0`}
                    >
                        <div
                            className={"p-4 @sm:p-6 flex flex-col @sm:flex-row justify-between items-start @sm:items-center cursor-pointer brutal-hover-invert transition-none"}
                            onClick={() => { setOpenAward(openAward === award.id ? null : award.id) }}
                        >
                            <div className={"flex items-center gap-4 @sm:gap-8 w-full @sm:w-auto"}>
                                <span className={"font-mono text-lg @sm:text-2xl font-black"}>
                                    {openAward === award.id ? '[-]' : '[+]'}
                                </span>
                                <span className={"font-mono text-xs @sm:text-sm font-bold px-2 py-1 bg-gray-200 text-black hidden @sm:block"}>
                                    {award.year || new Date(award.createdAt || new Date()).getFullYear()}
                                </span>
                                <h3 className={"custom-heading text-xl @sm:text-3xl @md:text-4xl font-black uppercase tracking-tighter truncate max-w-[200px] @sm:max-w-[400px]"}>
                                    {award.title}
                                </h3>
                            </div>
                            <div className={"mt-2 @sm:mt-0 pl-12 @sm:pl-0 font-mono text-[10px] @sm:text-xs font-bold uppercase text-left @sm:text-right"}>
                                {award.issuer || 'ISSUER UNKNOWN'} <br />
                                <span className="bg-black text-white px-2 py-1 mt-1 inline-block">{award.status || 'VALID'}</span>
                            </div>
                        </div>

                        {/* Konten Expand */}
                        <div className={`overflow-hidden transition-all duration-300 font-mono bg-[#f4f4f0] ${openAward === award.id ? 'max-h-[800px] border-t-[3px] border-black' : 'max-h-0'}`}>
                            <div className={"p-6 @sm:p-10 flex flex-col @md:flex-row gap-6 @sm:gap-10"}>
                                <div className={`w-full @md:w-1/3 aspect-[4/3] bg-white border-[3px] border-black p-2 ${hardShadow} ${radiusClass}`}>
                                    <LazyImage src={award.mediaUrl || "https://via.placeholder.com/400x300?text=NO+IMAGE"} className={`w-full h-full object-cover grayscale contrast-125 ${radiusClass}`} alt="Certificate" />
                                </div>
                                <div className={"w-full @md:w-2/3 flex flex-col justify-center"}>
                                    <p className={`text-xs @sm:text-sm font-bold uppercase mb-6 leading-relaxed bg-white border-[3px] border-black p-4 ${radiusClass}`}>
                                        &gt; {award.description || 'Details of the certification are secured in the main databank.'}
                                    </p>
                                    <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" onClick={(e) => { if(isEditor) e.preventDefault(); }} className={`w-max bg-black text-white font-bold text-xs @sm:text-sm px-6 py-3 border-[3px] border-transparent hover:bg-white hover:text-black hover:border-black transition-none ${radiusClass}`}>
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
