"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/shared/ui/LazyImage';
import { getVideoThumbnail } from '@/shared/lib/videoUtils';
import { EditableText } from '@/shared/ui/EditableText';
import { useAuraKineticMedia } from './AuraKineticContext';

export function AuraKineticProjectsBlock({ data, theme, isEditor }: any) {
  const { setSelectedMedia } = useAuraKineticMedia();
  
  const allProjects = data?.projects || data?.user?.projects || [];
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-full';
  };
  const radiusClass = getBtnShapeClass(theme?.buttonShape);
  const btnShape = radiusClass;
    const cardShape = btnShape;

  

  const cardStyle = theme?.cardStyle || 'glassmorphism';
  const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-[var(--hl)] shadow-[6px_6px_0_0_var(--hl)]' : cardStyle === 'flat' ? 'bg-[#0a0a0c] border-2 border-white/20' : 'bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:border-white/20 hover:bg-white/10';

  const fadeUp = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <section id="work" className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-24 md:py-32">
        <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold text-center mb-16">
            <EditableText value={theme?.customTexts?.aura_stats_projects || 'Selected Works'} field="aura_stats_projects" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {archiveItems.map((p: any, i: number) => {
                const isVideo = p.projectType === 'video';
                const isLarge = i === 0 || i === 3;

                return (
                    <motion.div
                        key={i}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                        className={`group relative block w-full cursor-pointer ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`}
                        onClick={() => {
                            if (isVideo || p.projectType === 'photo') {
                                setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                            } else if (p.mediaUrl) {
                                window.open(p.mediaUrl, '_blank');
                            }
                        }}
                    >
                        <div className={`relative w-full ${isLarge ? 'aspect-video md:aspect-[21/9]' : 'aspect-video md:aspect-[4/3]'} ${cardShape} overflow-hidden ${cardStyleClassDark} p-2 transition-all duration-500`}>
                            <div className={`relative w-full h-full ${cardShape} overflow-hidden bg-[#0a0a0c]`}>
                                <LazyImage
                                    src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl}
                                    alt={p.title}
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-40 transition-opacity duration-500"></div>

                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className={`w-16 h-16 ${btnShape} bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500`}>
                                            <i className="fas fa-play text-white ml-1"></i>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <div className="flex flex-col">
                                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--hl)] mb-2 drop-shadow-md">{p.projectType}</span>
                                        <h3 className="font-serif text-2xl md:text-4xl font-bold text-white drop-shadow-lg">{p.title}</h3>
                                    </div>
                                    {!isVideo && (
                                        <div className={`w-12 h-12 ${btnShape} bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform rotate-[-45deg] group-hover:rotate-0 transition-all duration-500 ease-out shadow-xl`}>
                                            <i className="fas fa-arrow-right"></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>

        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mt-16 flex justify-center">
            <Link href={`/${subdomain}/gallery`}  className={`group relative inline-flex items-center justify-center gap-4 px-8 py-4 bg-white/5 border border-white/10 hover:border-[var(--hl)] backdrop-blur-md transition-all duration-300 ${radiusClass} overflow-hidden shadow-lg`}>
                <div className="absolute inset-0 bg-[var(--hl)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="font-sans text-xs uppercase tracking-widest font-bold text-white group-hover:text-[var(--hl)] transition-colors">
                    <EditableText value={theme?.customTexts?.aura_explore_archive || 'Explore Full Archive'} field="aura_explore_archive" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                </span>
                <i className="fas fa-arrow-right text-[var(--hl)] transform group-hover:translate-x-2 transition-transform duration-300"></i>
            </Link>
        </motion.div>
    </section>
  );
}

