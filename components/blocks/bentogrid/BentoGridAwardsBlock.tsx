"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { BentoGridContext } from './BentoGridShell';

export function BentoGridAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { setSelectedMedia } = useContext(BentoGridContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const awardItems = data?.certificates || data?.user?.certificates || [];

    if (awardItems.length === 0) return null;

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
                    <i className="fas fa-award text-[var(--hl)]"></i> Honors & Awards
                </h3>
                <div className={`grid gap-4 grid-cols-2 @lg:grid-cols-4`}>
                    {awardItems.slice(0, 4).map((award: any, i: number) => (
                        <div
                            key={i}
                            onClick={() => !isEditor && award.mediaUrl && setSelectedMedia({ url: award.mediaUrl, title: award.title, type: 'certificate' })}
                            className={`${cardStyleClass} ${cardRadiusClass} flex flex-col gap-4 p-4 hover:bg-white/5 transition-colors group cursor-pointer overflow-hidden`}
                        >
                            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black relative border border-white/5">
                                <LazyImage src={award.mediaUrl} alt={award.title} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                            </div>
                            <div className="flex flex-col flex-1">
                                <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[var(--hl)] transition-colors">{award.title}</h4>
                                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">{award.issuer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
