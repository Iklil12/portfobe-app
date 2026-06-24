"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

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
        <div id="services" className="grid gap-3 @lg:gap-6 grid-cols-2 @lg:grid-cols-3 w-full scroll-mt-24">
            
            {/* Title Card */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-4 @md:p-8 flex flex-col justify-between min-h-[120px] @md:min-h-[180px] relative overflow-hidden col-span-2 @lg:col-span-1`}
            >
                <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.02] pointer-events-none select-none text-[3rem] @md:text-[6rem] font-black tracking-widest uppercase font-mono">
                    SRV
                </div>
                
                <div className="flex items-center justify-between z-10">
                    <div className="w-8 h-8 @md:w-10 @md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--hl)]">
                        <i className="fas fa-briefcase text-sm"></i>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        Node.06 // Services
                    </span>
                </div>

                <div className="mt-3 @md:mt-6 z-10">
                    <h3 className="text-sm @md:text-xl font-sans font-black text-white leading-tight uppercase tracking-tight">
                        <EditableText value={customTexts.bento_services_title || 'Services'} field="bento_services_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h3>
                    <p className="text-[7px] @md:text-[9px] font-mono text-slate-400 mt-1 @md:mt-2 uppercase tracking-wider">
                        {services.filter(num => customTexts[`bento_service_${num}_visible`] !== 'false').length} SERVICE CHANNELS ACTIVE
                    </p>
                </div>
            </motion.div>

            {/* Service Cards */}
            {services.map((num) => {
                const isVisible = customTexts[`bento_service_${num}_visible`] !== 'false';
                if (!isVisible && !isEditor) return null;

                return (
                    <motion.div 
                        key={num}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                        className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-4 @md:p-6 flex flex-col justify-between min-h-[120px] @md:min-h-[180px] relative group overflow-hidden ${
                            !isVisible ? 'opacity-40 bg-zinc-900/20' : ''
                        }`}
                    >
                        {/* Hover Glow */}
                        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 bg-[var(--hl)]" />

                        <div className="flex justify-between items-center z-10">
                            <span className="text-[7px] @md:text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                                SRV.0{num}
                            </span>
                            
                            {isEditor && (
                                <button
                                    onClick={() => toggleVisibility(num, isVisible)}
                                    className={`px-2 py-0.5 text-[8px] font-mono border rounded transition-all ${
                                        isVisible 
                                            ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                            : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                    }`}
                                    title={isVisible ? "Sembunyikan Layanan" : "Tampilkan Layanan"}
                                >
                                    {isVisible ? "✕ HIDE" : "➕ SHOW"}
                                </button>
                            )}
                        </div>

                        <div className="my-2 @md:my-4 z-10">
                            <h4 className="font-extrabold text-white text-xs @md:text-base tracking-tight leading-tight group-hover:text-[var(--hl)] transition-colors uppercase">
                                <EditableText value={customTexts[`bento_service_title_${num}`] || `Service ${num}`} field={`bento_service_title_${num}`} entity="appearance" isEditor={isEditor} as="span" />
                            </h4>
                        </div>

                        <div className="pt-2 @md:pt-3 border-t border-white/5 z-10">
                            <p className="text-slate-400 font-medium leading-relaxed text-[11px] @md:text-sm">
                                <EditableText value={customTexts[`bento_service_desc_${num}`] || 'Service description goes here...'} field={`bento_service_desc_${num}`} entity="appearance" isEditor={isEditor} as="span" />
                            </p>
                        </div>
                    </motion.div>
                );
            })}

        </div>
    );
}
