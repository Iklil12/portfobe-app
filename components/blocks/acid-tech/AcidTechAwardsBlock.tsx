"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { useAcidTech } from './AcidTechContext';

export function AcidTechAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { openAward, setOpenAward } = useAcidTech();
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const awardItems = data?.certificates || data?.user?.certificates || [];

    const rawThemeColor = theme?.themeColor || "#DFFF00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#ff9e00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    if (awardItems.length === 0 && !isEditor) return null;

    return (
        <section className="acid-bg text-[#09090b] py-20 @md:py-24" id="awards">
            <div className="max-w-6xl mx-auto px-6 @md:px-12">
                <motion.h2 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: false }} variants={fadeUp}
                    className={`acid-heading font-extrabold uppercase tracking-tighter mb-12 text-4xl @md:text-[clamp(3rem,6cqi,5rem)]`}
                >
                    <EditableText value={theme?.customTexts?.acid_awards_title || 'RECOGNITION'} field="acid_awards_title" entity="appearance" isEditor={isEditor} as="span" />
                </motion.h2>

                {awardItems.length > 0 ? (
                    <div className="border-t-4 border-[#09090b]">
                        {awardItems.map((award: any, i: number) => {
                            const isOpen = openAward === award.id;
                            return (
                                <motion.div 
                                    key={`award-${award.id || i}`}
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, margin: "50px" }} variants={fadeUp}
                                    className="border-b-4 border-[#09090b] group"
                                >
                                    <div className={`award-row flex justify-between items-center cursor-pointer hover:bg-[#09090b] hover:text-[var(--theme-color)] transition-colors px-2 @md:px-4 py-5 @md:py-6`} style={{ '--theme-color': themeColor } as any} onClick={() => !isEditor && setOpenAward(isOpen ? null : award.id)}>
                                        <div className="flex items-center gap-4 @md:gap-6 w-full @md:w-auto">
                                            <span className={`font-bold acid-body shrink-0 text-lg w-12 @md:text-2xl @md:w-16`}>{award.year || new Date(award.createdAt).getFullYear()}</span>
                                            <h3 className={`acid-heading font-extrabold uppercase tracking-tighter line-clamp-1 text-xl @md:text-2xl @lg:text-4xl`}>{award.title}</h3>
                                        </div>
                                        <motion.i 
                                            animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}
                                            className={`fas fa-plus text-xl @md:text-2xl shrink-0 ml-4 ${isOpen ? 'text-white' : ''}`}
                                        ></motion.i>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
                                        <div className={`px-2 @md:px-4 pb-8 pt-4 flex items-start gap-6 border-t border-[#09090b]/20 mt-2 @md:mt-4 flex-col @md:flex-row`}>
                                            <div className={`shrink-0 bg-[#000] border-2 border-[#09090b] flex items-center justify-center p-1 w-48 h-32`}>
                                                <LazyImage src={award.mediaUrl || "https://via.placeholder.com/600"} className="w-full h-full object-contain p-2 grayscale" alt="Certificate" />
                                            </div>
                                            <div className="acid-body">
                                                <h4 className={`font-bold uppercase tracking-widest mb-2 text-xs`}>{award.issuer}</h4>
                                                <p className={`font-medium max-w-lg leading-relaxed text-[#09090b]/80 text-sm`}>{award.description || 'Awarded for excellence and outstanding contribution in the respective creative category.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="py-10 text-center font-bold text-xs uppercase tracking-widest acid-body text-[#09090b]/50">
                        System: No Recognition Data
                    </div>
                )}
            </div>
        </section>
    );
}
