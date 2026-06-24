"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

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

    const monolithEase = [0.22, 1, 0.36, 1] as any;
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.25, delayChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 80, scale: 0.92, filter: 'blur(12px)' },
        visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.4, ease: monolithEase } }
    };
    const headerVariants = {
        hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: monolithEase } }
    };

    const buttonShape = theme?.buttonShape || 'rounded';
    const cardRadiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-[40px]' : 'rounded-[24px] @md:rounded-[32px]';

    const visibleServices = services.filter(s => isEditor || customTexts[`monolith_svc_${s.id}_visible`] !== 'false');

    return (
        <motion.section
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.08 }} variants={staggerContainer}
            className="relative z-20 w-full bg-[#050505] px-4 py-12 @md:px-12 @md:py-32 flex flex-col overflow-hidden"
        >
            {/* Top ambient line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Section Header */}
            <motion.div variants={headerVariants} className="flex flex-col @md:flex-row @md:justify-between @md:items-end gap-4 mb-8 @md:mb-20">
                <div className="flex flex-col gap-3">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">
                        <EditableText value={customTexts.monolith_services_label || 'What I Offer'} field="monolith_services_label" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                    </span>
                    <h2 className="font-serif text-2xl @md:text-6xl @lg:text-[5.5cqi] leading-[0.9] text-white">
                        <EditableText value={customTexts.monolith_services_title || 'Capabilities'} field="monolith_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                        <br />
                        <span className="italic text-[var(--hl)]">
                            <EditableText value={customTexts.monolith_services_subtitle || '& Offerings'} field="monolith_services_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                        </span>
                    </h2>
                </div>
            </motion.div>

            {/* Monolith Slabs Grid */}
            <div className="grid grid-cols-1 @lg:grid-cols-3 gap-3 @md:gap-6 w-full">
                {visibleServices.map((s, i) => {
                    const isVisible = customTexts[`monolith_svc_${s.id}_visible`] !== 'false';

                    return (
                        <motion.div
                            key={s.id}
                            variants={itemVariants}
                            className={`relative group ${!isVisible ? 'opacity-40' : ''}`}
                        >
                            <div className={`relative flex flex-col justify-between h-full min-h-[240px] @md:min-h-[420px] ${cardRadiusClass} border border-white/[0.04] bg-[#080808] overflow-hidden transition-all duration-700 group-hover:border-white/[0.08] group-hover:bg-[#0a0a0a]`}>

                                {/* Radial glow on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--hl), transparent 70%)', opacity: 0 }}>
                                </div>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--hl), transparent 70%)' }}>
                                </div>

                                {/* Top section */}
                                <div className="relative z-10 p-4 @md:p-8 flex flex-col">
                                    {/* Outlined number */}
                                    <span className="font-serif text-[50px] @md:text-[100px] leading-none font-light select-none text-outline group-hover:text-[var(--hl)] transition-all duration-700" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.06)', color: 'transparent' }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>

                                    {/* Title */}
                                    <h3 className="font-serif text-base @md:text-2xl leading-tight text-white mt-2 @md:mt-6 group-hover:text-[var(--hl)] transition-colors duration-500">
                                        <EditableText value={customTexts[`monolith_svc_${s.id}_title`] || s.defaultTitle} field={`monolith_svc_${s.id}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                                    </h3>

                                    {/* Description */}
                                    <p className="font-sans text-[13px] @md:text-sm text-white/40 @md:text-white/15 @md:group-hover:text-white/40 transition-colors duration-700 leading-relaxed mt-1.5 @md:mt-4">
                                        <EditableText value={customTexts[`monolith_svc_${s.id}_desc`] || s.defaultDesc} field={`monolith_svc_${s.id}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={120} />
                                    </p>
                                </div>

                                {/* Bottom section: Price + line */}
                                <div className="relative z-10 p-4 @md:p-8 pt-0">
                                    <div className="h-[1px] w-full bg-white/[0.04] mb-3 @md:mb-6"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 @md:text-white/15 @md:group-hover:text-white/30 transition-colors duration-500">
                                            <EditableText value={customTexts.monolith_services_from || 'Starting from'} field="monolith_services_from" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                                        </span>
                                        <span className="font-serif text-xl @md:text-2xl text-white/60 @md:text-white/20 @md:group-hover:text-[var(--hl)] transition-colors duration-500 italic">
                                            $<EditableText value={customTexts[`monolith_svc_${s.id}_price`] || s.defaultPrice} field={`monolith_svc_${s.id}_price`} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Editor Controls */}
                            {isEditor && (
                                <button
                                    onClick={() => toggleVisibility(s.id, isVisible)}
                                    className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all ${cardRadiusClass} ${
                                        isVisible 
                                            ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                            : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                    }`}
                                    title={isVisible ? "Sembunyikan" : "Tampilkan"}
                                >
                                    {isVisible ? "✕ Hide" : "➕ Show"}
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}
