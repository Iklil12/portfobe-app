"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { EditableText } from '@/components/ui/EditableText';
import { useObsidianMedia } from './ObsidianContext';

export function ObsidianProjectsBlock({ data, theme, isEditor }: any) {
  const { setSelectedMedia } = useObsidianMedia();
  
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const allProjects = data?.projects || data?.user?.projects || [];
  const displayProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 4);

  const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
  const userPlan = data?.plan || data?.user?.plan || 'FREE';
  const showGalleryButton = userPlan !== 'FREE' && galleryProjectsCount > 4;

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-md';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const getCardShapeClass = (style?: string) => {
      if (style === 'hard-shadow' || style === 'hard') {
          return 'rounded-none border-2 border-[rgba(255,255,255,0.2)] shadow-[6px_6px_0_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[var(--brand-accent)] hover:shadow-[6px_6px_0_0_var(--brand-accent)]';
      }
      if (style === 'flat') {
          return 'rounded-none border border-[rgba(255,255,255,0.1)] hover:border-[var(--brand-accent)] transition-colors duration-300';
      }
      if (style === 'soft-shadow' || style === 'soft') {
          return 'rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-xl hover:shadow-[0_8px_30px_rgb(255,255,255,0.1)] transition-all duration-300';
      }
      return 'rounded-2xl';
  };
  const cardShape = getCardShapeClass(theme?.cardStyle);

  const revealVariants: any = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };
  
  const staggerReveal: any = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <section id="work" className="py-24 px-6 border-t border-[rgba(255,255,255,0.1)] bg-[#030303]">
        <div className="max-w-screen-2xl mx-auto">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                <div>
                    <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                        <EditableText value={theme?.customTexts?.obs_portfolio_label || 'Portfolio'} field="obs_portfolio_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl font-medium">
                        <EditableText value={theme?.customTexts?.obs_portfolio_title || 'Selected Works'} field="obs_portfolio_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </h2>
                </div>
                {showGalleryButton && (
                    <Link href={`/${subdomain}/gallery`} className="hidden md:block font-body text-sm hover:underline mt-4 md:mt-0 text-gray-300 hover-accent">
                        <EditableText value={theme?.customTexts?.obs_portfolio_view_all || 'View all projects'} field="obs_portfolio_view_all" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </Link>
                )}
            </motion.div>

            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {displayProjects.map((p: any, i: number) => {
                    const isVideo = p.projectType === 'video';
                    return (
                        <motion.div key={i} variants={revealVariants} className="block group cursor-pointer" onClick={() => {
                            if (isVideo || p.projectType === 'photo') {
                                setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                            } else if (p.mediaUrl) {
                                window.open(p.mediaUrl, '_blank');
                            }
                        }}>
                            <div className={`w-full aspect-[4/3] ${cardShape} obsidian-img-container mb-6 bg-[#050505] relative`}>
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover" />
                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                        <i className="fas fa-play text-white text-3xl drop-shadow-lg"></i>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-heading text-2xl font-medium mb-1 group-hover-accent transition-colors">{p.title}</h3>
                                    <p className="font-body text-[#8a8a93] text-sm capitalize">{p.projectType || 'Project'}</p>
                                </div>
                                <div className={`w-10 h-10 ${btnShape} border border-[rgba(255,255,255,0.1)] flex items-center justify-center group-hover-bg-accent transition-colors`}>
                                    <i className="fas fa-arrow-right -rotate-45"></i>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
            
            {/* Explore Gallery Button */}
            {showGalleryButton && (
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="mt-16 flex justify-center">
                    <Link href={`/${subdomain}/gallery`}  className={`group flex items-center gap-4 px-8 py-4 border border-[rgba(255,255,255,0.1)] ${btnShape} obsidian-btn-outline transition-all duration-300`}>
                        <span className="font-heading font-medium text-lg">
                            <EditableText value={theme?.customTexts?.obs_explore_archive || 'Explore Gallery'} field="obs_explore_archive" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                        </span>
                        <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                    </Link>
                </motion.div>
            )}
        </div>
    </section>
  );
}
