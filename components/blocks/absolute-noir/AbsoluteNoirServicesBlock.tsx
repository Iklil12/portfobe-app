"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};
const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export const AbsoluteNoirServicesBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const customTexts = theme?.customTexts || {};
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    
    const toggleVisibility = (id: string, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `noir_svc_${id}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    const services = [
        { id: '1', defaultTitle: 'SYSTEM ARCHITECTURE', defaultDesc: 'Designing robust and scalable digital infrastructures.', defaultPrice: '$1200' },
        { id: '2', defaultTitle: 'INTERFACE OPTIMIZATION', defaultDesc: 'Enhancing user flows with minimal cognitive load.', defaultPrice: '$800' },
        { id: '3', defaultTitle: 'DATA VISUALIZATION', defaultDesc: 'Transforming complex datasets into readable aesthetics.', defaultPrice: '$1500' },
        { id: '4', defaultTitle: 'MOTION DYNAMICS', defaultDesc: 'Creating fluid, cinematic interactions and transitions.', defaultPrice: '$900' }
    ];

    return (
        <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full bg-[#050505] text-white flex flex-col">
            <motion.div variants={wireframeReveal} className="w-full py-4 px-6 wire-border-b flex items-center bg-[#0a0a0a]">
                <span className="font-mono text-sm uppercase tracking-widest">
                    <EditableText value={customTexts.noir_services_title || '[ AVAILABLE_PROTOCOLS ]'} field="noir_services_title" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                </span>
            </motion.div>

            <div className="grid grid-cols-1 @lg:grid-cols-2 auto-rows-min">
                {services.map((svc: any, i: number) => {
                    const isVisible = customTexts[`noir_svc_${svc.id}_visible`] !== 'false';
                    if (!isVisible && !isEditor) return null;

                    const isLastOdd = i === services.length - 1 && services.length % 2 !== 0;
                    return (
                        <motion.div 
                            key={svc.id || i} 
                            variants={wireframeReveal} 
                            className={`group flex flex-col p-8 @md:p-12 wire-border-b ${!isLastOdd && i % 2 === 0 ? '@lg:wire-border-r' : ''} ${isLastOdd ? '@lg:col-span-2' : ''} hover-invert transition-all relative ${
                                !isVisible ? 'opacity-40 bg-zinc-900/20' : ''
                            }`}
                        >
                            {isEditor && (
                                <button
                                    onClick={() => toggleVisibility(svc.id, isVisible)}
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

                            <div className="flex justify-between items-start mb-6">
                                <span className="font-mono text-[10px] uppercase border border-white/30 group-hover:border-black px-2 py-1">
                                    SEQ_0{i + 1} {!isVisible && "[DISEMBUNYIKAN]"}
                                </span>
                                <span className="font-mono text-xs uppercase opacity-70 group-hover:opacity-100 flex items-center gap-2">
                                    BASE: <EditableText value={customTexts[`noir_svc_${svc.id}_price`] || svc.defaultPrice} field={`noir_svc_${svc.id}_price`} entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                                </span>
                            </div>
                            
                            <h3 className="font-sans text-2xl @md:text-4xl font-black uppercase tracking-tight mb-4">
                                <EditableText value={customTexts[`noir_svc_${svc.id}_title`] || svc.defaultTitle} field={`noir_svc_${svc.id}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                            </h3>
                            <div className="font-mono text-sm text-white/60 group-hover:text-black leading-relaxed">
                                <EditableText value={customTexts[`noir_svc_${svc.id}_desc`] || svc.defaultDesc} field={`noir_svc_${svc.id}_desc`} entity="appearance" isEditor={isEditor} as="p" maxLength={150} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
};
