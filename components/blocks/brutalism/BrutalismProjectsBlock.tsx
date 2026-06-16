"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { EditableText } from '@/components/ui/EditableText';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismProjectsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { setSelectedMedia, hardShadow, hardShadowHover, radiusClass } = useContext(BrutalismContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);

    if (archiveItems.length === 0) return null;

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
        <section id="work" className="w-full flex flex-col border-b-[3px] border-black bg-[#f4f4f0]">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className={"p-6 border-b-[3px] border-black bg-white"}>
                <h2 className={"custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter"}>
                    <EditableText value={theme?.customTexts?.brutal_projects_title || 'INDEX_OF_WORK'} field="brutal_projects_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
            </motion.div>

            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                className={`grid grid-cols-1 ${'@md:grid-cols-2'}`}
            >
                {archiveItems.map((p: any, i: number) => {
                    const isVideo = p.projectType === 'video';
                    const isOdd = i % 2 !== 0;

                    return (
                        <motion.div
                            variants={starkReveal}
                            key={i}
                            onClick={() => {
                                if (!isEditor) {
                                    if (isVideo || p.projectType === 'photo') {
                                        setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                    } else if (p.mediaUrl) {
                                        window.open(p.mediaUrl, '_blank');
                                    }
                                }
                            }}
                            className={`group flex flex-col bg-white border-b-[3px] border-black ${!isOdd ? '@md:border-r-[3px]' : ''} cursor-pointer brutal-theme-item brutal-hover-invert transition-none`}
                        >
                            <div className={"flex justify-between items-center p-4 border-b-[3px] border-black font-mono text-[10px] @sm:text-xs font-bold uppercase bg-[#f4f4f0] group-hover:bg-black group-hover:text-white transition-none group-hover:border-white"}>
                                <span className="bg-black text-white group-hover:bg-white group-hover:text-black px-2 py-1">FILE_0{i + 1}</span>
                                <span>[{p.projectType}]</span>
                            </div>

                            <div className={"w-full aspect-video border-b-[3px] border-black bg-gray-200 relative overflow-hidden group-hover:border-white transition-none p-4 @sm:p-6 bg-[#f4f4f0]"}>
                                <div className={`w-full h-full border-[3px] border-black bg-white overflow-hidden relative group-hover:border-white ${hardShadow} ${radiusClass}`}>
                                    <LazyImage
                                        src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl}
                                        className="w-full h-full object-cover grayscale contrast-125 mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-300"
                                        alt={p.title}
                                    />
                                    {isVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-[var(--hl)] text-black border-[3px] border-black px-6 py-2 font-mono font-bold text-xs shadow-[4px_4px_0px_0px_#000] group-hover:bg-white transition-colors">PLAY_PREVIEW</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col justify-between flex-1">
                                <h3 className={"custom-heading text-2xl @sm:text-3xl @md:text-4xl font-black uppercase tracking-tighter mb-4 leading-none"}>{p.title}</h3>
                                <p className={"custom-body font-mono text-xs @sm:text-sm font-bold uppercase leading-relaxed line-clamp-3"}>
                                    &gt; {p.description || 'NO ADDITIONAL DATA PROVIDED FOR THIS RECORD.'}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className={"p-6 @sm:p-12 flex justify-center bg-white border-t-[3px] border-black"}>
                <Link href={`/${subdomain}/gallery`}  onClick={(e) => { if(isEditor) e.preventDefault(); }}>
                    <button className={`bg-[var(--hl)] text-black border-[3px] border-black font-mono font-black uppercase px-8 @sm:px-16 py-4 @sm:py-6 text-sm @sm:text-lg ${hardShadow} ${hardShadowHover} ${radiusClass} pointer-events-none`}>
                        <EditableText value={theme?.customTexts?.brutal_projects_cta || 'ACCESS FULL DATABASE'} field="brutal_projects_cta" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                    </button>
                </Link>
            </motion.div>
        </section>
    );
}
