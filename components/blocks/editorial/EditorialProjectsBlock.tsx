import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { useEditorialMedia } from './EditorialContext';

export function EditorialProjectsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { setSelectedMedia } = useEditorialMedia();
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

    const cardRadiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[3rem]' : 'rounded-2xl';
    const cardStyle = theme?.cardStyle || 'soft';
    const cardStyleClassLight = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-white shadow-[0_30px_60px_rgba(0,0,0,0.08)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-white border-2 border-[#111] shadow-[8px_8px_0_0_#111]' : 'bg-[#fdfdfc] border border-[rgba(0,0,0,0.08)] shadow-sm';
    const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[2rem]';

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    if (archiveItems.length === 0) return null;

    return (
        <section id="work" className={`w-full max-w-[1600px] mx-auto flex flex-col px-6 py-12 @md:px-12 @lg:px-20 @md:py-24`}>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col @md:flex-row justify-between items-start @md:items-end mb-16 @md:mb-24 gap-6">
                <h2 className={`font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl @lg:text-6xl`}>
                    <EditableText value={theme?.customTexts?.editorial_works_t1 || 'Selected'} field="editorial_works_t1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <EditableText value={theme?.customTexts?.editorial_works_t2 || 'Works'} field="editorial_works_t2" entity="appearance" isEditor={isEditor} as="span" className="font-serif italic text-slate-400" maxLength={20} />
                </h2>
                <p className="font-sans text-sm @md:text-base font-medium text-slate-500 max-w-xs">
                    <EditableText value={theme?.customTexts?.editorial_works_sub || 'A curated collection of digital products, visual systems, and brand identities.'} field="editorial_works_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />
                </p>
            </motion.div>

            {/* Grid Asimetris (Kiri dan Kanan naik-turun) */}
            <div className={`grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-16 @lg:gap-24`}>
                {archiveItems.map((p: any, i: number) => {
                    const isVideo = p.projectType === 'video';
                    const isEven = i % 2 !== 0;

                    return (
                        <motion.div
                            key={i}
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                            className={`flex flex-col group cursor-pointer w-full ${isEven ? '@md:mt-32' : ''}`}
                            onClick={() => {
                                if (isVideo || p.projectType === 'photo') {
                                    setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                } else if (p.mediaUrl) {
                                    window.open(p.mediaUrl, '_blank');
                                }
                            }}
                        >
                            {/* Image Box */}
                            <div className={`w-full aspect-[4/5] @md:aspect-[3/4] ${cardRadiusClass} overflow-hidden relative mb-6 @md:mb-8 ${cardStyleClassLight} group-hover:-translate-y-2 transition-all duration-700`}>
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />

                                {/* Video Play Indicator (Elegant Editorial) */}
                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/40 transition-all duration-500">
                                            <i className="fas fa-play text-white/80 text-lg ml-1"></i>
                                        </div>
                                    </div>
                                )}

                                {/* Hover Reveal Arrow */}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <i className="fas fa-arrow-right -rotate-45 text-[#111] text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col px-2">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-sans text-2xl @md:text-3xl font-semibold text-[#111] group-hover:text-[var(--hl)] transition-colors">{p.title}</h3>
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{p.projectType}</span>
                                </div>
                                <p className="font-sans text-sm @md:text-base text-slate-500 line-clamp-2 leading-relaxed">
                                    {p.description || 'View detailed case study of this project.'}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={fadeUp} className="w-full flex justify-center mt-20 @md:mt-32">
                <Link href={`/${subdomain}/gallery`} scroll={false} className={`group inline-flex items-center justify-center gap-4 px-8 py-4 ${radiusClass} border border-subtle hover:border-[var(--hl)] hover:bg-[var(--hl)] hover:text-white transition-all duration-300 font-sans font-medium text-sm @md:text-base text-[#111]`}>
                    <EditableText value={theme?.customTexts?.editorial_archive || 'View Full Archive'} field="editorial_archive" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </Link>
            </motion.div>
        </section>
    );
}
