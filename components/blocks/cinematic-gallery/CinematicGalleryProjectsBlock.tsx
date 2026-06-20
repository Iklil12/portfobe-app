"use client";

import React from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { getVideoThumbnail } from '@/lib/videoUtils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function CinematicGalleryProjectsBlock(props: any) {
    const { isMobileView, setSelectedMedia, data, isEditor, theme, isCardPreview } = useCinematicGallery();

    const pathname = usePathname();
    const isPreviewRoute = pathname?.includes('/preview/');
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

    const allProjects = data?.projects || data?.user?.projects || [];
    const featuredProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 4);
    const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
    const userPlan = data?.plan || data?.user?.plan || 'FREE';
    const showGalleryButton = userPlan !== 'FREE' && galleryProjectsCount > 4;

    if (featuredProjects.length === 0) return null;

    return (
        <>
            {featuredProjects.map((p: any, i: number) => {
                const isVideo = p.projectType === 'video';
                const isEven = i % 2 !== 0;
                const numberLabel = `0${i + 1} — ${p.projectType || 'Proyek'}`;
                
                return (
                    <section key={i} className={`panel flex-col ${!isMobileView ? (isEven ? 'md:flex-row-reverse' : 'md:flex-row') : ''} gap-8 md:gap-12 lg:gap-24 items-center justify-center`}>
                        <div className={`flex-shrink-0 w-[90vw] h-[50vh] ${!isMobileView ? 'md:w-[45vw] md:h-[65vh]' : ''} img-container bg-gray-900 overflow-hidden group rounded-lg`}>
                            <img src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="img-parallax opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                            {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center bg-black/30 backdrop-blur-sm">
                                        <i className="fas fa-play text-white ml-1"></i>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={`flex-shrink-0 flex flex-col justify-center w-full md:w-auto ${isEven && !isMobileView ? 'text-right' : 'text-left'}`}>
                            <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8b8b8b] mb-2 md:mb-4">{numberLabel}</span>
                            <h2 
                                className={`font-display font-bold text-4xl md:text-5xl lg:text-7xl hover-trigger cursor-pointer uppercase break-words ${isEven ? 'cg-outline-text hover:text-[#f5f5f0] hover:[-webkit-text-stroke:0px] transition-colors' : 'italic text-[#f5f5f0]'}`}
                                onClick={() => {
                                    if (isVideo || p.projectType === 'photo') {
                                        setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                    } else if (p.mediaUrl) {
                                        window.open(p.mediaUrl, '_blank');
                                    }
                                }}
                            >
                                {p.title}
                            </h2>
                            <p className={`font-sans mt-4 md:mt-8 max-w-xs md:max-w-sm text-xs md:text-sm text-gray-400 ${isEven && !isMobileView ? 'ml-auto' : ''}`}>
                                {p.description || 'Proyek kreatif yang mengeksplorasi medium digital dan batasan visual.'}
                            </p>
                        </div>
                    </section>
                );
            })}

            {/* Panel Khusus "EXPLORE ALL WORKS / GALLERY" */}
            {showGalleryButton && (
                <section 
                    className="panel flex-col items-center justify-center gap-8 md:gap-12 lg:gap-16 bg-[#0c0c0c] border border-white/5 relative"
                    style={!isCardPreview ? { width: '100vw' } : undefined}
                >
                    {/* Background Reticle */}
                    <div className="absolute inset-[10vh] border border-white/5 pointer-events-none z-10 rounded-sm">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/10"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/10"></div>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-center text-center max-w-xl z-20">
                        <span className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#8b8b8b] mb-4">
                            0{featuredProjects.length + 1} — INDEX ARSIP
                        </span>
                        <h2 className="font-serif font-bold text-4xl md:text-6xl lg:text-7xl italic text-[#f5f5f0] uppercase leading-none tracking-tight">
                            Galeri.
                        </h2>
                        <p className="font-sans mt-4 max-w-sm text-xs md:text-sm text-gray-400 leading-relaxed">
                            Eksplorasi secara lengkap seluruh arsip karya visual, cuplikan video sinematik, dan dokumentasi proyek kami.
                        </p>
                        <div className="mt-8">
                            <Link 
                                href={isEditor ? '#' : (isPreviewRoute ? `/preview/${subdomain}/gallery` : `/${subdomain}/gallery`)} 
                                className="inline-flex items-center gap-3 px-6 py-3 border border-white/10 hover:border-white/40 bg-white/5 hover:bg-white/10 rounded-full text-xs md:text-sm tracking-widest uppercase transition-all duration-300 pointer-events-auto"
                            >
                                <span>Jelajahi Galeri</span>
                                <i className="fas fa-arrow-right text-[10px]"></i>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
