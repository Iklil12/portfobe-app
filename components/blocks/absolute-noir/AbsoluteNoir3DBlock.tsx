"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { EditableText } from '@/components/ui/EditableText';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};
const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export const AbsoluteNoir3DBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    if (items3D.length === 0) return null;

    return (
        <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="p-8 @md:p-12 border-t border-white/10 bg-[#050505] text-white wire-border-b grayscale">
            <motion.div
                variants={wireframeReveal}
                className="mb-10 flex flex-col items-center text-center gap-3"
            >
                <div className="flex flex-col items-center">
                    <h2 className="font-sans font-black text-3xl @md:text-5xl tracking-tighter uppercase mb-2">
                        <EditableText value={theme?.customTexts?.noir_models_title || '3D Models'} field="noir_models_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" className="inline-block px-1" />
                    </h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 block">
                        <EditableText value={theme?.customTexts?.noir_models_subtitle || 'Interactive Viewer'} field="noir_models_subtitle" entity="appearance" isEditor={isEditor} maxLength={25} as="span" className="inline-block px-1" />
                    </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 bg-white/5 px-2 py-1 border border-white/10 mt-1">
                    {items3D.length} <EditableText value={theme?.customTexts?.noir_models_assets || 'ASSETS'} field="noir_models_assets" entity="appearance" isEditor={isEditor} maxLength={15} as="span" className="inline-block px-1" />
                </span>
            </motion.div>

            <motion.div
                variants={staggerGrid}
                className="grid grid-cols-1 gap-12"
            >
                {items3D.map((p: any, i: number) => (
                    <motion.div key={p.id || i} variants={wireframeReveal} className="group flex flex-col gap-4">
                        <div className="w-full border border-white/20 bg-[#0a0a0a] overflow-hidden transition-all duration-500 hover:border-white/50 p-1">
                            {/* Interactive3DViewer handles rendering internally */}
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0a" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg @md:text-xl font-black uppercase tracking-tight text-white mb-1">{p.title}</h3>
                                {p.description && <p className="text-xs text-white/60 font-mono max-w-lg">{p.description}</p>}
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 bg-white/5 px-2 py-1 border border-white/10 shrink-0">OBJ</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
};
