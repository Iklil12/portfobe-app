"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};
const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export const AbsoluteNoirTestimonialsBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0) return null;

    return (
        <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0, margin: "100px" }} variants={staggerGrid} id="testimonials" className="w-full bg-[#050505] text-white">
            <motion.div variants={wireframeReveal} className="w-full py-4 px-6 wire-border-b flex items-center bg-[#0a0a0a]">
                <span className="font-mono text-sm uppercase tracking-widest">
                    <EditableText value={theme?.customTexts?.noir_testimonials_title || '[ CLIENT_ENDORSEMENTS ]'} field="noir_testimonials_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                </span>
            </motion.div>

            <div className="grid grid-cols-1 @lg:grid-cols-2">
                {testimonials.map((t: any, i: number) => {
                    const isLastOdd = i === testimonials.length - 1 && testimonials.length % 2 !== 0;
                    return (
                        <motion.div key={t.id || i} variants={wireframeReveal} className={`p-8 @md:p-12 flex flex-col justify-between wire-border-b ${!isLastOdd && i % 2 === 0 ? '@lg:wire-border-r' : ''} ${isLastOdd ? '@lg:col-span-2' : ''} group hover-invert transition-colors`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full border border-white/20 group-hover:border-black/20 overflow-hidden shrink-0">
                                    {t.avatarUrl ? (
                                        <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale-[100%] contrast-[1.2]" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-mono font-bold bg-white/5 group-hover:bg-black/5 text-white group-hover:text-black">
                                            {t.clientName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-sans font-black uppercase text-lg leading-tight tracking-tight">{t.clientName}</h4>
                                    <p className="font-mono text-[10px] uppercase text-white/50 group-hover:text-black/50">{t.company || 'CLIENT'}</p>
                                </div>
                                <div className="ml-auto flex gap-1">
                                    {[...Array(5)].map((_, idx) => (
                                        <i key={idx} className={`text-[10px] ${idx < t.rating ? 'fas fa-star text-white group-hover:text-black' : 'far fa-star text-white/20 group-hover:text-black/20'}`}></i>
                                    ))}
                                </div>
                            </div>
                            <p className="font-sans text-lg @md:text-xl font-medium leading-relaxed italic">
                                "{t.content}"
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
};
