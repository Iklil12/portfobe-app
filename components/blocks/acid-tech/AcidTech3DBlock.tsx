"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTech3DBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-2xl' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-transparent' : cardStyle === 'flat' ? 'bg-[#09090b] border-2 border-zinc-800' : 'bg-[#09090b] border-2 border-zinc-800 hover:shadow-[8px_8px_0_0_var(--theme-color)]';

    const rawThemeColor = theme?.themeColor || "#DFFF00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#ff9e00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    if (items3D.length === 0 && !isEditor) return null;

    return (
        <section className="p-8 @lg:p-12 border-t-2 border-zinc-800 bg-[#09090b]">
            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
                variants={fadeUp} custom={0.2}
                className="mb-10 flex justify-between items-end"
            >
                <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-[#fafafa] acid-heading flex items-center gap-4">
                    <span className="text-4xl" style={{ color: themeColor }}>3D</span>
                    <span className="text-[#fafafa]">
                        <EditableText value={theme?.customTexts?.acid_3d_title || 'OBJECTS'} field="acid_3d_title" entity="appearance" isEditor={isEditor} as="span" />
                    </span>
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] acid-body" style={{ color: themeColor }}>{items3D.length} FILES</span>
            </motion.div>

            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                variants={staggerContainer}
                className="grid grid-cols-1 gap-8"
            >
                {items3D.map((p: any, i: number) => (
                    <motion.div key={`3d-${p.id || i}`} variants={fadeUp} className="group">
                        <div className={`w-full ${cardStyleClassDark} ${cardRadiusClass} overflow-hidden transition-all duration-300 aspect-[4/3] @md:aspect-video`} style={{ ':hover': { borderColor: themeColor } } as any}>
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0a" />
                        </div>
                        <div className="flex justify-between items-start mt-4">
                            <div>
                                <h3 className="text-base font-extrabold uppercase tracking-tight text-[#fafafa] acid-heading">{p.title}</h3>
                                {p.description && <p className="text-xs text-zinc-500 mt-1 acid-body">{p.description}</p>}
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#09090b] px-2 py-1 shrink-0 acid-body" style={{ backgroundColor: themeColor }}>3D</span>
                        </div>
                    </motion.div>
                ))}
                {items3D.length === 0 && isEditor && (
                    <div className="w-full aspect-video border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-500 uppercase tracking-widest text-xs font-mono">
                        System: No 3D Data Found
                    </div>
                )}
            </motion.div>
        </section>
    );
}
