"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function BentoGridServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    const toggleVisibility = (num: number, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `bento_service_${num}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    const services = [1, 2, 3];

    return (
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 w-full">
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col p-6 @lg:p-10 w-full`}
            >
                <h3 className="text-xl @md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <i className="fas fa-briefcase text-[var(--hl)]"></i>
                    <EditableText value={customTexts.bento_services_title || 'Services'} field="bento_services_title" entity="appearance" isEditor={isEditor} as="span" />
                </h3>
                <div className={`grid gap-4 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3`}>
                    {services.map((num) => {
                        const isVisible = customTexts[`bento_service_${num}_visible`] !== 'false';
                        if (!isVisible && !isEditor) return null;

                        return (
                            <div 
                                key={num} 
                                className={`${cardStyleClass} ${cardRadiusClass} flex flex-col gap-4 p-6 hover:bg-white/5 transition-all group relative ${
                                    !isVisible ? 'opacity-40 bg-zinc-900/20' : ''
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

                                <h4 className="font-bold text-white text-xl group-hover:text-[var(--hl)] transition-colors">
                                    <EditableText value={customTexts[`bento_service_title_${num}`] || `Service ${num}`} field={`bento_service_title_${num}`} entity="appearance" isEditor={isEditor} as="span" />
                                </h4>
                                <p className="text-slate-400 font-medium leading-relaxed text-sm">
                                    <EditableText value={customTexts[`bento_service_desc_${num}`] || 'Service description goes here...'} field={`bento_service_desc_${num}`} entity="appearance" isEditor={isEditor} as="span" />
                                </p>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
