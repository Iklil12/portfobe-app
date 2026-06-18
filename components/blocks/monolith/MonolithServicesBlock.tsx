"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function MonolithServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const services = [
        { id: '1', defaultTitle: 'SYSTEM ARCHITECTURE', defaultDesc: 'Designing scalable and robust technical foundations for enterprise-grade applications.', defaultPrice: '5,000' },
        { id: '2', defaultTitle: 'UI/UX ENGINEERING', defaultDesc: 'Crafting pixel-perfect, highly interactive user interfaces that bridge aesthetics and functionality.', defaultPrice: '3,000' },
        { id: '3', defaultTitle: 'PERFORMANCE OPTIMIZATION', defaultDesc: 'Analyzing and refactoring codebases to achieve maximum speed and efficiency.', defaultPrice: '2,000' }
    ];

    const toggleVisibility = (id: string, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `monolith_svc_${id}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    return (
        <section className="relative z-20 w-full bg-[#050505] py-20 @md:py-32 border-t border-white/5">
            <div className="flex justify-between items-end mb-12 @md:mb-20 px-6 @md:px-12">
                <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi]">
                    <EditableText value={customTexts.monolith_services_title || 'Capabilities'} field="monolith_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /><br/><span className="italic text-[var(--hl)]"><EditableText value={customTexts.monolith_services_subtitle || '& Offerings'} field="monolith_services_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                </motion.h2>
            </div>
            
            <div className="w-full flex flex-col border-t border-white/10">
                {services.map((s, i) => {
                    const isVisible = customTexts[`monolith_svc_${s.id}_visible`] !== 'false';
                    if (!isVisible && !isEditor) return null;

                    return (
                        <motion.div
                            key={s.id}
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                            className={`w-full border-b border-white/10 flex justify-between group hover:bg-white/5 transition-all duration-500 flex-col gap-4 py-8 px-6 @md:flex-row @md:items-center @md:gap-12 @md:py-12 @md:px-12 relative ${
                                !isVisible ? 'opacity-40 bg-zinc-950/20' : ''
                            }`}
                        >
                            {isEditor && (
                                <button
                                    onClick={() => toggleVisibility(s.id, isVisible)}
                                    className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all ${
                                        isVisible 
                                            ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                            : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                    }`}
                                    title={isVisible ? "Sembunyikan" : "Tampilkan"}
                                >
                                    {isVisible ? "✕ Sembunyikan" : "➕ Tampilkan"}
                                </button>
                            )}

                            <div className={`flex w-full flex-col gap-2 @md:flex-row @md:items-center @md:gap-12 @md:w-1/2`}>
                                <span className={`font-sans font-bold uppercase tracking-[0.2em] text-slate-600 group-hover:text-[var(--hl)] transition-colors w-12 text-sm`}>
                                    {String(i + 1).padStart(2, '0')} {!isVisible && "[HIDDEN]"}
                                </span>
                                <h3 className={`font-serif text-white leading-tight text-3xl @md:text-4xl group-hover:text-white transition-colors`}>
                                    <EditableText value={customTexts[`monolith_svc_${s.id}_title`] || s.defaultTitle} field={`monolith_svc_${s.id}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                                </h3>
                            </div>
                            <div className={`w-full flex flex-col @md:w-1/3`}>
                                <p className="font-sans text-sm @md:text-base text-slate-400 leading-relaxed">
                                    <EditableText value={customTexts[`monolith_svc_${s.id}_desc`] || s.defaultDesc} field={`monolith_svc_${s.id}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={120} />
                                </p>
                            </div>
                            <div className={`w-full flex justify-end items-center @md:w-1/6`}>
                                <span className={`font-sans font-bold uppercase tracking-widest text-[var(--hl)] text-sm`}>
                                    <EditableText value={customTexts.monolith_services_from || 'From'} field="monolith_services_from" entity="appearance" isEditor={isEditor} as="span" maxLength={10} /> $<EditableText value={customTexts[`monolith_svc_${s.id}_price`] || s.defaultPrice} field={`monolith_svc_${s.id}_price`} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
