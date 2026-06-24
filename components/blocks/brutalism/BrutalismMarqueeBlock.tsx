"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismMarqueeBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const brutalEase = [0, 0, 0, 1] as any;
    
    const MarqueeContent = () => (
        <span className="w-1/2 flex justify-around">
            <span><EditableText value={theme?.customTexts?.brutal_marquee_1 || 'RAW'} field="brutal_marquee_1" entity="appearance" isEditor={isEditor} as="span" /></span>
            <span>*</span>
            <span><EditableText value={theme?.customTexts?.brutal_marquee_2 || 'UNAPOLOGETIC'} field="brutal_marquee_2" entity="appearance" isEditor={isEditor} as="span" /></span>
            <span>*</span>
            <span><EditableText value={theme?.customTexts?.brutal_marquee_3 || 'SYSTEMATIC'} field="brutal_marquee_3" entity="appearance" isEditor={isEditor} as="span" /></span>
            <span>*</span>
        </span>
    );

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    return (
        <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal}
            className={`w-full border-b-[3px] border-black overflow-hidden py-4 flex bg-black text-white font-mono text-2xl @sm:text-4xl font-black uppercase tracking-widest group`}
        >
            <div className={`w-[200%] flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]`}>
                <MarqueeContent />
                <MarqueeContent />
            </div>
        </motion.div>
    );
}
