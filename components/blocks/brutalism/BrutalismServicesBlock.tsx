"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
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
            {/* Title Bar dengan retro controls & warna highlight editor */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} 
                className="p-4 @sm:p-6 border-b-[3px] border-black bg-[var(--hl)] flex justify-between items-center"
            >
                <h2 className="custom-heading text-xl @xs:text-2xl @sm:text-4xl @md:text-5xl font-black uppercase tracking-tighter text-black">
                    <EditableText value={customTexts.brutal_services_title || 'CORE_SERVICES'} field="brutal_services_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
                
                {/* Retro controls window */}
                <div className="flex items-center gap-1.5 hidden @sm:flex font-mono text-xs font-bold border-[3px] border-black bg-white p-1.5 shadow-[3px_3px_0px_0px_#000] select-none">
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">_</span>
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">⧠</span>
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-100">X</span>
                </div>
            </motion.div>

            {/* Sub-bar / Info Toolbar */}
            <div className="w-full bg-white border-b-[3px] border-black px-4 @sm:px-6 py-2 flex justify-between items-center text-[9px] @sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-neutral-50">
                <div className="flex items-center gap-2 @sm:gap-4">
                    <span>PATH: <span className="text-black">/ROOT/SERVICES</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--hl)] animate-pulse border border-black"></span>
                    <span className="text-black">ACTIVE</span>
                </div>
            </div>

            {/* Grid Kartu Layanan */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer} 
                className="p-4 @sm:p-12 grid grid-cols-1 @md:grid-cols-3 gap-4 @sm:gap-8 bg-[#f4f4f0]"
            >
                {services.map((num) => {
                    const isVisible = customTexts[`brutal_service_${num}_visible`] !== 'false';
                    if (!isVisible && !isEditor) return null;

                    // Fallbacks for specialty / tech tags
                    const defaultTag = num === 1 ? 'REACT / NEXTJS / TS' : num === 2 ? 'FIGMA / UI / UX' : 'DOCKER / VPS / AWS';

                    return (
                        <motion.div 
                            key={num} 
                            variants={starkReveal} 
                            className={`bg-white border-[3px] border-black p-4 @sm:p-6 @lg:p-8 flex flex-col justify-between relative shadow-[5px_5px_0px_0px_#000] @sm:shadow-[8px_8px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_#000] transition-all cursor-pointer group ${radiusClass} ${
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

                            <div>
                                {/* Service Code Badge */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="font-mono text-[10px] font-black bg-black text-[var(--hl)] px-2 py-1 w-max border border-black uppercase tracking-wider">
                                        SVC_0{num} {!isVisible && "[HIDDEN]"}
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-green-500 group-hover:animate-ping"></span>
                                </div>

                                {/* Title */}
                                <h3 className="custom-heading text-xl @sm:text-2xl font-black uppercase mb-4 leading-tight text-black group-hover:text-[var(--hl)] transition-colors duration-150">
                                    <EditableText value={customTexts[`brutal_service_title_${num}`] || `Service ${num}`} field={`brutal_service_title_${num}`} entity="appearance" isEditor={isEditor} as="span" />
                                </h3>

                                {/* Description */}
                                <p className="custom-body font-mono text-xs @sm:text-sm font-medium uppercase text-slate-600 leading-relaxed mb-6">
                                    <EditableText value={customTexts[`brutal_service_desc_${num}`] || 'Detailed service description goes here...'} field={`brutal_service_desc_${num}`} entity="appearance" isEditor={isEditor} as="span" />
                                </p>
                            </div>

                            {/* Tech Stack / Spec Label at the bottom */}
                            <div className="border-t border-dashed border-black/20 pt-4 mt-auto font-mono text-[9px] text-slate-400 flex justify-between items-center">
                                <span>SPEC_FIELD:</span>
                                <span className="text-black font-bold">
                                    <EditableText value={customTexts[`brutal_service_tag_${num}`] || defaultTag} field={`brutal_service_tag_${num}`} entity="appearance" isEditor={isEditor} as="span" />
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
