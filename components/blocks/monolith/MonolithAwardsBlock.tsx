"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function MonolithAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const awardItems = data?.certificates || data?.user?.certificates || [];

    if (awardItems.length === 0) return null;

    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    return (
        <section id="awards" className={`relative z-[100] w-full bg-[#f4f4f5] text-black mt-[-20px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] rounded-t-[30px] @md:rounded-t-[40px] py-16 px-6 @md:py-24 @md:py-32 @md:px-12`}>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-10 @md:mb-16">
                <h2 className={`font-serif font-bold text-4xl @md:text-7xl`}>
                    <EditableText value={theme?.customTexts?.monolith_awards_title || 'Honors &'} field="monolith_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /><br/><span className="italic text-slate-400"><EditableText value={theme?.customTexts?.monolith_awards_subtitle || 'Recognitions'} field="monolith_awards_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                </h2>
            </motion.div>

            <div className="w-full flex flex-col border-t border-black">
                {awardItems.map((award: any, i: number) => (
                    <motion.a 
                        href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                        className={`w-full border-b border-black flex justify-between group hover:bg-black hover:text-white transition-all duration-500 rounded-xl @md:rounded-2xl flex-col gap-4 py-6 px-4 -mx-4 @md:flex-row @md:items-center @md:gap-6 @md:py-8 @md:py-12 @md:px-8 @md:-mx-8`}
                    >
                        <div className={`flex w-full flex-col gap-1 @md:flex-row @md:items-center @md:gap-6 @md:gap-12 @md:w-1/2`}>
                            <span className={`font-serif text-slate-400 group-hover:text-slate-300 text-xl @md:text-3xl w-16`}>{award.year || new Date(award.createdAt).getFullYear()}</span>
                            <h3 className={`font-sans font-bold tracking-tight leading-tight text-2xl @md:text-4xl`}>{award.title}</h3>
                        </div>
                        <div className={`w-full flex flex-col @md:w-1/4`}>
                            <span className={`font-sans font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-400 mb-1 text-[9px] @md:text-xs`}>
                                <EditableText value={theme?.customTexts?.monolith_awards_issuer || 'Issuer'} field="monolith_awards_issuer" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                            </span>
                            <span className={`font-serif italic text-base @md:text-lg @lg:text-xl`}>{award.issuer}</span>
                        </div>
                        <div className={`w-full flex justify-between items-center @md:w-1/4`}>
                            <span className={`font-sans font-bold uppercase tracking-widest rounded-full border border-black group-hover:border-white text-[9px] px-3 py-1 @md:text-xs @md:px-4 @md:py-1`}>{award.status || 'Verified'}</span>
                            <i className="fas fa-external-link-alt transform group-hover:scale-125 transition-transform"></i>
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
