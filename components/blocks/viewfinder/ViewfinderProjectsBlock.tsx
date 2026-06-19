"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import Link from 'next/link';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { useViewfinder } from './ViewfinderContext';

export function ViewfinderProjectsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const { setSelectedMedia } = useViewfinder();
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const allProjects = data?.projects || data?.user?.projects || [];
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

  const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-2xl' : 'rounded-md';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#111] shadow-[0_30px_60px_rgba(255,255,255,0.05)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#050505] border border-[#222] hover:border-[#444]';
  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-sm';

  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUpVariants = {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const scrollLeft = () => {
      if (scrollRef.current) scrollRef.current.scrollBy({ left: -500, behavior: 'smooth' });
  };
  const scrollRight = () => {
      if (scrollRef.current) scrollRef.current.scrollBy({ left: 500, behavior: 'smooth' });
  };

  const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
  const userPlan = data?.plan || data?.user?.plan || 'FREE';
  const showGalleryButton = userPlan !== 'FREE' && galleryProjectsCount > 4;

  if (!archiveItems.length) return null;

  return (
    <section id="projects" className="relative z-20 py-20 bg-[#050505] border-y border-white/10 overflow-hidden shrink-0 @container">
        
        {/* Header Section */}
        <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
            variants={fadeUpVariants}
            className="flex flex-col @md:flex-row gap-6 justify-between items-center @md:items-end mb-10 px-6 @md:px-12 pointer-events-auto max-w-[100vw]"
        >
            <div className="w-full @md:w-auto flex justify-center @md:justify-start">
              <h2 className="font-cinema text-5xl @md:text-7xl tracking-wide text-[#F3F3F1] uppercase flex items-center gap-2 text-center">
                  <EditableText value={theme?.customTexts?.vf_reel_title || 'THE REEL'} field="vf_reel_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> <span style={{ color: 'var(--primary)' }}>.</span>
              </h2>
            </div>
            
            <div className="flex flex-col gap-3 w-full @md:w-auto items-center @md:items-end">
                <div className="flex gap-2 w-full @md:w-auto select-none">
                    <motion.button
                        whileHover={{ x: -6, backgroundColor: "#F3F3F1", color: "#050505" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={scrollLeft}
                        className="flex-1 @md:flex-none text-center text-[10px] @sm:text-xs border border-white/20 px-4 @sm:px-6 py-2.5 transition-colors uppercase tracking-[0.2em] font-bold bg-transparent text-white cursor-pointer"
                    >
                        <i className="fas fa-chevron-left mr-2"></i> <EditableText value={theme?.customTexts?.vf_btn_prev || 'PREV'} field="vf_btn_prev" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                    </motion.button>
                    <motion.button
                        whileHover={{ x: 6, backgroundColor: "#F3F3F1", color: "#050505" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={scrollRight}
                        className="flex-1 @md:flex-none text-center text-[10px] @sm:text-xs border border-white/20 px-4 @sm:px-6 py-2.5 transition-colors uppercase tracking-[0.2em] font-bold bg-transparent text-white cursor-pointer"
                    >
                        <EditableText value={theme?.customTexts?.vf_btn_next || 'NEXT'} field="vf_btn_next" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /> <i className="fas fa-chevron-right ml-2"></i>
                    </motion.button>
                </div>
            </div>
        </motion.div>

        {/* Film Strip Frame Wrapper (Amber 35mm styling) */}
        <div className="relative w-full bg-black/50 py-2 border-y border-white/5">
          
          {/* Top Film Sprocket Holes Row */}
          <div className="flex gap-10 overflow-hidden px-6 py-2 border-b border-[#e67e22]/15 bg-[#120b05] select-none pointer-events-none">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 shrink-0 font-mono text-[7px] text-[#e67e22]/50 uppercase tracking-widest">
                <div className="w-3.5 h-2.5 bg-[#050505] border border-[#e67e22]/20 rounded-[1px]"></div>
                <span>FR_0{(100 + i).toString()}</span>
                <span className="font-bold text-[#f1c40f]/60">KODAK 500T 5219</span>
              </div>
            ))}
          </div>

          {/* Carousel Body */}
          <div ref={scrollRef} className="film-strip flex gap-8 overflow-x-auto px-6 py-10 pointer-events-auto max-w-[100vw]">
              {archiveItems.map((p: any, idx: number) => {
                  const isVideo = p.projectType === 'video';
                  return (
                      <motion.div
                          initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          viewport={{ once: true, amount: 0.1 }}
                          transition={{ duration: 0.8, delay: (idx % 3) * 0.08, ease: cinematicEase }}
                          whileHover={{ y: -6 }}
                          key={p.id || idx}
                          onClick={() => {
                              if (isVideo || p.projectType === 'photo') {
                                  setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                              } else if (p.mediaUrl) {
                                  window.open(p.mediaUrl, '_blank');
                              }
                          }}
                          className="film-frame flex-none block w-[85vw] @md:w-[45vw] @lg:w-[35vw] max-w-[600px] group cursor-pointer"
                      >
                          <div className={`w-full aspect-video overflow-hidden ${cardStyleClassDark} ${cardRadiusClass} relative shadow-xl`}>
                              <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover opacity-75 cine-img group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000" />
                              
                              {/* Hover Viewfinder Target Overlay */}
                              <div className="absolute inset-3 border border-white/0 group-hover:border-white/15 transition-all duration-500 pointer-events-none rounded-[2px] z-20">
                                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="absolute top-2 left-2 font-mono text-[7px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 tracking-wider">
                                  PLAYBACK // 00:{12 + idx}:05:00
                                </div>
                              </div>

                              {/* Cinematic Play Overlay */}
                              {isVideo && (
                                  <div className="absolute inset-0 flex items-center justify-center z-10 select-none">
                                      <div className={`w-14 h-14 ${radiusClass} border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/50 transition-all duration-500`}>
                                          <i className="fas fa-play text-white text-xs ml-1"></i>
                                      </div>
                                  </div>
                              )}
                          </div>
                          <div className="mt-5 overflow-hidden text-left select-none">
                              <h3 className="font-cinema text-3xl @md:text-4xl tracking-wide text-[#F3F3F1] group-hover:text-[var(--primary)] transition-colors duration-500">
                                  {p.title}
                              </h3>
                              <p className="uppercase tracking-[0.25em] mt-1.5 vf-hud-text opacity-60 font-bold text-[8px]" style={{ color: 'var(--primary)' }}>{p.projectType}</p>
                          </div>
                      </motion.div>
                  );
              })}
              <div className="flex-none w-6"></div>
          </div>

          {/* Bottom Film Sprocket Holes Row */}
          <div className="flex gap-10 overflow-hidden px-6 py-2 border-t border-[#e67e22]/15 bg-[#120b05] select-none pointer-events-none">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 shrink-0 font-mono text-[7px] text-[#e67e22]/50 uppercase tracking-widest">
                <div className="w-3.5 h-2.5 bg-[#050505] border border-[#e67e22]/20 rounded-[1px]"></div>
                <span>TC_FRAME_RATE // 24.00 FPS</span>
                <span className="font-bold text-[#f1c40f]/60">S-LOG3 CINE</span>
              </div>
            ))}
          </div>

        </div>

        {/* Full Archive Link Button */}
        {showGalleryButton && (
            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                className="flex justify-center items-center w-full mt-14 px-6"
            >
                <Link href={`/${subdomain}/gallery`}  className="w-full @md:w-auto">
                    <motion.div
                        whileHover="hover"
                        initial="initial"
                        className="group flex items-center justify-center gap-3 px-12 py-4.5 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[#050505] transition-all duration-300 cursor-pointer uppercase font-black tracking-[0.3em] text-xs @sm:text-sm w-full @md:min-w-[320px]"
                    >
                        <span><EditableText value={theme?.customTexts?.vf_btn_archive || 'FULL ARCHIVE'} field="vf_btn_archive" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                        <motion.i
                            variants={{
                                initial: { x: 0 },
                                hover: { x: 5 }
                            }}
                            className="fas fa-arrow-right"
                        ></motion.i>
                    </motion.div>
                </Link>
            </motion.div>
        )}
    </section>
  );
}
