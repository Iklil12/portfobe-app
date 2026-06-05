"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    return (
        <section className={`py-20 @md:py-24 px-6 @md:px-12 border-b border-[#1f1f1f] bg-[#050505]`}>
            <div className="flex flex-col @md:flex-row justify-between items-start gap-12 max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} {...{ [animationTrigger]: { opacity: 1, x: 0 } }} transition={{ duration: 0.6 }} className="w-full @md:w-1/3">
                    <h2 className={`font-black uppercase tracking-tighter mb-3 cine-heading text-3xl @md:text-5xl text-white`}>
                        <EditableText value={theme?.customTexts?.cinematic_about_title || 'About'} field="cinematic_about_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h2>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} {...{ [animationTrigger]: { opacity: 1, x: 0 } }} transition={{ duration: 0.6 }} className="w-full @md:w-2/3">
                    <EditableText 
                        value={theme?.customTexts?.cinematic_about_content || 'We believe in the power of visual storytelling. Every frame is meticulously crafted to evoke emotion, transcend boundaries, and create an unforgettable cinematic experience.'} 
                        field="cinematic_about_content" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        as="p" 
                        className={`cine-body text-gray-400 leading-relaxed text-lg @md:text-2xl font-light`} 
                    />
                </motion.div>
            </div>
        </section>
    );
}
