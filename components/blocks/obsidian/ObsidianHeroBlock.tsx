"use client";

import React, { useState, useEffect } from 'react';
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

  // Live Timecode Generator
  const [timecode, setTimecode] = useState("00:00:00:00");
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours() % 24).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const frames = String(Math.floor(now.getMilliseconds() / 41)).padStart(2, '0'); // 24 FPS approximation
      setTimecode(`${hrs}:${mins}:${secs}:${frames}`);
    }, 41);
    return () => clearInterval(interval);
  }, []);

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-md';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const getCardShapeClass = (style?: string) => {
      if (style === 'hard-shadow' || style === 'hard') {
          return 'rounded-none border-2 border-[rgba(255,255,255,0.2)] shadow-[10px_10px_0_0_rgba(255,255,255,0.1)]';
      }
      if (style === 'flat') {
          return 'rounded-none border border-white/10';
      }
      if (style === 'soft-shadow' || style === 'soft') {
          return 'rounded-[2rem] border border-white/5 shadow-2xl';
      }
      return 'rounded-[24px] border border-white/10';
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
    <header className="relative pt-10 pb-16 md:pb-24 px-8 flex flex-col justify-center overflow-hidden bg-zinc-950">
        {/* Cinematic Background Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute left-[10%] top-[20%] w-[350px] h-[350px] bg-red-950/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute right-[10%] bottom-[20%] w-[400px] h-[400px] bg-zinc-900/30 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 @lg:gap-16 items-center">
                
                {/* Left Side: Content Narratives */}
                <motion.div 
                  initial="hidden" 
                  {...{ [animationTrigger]: "visible" }} 
                  variants={staggerReveal} 
                  viewport={{ once: true, amount: 0 }} 
                  className="w-full flex flex-col items-start"
                >
                    {/* Profession Pill */}
                    <motion.div 
                      variants={revealVariants} 
                      className={`inline-flex items-center gap-2 border border-white/10 ${btnShape} px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 bg-white/[0.02] mb-8`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 
                      variants={revealVariants} 
                      className="font-heading text-5xl @sm:text-6xl @md:text-7xl font-semibold tracking-[-0.03em] leading-[1.08] mb-8 text-white max-w-2xl"
                    >
                        <EditableText value={theme?.customTexts?.obs_hero_title || 'Visual storytelling that leaves a mark.'} field="obs_hero_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
                    </motion.h1>

                    {/* Bio Paragraph */}
                    <motion.p 
                      variants={revealVariants} 
                      className="font-body text-zinc-400 text-base @md:text-lg max-w-xl leading-relaxed mb-10"
                    >
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={150} />
                    </motion.p>

                    {/* CTA Actions */}
                    <motion.div variants={revealVariants} className="flex flex-wrap items-center gap-4 mb-12">
                        <a 
                          href="#work" 
                          className={`px-8 py-4 bg-white text-black hover:bg-zinc-200 ${btnShape} font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.08)]`}
                        >
                            <EditableText value={theme?.customTexts?.obs_hero_cta1 || 'Explore Works'} field="obs_hero_cta1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                        </a>
                        
                        <button 
                          onClick={() => setSelectedMedia({ url: heroMediaUrl, title: heroMediaTitle, type: heroMediaType as any })} 
                          className={`flex items-center gap-2.5 border border-white/10 hover:border-white/30 px-8 py-4 ${btnShape} transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.05] text-white font-medium`}
                        >
                            <i className="fas fa-play-circle text-lg text-red-500 animate-pulse"></i> 
                            <EditableText value={theme?.customTexts?.obs_hero_cta2 || 'Play Showreel'} field="obs_hero_cta2" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                        </button>
                    </motion.div>

                    {/* Cinematic HUD Metadata Block */}
                    <motion.div 
                      variants={revealVariants} 
                      className="hidden @sm:grid grid-cols-4 gap-6 border-t border-white/5 pt-8 w-full max-w-lg"
                    >
                        <div>
                          <span className="text-[9px] font-mono text-zinc-600 block uppercase tracking-wider mb-1">ISO</span>
                          <span className="text-xs font-mono font-semibold text-zinc-300">400</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-zinc-600 block uppercase tracking-wider mb-1">SHUTTER</span>
                          <span className="text-xs font-mono font-semibold text-zinc-300">1/48</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-zinc-600 block uppercase tracking-wider mb-1">FRAME</span>
                          <span className="text-xs font-mono font-semibold text-zinc-300">24.00 FPS</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-zinc-600 block uppercase tracking-wider mb-1">CODEC</span>
                          <span className="text-xs font-mono font-semibold text-zinc-300">RAW 4K</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side: Floating Interactive Widescreen Player */}
                <motion.div 
                  initial="hidden" 
                  {...{ [animationTrigger]: "visible" }} 
                  variants={revealVariants} 
                  viewport={{ once: true, amount: 0.1 }}
                  className="w-full relative group"
                >
                    <div 
                      onClick={() => setSelectedMedia({ url: heroMediaUrl, title: heroMediaTitle, type: heroMediaType as any })}
                      className={`relative w-full aspect-[4/3] @sm:aspect-[16/10] overflow-hidden cursor-pointer shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 group ${cardShape}`}
                    >
                        {/* Film grain/scanning overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-20 opacity-20"></div>

                        {/* Thumbnail Image */}
                        <img 
                          src={heroImageThumb} 
                          alt={heroMediaTitle} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                        />

                        {/* Dark Vignette Layer */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-10"></div>

                        {/* Top Left Camera HUD UI: REC blink & Timecode */}
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-black/60 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md font-mono text-[9px] text-zinc-300">
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 absolute"></span>
                                REC
                            </span>
                            <span className="text-zinc-500">|</span>
                            <span className="text-white tracking-widest">{timecode}</span>
                        </div>

                        {/* Top Right Camera HUD UI: Battery/Format */}
                        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 px-2.5 py-1.5 rounded-lg border border-white/5 backdrop-blur-md font-mono text-[9px] text-zinc-300">
                            <span>4K</span>
                            <i className="fas fa-battery-three-quarters text-emerald-400"></i>
                        </div>

                        {/* Bottom Left Camera HUD UI: Reticles */}
                        <div className="absolute bottom-4 left-4 z-20 font-mono text-[8px] text-zinc-400 bg-black/40 px-2 py-1 rounded border border-white/5">
                            <span>TC // 23.98p</span>
                        </div>

                        {/* Center Giant Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                            <div className={`w-20 h-20 ${btnShape} border border-white/20 bg-black/40 backdrop-blur-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-white/50 group-hover:bg-red-600/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                                <i className="fas fa-play text-white text-xl ml-1 transition-transform group-hover:scale-115"></i>
                            </div>
                        </div>

                        {/* Audio Wave Diagnostic Overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 z-20 bg-zinc-950/60 overflow-hidden">
                            <div className="h-full bg-red-600 w-1/3 animate-[pulse_1.5s_infinite]"></div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    </header>
  );
}
