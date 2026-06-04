"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';

export function MonolithTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0) return null;

    const buttonShape = theme?.buttonShape || 'rounded';
    const cardRadiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-[40px]' : 'rounded-2xl';
    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#111111] shadow-[0_30px_60px_rgba(255,255,255,0.03)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[6px_6px_0_0_rgba(255,255,255,0.2)]' : 'bg-[#080808] border border-white/10 hover:border-white/30';

    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    return (
        <section className="relative z-20 w-full bg-[#050505] py-20 @md:py-32 border-t border-white/5">
            <div className="flex justify-between items-end mb-12 @md:mb-20 px-6 @md:px-12">
                <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi]">
                    <EditableText value={theme?.customTexts?.monolith_testi_title || 'Client'} field="monolith_testi_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /><br/><span className="italic text-[var(--hl)]"><EditableText value={theme?.customTexts?.monolith_testi_subtitle || 'Voices'} field="monolith_testi_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                </motion.h2>
            </div>
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-6 @md:gap-12 px-6 @md:px-12 pb-10">
                {testimonials.map((t: any, i: number) => (
                    <motion.div
                        key={t.id}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                        className={`group flex flex-col p-8 @md:p-12 transition-colors duration-500 ${cardRadiusClass} ${cardStyleClassDark}`}
                    >
                        <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-6 group-hover:border-[var(--hl)]/50 transition-colors">
                            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-white/20">
                                {t.avatarUrl ? (
                                    <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                                ) : (
                                    <div className="w-full h-full bg-white/10 flex items-center justify-center font-sans font-bold text-white text-xl">
                                        {t.clientName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-serif text-white text-2xl group-hover:text-[var(--hl)] transition-colors">{t.clientName}</h4>
                                {t.company && <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">{t.company}</p>}
                            </div>
                        </div>
                        <p className="font-sans text-sm @md:text-lg text-slate-300 leading-relaxed mb-8">
                            "{t.content}"
                        </p>
                        <div className="flex gap-1 text-[10px] @md:text-xs mt-auto">
                            {[...Array(5)].map((_, idx) => (
                                <i key={idx} className={`${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/20'}`}></i>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
