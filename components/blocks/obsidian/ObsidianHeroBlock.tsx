"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { useObsidianMedia } from './ObsidianContext';
import { getVideoThumbnail } from '@/lib/videoUtils';

export function ObsidianHeroBlock({ data, theme, isEditor }: any) {
  const { setSelectedMedia } = useObsidianMedia();
  
  const profession = data?.profile?.profession || data?.profession || "Video Production Studio";
  const bio = data?.profile?.bio || data?.bio || "We bring your ideas to life, creating content that not only meets but exceeds your expectations. From concept to final cut.";
  
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProject = allProjects.find((p: any) => p.projectType === 'video');
  const photoProject = allProjects.find((p: any) => p.projectType === 'photo');
  const heroProject = videoProject || photoProject || null;
  
  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1534938665420-4193d6aa2a28?q=80&w=2000&auto=format&fit=crop`;

  const heroMediaUrl = heroProject?.mediaUrl || displayAvatar;
  const heroMediaTitle = heroProject?.title || 'Showreel';
  const heroMediaType = heroProject ? heroProject.projectType : 'video';
  const heroImageThumb = heroProject && heroProject.projectType === 'video' 
      ? getVideoThumbnail(heroProject.mediaUrl) 
      : heroMediaUrl;

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
    <header className="relative pb-20 px-6 flex flex-col justify-center">
        <div className="max-w-screen-2xl mx-auto w-full">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="max-w-4xl mb-12">
                <motion.div variants={revealVariants} className={`inline-block border border-[rgba(255,255,255,0.1)] ${btnShape} px-4 py-1.5 text-xs font-body uppercase tracking-widest text-[#8a8a93] mb-6`}>
                    <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                </motion.div>
                <motion.h1 variants={revealVariants} className="font-heading text-5xl sm:text-6xl md:text-8xl font-medium tracking-tight leading-[1.05] mb-8">
                    <EditableText value={theme?.customTexts?.obs_hero_title || 'Visual storytelling that leaves a mark.'} field="obs_hero_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
                </motion.h1>
                <motion.p variants={revealVariants} className="font-body text-[#8a8a93] text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
                    <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={150} />
                </motion.p>
                <motion.div variants={revealVariants} className="flex flex-wrap items-center gap-4">
                    <a href="#work" className={`obsidian-btn-primary px-8 py-4 ${btnShape} font-medium transition-all`}>
                        <EditableText value={theme?.customTexts?.obs_hero_cta1 || 'Explore Works'} field="obs_hero_cta1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </a>
                    <button onClick={() => setSelectedMedia({ url: heroMediaUrl, title: heroMediaTitle, type: heroMediaType as any })} className={`flex items-center gap-2 border border-[rgba(255,255,255,0.1)] px-8 py-4 ${btnShape} transition-colors duration-300 obsidian-btn-outline`}>
                        <i className="fas fa-play-circle text-xl"></i> 
                        <EditableText value={theme?.customTexts?.obs_hero_cta2 || 'Play Showreel'} field="obs_hero_cta2" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </button>
                </motion.div>
            </motion.div>

            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className={`w-full h-[50vh] md:h-[70vh] ${cardShape} obsidian-img-container relative cursor-pointer`} onClick={() => setSelectedMedia({ url: heroMediaUrl, title: heroMediaTitle, type: heroMediaType as any })}>
                <img src={heroImageThumb} alt={heroMediaTitle} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none group-hover:bg-black/10 transition-colors">
                    <div className={`w-24 h-24 ${btnShape} border border-white/30 backdrop-blur-md flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <i className="fas fa-play text-white text-2xl ml-1"></i>
                    </div>
                </div>
            </motion.div>
        </div>
    </header>
  );
}
