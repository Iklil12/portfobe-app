"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { EditableText } from '@/components/ui/EditableText';
import { useAbsoluteNoir } from './AbsoluteNoirContext';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};
const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export const AbsoluteNoirProjectsBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const { setSelectedMedia } = useAbsoluteNoir();
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);

    return (
        <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} id="work" className="w-full flex flex-col">
            <motion.div variants={wireframeReveal} className="w-full py-4 px-6 wire-border-b flex justify-between items-center bg-[#0a0a0a]">
                <span className="font-mono text-sm uppercase tracking-widest text-white">
                    <EditableText value={theme?.customTexts?.noir_archive_label || '[ SYSTEM_ARCHIVE ]'} field="noir_archive_label" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                </span>
                <span className="font-mono text-xs text-white/50">
                    <EditableText value={theme?.customTexts?.noir_archive_displaying || 'DISPLAYING:'} field="noir_archive_displaying" entity="appearance" isEditor={isEditor} maxLength={15} as="span" /> {archiveItems.length} <EditableText value={theme?.customTexts?.noir_archive_items || 'ITEMS'} field="noir_archive_items" entity="appearance" isEditor={isEditor} maxLength={10} as="span" />
                </span>
            </motion.div>

            <div className="grid grid-cols-1 @md:grid-cols-12 auto-rows-min">
                {archiveItems.map((p: any, i: number) => {
                    const isVideo = p.projectType === 'video';
                    const colSpan = i % 2 === 0 ? '@md:col-span-8' : '@md:col-span-4';
                    const borderRight = i % 2 === 0 ? '@md:wire-border-r' : '';

                    return (
                        <motion.div
                            key={i}
                            variants={wireframeReveal}
                            onClick={() => {
                                if (isVideo || p.projectType === 'photo') {
                                    setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                } else if (p.mediaUrl) {
                                    window.open(p.mediaUrl, '_blank');
                                }
                            }}
                            className={`group flex flex-col w-full wire-border-b ${colSpan} ${borderRight} hover-invert cursor-pointer bg-[#050505] transition-colors`}
                        >
                            <div className="p-4 flex justify-between items-center wire-border-b group-hover:border-black transition-colors">
                                <span className="font-mono text-[10px] uppercase">ID_0{i + 1}</span>
                                <span className="font-mono text-[10px] uppercase border border-white/30 group-hover:border-black px-2 py-1">{p.projectType}</span>
                            </div>
                            
                            <div className="w-full aspect-[4/3] @md:aspect-video relative overflow-hidden bg-black p-4">
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover grayscale-[100%] contrast-[1.4] wire-border group-hover:border-black group-hover:opacity-80 transition-all duration-300" />
                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500">
                                            <i className="fas fa-play text-xs ml-1"></i>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 wire-border-t group-hover:border-black transition-colors flex flex-col justify-between h-full">
                                <h3 className="font-sans text-2xl @lg:text-4xl font-black uppercase tracking-tight mb-4">{p.title}</h3>
                                <p className="font-mono text-xs text-white/60 group-hover:text-black leading-relaxed">
                                    {p.description || 'Data rendering complete. Visual metrics optimized for viewing.'}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div variants={wireframeReveal} className="w-full">
                <Link href={isEditor ? "#" : `/${subdomain}/gallery`}  className="w-full flex items-center justify-between p-8 @md:p-12 bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 group border-b-2 border-transparent hover:border-white">
                    <div className="flex flex-col items-start">
                        <span className="font-mono text-[10px] @md:text-xs font-bold uppercase tracking-[0.3em] mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <EditableText value={theme?.customTexts?.noir_explore_label || '[ DATA_OVERFLOW ]'} field="noir_explore_label" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                        </span>
                        <span className="font-sans font-black text-3xl @md:text-6xl uppercase tracking-tighter group-hover:italic group-hover:pl-4 transition-all duration-300">
                            <EditableText value={theme?.customTexts?.noir_explore_archive || 'Explore Archive'} field="noir_explore_archive" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                        </span>
                    </div>
                    <div className="w-16 h-16 @md:w-24 @md:h-24 flex items-center justify-center border-4 border-black group-hover:border-white rounded-full transition-colors duration-300 shrink-0 ml-4">
                        <i className="fas fa-arrow-right text-2xl @md:text-4xl -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                    </div>
                </Link>
            </motion.div>
        </motion.section>
    );
};
