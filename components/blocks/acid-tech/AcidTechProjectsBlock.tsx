"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { getVideoThumbnail } from '@/shared/lib/videoUtils';
import { EditableText } from '@/shared/ui/EditableText';
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
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-zinc-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'flat' ? 'bg-black border border-zinc-800' : 'bg-black border border-zinc-800 hover:shadow-[6px_6px_0_0_var(--tc)]';

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    return (
        <section id="work" className="pt-10 pb-20 @md:pb-32 bg-black font-mono text-white" style={{ '--tc': themeColor } as React.CSSProperties}>
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                className="px-6 md:px-16 mb-10 flex justify-between items-end border-b border-[var(--tc)]/20 pb-6 w-full max-w-[90rem] mx-auto"
            >
                <div>
                    <span className="text-[var(--tc)] font-bold text-[10px] uppercase tracking-[0.2em] mb-2 block">[ FILE_INDEX ]</span>
                    <h2 className="font-extrabold uppercase tracking-tight text-3xl @md:text-5xl text-white">
                        <EditableText value={theme?.customTexts?.acid_projects_title || 'PROJECT INDEX'} field="acid_projects_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h2>
                </div>
                <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest hidden @md:inline">&gt; CHOOSE_NODE_TO_LOAD</span>
            </motion.div>

            <div className="flex flex-col relative w-full px-6 md:px-16 max-w-[90rem] mx-auto">
                {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
                    const isVideo = p.projectType === 'video';
                    return (
                        <motion.div 
                            key={`proj-${p.id || i}`}
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, margin: "50px" }} variants={fadeUp}
                            className={`project-item relative w-full flex justify-between cursor-pointer flex-col py-6 px-6 @md:flex-row @md:items-center @md:py-8 @md:px-8 mb-6 ${cardStyleClassDark} ${cardRadiusClass}`}
                            onClick={() => {
                                if (isEditor) return;
                                if (isVideo || p.projectType === 'photo') {
                                    setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                } else if (p.mediaUrl) {
                                    window.open(p.mediaUrl, '_blank');
                                }
                            }}
                        >
                            {/* Node frame decor */}
                            <div className="absolute top-0 left-0 right-0 h-4 bg-zinc-950/80 px-2 py-0.5 flex justify-between items-center text-[7px] text-zinc-600 font-mono border-b border-zinc-900">
                                <span>RECORD_ID // 0{i + 1}</span>
                                <span>TYPE: {p.projectType.toUpperCase()}</span>
                            </div>

                            <div className="flex flex-col relative z-10 pointer-events-none mt-2">
                                <span className="font-bold text-[9px] uppercase tracking-[0.2em] mb-1.5 text-[var(--tc)]">0{i + 1} // {p.projectType.toUpperCase()}</span>
                                <h3 className="font-extrabold uppercase tracking-tight line-clamp-1 text-2xl @md:text-3xl text-white">{p.title}</h3>
                            </div>
                            <div className="font-bold uppercase tracking-widest text-zinc-400 relative z-10 pointer-events-none mt-3 text-[9px] @md:mt-0 @md:text-xs">
                                {p.description || 'View details'} // {new Date(p.createdAt).getFullYear()}
                            </div>

                            {/* Video Indicator (Neon Clear Play) */}
                            {isVideo && (
                                <div className="absolute right-[20%] top-1/2 -translate-y-1/2 hidden @md:flex items-center gap-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-8 h-8 flex items-center justify-center border border-[var(--tc)] bg-[var(--tc)]/5 text-[var(--tc)]">
                                        <i className="fas fa-play text-xs"></i>
                                    </div>
                                    <span className="font-bold text-[9px] tracking-widest uppercase text-[var(--tc)]">Play_Preview</span>
                                </div>
                            )}

                            {/* Mobile Inline Image */}
                            <div className={`block @md:hidden mt-6 w-full aspect-[16/9] relative z-10 overflow-hidden ${cardStyleClassDark} ${cardRadiusClass}`}>
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="w-full h-full object-cover grayscale" />
                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-10 h-10 flex items-center justify-center border border-white text-white">
                                            <i className="fas fa-play text-xs"></i>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Hover Image */}
                            <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="hover-img hidden @md:block grayscale object-cover" />
                        </motion.div>
                    )
                }) : <div className="py-20 text-center text-zinc-700 font-bold text-xs uppercase tracking-widest">SYSTEM: NO_DATA_FOUND</div>}
            </div>

            {/* Tombol Gallery Utama */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                className="w-full mt-8 mb-12 @md:mt-16 @md:mb-20 px-6 md:px-16 max-w-[90rem] mx-auto"
            >
                <Link href={isEditor ? '#' : `/${subdomain}/gallery`} className="group block w-full no-underline relative overflow-hidden bg-zinc-950 border border-[var(--tc)]/30 hover:border-[var(--tc)] transition-all duration-300">
                    <div className="flex items-center justify-between px-6 py-6 @md:px-10 @md:py-10">
                        <div className="flex flex-col relative z-10">
                            <span className="text-[var(--tc)] font-bold text-[9px] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[var(--tc)] animate-pulse"></span> 
                                <EditableText value={theme?.customTexts?.acid_btn_system || 'System: Access_Granted'} field="acid_btn_system" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                            <h3 className="font-extrabold uppercase tracking-tight text-white group-hover:text-[var(--tc)] transition-colors duration-300 leading-none text-2xl @md:text-4xl">
                                <EditableText value={theme?.customTexts?.acid_btn_explore || 'VIEW_FULL_ARCHIVE'} field="acid_btn_explore" entity="appearance" isEditor={isEditor} as="span" />
                            </h3>
                        </div>

                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="shrink-0 border border-[var(--tc)]/30 group-hover:border-[var(--tc)] transition-all duration-300 flex items-center justify-center bg-black group-hover:bg-[var(--tc)] w-10 h-10 @md:w-16 @md:h-16"
                        >
                            <i className="fas fa-arrow-right group-hover:-rotate-45 transition-transform duration-300 text-[var(--tc)] group-hover:text-black text-xs @md:text-lg"></i>
                        </motion.div>
                    </div>
                </Link>
            </motion.div>
        </section>
    );
}
