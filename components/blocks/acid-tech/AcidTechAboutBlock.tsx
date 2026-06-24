"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function AcidTechAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const [decryptProgress, setDecryptProgress] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setDecryptProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + 5;
            });
        }, 120);
        return () => clearInterval(interval);
    }, []);

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    return (
        <section className="px-6 md:px-16 py-24 bg-black border-y border-[var(--tc)]/20 font-mono text-white" style={{ '--tc': themeColor } as React.CSSProperties}>
            <div className="w-full max-w-[90rem] mx-auto">
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
                >
                    {/* Left Column: Title & Animated HUD Graphics */}
                    <div className="lg:col-span-5 flex flex-col justify-between py-2">
                        <div>
                            <span className="text-[var(--tc)] font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block">
                                [ <EditableText value={theme?.customTexts?.acid_about_subtitle || 'SYSTEM: INFORMATION'} field="acid_about_subtitle" entity="appearance" isEditor={isEditor} as="span" /> ]
                            </span>
                            <h2 className="font-extrabold uppercase tracking-tight text-3xl md:text-5xl text-white leading-tight">
                                <EditableText value={theme?.customTexts?.acid_about_title || 'Pushing Boundaries of Digital Experience'} field="acid_about_title" entity="appearance" isEditor={isEditor} as="span" />
                            </h2>
                        </div>

                        {/* Interactive Decryption Loader Graphic */}
                        <div className="mt-8 lg:mt-16 border-l-2 border-[var(--tc)]/30 pl-6 py-2">
                            <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">// CORE_INTEGRITY_CHECK</div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-[var(--tc)] font-bold">DECRYPT_STAGE:</span>
                                <span className="text-xs text-white font-bold bg-zinc-950 px-2 py-0.5 border border-zinc-900">
                                    {decryptProgress}% {decryptProgress === 100 ? "SUCCESS" : "DECRYPTING..."}
                                </span>
                            </div>
                            {/* Visual Progress Bar */}
                            <div className="w-full max-w-xs h-1.5 bg-zinc-950 border border-zinc-900 mt-2 relative overflow-hidden">
                                <div 
                                    className="h-full bg-[var(--tc)] transition-all duration-150"
                                    style={{ width: `${decryptProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Clean HUD Terminal Viewport */}
                    <div className="lg:col-span-7 flex flex-col justify-between border border-zinc-900 bg-zinc-950/20 relative overflow-hidden">
                        {/* Terminal Header */}
                        <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-900 flex justify-between items-center text-[9px] text-zinc-500 uppercase">
                            <span>SYS_INFODOC // ABOUT_ME.LOG</span>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[var(--tc)] rounded-full animate-pulse"></span>
                                <span className="text-[var(--tc)] font-bold text-[8px]">SYS_ONLINE</span>
                            </div>
                        </div>

                        {/* Viewport Content */}
                        <div className="p-6 md:p-8 font-mono text-xs md:text-sm leading-relaxed text-zinc-400">
                            <span className="text-[var(--tc)] font-bold mr-2">&gt; DECRYPTED_STATEMENT:</span>
                            <EditableText 
                                value={theme?.customTexts?.acid_about_content || "We exist at the intersection of technology and art, creating experiences that challenge the status quo. Our methodology strips away the unnecessary, leaving only pure, impactful interactions that resonate with the digital native generation."} 
                                field="acid_about_content" 
                                entity="appearance" 
                                isEditor={isEditor} 
                                as="span" 
                            />
                        </div>

                        {/* Bottom Structured Technical Badges (Highlights) */}
                        <div className="grid grid-cols-3 border-t border-zinc-900 bg-zinc-950/80">
                            <div className="p-4 border-r border-zinc-900 text-center flex flex-col items-center justify-center">
                                <span className="text-[var(--tc)] text-xs md:text-sm font-extrabold uppercase tracking-wide">
                                    <EditableText value={theme?.customTexts?.acid_about_highlight1_val || '8+ YEARS'} field="acid_about_highlight1_val" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </span>
                                <span className="text-[7px] md:text-[8px] text-zinc-500 uppercase tracking-widest mt-1">
                                    <EditableText value={theme?.customTexts?.acid_about_highlight1_lbl || '[ EXP_LEVEL ]'} field="acid_about_highlight1_lbl" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </span>
                            </div>
                            <div className="p-4 border-r border-zinc-900 text-center flex flex-col items-center justify-center">
                                <span className="text-[var(--tc)] text-xs md:text-sm font-extrabold uppercase tracking-wide">
                                    <EditableText value={theme?.customTexts?.acid_about_highlight2_val || '50+ NODES'} field="acid_about_highlight2_val" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </span>
                                <span className="text-[7px] md:text-[8px] text-zinc-500 uppercase tracking-widest mt-1">
                                    <EditableText value={theme?.customTexts?.acid_about_highlight2_lbl || '[ BUILDS_FINISHED ]'} field="acid_about_highlight2_lbl" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </span>
                            </div>
                            <div className="p-4 text-center flex flex-col items-center justify-center">
                                <span className="text-[var(--tc)] text-xs md:text-sm font-extrabold uppercase tracking-wide">
                                    <EditableText value={theme?.customTexts?.acid_about_highlight3_val || 'SE_ASIA'} field="acid_about_highlight3_val" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </span>
                                <span className="text-[7px] md:text-[8px] text-zinc-500 uppercase tracking-widest mt-1">
                                    <EditableText value={theme?.customTexts?.acid_about_highlight3_lbl || '[ SERVER_NODE ]'} field="acid_about_highlight3_lbl" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
