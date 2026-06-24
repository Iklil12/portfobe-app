"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { hardShadow, hardShadowHover, radiusClass } = useContext(BrutalismContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const brutalEase = [0, 0, 0, 1] as any;

    const fullName = data?.profile?.fullName || data?.fullName || "JOHN DOE";
    const profession = data?.profile?.profession || data?.profession || "SYSTEM ARCHITECT";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    return (
        <section className="w-full flex flex-col border-b-[3px] border-black bg-[#f4f4f0]">
            {/* Title Bar dengan Retro Controls - Mengikuti Highlight Color */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} 
                className="p-6 border-b-[3px] border-black bg-[var(--hl)] flex justify-between items-center"
            >
                <h2 className="custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter text-black">
                    <EditableText value={theme?.customTexts?.brutal_about_title || 'ABOUT_ME'} field="brutal_about_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
                
                {/* Retro controls window */}
                <div className="flex items-center gap-1.5 hidden @sm:flex font-mono text-xs font-bold border-[3px] border-black bg-white p-1.5 shadow-[3px_3px_0px_0px_#000] select-none">
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">_</span>
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">⧠</span>
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-100">X</span>
                </div>
            </motion.div>

            {/* Sub-bar / Info Toolbar */}
            <div className="w-full bg-white border-b-[3px] border-black px-6 py-3 flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-neutral-50">
                <div className="flex items-center gap-4">
                    <span>PATH: <span className="text-black">/ROOT/ABOUT_ME.LOG</span></span>
                    <span className="hidden @md:inline">|</span>
                    <span className="hidden @md:inline">SIZE: <span className="text-black">2.48 KB</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-pulse border border-black"></span>
                    <span className="text-black">READ_WRITE_ACTIVE</span>
                </div>
            </div>

            {/* Grid Konten Utama */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} 
                className="p-4 @sm:p-12 bg-white grid grid-cols-1 @lg:grid-cols-12 gap-8 @lg:gap-12"
            >
                {/* Kiri: Bio / Statement Besar */}
                <div className="@lg:col-span-8 flex flex-col justify-between">
                    <div className="relative">
                        <div className="absolute -top-8 -left-4 text-8xl font-black text-black/5 select-none font-serif pointer-events-none">“</div>
                        <p className="custom-body font-mono text-sm @sm:text-lg font-bold uppercase leading-relaxed text-black/90 relative z-10">
                            <EditableText value={theme?.customTexts?.brutal_about_text || 'We believe in the power of raw visual storytelling. Every frame is meticulously crafted to evoke emotion, transcend boundaries, and create an unforgettable experience.'} field="brutal_about_text" entity="appearance" isEditor={isEditor} as="span" />
                        </p>
                    </div>

                    {/* Status Dashboard Mini dengan Animasi Hover & Neon Accent */}
                    <div className="mt-8 pt-6 border-t border-dashed border-black/20 grid grid-cols-1 @sm:grid-cols-3 gap-4 font-mono text-[10px] font-black uppercase text-slate-500">
                        <div className={`border-[3px] border-black bg-white p-3 flex flex-col justify-center ${hardShadow} ${hardShadowHover} ${radiusClass} cursor-pointer hover:bg-[var(--hl)] hover:text-black transition-colors duration-150`}>
                            <span className="text-black/40 text-[9px] pointer-events-none">
                                <EditableText value={theme?.customTexts?.brutal_about_dash_label_1 || 'CREATIVE_FLOW:'} field="brutal_about_dash_label_1" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                            </span>
                            <span className="text-black text-[11px] mt-1 font-bold pointer-events-none">
                                <EditableText value={theme?.customTexts?.brutal_about_dash_val_1 || '✓ ACTIVATED'} field="brutal_about_dash_val_1" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                            </span>
                        </div>
                        <div className={`border-[3px] border-black bg-white p-3 flex flex-col justify-center ${hardShadow} ${hardShadowHover} ${radiusClass} cursor-pointer hover:bg-[var(--hl)] hover:text-black transition-colors duration-150`}>
                            <span className="text-black/40 text-[9px] pointer-events-none">
                                <EditableText value={theme?.customTexts?.brutal_about_dash_label_2 || 'CORE_STACK:'} field="brutal_about_dash_label_2" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                            </span>
                            <span className="text-black text-[11px] mt-1 font-bold pointer-events-none">
                                <EditableText value={theme?.customTexts?.brutal_about_dash_val_2 || 'HTML_JS_NEXTJS'} field="brutal_about_dash_val_2" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                            </span>
                        </div>
                        <div className={`border-[3px] border-black bg-white p-3 flex flex-col justify-center ${hardShadow} ${hardShadowHover} ${radiusClass} cursor-pointer hover:bg-[var(--hl)] hover:text-black transition-colors duration-150 group`}>
                            <span className="text-black/45 group-hover:text-white/70 text-[9px] pointer-events-none">
                                <EditableText value={theme?.customTexts?.brutal_about_dash_label_3 || 'HOSTING_ZONE:'} field="brutal_about_dash_label_3" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                            </span>
                            <span className="text-black group-hover:text-white text-[11px] mt-1 font-bold pointer-events-none">
                                <EditableText value={theme?.customTexts?.brutal_about_dash_val_3 || 'VPS_PRODUCTION'} field="brutal_about_dash_val_3" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Kanan: System Specs Widget - Dossier dengan Highlight Color */}
                <div className="@lg:col-span-4 flex flex-col justify-stretch">
                    <div className={`border-[3px] border-black p-6 bg-[var(--hl)] ${hardShadow} ${hardShadowHover} ${radiusClass} flex flex-col justify-between h-full hover:bg-black hover:text-white group transition-all duration-200 cursor-pointer`}>
                        <div>
                            <div className="flex justify-between items-center border-b-[2px] border-black pb-3 mb-4 group-hover:border-white transition-colors duration-200">
                                <span className="text-xs font-black uppercase tracking-wider pointer-events-none">
                                    <EditableText value={theme?.customTexts?.brutal_about_specs_title || 'WORK_STATUS'} field="brutal_about_specs_title" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                                </span>
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black animate-pulse group-hover:bg-[#ff0055] group-hover:border-white transition-colors duration-200"></span>
                            </div>
                            
                            <div className="flex flex-col gap-3 text-[11px] font-bold font-mono">
                                <div className="flex justify-between border-b border-black/20 pb-1 group-hover:border-white/20 transition-colors duration-200">
                                    <span className="text-black/50 group-hover:text-white/50 transition-colors duration-200 pointer-events-none">
                                        <EditableText value={theme?.customTexts?.brutal_about_specs_label_1 || 'AVAILABILITY:'} field="brutal_about_specs_label_1" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                                    </span>
                                    <span className="pointer-events-none">
                                        <EditableText value={theme?.customTexts?.brutal_about_specs_val_1 || 'AVAILABLE FOR HIRE'} field="brutal_about_specs_val_1" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-black/20 pb-1 group-hover:border-white/20 transition-colors duration-200">
                                    <span className="text-black/50 group-hover:text-white/50 transition-colors duration-200 pointer-events-none">
                                        <EditableText value={theme?.customTexts?.brutal_about_specs_label_2 || 'LOCATION:'} field="brutal_about_specs_label_2" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                                    </span>
                                    <span className="pointer-events-none">
                                        <EditableText value={theme?.customTexts?.brutal_about_specs_val_2 || (data?.profile?.location || 'INDONESIA').toUpperCase()} field="brutal_about_specs_val_2" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-black/20 pb-1 group-hover:border-white/20 transition-colors duration-200">
                                    <span className="text-black/50 group-hover:text-white/50 transition-colors duration-200 pointer-events-none">
                                        <EditableText value={theme?.customTexts?.brutal_about_specs_label_3 || 'SPECIALTY:'} field="brutal_about_specs_label_3" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                                    </span>
                                    <span className="pointer-events-none">
                                        <EditableText value={theme?.customTexts?.brutal_about_specs_val_3 || profession.toUpperCase()} field="brutal_about_specs_val_3" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                                    </span>
                                </div>
                                <div className="flex justify-between pb-1">
                                    <span className="text-black/50 group-hover:text-white/50 transition-colors duration-200 pointer-events-none">
                                        <EditableText value={theme?.customTexts?.brutal_about_specs_label_4 || 'WORKING_MODE:'} field="brutal_about_specs_label_4" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                                    </span>
                                    <span className="text-green-600 group-hover:text-green-400 transition-colors duration-200 pointer-events-none">
                                        <EditableText value={theme?.customTexts?.brutal_about_specs_val_4 || 'REMOTE / ASYNC'} field="brutal_about_specs_val_4" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 border-t-[2px] border-black pt-4 flex items-center justify-between font-mono group-hover:border-white transition-colors duration-200">
                            <div className="flex -space-x-1">
                                <span className="w-3 h-3 bg-black border border-white group-hover:bg-white group-hover:border-black transition-colors duration-200"></span>
                                <span className="w-3 h-3 bg-white border border-black group-hover:bg-black group-hover:border-white transition-colors duration-200"></span>
                                <span className="w-3 h-3 bg-[#00ffcc] border border-black group-hover:bg-[#00ffcc] group-hover:border-white transition-colors duration-200"></span>
                            </div>
                            <span className="text-[10px] font-black tracking-widest pointer-events-none">
                                <EditableText value={theme?.customTexts?.brutal_about_specs_footer || '[ HIRE_ME ]'} field="brutal_about_specs_footer" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
