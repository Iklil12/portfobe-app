"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';
import { useAcidTech } from './AcidTechContext';

export function AcidTechAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { openAward, setOpenAward } = useAcidTech();
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const awardItems = data?.certificates || data?.user?.certificates || [];

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    if (awardItems.length === 0 && !isEditor) return null;

    return (
        <section className="w-full bg-black text-white py-24 border-y border-[var(--tc)]/20 font-mono" id="awards" style={{ '--tc': themeColor } as React.CSSProperties}>
            <div className="max-w-[90rem] mx-auto px-6 md:px-16 flex flex-col md:flex-row gap-16">
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: false }} variants={fadeUp}
                    className="md:w-1/3"
                >
                    <span className="text-[var(--tc)] font-bold text-[10px] uppercase tracking-[0.2em] mb-2 block">[ RECOGNITION_LOG ]</span>
                    <h2 className="font-extrabold uppercase tracking-tight text-4xl text-white">
                        <EditableText value={theme?.customTexts?.acid_awards_title || 'RECOGNITION'} field="acid_awards_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h2>
                </motion.div>

                <div className="md:w-2/3">
                    {awardItems.length > 0 ? (
                        <div className="border-t border-[var(--tc)]/20">
                            {awardItems.map((award: any, i: number) => {
                                const isOpen = openAward === award.id;
                                return (
                                    <motion.div 
                                        key={`award-${award.id || i}`}
                                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, margin: "50px" }} variants={fadeUp}
                                        className="border-b border-[var(--tc)]/20 group"
                                    >
                                        <div 
                                            className={`flex justify-between items-center cursor-pointer px-4 py-6 transition-all duration-300 ${isOpen ? 'bg-[var(--tc)]/5 text-[var(--tc)]' : 'hover:bg-[var(--tc)]/[0.02] hover:text-[var(--tc)]'}`} 
                                            onClick={() => setOpenAward(isOpen ? null : award.id)}
                                        >
                                            <div className="flex items-center gap-6 w-full @md:w-auto">
                                                <span className="font-bold text-sm shrink-0 w-16 text-zinc-500">[{award.year || new Date(award.createdAt).getFullYear()}]</span>
                                                <h3 className="font-bold uppercase tracking-wider text-base md:text-lg">{award.title}</h3>
                                            </div>
                                            <motion.div 
                                                animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}
                                                className="w-5 h-5 shrink-0 flex items-center justify-center font-bold text-sm"
                                            >
                                                {isOpen ? '✕' : '+'}
                                            </motion.div>
                                        </div>

                                        <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
                                            <div className="px-4 pb-8 pt-4 flex items-start gap-6 border-t border-zinc-900 mt-2 flex-col @md:flex-row">
                                                <div className="shrink-0 bg-black border border-zinc-800 flex items-center justify-center p-1 w-48 h-32">
                                                    <LazyImage src={award.mediaUrl || "https://via.placeholder.com/600"} className="w-full h-full object-contain p-2 grayscale" alt="Certificate" />
                                                </div>
                                                <div className="text-xs @md:text-sm">
                                                    <h4 className="font-bold uppercase tracking-widest text-[var(--tc)] mb-2">ISSUER // {award.issuer}</h4>
                                                    <p className="font-medium max-w-lg leading-relaxed text-zinc-400">{award.description || 'Awarded for excellence and outstanding contribution in the respective creative category.'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-10 text-center font-bold text-xs uppercase tracking-widest text-zinc-700">
                            System: No Recognition Data
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
