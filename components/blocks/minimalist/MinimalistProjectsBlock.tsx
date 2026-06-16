"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.15) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export const MinimalistProjectsBlock = ({ data, theme, isEditor, blockConfig, setSelectedMedia }: any) => {

  
  const animationTrigger = isEditor ? "animate" : "whileInView";
  const allProjects = data?.projects || data?.user?.projects || [];
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  
  const buttonShape = theme?.buttonShape || 'rounded';
  const radiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-lg';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-white border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]' : 'bg-gray-50 border border-gray-200 shadow-sm';

  const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
  const userPlan = data?.plan || data?.user?.plan || 'FREE';
  const showGalleryButton = userPlan !== 'FREE' && galleryProjectsCount > 4;

  if (archiveItems.length === 0) return null;

  return (
    <section className={`p-8 @lg:p-12`}>
      <motion.div
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
        variants={cinematicBlurUp} custom={1.2}
        className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6"
      >
        <h2 className="text-2xl font-black uppercase tracking-tighter min-heading">
          <EditableText value={theme?.customTexts?.min_projects_title || 'Selected Index'} field="min_projects_title" entity="appearance" isEditor={isEditor} maxLength={25} className="min-heading" />
        </h2>
        <span className="text-[10px] font-mono text-gray-400 uppercase min-heading">
          <EditableText value={theme?.customTexts?.min_projects_subtitle || 'Archive'} field="min_projects_subtitle" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading" />
        </span>
      </motion.div>

      <motion.div
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
        variants={getStaggerContainer(1.4, 0.25)}
        className={`grid grid-cols-1 gap-8 @md:grid-cols-2`}
      >
        {archiveItems.map((p: any, i: number) => {
          const isVideo = p.projectType === 'video';
          return (
            <motion.div
              variants={cinematicBlurUp} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
              key={i} className="group cursor-pointer block"
              onClick={() => {
                if (isVideo || p.projectType === 'photo') {
                  setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                } else if (p.mediaUrl) {
                  window.open(p.mediaUrl, '_blank');
                }
              }}
            >
              <div className={`w-full aspect-[4/3] mb-4 overflow-hidden relative ${cardStyleClass} ${radiusClass}`}>
                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] grayscale group-hover:grayscale-0 group-hover:scale-110" />
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] 
                  ${isVideo
                    ? 'bg-transparent opacity-100'
                    : 'bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100'
                  }`}>
                  <div className={`flex items-center justify-center shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${radiusClass}
                    ${isVideo
                      ? 'w-12 h-12 bg-white/90 text-black opacity-100 scale-100 group-hover:scale-110'
                      : 'w-14 h-14 bg-white text-black opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 delay-100'
                    }`}>
                    <i className={`fas ${isVideo ? 'fa-play ml-1' : 'fa-arrow-right -rotate-45'}`}></i>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-start mt-4">
                <div>
                  <h3 className="text-base font-bold tracking-tight mb-1 min-heading group-hover:text-gray-600 transition-colors">{p.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{p.projectType}</p>
                </div>
                <span className="text-[10px] font-mono text-gray-400 pt-1 group-hover:text-black transition-colors">0{i + 1}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      {showGalleryButton && (
        <motion.div
          initial="hidden"
          {...{ [animationTrigger]: "visible" }}
          viewport={{ once: true }}
          variants={cinematicBlurUp}
          custom={0.3}
          className="w-full flex justify-center mt-16 mb-20 relative z-10"
        >
          <Link href={`/${subdomain}/gallery`}  className="group inline-flex items-center gap-4 @md:gap-6 no-underline p-2">
            <span className="text-[10px] @md:text-xs font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors duration-500 relative min-heading">
              <EditableText value={theme?.customTexts?.min_explore_archive || 'EXPLORE ARCHIVE'} field="min_explore_archive" entity="appearance" isEditor={isEditor} maxLength={20} as="span" className="min-heading" />
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"></span>
            </span>
            <div className={`w-10 h-10 @md:w-12 @md:h-12 border border-gray-200 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-black group-hover:border-black shadow-sm group-hover:shadow-md overflow-hidden relative ${radiusClass}`}>
              <i className="fas fa-arrow-right absolute transform -translate-x-[150%] text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 text-[10px] @md:text-xs"></i>
              <i className="fas fa-arrow-right absolute transform translate-x-0 text-gray-400 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[150%] opacity-100 group-hover:opacity-0 text-[10px] @md:text-xs"></i>
            </div>
          </Link>
        </motion.div>
      )}
    </section>
  );
};
