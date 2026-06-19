"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { BentoGridContext } from './BentoGridShell';

export function BentoGridAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div id="about" className="grid gap-4 @lg:gap-6 grid-cols-1 @lg:grid-cols-3 w-full scroll-mt-24">
            
            {/* Card 1: Main Story (col-span-2) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card ${cardStyleClass} ${cardRadiusClass} flex flex-col justify-between p-8 @lg:p-10 @lg:col-span-2 relative overflow-hidden`}
            >
                {/* Subtle background graphic */}
                <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.02] pointer-events-none select-none text-[8rem] font-black tracking-widest uppercase font-mono">
                    STORY
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <i className="fas fa-fingerprint text-[var(--hl)] text-sm"></i>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                            <EditableText value={theme?.customTexts?.bento_about_label || 'PROFILE STORY'} field="bento_about_label" entity="appearance" isEditor={isEditor} as="span" />
                        </span>
                    </div>

                    <h3 className="text-3xl @lg:text-4xl font-sans font-black text-white leading-tight mb-6 uppercase tracking-tight">
                        <EditableText value={theme?.customTexts?.bento_about_title || 'About Me'} field="bento_about_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h3>
                    
                    <p className="text-slate-400 font-medium leading-relaxed text-sm @lg:text-base max-w-3xl">
                        <EditableText value={theme?.customTexts?.bento_about_text || 'We believe in the power of visual storytelling. Every frame is meticulously crafted to evoke emotion, transcend boundaries, and create an unforgettable experience.'} field="bento_about_text" entity="appearance" isEditor={isEditor} as="span" />
                    </p>
                </div>
            </motion.div>

            {/* Card 2: Personal Philosophy (col-span-1) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card ${cardStyleClass} ${cardRadiusClass} flex flex-col justify-between p-8 @lg:p-10 relative overflow-hidden`}
            >
                {/* Glow behind card */}
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-[var(--hl)]/10 blur-xl pointer-events-none" />

                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <i className="fas fa-quote-left text-[var(--hl)] text-sm"></i>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                            PHILOSOPHY
                        </span>
                    </div>

                    <blockquote className="text-white font-extrabold italic text-sm @lg:text-base leading-relaxed mb-6">
                        <EditableText value={theme?.customTexts?.bento_about_quote || '"Design is not just what it looks like and feels like. Design is how it works."'} field="bento_about_quote" entity="appearance" isEditor={isEditor} as="span" />
                    </blockquote>
                </div>

                <div className="space-y-2.5 pt-6 border-t border-white/5 font-mono text-[9px] text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--hl)] font-bold">✦</span>
                        <span className="font-bold tracking-wider uppercase">PIXEL PERFECT EXECUTION</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--hl)] font-bold">✦</span>
                        <span className="font-bold tracking-wider uppercase">USER-CENTERED PATTERNS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--hl)] font-bold">✦</span>
                        <span className="font-bold tracking-wider uppercase">HIGH PERFORMANCE CODE</span>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
