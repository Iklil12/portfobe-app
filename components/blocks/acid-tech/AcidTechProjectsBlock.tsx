"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { EditableText } from '@/components/ui/EditableText';
import { useAcidTech } from './AcidTechContext';

export function AcidTechProjectsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { setSelectedMedia } = useAcidTech();
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    
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

    return (
        <section id="work" className="pt-10 pb-20 @md:pb-32">
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                className="px-6 @md:px-12 mb-10 flex justify-between items-end border-b-2 border-zinc-800 pb-6"
            >
                <h2 className={`acid-heading font-extrabold uppercase tracking-tighter text-4xl @md:text-[clamp(3rem,6cqi,5rem)]`}>
                    <EditableText value={theme?.customTexts?.acid_projects_title || 'PROJECT\nINDEX'} field="acid_projects_title" entity="appearance" isEditor={isEditor} as="span" className="whitespace-pre-wrap" />
                </h2>
                <span className="acid-text font-bold text-xs @md:text-sm uppercase tracking-widest acid-body">Hover to Reveal</span>
            </motion.div>

            <div className="flex flex-col relative w-full">
                {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
                    const isVideo = p.projectType === 'video';
                    return (
                        <motion.div 
                            key={`proj-${p.id || i}`}
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, margin: "50px" }} variants={fadeUp}
                            className={`project-item relative w-full flex justify-between cursor-pointer flex-col py-6 px-6 @md:flex-row @md:items-center @md:py-10 @md:px-10 mb-4 ${cardStyleClassDark} ${cardRadiusClass}`}
                            onClick={() => {
                                if (isEditor) return;
                                if (isVideo || p.projectType === 'photo') {
                                    setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                } else if (p.mediaUrl) {
                                    window.open(p.mediaUrl, '_blank');
                                }
                            }}
                        >
                            <div className="flex flex-col relative z-10 pointer-events-none">
                                <span className="font-bold text-[10px] @md:text-xs uppercase tracking-[0.2em] mb-2 opacity-70 acid-body">0{i + 1} / {p.projectType}</span>
                                <h3 className={`acid-heading font-extrabold uppercase tracking-tighter line-clamp-1 text-3xl @md:text-[clamp(2rem,4cqi,4rem)]`}>{p.title}</h3>
                            </div>
                            <div className={`font-bold uppercase tracking-widest opacity-70 acid-body relative z-10 pointer-events-none mt-3 text-[10px] @md:mt-0 @md:text-sm`}>
                                {p.description || 'View details'} • {new Date(p.createdAt).getFullYear()}
                            </div>

                            {/* Video Indicator (Neon Clear Play) */}
                            {isVideo && (
                                <div className="absolute right-[20%] top-1/2 -translate-y-1/2 hidden @md:flex items-center gap-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-12 h-12 flex items-center justify-center border-2 border-current" style={{ color: themeColor }}>
                                        <i className="fas fa-play"></i>
                                    </div>
                                    <span className="font-bold text-xs tracking-widest uppercase acid-body">Play_Preview</span>
                                </div>
                            )}

                            {/* Mobile Inline Image */}
                            <div className={`block @md:hidden mt-6 w-full aspect-[16/9] relative z-10 overflow-hidden ${cardStyleClassDark} ${cardRadiusClass}`}>
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="w-full h-full object-cover grayscale" />
                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-12 h-12 flex items-center justify-center border-2 border-white text-white">
                                            <i className="fas fa-play"></i>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Hover Image */}
                            <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className={`hover-img hidden @md:block grayscale object-cover`} />
                        </motion.div>
                    )
                }) : <div className="py-20 text-center text-zinc-600 font-bold text-xs uppercase tracking-widest acid-body">SYSTEM: NO_DATA_FOUND</div>}
            </div>

            {/* Tombol Gallery Utama */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                className={`w-full mt-8 mb-12 @md:mt-20 @md:mb-24 border-y-2 border-zinc-800`}
            >
                <Link href={isEditor ? '#' : `/${subdomain}/gallery`} scroll={false} className="group block w-full no-underline relative overflow-hidden bg-[#09090b] hover:bg-zinc-900 transition-colors duration-300">
                    <div className={`flex items-center justify-between px-6 py-6 @md:px-12 @md:py-12 @lg:py-16`}>
                        <div className="flex flex-col relative z-10">
                            <span className="acid-text font-bold text-[10px] @md:text-xs uppercase tracking-[0.2em] acid-body mb-2 @md:mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-none animate-pulse" style={{ backgroundColor: themeColor }}></span> 
                                <EditableText value={theme?.customTexts?.acid_btn_system || 'System: Access_Granted'} field="acid_btn_system" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                            <h3 className={`acid-heading font-extrabold uppercase tracking-tighter text-[#fafafa] group-hover:text-[var(--theme-color)] transition-colors duration-300 leading-none text-3xl @md:text-5xl @lg:text-[5.5rem]`} style={{ '--theme-color': themeColor } as any}>
                                <EditableText value={theme?.customTexts?.acid_btn_explore || 'VIEW_FULL\nARCHIVE'} field="acid_btn_explore" entity="appearance" isEditor={isEditor} as="span" className="whitespace-pre-wrap" />
                            </h3>
                        </div>

                        <motion.div 
                            whileHover={{ scale: 1.1, rotate: 12 }}
                            className={`shrink-0 border-2 border-zinc-800 group-hover:border-[var(--theme-color)] transition-all duration-300 flex items-center justify-center bg-[#09090b] group-hover:bg-[var(--theme-color)] w-10 h-10 @md:w-24 @md:h-24 @lg:w-32 @lg:h-32`} style={{ '--theme-color': themeColor } as any}
                        >
                            <i className={`fas fa-arrow-right group-hover:-rotate-45 transition-transform duration-300 text-zinc-500 group-hover:text-[#09090b] text-sm @md:text-3xl @lg:text-5xl`}></i>
                        </motion.div>
                    </div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: themeColor }}></div>
                </Link>
            </motion.div>
        </section>
    );
}
