"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { EditableText } from '@/components/ui/EditableText';
import { useSpatialMedia } from './SpatialContext';

export function SpatialProjectsBlock({ data, theme, isMobileView, isCardPreview, isEditor }: any) {
  const { setSelectedMedia } = useSpatialMedia();
  
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const allProjects = data?.projects || data?.user?.projects || [];
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
  const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0f1115] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[8px_8px_0_0_#ffffff]' : 'glass-panel border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]';

  const auraAnim = isCardPreview
      ? { hidden: { opacity: 1, y: 0, filter: "blur(0px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }
      : { hidden: { opacity: 0, y: 40, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const viewAnim = isCardPreview
      ? { initial: "visible" as const, animate: "visible" as const }
      : { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, amount: 0.1 } };

  const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
  const userPlan = data?.plan || data?.user?.plan || 'FREE';
  const showGalleryButton = userPlan !== 'FREE' && galleryProjectsCount > 4;

  return (
    <div id="projects" className={`flex flex-col w-full px-8 gap-12`}>
        <motion.div {...viewAnim} variants={auraAnim} className="flex justify-between items-end mb-4">
            <h2 className={`font-medium tracking-tight text-white text-4xl`}>
                <EditableText value={theme?.customTexts?.spatial_stats_projects || 'Selected Works'} field="spatial_stats_projects" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
            </h2>
            <span className="text-slate-500 font-medium">({archiveItems.length})</span>
        </motion.div>

        <div className="grid grid-cols-1 @md:grid-cols-12 gap-6 @md:gap-8">
            {archiveItems.map((p: any, i: number) => {
                const colSpan = 'col-span-1 ' + (i % 4 === 0 || i % 4 === 3 ? '@md:col-span-7' : '@md:col-span-5');
                const isVideo = p.projectType === 'video';

                return (
                    <motion.div
                        key={i}
                        {...viewAnim} variants={auraAnim}
                        className={`group flex flex-col gap-4 cursor-pointer ${colSpan}`}
                        onClick={() => {
                            if (isVideo || p.projectType === 'photo') {
                                setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                            } else if (p.mediaUrl) {
                                window.open(p.mediaUrl, '_blank');
                            }
                        }}
                    >
                        {/* Image Container */}
                        <div className={`w-full aspect-[4/3] ${cardRadiusClass} overflow-hidden relative ${cardStyleClass} p-2 transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(var(--hl-rgb),0.15)] group-hover:border-[var(--hl)]/30`}>
                            <div className="w-full h-full rounded-[16px] overflow-hidden relative bg-[#0a0a0a]">
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                                
                                {/* Hover Overlay */}
                                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500
                                    ${isVideo 
                                        ? 'bg-transparent opacity-100' 
                                        : 'bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100'
                                    }`}>
                                    <div className={`rounded-full flex items-center justify-center border transition-all duration-500
                                        ${isVideo
                                            ? 'w-12 h-12 bg-white/10 backdrop-blur-md border-white/20 scale-100 group-hover:scale-110 group-hover:bg-white/20'
                                            : 'w-14 h-14 bg-white/10 backdrop-blur-md border-white/20 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100'
                                        }`}>
                                        <i className={`fas ${isVideo ? 'fa-play ml-1' : 'fa-arrow-right -rotate-45'} text-white`}></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col px-2">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-xl font-medium text-white group-hover:text-[var(--hl)] transition-colors">{p.title}</h3>
                                <span className={`text-[10px] uppercase tracking-widest text-slate-500 border border-slate-800 px-2 py-1 ${radiusClass}`}>{p.projectType}</span>
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">{p.description || 'View detailed case study of this project.'}</p>
                        </div>
                    </motion.div>
                );
            })}
        </div>

        {/* Explore More Button */}
        {showGalleryButton && (
            <motion.div {...viewAnim} variants={auraAnim} className="w-full flex justify-center mt-8">
                <Link href={`/${subdomain}/gallery`}  className={`${cardStyleClass} px-8 py-4 ${radiusClass} flex items-center gap-3 hover:scale-105 hover:bg-white/5 transition-all duration-500 group`}>
                    <span className="font-medium text-white">
                        <EditableText value={theme?.customTexts?.spatial_explore_archive || 'Explore Full Archive'} field="spatial_explore_archive" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                    </span>
                    <i className="fas fa-arrow-right text-sm text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all"></i>
                </Link>
            </motion.div>
        )}
    </div>
  );
}
