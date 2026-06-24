"use client";

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/shared/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });
import { EditableText } from '@/shared/ui/EditableText';

export function AcidTech3DBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-2xl' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-zinc-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'flat' ? 'bg-black border border-zinc-800' : 'bg-black border border-zinc-800 hover:shadow-[6px_6px_0_0_var(--tc)]';

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    if (items3D.length === 0 && !isEditor) return null;

    return (
        <section className="py-24 bg-black border-y border-[var(--tc)]/20 font-mono text-white" style={{ '--tc': themeColor } as React.CSSProperties}>
            <div className="max-w-[90rem] mx-auto px-6 md:px-16">
                <motion.div
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
                    variants={fadeUp}
                    className="mb-12 flex flex-col items-center text-center max-w-5xl mx-auto border-b border-zinc-900 pb-6"
                >
                    <span className="text-[var(--tc)] font-bold text-[10px] uppercase tracking-[0.2em] mb-2">[ 3D_RENDER_VIEWPORT ]</span>
                    <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                        <span className="text-3xl text-[var(--tc)]">3D</span>
                        <span>
                            <EditableText value={theme?.customTexts?.acid_3d_title || 'OBJECTS'} field="acid_3d_title" entity="appearance" isEditor={isEditor} as="span" />
                        </span>
                    </h2>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-2">{items3D.length} ACTIVE_SCENES</span>
                </motion.div>

                <motion.div
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                    variants={staggerContainer}
                    className="flex flex-col gap-16 max-w-5xl mx-auto w-full items-center"
                >
                    {items3D.map((p: any, i: number) => (
                        <motion.div key={`3d-${p.id || i}`} variants={fadeUp} className="group relative w-full">
                            {/* Tab header simulated */}
                            <div className="absolute top-0 left-0 right-0 h-6 bg-zinc-950/80 px-3 py-1 flex justify-between items-center text-[8px] text-zinc-500 z-10 border-b border-zinc-900">
                                <span>3D_ENGINE_ACTIVE // INSTANCE_0{i + 1}</span>
                                <span className="text-[var(--tc)]">LOADED_OK</span>
                            </div>

                            <div className={`w-full ${cardStyleClassDark} ${cardRadiusClass} overflow-hidden transition-all duration-300 h-[380px] md:h-[550px] lg:h-[600px] pt-6 border border-zinc-900 group-hover:border-[var(--tc)] shadow-[0_0_30px_rgba(0,255,0,0.01)]`}>
                                <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#000000" />
                            </div>
                            <div className="flex justify-between items-start mt-4 px-1">
                                <div>
                                    <h3 className="text-lg font-bold uppercase tracking-wide text-white">{p.title}</h3>
                                    {p.description && <p className="text-xs text-zinc-500 mt-1">{p.description}</p>}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-black px-3 py-1 shrink-0 bg-[var(--tc)]">[ 3D_MODEL ]</span>
                            </div>
                        </motion.div>
                    ))}
                    {items3D.length === 0 && isEditor && (
                        <div className="w-full h-[400px] border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 uppercase tracking-widest text-xs font-mono">
                            System: No 3D Data Found
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
