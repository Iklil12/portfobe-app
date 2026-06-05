"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';

export function BentoGrid3DBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    if (items3D.length === 0) return null;

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 w-full">
            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim}
                className={`bento-card p-6 @md:p-8 w-full`}
            >
                <div className="flex flex-col @md:flex-row justify-between items-start @md:items-end mb-8 gap-4">
                    <div>
                        <h3 className="text-xl @md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            <i className="fas fa-cube text-[var(--hl)]"></i> 3D Models
                        </h3>
                        <p className="custom-body text-sm text-slate-400 mt-2">Interactive spatial assets</p>
                    </div>
                    <span className={`text-[10px] font-bold tracking-widest uppercase text-[var(--hl)] bg-[#1a1a1d] px-4 py-2 ${radiusClass} border border-white/10`}>{items3D.length} Items</span>
                </div>

                <div className="flex flex-col gap-6">
                    {items3D.map((p: any, i: number) => (
                        <div key={p.id || i} className={`group relative overflow-hidden ${cardStyleClass} ${cardRadiusClass} p-4 hover:border-[var(--hl)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(var(--hl-rgb),0.15)]`}>
                            <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-[#121214]">
                                <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#121214" />
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--hl)]/30 rounded-[24px] pointer-events-none transition-colors duration-300"></div>
                            </div>
                            <div className="flex justify-between items-center mt-6 px-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-1 opacity-60">Asset 0{i+1}</span>
                                    <h4 className="font-bold text-white text-2xl group-hover:text-[var(--hl)] transition-colors">{p.title}</h4>
                                    {p.description && <p className="text-sm text-slate-400 mt-2 line-clamp-2 max-w-2xl">{p.description}</p>}
                                </div>
                                <div className="hidden @md:flex w-12 h-12 rounded-full border border-white/10 items-center justify-center text-slate-500 group-hover:bg-[var(--hl)] group-hover:text-black transition-all">
                                    <i className="fas fa-cube"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
