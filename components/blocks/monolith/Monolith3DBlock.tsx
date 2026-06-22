"use client";

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/components/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });
import { EditableText } from '@/components/ui/EditableText';

export function Monolith3DBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    if (items3D.length === 0) return null;

    const buttonShape = theme?.buttonShape || 'rounded';
    const cardRadiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-[40px]' : 'rounded-2xl';
    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#111111] shadow-[0_30px_60px_rgba(255,255,255,0.03)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[6px_6px_0_0_rgba(255,255,255,0.2)]' : 'bg-[#080808] border border-white/10 hover:border-white/30';

    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    return (
        <section className="relative z-20 w-full bg-[#050505] py-20 @md:py-32 border-t border-white/5">
            <div className="flex justify-between items-end mb-12 @md:mb-20 px-6 @md:px-12">
                <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi]">
                    <EditableText value={theme?.customTexts?.monolith_3d_title || 'Interactive'} field="monolith_3d_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /><br/><span className="italic text-[var(--hl)]"><EditableText value={theme?.customTexts?.monolith_3d_subtitle || 'Models'} field="monolith_3d_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                </motion.h2>
            </div>
            <div className="flex flex-col gap-12 @md:gap-20 px-6 @md:px-12 pb-20">
                {items3D.map((p: any, i: number) => (
                    <motion.div
                        key={i}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "50px" }} variants={fadeUp}
                        className={`snap-item relative overflow-hidden group transition-colors duration-500 w-full aspect-[4/5] @md:aspect-video ${cardRadiusClass} ${cardStyleClassDark}`}
                    >
                        <div className="absolute inset-0 bg-[#050505]"></div>
                        <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                        <div className="absolute bottom-0 w-full flex flex-col justify-end p-8 gap-4 @md:p-16 @md:gap-6 pointer-events-none [&_span]:pointer-events-auto [&_h3]:pointer-events-auto [&_p]:pointer-events-auto">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-sans font-bold uppercase tracking-[0.4em] text-[var(--hl)] text-[10px] @md:text-xs">
                                        <EditableText value={theme?.customTexts?.monolith_3d_prefix || 'Spatial Asset'} field="monolith_3d_prefix" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> 0{i+1}
                                    </span>
                                </div>
                                <h3 className="font-serif text-white leading-[1.1] line-clamp-2 text-4xl @md:text-7xl @lg:text-[6cqi]">{p.title}</h3>
                                {p.description && <p className="font-sans text-white/50 text-sm @md:text-lg max-w-2xl mt-4">{p.description}</p>}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
