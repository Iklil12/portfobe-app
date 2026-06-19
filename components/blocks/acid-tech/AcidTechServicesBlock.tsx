"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechServicesBlock({ theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-2xl' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-zinc-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'flat' ? 'bg-black border border-zinc-800' : 'bg-black border border-zinc-800 hover:shadow-[6px_6px_0_0_var(--tc)]';

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const toggleVisibility = (index: number, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `acid_service_${index}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    const services = [0, 1, 2];

    return (
        <section className="px-4 md:px-12 py-16 md:py-24 bg-black border-y border-[var(--tc)]/20 font-mono text-white" style={{ '--tc': themeColor } as React.CSSProperties}>
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                className="w-full max-w-[90rem] mx-auto px-2 md:px-16"
            >
                <motion.div variants={fadeUp} className="mb-10">
                    <span className="text-[var(--tc)] font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-3 block">
                        [ <EditableText value={customTexts.acid_services_subtitle || 'CAPABILITIES'} field="acid_services_subtitle" entity="appearance" isEditor={isEditor} as="span" /> ]
                    </span>
                    <h2 className="font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-white">
                        <EditableText value={customTexts.acid_services_title || 'CORE SERVICES'} field="acid_services_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {services.map((i) => {
                        const isVisible = customTexts[`acid_service_${i}_visible`] !== 'false';
                        if (!isVisible && !isEditor) return null;

                        return (
                            <motion.div 
                                key={`service-${i}`} variants={fadeUp} 
                                className={`p-5 md:p-8 pt-9 flex flex-col relative ${cardStyleClassDark} ${cardRadiusClass} ${
                                    !isVisible ? 'opacity-40 bg-zinc-950/20' : ''
                                }`}
                            >
                                {/* Tab top decor */}
                                <div className="absolute top-0 left-0 right-0 h-6 bg-zinc-950 border-b border-zinc-900 px-3 py-1 flex justify-between items-center text-[7px] text-[var(--tc)]/60">
                                    <span>NODE_SRV // 0{i + 1}</span>
                                    <span>STATUS: ONLINE</span>
                                </div>

                                {isEditor && (
                                    <button
                                        onClick={() => toggleVisibility(i, isVisible)}
                                        className="absolute top-8 right-4 z-30 px-2 py-0.5 text-[8px] font-mono border border-zinc-800 transition-all text-zinc-500 hover:text-white"
                                        title={isVisible ? "Sembunyikan Layanan" : "Tampilkan Layanan"}
                                    >
                                        {isVisible ? "✕ HIDE" : "➕ SHOW"}
                                    </button>
                                )}

                                <h3 className="font-extrabold text-lg md:text-xl text-white uppercase tracking-tight mb-3 mt-2">
                                    <EditableText value={customTexts[`acid_service_${i}_title`] || `Service 0${i + 1}`} field={`acid_service_${i}_title`} entity="appearance" isEditor={isEditor} as="span" />
                                </h3>
                                <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed mb-5">
                                    <span className="text-[var(--tc)] mr-1.5">&gt;</span>
                                    <EditableText value={customTexts[`acid_service_${i}_desc`] || 'High-performance delivery with ruthless efficiency and uncompromising quality.'} field={`acid_service_${i}_desc`} entity="appearance" isEditor={isEditor} as="span" />
                                </p>
                                <div className="mt-auto flex justify-between items-center border-t border-zinc-900 pt-4 text-[9px] md:text-[10px]">
                                    <span className="font-bold uppercase tracking-widest text-zinc-500">
                                        ESTIMATE {!isVisible && "[HIDDEN]"}
                                    </span>
                                    <span className="text-[var(--tc)] font-extrabold text-xs md:text-sm">
                                        <EditableText value={customTexts[`acid_service_${i}_price`] || '$500'} field={`acid_service_${i}_price`} entity="appearance" isEditor={isEditor} as="span" />
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}
