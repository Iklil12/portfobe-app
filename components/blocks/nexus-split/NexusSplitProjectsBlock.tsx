"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { useNexusSplit } from './NexusSplitContext';

export function NexusSplitProjectsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const { setSelectedMedia } = useNexusSplit();
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const allProjects = data?.projects || data?.user?.projects || [];
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

  const buttonShape = theme?.buttonShape || 'rounded';
  const cardRadiusClass = buttonShape === 'square' || buttonShape === 'hard' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-3xl' : 'rounded-2xl';
  const radiusClass = buttonShape === 'square' || buttonShape === 'hard' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';

  const nexusEase = [0.16, 1, 0.3, 1] as any;
  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 }
      }
  };
  const itemFadeUp = {
      hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: nexusEase } }
  };
  const listItemVariants = {
      hidden: { opacity: 0, x: -30, filter: 'blur(5px)' },
      visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: nexusEase } }
  };

  const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
  const userPlan = data?.plan || data?.user?.plan || 'FREE';
  const showGalleryButton = userPlan !== 'FREE' && galleryProjectsCount > 4;

  if (!archiveItems.length) return null;

  return (
    <motion.section 
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        id="work" className="flex flex-col pt-16 @lg:pt-24 pb-10 border-b nexus-border"
    >
        <motion.div variants={itemFadeUp} className={`flex justify-between items-end mb-10 px-6 @md:px-12`}>
            <h2 className="font-display font-extrabold text-4xl @lg:text-6xl text-white">
                <EditableText value={theme?.customTexts?.nexus_projects_title || 'Selected Works'} field="nexus_projects_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </h2>
            <span className="font-sans text-xs font-medium text-[var(--hl)] hidden @sm:block">
                <EditableText value={theme?.customTexts?.nexus_projects_sub || 'Explore the archive'} field="nexus_projects_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </span>
        </motion.div>

        <div className="flex flex-col w-full">
            {archiveItems.map((p: any, i: number) => {
                const isVideo = p.projectType === 'video';
                const isHovered = hoveredProject === i;

                return (
                    <motion.div 
                        key={i}
                        variants={listItemVariants}
                        onMouseEnter={() => setHoveredProject(i)}
                        onMouseLeave={() => setHoveredProject(null)}
                        onClick={() => {
                            if (isVideo || p.projectType === 'photo') {
                                setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                            } else if (p.mediaUrl) {
                                window.open(p.mediaUrl, '_blank');
                            }
                        }}
                        className={`relative w-full border-t nexus-border group cursor-pointer px-6 py-6 @md:px-12 @md:py-10`}
                    >
                        <div className="flex flex-col w-full relative z-10">
                            <div className="flex justify-between items-start w-full">
                                <div className="flex flex-col gap-2">
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-[var(--hl)] transition-colors">
                                        0{i + 1} &nbsp;&mdash;&nbsp; {p.projectType}
                                    </span>
                                    <h3 className={`font-display font-bold text-white transition-colors duration-300 text-3xl @md:text-5xl @lg:text-6xl ${isHovered ? '@md:translate-x-4' : ''}`}>
                                        {p.title}
                                    </h3>
                                </div>
                                
                                {/* Arrow Button */}
                                <div className={`shrink-0 rounded-full border nexus-border flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 w-10 h-10 @md:w-14 @md:h-14`}>
                                    <i className="fas fa-arrow-right -rotate-45"></i>
                                </div>
                            </div>

                            {/* Mobile Image Reveal (Inline) */}
                            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mt-6 border nexus-border @md:hidden relative">
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover" />
                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-12 h-12 rounded-full bg-[var(--hl)] flex items-center justify-center text-white">
                                            <i className="fas fa-play text-xs ml-0.5"></i>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Image Reveal (Floating) */}
                        <AnimatePresence>
                            <div className="hidden @md:block">
                                {isHovered && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className={`absolute right-[15%] top-1/2 -translate-y-1/2 w-[320px] aspect-[4/3] ${cardRadiusClass} overflow-hidden shadow-2xl z-0 pointer-events-none border border-white/20`}
                                    >
                                        <div className="relative w-full h-full">
                                            <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover" />
                                            {isVideo && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                    <div className="w-14 h-14 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white">
                                                        <i className="fas fa-play text-lg ml-1"></i>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>

        {showGalleryButton && (
            <motion.div variants={itemFadeUp} className={`w-full flex mt-12 px-6 @md:px-12`}>
                <Link 
                    href={`/${subdomain}/gallery`}  
                    className={`inline-flex items-center gap-3 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] active:scale-95 transition-all duration-300 ${radiusClass} px-6 py-3.5 font-mono font-bold text-[10px] uppercase tracking-[0.2em] text-white group shadow-xl`}
                >
                    <EditableText value={theme?.customTexts?.nexus_projects_link || 'View Full Archive'} field="nexus_projects_link" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> 
                    <svg className="w-3.5 h-3.5 text-white/50 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </motion.div>
        )}
    </motion.section>
  );
}
