"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { EditableText } from '@/components/ui/EditableText';

export function MonolithProjectsBlock({ data, theme, isEditor, isCardPreview, setSelectedMedia }: any) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 5);

    const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
    const userPlan = data?.plan || data?.user?.plan || 'FREE';
    const showGalleryButton = userPlan !== 'FREE' && galleryProjectsCount > 4;

    const buttonShape = theme?.buttonShape || 'rounded';
    const cardRadiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-[40px]' : 'rounded-2xl';
    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#111111] shadow-[0_30px_60px_rgba(255,255,255,0.03)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[6px_6px_0_0_rgba(255,255,255,0.2)]' : 'bg-[#080808] border border-white/10 hover:border-white/30';

    const scrollLeft = () => {
        if (sliderRef.current) {
            const clientWidth = sliderRef.current.clientWidth;
            const scrollAmount = clientWidth < 768 ? clientWidth * 0.85 : clientWidth * 0.65;
            sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            const clientWidth = sliderRef.current.clientWidth;
            const scrollAmount = clientWidth < 768 ? clientWidth * 0.85 : clientWidth * 0.65;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    return (
        <section id="work" className="relative z-20 w-full bg-[#050505] py-20 @md:py-32">
            <div className={`flex justify-between items-end mb-12 @md:mb-20 px-6 @md:px-12`}>
                <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className={`font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi]`}>
                    <EditableText value={theme?.customTexts?.monolith_projects_title || 'Selected'} field="monolith_projects_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /><br/><span className="italic text-[var(--hl)]"><EditableText value={theme?.customTexts?.monolith_projects_subtitle || 'Archives'} field="monolith_projects_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                </motion.h2>
                
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className={`flex gap-3 @md:gap-4`}>
                    <button onClick={scrollLeft} className={`rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 w-10 h-10 @md:w-14 @md:h-14`}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <button onClick={scrollRight} className={`rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--hl)] hover:text-black hover:border-[var(--hl)] transition-all duration-300 w-10 h-10 @md:w-14 @md:h-14`}>
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </motion.div>
            </div>

            <div 
                ref={sliderRef} 
                className={`flex overflow-x-auto hide-scrollbar gap-4 @md:gap-8 pb-10 px-6 @md:px-12`}
            >
                {archiveItems.map((p: any, i: number) => {
                    const isVideo = p.projectType === 'video';
                    return (
                        <motion.div
                            key={i}
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "50px" }} variants={fadeUp}
                            onClick={() => {
                                if (isVideo || p.projectType === 'photo') {
                                    if(setSelectedMedia) setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                } else if (p.mediaUrl) {
                                    window.open(p.mediaUrl, '_blank');
                                }
                            }}
                            className={`snap-item shrink-0 relative overflow-hidden group cursor-pointer transition-colors duration-500 ${cardRadiusClass} ${cardStyleClassDark}
                            w-[85cqi] max-w-[320px] aspect-[4/5] @md:max-w-none @md:aspect-auto @md:w-[65cqi] @md:h-[75vh]`}
                        >
                            <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100 opacity-60 group-hover:opacity-90" />
                            <div className={`absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent @md:h-full @md:inset-0 @md:from-black @md:via-black/30`}></div>

                            {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="w-24 h-24 rounded-full bg-[var(--hl)] text-black flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-500 shadow-[0_0_50px_rgba(var(--hl),0.5)]">
                                        <i className="fas fa-play text-2xl ml-1"></i>
                                    </div>
                                </div>
                            )}

                            <div className={`absolute bottom-0 w-full flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10 p-5 gap-2 @md:p-12 @md:gap-3 @md:flex-row @md:items-end @md:justify-between`}>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`font-sans font-bold uppercase tracking-widest text-white border border-white/30 backdrop-blur-md rounded-full text-[9px] px-3 py-1 @md:text-xs @md:px-4 @md:py-1`}>0{i + 1}</span>
                                        <span className={`font-sans font-bold uppercase tracking-widest text-[var(--hl)] text-[9px] @md:text-xs uppercase`}>{p.projectType}</span>
                                    </div>
                                    <h3 className={`font-serif text-white leading-[1.1] line-clamp-2 text-3xl @md:text-6xl @lg:text-[5cqi]`}>{p.title}</h3>
                                </div>

                                <div className={`flex justify-between items-end flex-row w-full @md:flex-col @md:w-1/3 gap-4 @md:gap-6`}>
                                    <p className={`font-sans font-medium text-slate-300 line-clamp-2 text-[10px] text-left max-w-[70%] @md:max-w-none @md:text-right @md:text-sm`}>
                                        {p.description || 'Immersive case study and visual exploration of this masterpiece.'}
                                    </p>
                                    <div className={`rounded-full bg-white text-black flex items-center justify-center group-hover:bg-[var(--hl)] transition-colors duration-300 shrink-0 w-8 h-8 @md:w-16 @md:h-16`}>
                                        <i className={`fas fa-arrow-right -rotate-45 text-[10px] @md:text-2xl`}></i>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                <div className={`shrink-0 w-12`}></div>
            </div>

            {showGalleryButton && (
                <div className={`w-full flex justify-center mt-12 px-6 @md:px-12`}>
                    <Link href={`/${subdomain}/gallery`}  className="group flex items-center gap-4">
                        <span className={`font-serif text-white group-hover:text-[var(--hl)] transition-colors italic text-2xl @md:text-3xl @lg:text-5xl`}>
                            <EditableText value={theme?.customTexts?.monolith_projects_link || 'View Full Catalog'} field="monolith_projects_link" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                        </span>
                        <div className={`rounded-full border border-white/20 flex items-center justify-center group-hover:border-[var(--hl)] transition-colors w-10 h-10 @md:w-12 @md:h-12`}>
                            <i className="fas fa-arrow-right text-white group-hover:text-[var(--hl)]"></i>
                        </div>
                    </Link>
                </div>
            )}
        </section>
    );
}
