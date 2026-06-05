"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';

export function BentoGridTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0) return null;

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 w-full">
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col p-6 @lg:p-10 w-full`}
            >
                <h3 className="text-xl @md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <i className="fas fa-comment-dots text-[var(--hl)]"></i> Client Voices
                </h3>
                <div className={`grid gap-4 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3`}>
                    {testimonials.map((t: any, i: number) => (
                        <div
                            key={t.id}
                            className={`${cardStyleClass} ${cardRadiusClass} flex flex-col gap-4 p-6 hover:bg-white/5 transition-colors group`}
                        >
                            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                {t.avatarUrl ? (
                                    <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-12 h-12 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg text-white">
                                        {t.clientName.charAt(0)}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <h4 className="font-bold text-white leading-tight">{t.clientName}</h4>
                                    {t.company && <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t.company}</span>}
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 italic leading-relaxed">
                                "{t.content}"
                            </p>
                            <div className="mt-auto pt-2 flex gap-1">
                                {[...Array(5)].map((_, idx) => (
                                    <i key={idx} className={`text-xs ${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/10'}`}></i>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
