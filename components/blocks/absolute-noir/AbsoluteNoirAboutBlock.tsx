"use client";

import React from 'react';
import { motion } from 'framer-motion';
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

export const AbsoluteNoirAboutBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    return (
        <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full flex flex-col wire-border-b bg-[#050505] text-white">
            <motion.div variants={wireframeReveal} className="w-full p-8 @md:p-12 flex flex-col justify-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50">
                    <EditableText value={theme?.customTexts?.noir_about_label || '[ IDENTIFICATION_DATA ]'} field="noir_about_label" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                </span>
                <h2 className="font-sans font-black text-4xl @md:text-6xl tracking-tighter uppercase mb-6 leading-none">
                    <EditableText value={theme?.customTexts?.noir_about_title || 'OPERATIVE BACKGROUND'} field="noir_about_title" entity="appearance" isEditor={isEditor} maxLength={40} as="span" />
                </h2>
                <div className="font-mono text-sm @md:text-base text-white/80 leading-relaxed max-w-xl">
                    <EditableText value={theme?.customTexts?.noir_about_desc || 'Detailed system logs indicate a history of high-performance output, meticulous attention to structural integrity, and an uncompromising approach to aesthetic minimalism.'} field="noir_about_desc" entity="appearance" isEditor={isEditor} as="p" maxLength={400} />
                </div>
            </motion.div>
        </motion.section>
    );
};
