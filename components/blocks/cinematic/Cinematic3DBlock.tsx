"use client";

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/components/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });
import { EditableText } from '@/components/ui/EditableText';

export function Cinematic3DBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    const buttonShape = theme?.buttonShape || 'hard';
    const cardStyle = theme?.cardStyle || 'hard';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-3xl' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0a0a0a] shadow-[0_30px_60px_rgba(255,255,255,0.03)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/30 shadow-[4px_4px_0_0_#fff]' : 'bg-black border border-[#1f1f1f] hover:border-white/20';

    if (items3D.length === 0 && !isEditor) return null;

    return (
        <section className="border-b border-[#1f1f1f] bg-[#050505] py-20 @md:py-24 px-6 @md:px-12">
            <div className="flex justify-between items-end mb-12">
                <h2 className={`font-black uppercase tracking-tighter cine-heading text-[clamp(2.5rem,8cqi,5rem)]`}>
                    <EditableText value={theme?.customTexts?.cinematic_3d_title || '3D Models'} field="cinematic_3d_title" entity="appearance" isEditor={isEditor} as="span" />
                    {' '}<span className="text-gray-600 text-xl @md:text-2xl">({items3D.length})</span>
                </h2>
            </div>

            <div className="flex flex-col gap-12 @md:gap-24">
                {items3D.map((p: any, i: number) => (
                    <motion.div 
                        key={`3d-${i}`}
                        initial={{ opacity: 0, y: 50 }} 
                        {...{ [animationTrigger]: { opacity: 1, y: 0 } }} 
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                        className={`group relative w-full flex flex-col @md:block ${cardRadiusClass} overflow-hidden ${cardStyleClass} transition-all duration-700`}
                    >
                        {/* 3D Viewer Container */}
                        <div className="relative w-full aspect-[4/3] @md:aspect-video bg-black">
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#000000" />
                            <div className="hidden @md:block absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 pointer-events-none group-hover:opacity-40 transition-opacity"></div>
                            
                            {/* Desktop Absolute Text */}
                            <div className="hidden @md:flex absolute bottom-0 left-0 w-full p-8 @md:p-16 flex-col gap-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-out pointer-events-none">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-[10px] uppercase tracking-[0.5em] text-gray-500">Asset_0{i+1}</span>
                                    <div className="h-px w-12 bg-white/10"></div>
                                </div>
                                <h3 className="font-black uppercase tracking-tighter text-4xl @md:text-8xl text-white leading-none">{p.title}</h3>
                                {p.description && <p className="cine-body text-gray-400 text-sm @md:text-lg max-w-2xl mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">{p.description}</p>}
                            </div>
                        </div>

                        {/* Mobile Stacked Text */}
                        <div className="flex @md:hidden flex-col gap-3 p-6 border-t border-[#1f1f1f]">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-[10px] uppercase tracking-[0.5em] text-gray-500">Asset_0{i+1}</span>
                                <div className="h-px w-8 bg-white/10"></div>
                            </div>
                            <h3 className="font-black uppercase tracking-tighter text-4xl text-white leading-none">{p.title}</h3>
                            {p.description && <p className="cine-body text-gray-400 text-sm mt-2">{p.description}</p>}
                        </div>
                    </motion.div>
                ))}
                {items3D.length === 0 && isEditor && (
                    <div className="w-full aspect-video border border-dashed border-[#1f1f1f] flex items-center justify-center text-gray-500 uppercase tracking-widest text-xs font-mono">
                        Add 3D Project to see preview
                    </div>
                )}
            </div>
        </section>
    );
}
