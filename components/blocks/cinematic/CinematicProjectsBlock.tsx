"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { getVideoThumbnail } from '@/shared/lib/videoUtils';
import { EditableText } from '@/shared/ui/EditableText';
import { useCinematic } from './CinematicContext';
import { usePathname } from 'next/navigation';

export function CinematicProjectsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { setSelectedMedia } = useCinematic();
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
    const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
    const userPlan = data?.plan || data?.user?.plan || 'FREE';
    const showGalleryButton = true; // Selalu tampilkan tombol galeri atas permintaan user
    const pathname = usePathname();
    const isPreviewRoute = pathname?.includes('/preview/');
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

    const buttonShape = theme?.buttonShape || 'hard';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';

    return (
        <section className={`py-20 @md:py-24 px-6 @md:px-12`} id="work">
            <div className="flex justify-between items-end mb-12">
                <h2 className={`font-black uppercase tracking-tighter cine-heading text-[clamp(2.5rem,8cqi,5rem)]`}>
                    <EditableText value={theme?.customTexts?.cinematic_projects_title || 'Selected Works'} field="cinematic_projects_title" entity="appearance" isEditor={isEditor} as="span" />
                    {' '}<span className="text-gray-600 text-xl @md:text-2xl">({archiveItems.length})</span>
                </h2>
            </div>

            <div className="flex flex-col border-t border-[#1f1f1f]">
                {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
                    const isVideo = p.projectType === 'video';
                    return (
                        <motion.div 
                            key={`project-${i}`}
                            initial={{ opacity: 0, x: -20 }} 
                            {...{ [animationTrigger]: { opacity: 1, x: 0 } }} 
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            onClick={() => {
                                if (isEditor) return;
                                if (isVideo || p.projectType === 'photo') {
                                    setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                } else if (p.mediaUrl) {
                                    window.open(p.mediaUrl, '_blank');
                                }
                            }}
                            className={`project-row relative group flex justify-between cursor-pointer cine-border-accent flex-col @md:flex-row @md:items-center py-8 @md:py-14`}
                        >
                            <div className={`flex relative z-10 pointer-events-none flex-col @md:flex-row @md:items-center gap-4 @md:gap-20`}>
                                <span className="text-gray-600 font-mono text-sm @md:text-lg hidden @md:block">0{i + 1}</span>
                                <h3 className={`font-black tracking-tighter uppercase group-hover:cine-accent text-gray-300 transition-colors cine-heading line-clamp-1 text-[clamp(1.5rem,5cqi,4rem)]`}>{p.title}</h3>
                            </div>
                            
                            {/* Video Play Indicator */}
                            {isVideo && (
                                <div className="absolute left-[40%] top-1/2 -translate-y-1/2 hidden @md:flex items-center gap-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                                    <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
                                        <i className="fas fa-play text-[10px] ml-1"></i>
                                    </div>
                                    <span className="font-bold text-[10px] uppercase tracking-[0.3em] cine-body">Watch_Now</span>
                                </div>
                            )}

                            <div className={`flex flex-col relative z-10 pointer-events-none cine-body mt-4 @md:mt-0 @md:text-right`}>
                                <span className="text-[10px] @md:text-sm font-bold uppercase tracking-widest text-white">{p.projectType}</span>
                                <span className="cine-body text-gray-500 mt-1 text-[10px] @md:text-sm truncate max-w-[200px]">{p.description || 'View Project'}</span>
                            </div>

                            {/* Mobile Inline Image */}
                            <div className={`block @md:hidden mt-5 w-full aspect-video relative z-10 overflow-hidden ${radiusClass}`}>
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="w-full h-full object-cover grayscale" />
                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
                                            <i className="fas fa-play text-xs ml-0.5"></i>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Absolute Hover Image */}
                            <div className={`hidden @md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40cqi] h-[40vh] z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden ${radiusClass}`}>
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="w-full h-full object-cover grayscale opacity-50" />
                            </div>
                        </motion.div>
                    )
                }) : <div className="py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">No projects available.</div>}
            </div>

            {/* Tombol Gallery Utama (Sleek Cinematic Style) */}
            {showGalleryButton && (
                <div className={`w-full flex justify-center mb-20 px-6 mt-12`}>
                    <Link href={isEditor ? '#' : (isPreviewRoute ? `/preview/${subdomain}/gallery` : `/${subdomain}/gallery`)}  className="group relative block w-full max-w-4xl no-underline overflow-hidden border-y border-[#1f1f1f] hover:border-white/30 transition-colors duration-700">
                        {/* Background Glow Effect */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-700"></div>

                        <div className={`relative z-10 flex items-center justify-between py-10 @md:py-14 px-2 @md:px-8`}>
                            <div className="flex flex-col">
                                <span className={`font-mono text-gray-500 uppercase tracking-[0.3em] group-hover:text-gray-300 transition-colors duration-500 text-[9px] @md:text-xs mb-3`}>
                                    <i className="fas fa-film mr-2"></i>
                                    <EditableText value={theme?.customTexts?.cinematic_btn_index || 'Full Index'} field="cinematic_btn_index" entity="appearance" isEditor={isEditor} as="span" />
                                </span>
                                <h3 className={`font-black uppercase tracking-tighter text-gray-300 group-hover:text-white transition-colors duration-500 cine-heading flex items-center gap-4 text-3xl @md:text-6xl`}>
                                    <EditableText value={theme?.customTexts?.cinematic_btn_explore || 'Explore Archive'} field="cinematic_btn_explore" entity="appearance" isEditor={isEditor} as="span" />
                                </h3>
                            </div>

                            {/* Animated Arrow */}
                            <div className={`flex items-center justify-center shrink-0 ${radiusClass} border border-[#1f1f1f] group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-700 text-gray-500 w-12 h-12 @md:w-20 @md:h-20`}>
                                <i className={`fas fa-arrow-right group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-lg @md:text-2xl`}></i>
                            </div>
                        </div>

                        {/* Scanning Line (Cinematic Lens Flare effect) */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out"></div>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-[1.5s] ease-in-out"></div>
                    </Link>
                </div>
            )}
        </section>
    );
}
