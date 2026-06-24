"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
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
        <div className="grid gap-4 @lg:gap-6 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 w-full">
            
            {/* Title Card */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-8 flex flex-col justify-between min-h-[220px] relative overflow-hidden`}
            >
                <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.02] pointer-events-none select-none text-[6rem] font-black tracking-widest uppercase font-mono">
                    AWD
                </div>
                
                <div className="flex items-center justify-between z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--hl)]">
                        <i className="fas fa-award text-sm"></i>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        Node.07 // Credentials
                    </span>
                </div>

                <div className="mt-6 z-10">
                    <h3 className="text-xl font-sans font-black text-white leading-tight uppercase tracking-tight">
                        Honors & Awards
                    </h3>
                    <p className="text-[9px] font-mono text-slate-400 mt-2 uppercase tracking-wider">
                        {awardItems.length} CERTIFICATES VERIFIED
                    </p>
                </div>
            </motion.div>

            {/* Award Cards */}
            {awardItems.slice(0, 4).map((award: any, i: number) => (
                <motion.div 
                    key={i}
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    onClick={() => !isEditor && award.mediaUrl && setSelectedMedia({ url: award.mediaUrl, title: award.title, type: 'certificate' })}
                    className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-5 flex flex-col justify-between min-h-[220px] relative group cursor-pointer overflow-hidden`}
                >
                    {/* Hover Glow */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 bg-[var(--hl)]" />

                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-black relative border border-white/5 z-10">
                        <LazyImage src={award.mediaUrl} alt={award.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                    </div>

                    <div className="mt-4 flex-1 flex flex-col justify-end z-10">
                        <h4 className="text-sm font-extrabold text-white line-clamp-2 leading-snug group-hover:text-[var(--hl)] transition-colors uppercase tracking-tight">{award.title}</h4>
                        <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest font-mono font-bold">{award.issuer}</p>
                    </div>
                </motion.div>
            ))}

        </div>
    );
}
