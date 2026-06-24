"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { BentoGridContext } from './BentoGridShell';

export function BentoGridMarqueeBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { highlightColor } = useContext(BentoGridContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const marqueeText = theme?.customTexts?.bento_marquee_text || 'CREATIVE DEVELOPER • NEXT.JS EXPERT • FULLSTACK DEVELOPER • UI/UX DESIGNER •';

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 w-full">
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col lg:flex-row lg:items-center p-5 lg:p-8 gap-4 lg:gap-8 overflow-hidden @lg:col-span-4 @lg:row-span-1 w-full`}
            >
                <div className="shrink-0 z-10">
                    <p className="text-slate-500 text-[10px] font-mono font-bold tracking-widest uppercase mb-1">
                        <EditableText value={theme?.customTexts?.bento_marquee_sub || 'Tech Stack'} field="bento_marquee_sub" entity="appearance" isEditor={isEditor} as="span" />
                    </p>
                    <h4 className="text-xl font-sans font-black text-white whitespace-nowrap uppercase tracking-tight">
                        <EditableText value={theme?.customTexts?.bento_marquee_title || 'My Arsenal'} field="bento_marquee_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h4>
                </div>

                <div className="scroller w-full relative flex items-center group py-2">
                    <div 
                        className={`scroller__inner ${isEditor ? '' : 'group-hover:[animation-play-state:paused]'}`}
                        style={isEditor ? { animation: 'none' } : undefined}
                    >
                        <div className="flex gap-8 pr-8 items-center text-xl @md:text-2xl font-black tracking-widest uppercase font-mono text-white/20 select-none">
                            <span className="flex gap-8 items-center shrink-0">
                                <span className="text-white pointer-events-auto">
                                    <EditableText value={marqueeText} field="bento_marquee_text" entity="appearance" isEditor={isEditor} as="span" />
                                </span>
                                <span className="text-[var(--hl)]">/</span>
                                <span>{marqueeText}</span>
                                <span className="text-[var(--hl)]">/</span>
                                <span>{marqueeText}</span>
                                <span className="text-[var(--hl)]">/</span>
                                <span>{marqueeText}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
