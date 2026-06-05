"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechServicesBlock({ theme, isEditor, isCardPreview }: any) {
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
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const services = [1, 2, 3];

    return (
        <section className="px-6 @md:px-12 py-20 @md:py-24">
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
            >
                <motion.div variants={fadeUp} className="mb-12">
                    <span className="acid-text font-bold text-[10px] @md:text-xs uppercase tracking-[0.2em] mb-4 block acid-body">
                        <EditableText value={theme?.customTexts?.acid_services_subtitle || 'CAPABILITIES'} field="acid_services_subtitle" entity="appearance" isEditor={isEditor} as="span" />
                    </span>
                    <h2 className={`acid-heading font-extrabold uppercase tracking-tighter text-4xl @md:text-[clamp(3rem,6cqi,5rem)] text-[#fafafa]`}>
                        <EditableText value={theme?.customTexts?.acid_services_title || 'CORE SERVICES'} field="acid_services_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 @md:grid-cols-3 gap-6 @md:gap-8">
                    {services.map((_, i) => (
                        <motion.div 
                            key={`service-${i}`} variants={fadeUp} 
                            className={`p-6 @md:p-8 flex flex-col ${cardStyleClassDark} ${cardRadiusClass}`}
                            style={{ '--theme-color': themeColor } as any}
                        >
                            <h3 className="acid-heading font-extrabold text-2xl text-white uppercase tracking-tighter mb-4">
                                <EditableText value={theme?.customTexts?.[`acid_service_${i}_title`] || `Service 0${i + 1}`} field={`acid_service_${i}_title`} entity="appearance" isEditor={isEditor} as="span" />
                            </h3>
                            <p className="acid-body text-zinc-400 text-sm leading-relaxed mb-6">
                                <EditableText value={theme?.customTexts?.[`acid_service_${i}_desc`] || 'High-performance delivery with ruthless efficiency and uncompromising quality.'} field={`acid_service_${i}_desc`} entity="appearance" isEditor={isEditor} as="span" />
                            </p>
                            <div className="mt-auto flex justify-between items-center border-t border-zinc-800 pt-4">
                                <span className="acid-body text-[10px] font-bold uppercase tracking-widest text-zinc-500">STARTING AT</span>
                                <span className="acid-text font-extrabold text-lg">
                                    <EditableText value={theme?.customTexts?.[`acid_service_${i}_price`] || '$500'} field={`acid_service_${i}_price`} entity="appearance" isEditor={isEditor} as="span" />
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
