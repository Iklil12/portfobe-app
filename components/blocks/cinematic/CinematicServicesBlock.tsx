"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicServicesBlock({ theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const defaultServices = [
        {
            id: 1,
            titleKey: 'cinematic_svc1_title',
            descKey: 'cinematic_svc1_desc',
            delivKey: 'cinematic_svc1_deliv',
            priceKey: 'cinematic_svc1_price',
            defTitle: 'Directing',
            defDesc: 'Leading the creative vision on set, ensuring every performance and shot aligns with the core narrative of your film or commercial.',
            defDeliv: 'On-set Vision',
            defPrice: 'Contact'
        },
        {
            id: 2,
            titleKey: 'cinematic_svc2_title',
            descKey: 'cinematic_svc2_desc',
            delivKey: 'cinematic_svc2_deliv',
            priceKey: 'cinematic_svc2_price',
            defTitle: 'Cinematography',
            defDesc: 'Painting with light and shadow. We use industry-leading camera systems to capture visually stunning imagery that elevates your story.',
            defDeliv: 'Visual Capture',
            defPrice: 'Contact'
        },
        {
            id: 3,
            titleKey: 'cinematic_svc3_title',
            descKey: 'cinematic_svc3_desc',
            delivKey: 'cinematic_svc3_deliv',
            priceKey: 'cinematic_svc3_price',
            defTitle: 'Post-Production',
            defDesc: 'The final polish. From offline editing to professional color grading and sound design, we bring the raw footage to life.',
            defDeliv: 'Final Edit & Color',
            defPrice: 'Contact'
        }
    ];

    const toggleVisibility = (id: number, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `cinematic_svc_${id}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    return (
        <section className={`py-16 @md:py-24 px-6 @md:px-12 border-b border-[#1f1f1f] bg-[#050505]`}>
            <div className="flex justify-between items-end mb-8 @md:mb-12">
                <h2 className="font-black uppercase tracking-tighter text-3xl @md:text-5xl @lg:text-[clamp(2.5rem,8cqi,5rem)]">
                    <EditableText value={customTexts.cinematic_services_title || 'Services'} field="cinematic_services_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
            </div>
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-4 @md:gap-8">
                {defaultServices.map((s, i) => {
                    const isVisible = customTexts[`cinematic_svc_${s.id}_visible`] !== 'false';
                    if (!isVisible && !isEditor) return null;

                    return (
                        <motion.div 
                            key={`service-${s.id}`} 
                            initial={{ opacity: 0, y: 20 }} 
                            {...{ [animationTrigger]: { opacity: isVisible ? 1 : 0.4, y: 0 } }} 
                            transition={{ duration: 0.5, delay: i * 0.1 }} 
                            className={`border border-[#1f1f1f] p-5 @md:p-8 hover:border-white/20 transition-all flex flex-col justify-between relative ${
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
                                    title={isVisible ? "Sembunyikan Layanan" : "Tampilkan Layanan"}
                                >
                                    {isVisible ? "✕ Sembunyikan" : "➕ Tampilkan"}
                                </button>
                            )}

                            <div>
                                <EditableText value={customTexts[s.titleKey] || s.defTitle} field={s.titleKey} entity="appearance" isEditor={isEditor} as="h3" className="font-bold uppercase tracking-tighter text-lg @md:text-2xl mb-2 @md:mb-4 text-white" />
                                <EditableText value={customTexts[s.descKey] || s.defDesc} field={s.descKey} entity="appearance" isEditor={isEditor} as="p" className="text-xs @md:text-sm text-gray-500 mb-4 @md:mb-6 leading-relaxed" />
                            </div>
                            <div className="flex justify-between items-center font-mono text-[11px] @md:text-sm mt-auto pt-3 @md:pt-4 border-t border-[#1f1f1f]/50">
                                <EditableText value={customTexts[s.delivKey] || s.defDeliv} field={s.delivKey} entity="appearance" isEditor={isEditor} as="span" className="text-white/60" />
                                <EditableText value={customTexts[s.priceKey] || s.defPrice} field={s.priceKey} entity="appearance" isEditor={isEditor} as="span" className="text-white font-bold" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
