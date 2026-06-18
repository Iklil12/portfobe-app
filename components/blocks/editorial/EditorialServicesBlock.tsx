"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function EditorialServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    
    const displayServices = [
        { id: '1', defaultTitle: 'Brand Identity', defaultDesc: 'Crafting cohesive visual systems that resonate.' },
        { id: '2', defaultTitle: 'Digital Design', defaultDesc: 'Interfaces that are intuitive, beautiful, and accessible.' },
        { id: '3', defaultTitle: 'Art Direction', defaultDesc: 'Guiding the creative vision from concept to completion.' }
    ];

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    const toggleVisibility = (id: string, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `editorial_svc_${id}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    return (
        <section id="services" className={`w-full max-w-[1600px] mx-auto flex flex-col px-6 py-12 @md:px-12 @lg:px-20 @md:py-24 border-t border-subtle`}>
            <div className="flex flex-col @lg:flex-row gap-16 @lg:gap-24">
                
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="w-full @lg:w-1/3">
                    <h2 className={`font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl @lg:text-6xl mb-6`}>
                        <EditableText value={customTexts.editorial_services_t1 || 'Core'} field="editorial_services_t1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <EditableText value={customTexts.editorial_services_t2 || 'Expertise'} field="editorial_services_t2" entity="appearance" isEditor={isEditor} as="span" className="font-serif italic text-slate-400" maxLength={20} />
                    </h2>
                    <p className="font-sans text-sm @md:text-base text-slate-500 max-w-sm leading-relaxed">
                        <EditableText value={customTexts.editorial_services_sub || 'A disciplined approach to digital creation, focusing on strategy, design, and seamless execution.'} field="editorial_services_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={150} />
                    </p>
                </motion.div>

                <div className="w-full @lg:w-2/3 flex flex-col border-t border-subtle">
                    {displayServices.map((service, i) => {
                        const isVisible = customTexts[`editorial_svc_${service.id}_visible`] !== 'false';
                        if (!isVisible && !isEditor) return null;

                        return (
                            <motion.div
                                key={service.id}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className={`group flex flex-col @md:flex-row @md:items-start border-b border-subtle py-8 @md:py-12 relative overflow-hidden ${
                                    !isVisible ? 'opacity-40 bg-slate-50' : ''
                                }`}
                            >
                                {isEditor && (
                                    <button
                                        onClick={() => toggleVisibility(service.id, isVisible)}
                                        className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all ${
                                            isVisible 
                                                ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                                : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                        }`}
                                        title={isVisible ? "Sembunyikan Layanan" : "Tampilkan Layanan"}
                                    >
                                        {isVisible ? "✕ Sembunyikan" : "➕ Tampilkan"}
                                    </button>
                                )}

                                {/* Hover Reveal Highlight */}
                                <div className="absolute top-0 left-0 w-full h-full bg-slate-50 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom -z-10"></div>
                                
                                <div className="w-full @md:w-1/3 mb-4 @md:mb-0">
                                    <span className="font-sans text-xs font-bold text-[var(--hl)] uppercase tracking-widest block mb-2">
                                        0{i + 1} // {!isVisible && "[HIDDEN]"}
                                    </span>
                                    <h3 className="font-serif italic text-2xl @md:text-3xl text-[#111] pr-4">
                                        <EditableText value={customTexts[`editorial_svc_${service.id}_title`] || service.defaultTitle} field={`editorial_svc_${service.id}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                                    </h3>
                                </div>
                                
                                <div className="w-full @md:w-2/3">
                                    <p className="font-sans text-sm @md:text-base text-slate-500 leading-relaxed group-hover:text-[#111] transition-colors duration-300">
                                        <EditableText value={customTexts[`editorial_svc_${service.id}_desc`] || service.defaultDesc} field={`editorial_svc_${service.id}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={150} />
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
