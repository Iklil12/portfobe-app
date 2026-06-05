"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { BrutalismContext } from './BrutalismShell';

export function Brutalism3DBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { hardShadow, radiusClass } = useContext(BrutalismContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    if (items3D.length === 0) return null;

    const brutalEase = [0, 0, 0, 1] as any;

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    return (
        <section className="w-full flex flex-col border-b-[3px] border-black bg-[#f4f4f0]">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className={"p-6 border-b-[3px] border-black bg-white"}>
                <h2 className={"custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter"}>3D_MODELS</h2>
            </motion.div>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer} className="flex flex-col">
                {items3D.map((p: any, i: number) => {
                    return (
                        <motion.div key={i} variants={starkReveal} className={`group flex flex-col bg-white border-b-[3px] border-black brutal-theme-item transition-none`}>
                            <div className={"flex justify-between items-center p-6 border-b-[3px] border-black font-mono text-xs @sm:text-sm font-black uppercase bg-[#f4f4f0] group-hover:bg-black group-hover:text-white transition-none group-hover:border-white"}>
                                <span className="bg-black text-white group-hover:bg-white group-hover:text-black px-4 py-2">3D_RENDER_0{i + 1}</span>
                                <span className="tracking-widest">[{p.title}]</span>
                            </div>
                            <div className={"w-full aspect-[4/3] @md:aspect-video border-b-[3px] border-black bg-gray-200 relative overflow-hidden transition-none p-6 @sm:p-12 bg-[#f4f4f0]"}>
                                <div className={`w-full h-full border-[3px] border-black bg-white overflow-hidden relative ${hardShadow} ${radiusClass}`}>
                                    <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#ffffff" />
                                </div>
                            </div>
                            <div className="p-6 flex flex-col justify-between flex-1">
                                <h3 className={"custom-heading text-2xl @sm:text-3xl font-black uppercase tracking-tighter mb-2 leading-none"}>{p.title}</h3>
                                {p.description && <p className={"custom-body font-mono text-[10px] @sm:text-xs font-bold uppercase leading-relaxed line-clamp-2"}>&gt; {p.description}</p>}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
