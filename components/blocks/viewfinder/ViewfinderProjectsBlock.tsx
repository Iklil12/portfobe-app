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
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 10);
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

  if (!archiveItems.length) return null;

  return (
    <section id="projects" className="relative z-20 py-20 bg-[#050505] border-y border-white/10 overflow-hidden shrink-0">
        <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
            variants={fadeUpVariants}
            className="flex flex-col @md:flex-row gap-6 justify-between items-start @md:items-end mb-10 px-6 @md:px-12 pointer-events-auto max-w-[100vw]"
        >
            <h2 className="font-cinema text-6xl @md:text-7xl tracking-wide text-[#F3F3F1] uppercase">
                <EditableText value={theme?.customTexts?.vf_reel_title || 'THE REEL'} field="vf_reel_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> <span style={{ color: 'var(--primary)' }}>.</span>
            </h2>
            <div className="flex flex-col gap-3 w-full @md:w-auto items-start @md:items-end">
                <div className="flex gap-2 w-full @md:w-auto">
                    <motion.button
                        whileHover={{ x: -8, backgroundColor: "#F3F3F1", color: "#050505" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollLeft}
                        className="flex-1 @md:flex-none text-center text-[10px] @sm:text-sm border border-white/20 px-4 @sm:px-6 py-2 transition-colors uppercase tracking-[0.1em] @sm:tracking-[0.2em] font-bold bg-transparent text-white"
                    >
                        <i className="fas fa-chevron-left mr-2"></i> <EditableText value={theme?.customTexts?.vf_btn_prev || 'PREV'} field="vf_btn_prev" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                    </motion.button>
                    <motion.button
                        whileHover={{ x: 8, backgroundColor: "#F3F3F1", color: "#050505" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollRight}
                        className="flex-1 @md:flex-none text-center text-[10px] @sm:text-sm border border-white/20 px-4 @sm:px-6 py-2 transition-colors uppercase tracking-[0.1em] @sm:tracking-[0.2em] font-bold bg-transparent text-white"
                    >
                        <EditableText value={theme?.customTexts?.vf_btn_next || 'NEXT'} field="vf_btn_next" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /> <i className="fas fa-chevron-right ml-2"></i>
                    </motion.button>
                </div>
            </div>
        </motion.div>

        <div ref={scrollRef} className="film-strip flex gap-6 overflow-x-auto px-6 pb-12 pt-2 pointer-events-auto max-w-[100vw]">
            {archiveItems.map((p: any, idx: number) => {
                const isVideo = p.projectType === 'video';
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, amount: 0 }}
                        transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: cinematicEase }}
                        whileHover={{ y: -5 }}
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
                        <div className={`w-full aspect-video overflow-hidden ${cardStyleClassDark} ${cardRadiusClass} relative`}>
                            <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover opacity-80 cine-img group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
                            
                            {/* Cinematic Play Overlay */}
                            {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`w-14 h-14 ${radiusClass} border border-white/40 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500`}>
                                        <i className="fas fa-play text-white text-xs ml-1"></i>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 overflow-hidden text-left">
                            <h3 className="font-cinema text-3xl @md:text-4xl tracking-wide text-[#F3F3F1] group-hover:text-[var(--primary)] transition-colors duration-500">
                                {p.title}
                            </h3>
                            <p className="uppercase tracking-[0.2em] mt-2 vf-hud-text opacity-60 font-bold" style={{ color: 'var(--primary)' }}>{p.projectType}</p>
                        </div>
                    </motion.div>
                );
            })}
            <div className="flex-none w-6"></div>
        </div>

        <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
            className="flex justify-center items-center w-full mt-12 px-6"
        >
            <Link href={`/${subdomain}/gallery`}  className="w-full @md:w-auto">
                <motion.div
                    whileHover="hover"
                    initial="initial"
                    className="group flex items-center justify-center gap-3 px-12 py-5 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[#050505] transition-all duration-300 cursor-pointer uppercase font-black tracking-[0.3em] text-xs @sm:text-sm w-full @md:min-w-[300px]"
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
    </section>
  );
}
