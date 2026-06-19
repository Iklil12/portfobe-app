"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { BentoGridContext } from './BentoGridShell';

export function BentoGridProjectsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { setSelectedMedia } = useContext(BentoGridContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);

    if (archiveItems.length === 0) return null;

    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div id="work" className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 w-full scroll-mt-24">
            {archiveItems.map((p: any, i: number) => {
                const spanClass = 'col-span-1 aspect-[4/5] ' + (i === 2 || i === 3 ? '@lg:col-span-4 @lg:row-span-3 @lg:aspect-auto' : '@lg:col-span-2 @lg:row-span-3 aspect-square @lg:aspect-auto');
                const isVideo = p.projectType === 'video';
                
                return (
                    <motion.div
                        key={i}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim}
                        onClick={() => {
                            if (!isEditor) {
                                if (isVideo || p.projectType === 'photo') {
                                    setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                } else if (p.mediaUrl) {
                                    window.open(p.mediaUrl, '_blank');
                                }
                            }
                        }}
                        className={`bento-card p-2 @md:p-3 group relative overflow-hidden flex flex-col justify-end cursor-pointer ${spanClass}`}
                    >
                        <div className={`w-full h-full ${cardRadiusClass} overflow-hidden relative`}>
                            <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700"></div>

                            {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[var(--hl)] group-hover:border-transparent transition-all duration-500">
                                        <i className="fas fa-play text-white text-lg ml-1"></i>
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 w-full p-6 @lg:p-8 flex flex-col gap-2 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex justify-between items-center w-full mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">{p.projectType}</span>
                                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <i className="fas fa-arrow-right -rotate-45"></i>
                                    </div>
                                </div>
                                <h3 className="text-2xl @md:text-3xl font-black text-white line-clamp-2 leading-tight">{p.title}</h3>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
