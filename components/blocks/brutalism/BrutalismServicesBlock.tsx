"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { hardShadow, radiusClass } = useContext(BrutalismContext);
    const customTexts = theme?.customTexts || {};
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const brutalEase = [0, 0, 0, 1] as any;
    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };
    const staggerContainer = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    const toggleVisibility = (num: number, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `brutal_service_${num}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    const services = [1, 2, 3];

    return (
        <section className="w-full flex flex-col border-b-[3px] border-black bg-[#f4f4f0]">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className={"p-6 border-b-[3px] border-black bg-white"}>
                <h2 className={"custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter"}>
                    <EditableText value={customTexts.brutal_services_title || 'CORE_SERVICES'} field="brutal_services_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
            </motion.div>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer} className={"p-6 @sm:p-12 grid grid-cols-1 @md:grid-cols-3 gap-6 bg-[#f4f4f0]"}>
                {services.map((num) => {
                    const isVisible = customTexts[`brutal_service_${num}_visible`] !== 'false';
                    if (!isVisible && !isEditor) return null;

                    return (
                        <motion.div 
                            key={num} 
                            variants={starkReveal} 
                            className={`bg-white border-[3px] border-black p-6 @sm:p-8 flex flex-col relative ${hardShadow} ${radiusClass} ${
                                !isVisible ? 'opacity-40 bg-zinc-100' : ''
                            }`}
                        >
                            {isEditor && (
                                <button
                                    onClick={() => toggleVisibility(num, isVisible)}
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

                            <div className="font-mono text-xs font-bold uppercase bg-black text-white px-2 py-1 w-max mb-4">
                                SVC_0{num} {!isVisible && "[HIDDEN]"}
                            </div>
                            <h3 className="custom-heading text-xl @sm:text-2xl font-black uppercase mb-4 leading-tight">
                                <EditableText value={customTexts[`brutal_service_title_${num}`] || `Service ${num}`} field={`brutal_service_title_${num}`} entity="appearance" isEditor={isEditor} as="span" />
                            </h3>
                            <p className="custom-body font-mono text-xs @sm:text-sm font-bold uppercase text-slate-600 leading-relaxed">
                                <EditableText value={customTexts[`brutal_service_desc_${num}`] || 'Detailed service description goes here...'} field={`brutal_service_desc_${num}`} entity="appearance" isEditor={isEditor} as="span" />
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
