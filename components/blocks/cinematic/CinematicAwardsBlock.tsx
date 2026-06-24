"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';
import { useCinematic } from './CinematicContext';

export function CinematicAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { openAward, setOpenAward } = useCinematic();
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const awardItems = data?.certificates || data?.user?.certificates || [];
    const buttonShape = theme?.buttonShape || 'hard';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';

    if (awardItems.length === 0 && !isEditor) return null;

    return (
        <section className={`bg-[#050505] border-t border-[#1f1f1f] py-20 @md:py-24 px-6 @md:px-12`}>
            <div className={`grid gap-10 @md:grid-cols-12 @md:gap-12`}>
                <div className={`@md:col-span-4`}>
                    <motion.div initial={{ opacity: 0, x: -20 }} {...{ [animationTrigger]: { opacity: 1, x: 0 } }} transition={{ duration: 0.6 }} className="@md:sticky @md:top-24">
                        <h2 className={`font-black uppercase tracking-tighter mb-3 cine-heading text-3xl @md:text-5xl`}>
                            <EditableText value={theme?.customTexts?.cinematic_awards_title || 'Recognition'} field="cinematic_awards_title" entity="appearance" isEditor={isEditor} as="span" />
                        </h2>
                        <EditableText value={theme?.customTexts?.cinematic_awards_subtitle || 'Acknowledged by the industry for exceptional visual storytelling.'} field="cinematic_awards_subtitle" entity="appearance" isEditor={isEditor} as="p" className={`text-gray-500 max-w-xs cine-body text-sm`} />
                    </motion.div>
                </div>

                <div className={`border-t border-[#1f1f1f] @md:col-span-8`}>
                    {awardItems.length > 0 ? awardItems.map((award: any, i: number) => {
                        const isOpen = openAward === award.id;
                        return (
                            <motion.div key={`award-${i}`} initial={{ opacity: 0, y: 20 }} {...{ [animationTrigger]: { opacity: 1, y: 0 } }} transition={{ duration: 0.5, delay: i * 0.1 }} className="border-b border-[#1f1f1f] @container">
                                <div className={`award-row flex flex-row justify-between items-center cursor-pointer text-gray-400 py-6 @md:py-8 gap-4 w-full`} onClick={() => setOpenAward(isOpen ? null : award.id)}>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <h3 className={`font-bold uppercase tracking-tighter cine-heading ${isOpen ? 'text-white' : ''} text-xl @md:text-2xl truncate`}>{award.title}</h3>
                                        <span className="text-[10px] @md:text-sm uppercase tracking-widest cine-body mt-1 truncate">{award.issuer}</span>
                                    </div>

                                    <div className={`flex items-center gap-4 shrink-0`}>
                                        <span className="font-mono text-xs @md:text-sm">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                        <i className={`fas fa-arrow-right transition-transform duration-300 text-sm ${isOpen ? '-rotate-45 text-white' : 'rotate-45'}`}></i>
                                    </div>
                                </div>

                                <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                                    <div className={`pb-6 flex gap-5 flex-col @md:flex-row`}>
                                        <div className={`shrink-0 bg-[#111] flex items-center justify-center overflow-hidden ${radiusClass} w-full @md:w-48 h-32`}>
                                            <LazyImage src={award.mediaUrl || "https://via.placeholder.com/600"} className="w-full h-full object-contain p-2 grayscale hover:grayscale-0 transition-all duration-500" alt="Certificate" />
                                        </div>
                                        <div className="flex flex-col justify-center cine-body">
                                            <p className="text-white font-bold mb-1 text-[11px] uppercase tracking-wider">{award.status || 'Verified'}</p>
                                            <p className="cine-body text-gray-500 text-[11px] @md:text-sm max-w-md leading-relaxed mb-4">{award.description || 'Awarded for excellence in the respective category.'}</p>
                                            {award.mediaUrl && <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-gray-400 transition flex items-center gap-2">View Certificate <i className="fas fa-external-link-alt text-[8px]"></i></a>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    }) : (
                        isEditor && <div className="py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">Add awards to preview</div>
                    )}
                </div>
            </div>
        </section>
    );
}
