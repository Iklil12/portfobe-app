"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const brutalEase = [0, 0, 0, 1] as any;
    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    return (
        <section className="w-full flex flex-col border-b-[3px] border-black bg-[#f4f4f0]">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className={"p-6 border-b-[3px] border-black bg-[var(--hl)]"}>
                <h2 className={"custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter"}>
                    <EditableText value={theme?.customTexts?.brutal_about_title || 'ABOUT_ME'} field="brutal_about_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
            </motion.div>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className={"p-6 @sm:p-12 bg-white"}>
                <p className="custom-body font-mono text-sm @sm:text-base font-bold uppercase leading-relaxed max-w-4xl">
                    <EditableText value={theme?.customTexts?.brutal_about_text || 'We believe in the power of raw visual storytelling. Every frame is meticulously crafted to evoke emotion, transcend boundaries, and create an unforgettable experience.'} field="brutal_about_text" entity="appearance" isEditor={isEditor} as="span" />
                </p>
            </motion.div>
        </section>
    );
}
