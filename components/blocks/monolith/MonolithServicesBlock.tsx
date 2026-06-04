"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function MonolithServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    // Murni statis, tidak menggunakan data dari database
    const services = [
        { id: '1', defaultTitle: 'SYSTEM ARCHITECTURE', defaultDesc: 'Designing scalable and robust technical foundations for enterprise-grade applications.', defaultPrice: '5,000' },
        { id: '2', defaultTitle: 'UI/UX ENGINEERING', defaultDesc: 'Crafting pixel-perfect, highly interactive user interfaces that bridge aesthetics and functionality.', defaultPrice: '3,000' },
        { id: '3', defaultTitle: 'PERFORMANCE OPTIMIZATION', defaultDesc: 'Analyzing and refactoring codebases to achieve maximum speed and efficiency.', defaultPrice: '2,000' }
    ];

    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    return (
        <section className="relative z-20 w-full bg-[#050505] py-20 @md:py-32 border-t border-white/5">
            <div className="flex justify-between items-end mb-12 @md:mb-20 px-6 @md:px-12">
                <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi]">
                    <EditableText value={theme?.customTexts?.monolith_services_title || 'Capabilities'} field="monolith_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /><br/><span className="italic text-[var(--hl)]"><EditableText value={theme?.customTexts?.monolith_services_subtitle || '& Offerings'} field="monolith_services_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                </motion.h2>
            </div>
            
            <div className="w-full flex flex-col border-t border-white/10">
                {services.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                        className={`w-full border-b border-white/10 flex justify-between group hover:bg-white/5 transition-all duration-500 flex-col gap-4 py-8 px-6 @md:flex-row @md:items-center @md:gap-12 @md:py-12 @md:px-12`}
                    >
                        <div className={`flex w-full flex-col gap-2 @md:flex-row @md:items-center @md:gap-12 @md:w-1/2`}>
                            <span className={`font-sans font-bold uppercase tracking-[0.2em] text-slate-600 group-hover:text-[var(--hl)] transition-colors w-12 text-sm`}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3 className={`font-serif text-white leading-tight text-3xl @md:text-4xl group-hover:text-white transition-colors`}>
                                <EditableText value={theme?.customTexts?.[`monolith_svc_${s.id}_title`] || s.defaultTitle} field={`monolith_svc_${s.id}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                            </h3>
                        </div>
                        <div className={`w-full flex flex-col @md:w-1/3`}>
                            <p className="font-sans text-sm @md:text-base text-slate-400 leading-relaxed">
                                <EditableText value={theme?.customTexts?.[`monolith_svc_${s.id}_desc`] || s.defaultDesc} field={`monolith_svc_${s.id}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={120} />
                            </p>
                        </div>
                        <div className={`w-full flex justify-end items-center @md:w-1/6`}>
                            <span className={`font-sans font-bold uppercase tracking-widest text-[var(--hl)] text-sm`}>
                                <EditableText value={theme?.customTexts?.monolith_services_from || 'From'} field="monolith_services_from" entity="appearance" isEditor={isEditor} as="span" maxLength={10} /> $<EditableText value={theme?.customTexts?.[`monolith_svc_${s.id}_price`] || s.defaultPrice} field={`monolith_svc_${s.id}_price`} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
