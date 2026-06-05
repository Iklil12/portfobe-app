"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechAboutBlock({ theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-2xl' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-transparent' : cardStyle === 'flat' ? 'bg-[#09090b] border-2 border-zinc-800' : 'bg-[#09090b] border-2 border-zinc-800 hover:shadow-[8px_8px_0_0_var(--theme-color)]';

    const rawThemeColor = theme?.themeColor || "#DFFF00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#ff9e00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    return (
        <section className="px-6 @md:px-12 py-20 @md:py-24 border-y-2 border-zinc-800">
            <div className={`w-full max-w-4xl ${cardStyleClassDark} ${cardRadiusClass} p-8 @md:p-12 mx-auto`} style={{ '--theme-color': themeColor } as any}>
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                >
                    <span className="acid-text font-bold text-[10px] @md:text-xs uppercase tracking-[0.2em] mb-4 block acid-body">
                        <EditableText value={theme?.customTexts?.acid_about_subtitle || 'SYSTEM: INFORMATION'} field="acid_about_subtitle" entity="appearance" isEditor={isEditor} as="span" />
                    </span>
                    <h2 className={`acid-heading font-extrabold uppercase tracking-tighter text-3xl @md:text-5xl text-[#fafafa] mb-8 leading-tight`}>
                        <EditableText value={theme?.customTexts?.acid_about_title || 'Pushing Boundaries of Digital Experience'} field="acid_about_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h2>
                    <p className="text-zinc-400 font-medium leading-relaxed acid-body text-sm @md:text-lg">
                        <EditableText 
                            value={theme?.customTexts?.acid_about_content || "We exist at the intersection of technology and art, creating experiences that challenge the status quo. Our methodology strips away the unnecessary, leaving only pure, impactful interactions that resonate with the digital native generation."} 
                            field="acid_about_content" 
                            entity="appearance" 
                            isEditor={isEditor} 
                            as="span" 
                        />
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
