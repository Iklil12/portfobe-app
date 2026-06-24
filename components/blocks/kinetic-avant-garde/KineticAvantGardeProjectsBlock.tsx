"use client";
import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';
import { getVideoThumbnail } from '@/shared/lib/videoUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function KineticAvantGardeProjectsBlock({ data, theme, isEditor, isCardPreview, setSelectedMedia }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const allProjects = data?.projects || data?.user?.projects || [];
    const featuredProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d');
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

    const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
    const userPlan = data?.plan || data?.user?.plan || 'FREE';
    const showGalleryButton = userPlan !== 'FREE' && galleryProjectsCount > 4;

    useGSAP(() => {
        if (isCardPreview) return;
        
        const cards = gsap.utils.toArray('.stack-card') as HTMLElement[];
        cards.forEach((card, i) => {
            if (i !== cards.length - 1) { 
                gsap.to(card, {
                    scale: 0.92,
                    opacity: 0.4,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                        pin: false
                    }
                });
            }
        });
    }, { scope: containerRef, dependencies: [isEditor, isCardPreview, featuredProjects.length] });

    if (featuredProjects.length === 0) return null;

    return (
        <section ref={containerRef} className="relative kag-bg-void pb-[10vh] overflow-hidden border-t border-white/10" id="gallery" style={{ '--accent': theme?.themeColor || '#c92a2a' } as any}>
            
            {/* Elegant Noise Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-screen"></div>
            
            {/* Giant Faint Background Marquee */}
            <div className="absolute top-32 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.02] select-none pointer-events-none z-0 flex">
                <div className="animate-marquee inline-flex font-kag-brutal text-[25vw] leading-none uppercase text-white">
                    <span className="px-8">SELECTED WORKS —</span>
                    <span className="px-8">SELECTED WORKS —</span>
                    <span className="px-8">SELECTED WORKS —</span>
                </div>
            </div>
            
            <div className="pt-32 pb-32 px-6 md:px-12 max-w-[90rem] mx-auto relative z-10">
                <div className="flex items-center gap-6 mb-16 md:mb-24 relative z-20">
                    <div className="w-24 md:w-48 h-[1px] kag-bg-blood"></div>
                    <h3 className="font-kag-mono text-[#e6e4dc] tracking-[0.5em] uppercase text-xs md:text-sm font-bold opacity-60">
                        <EditableText entity="appearance" field="kag_gallery_subtitle" value={getCustomText('kag_gallery_subtitle', 'ARSIP PROYEK')} isEditor={isEditor} />
                    </h3>
                </div>
                
                <div className="relative w-full">
                    {/* The solid, gargantuan first word */}
                    <h2 className="font-kag-brutal text-[clamp(4rem,15vw,16rem)] leading-[0.75] tracking-tighter uppercase text-[#e6e4dc] m-0 p-0 relative z-20 break-words">
                        <EditableText entity="appearance" field="kag_gallery_title1" value={getCustomText('kag_gallery_title1', 'KARYA')} isEditor={isEditor} as="span" />
                    </h2>
                    
                    {/* The elegant, outlined, right-aligned overlapping second word */}
                    <h2 
                        className="font-kag-serif italic text-[clamp(3.5rem,15vw,14rem)] leading-[0.75] tracking-tighter uppercase text-transparent text-right -mt-[8vw] md:-mt-[6vw] relative z-30 md:pr-12 pointer-events-none break-words"
                        style={{ WebkitTextStroke: 'clamp(1px, 0.4vw, 3px) var(--accent)' }}
                    >
                        <EditableText entity="appearance" field="kag_gallery_title2" value={getCustomText('kag_gallery_title2', 'MURNI')} isEditor={isEditor} as="span" className="pointer-events-auto" />
                    </h2>

                    {/* Decorative Kinetic Circular Elements */}
                    <div className="absolute top-[20%] right-[5%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] border border-white/10 rounded-full animate-spin-slow pointer-events-none z-10 mix-blend-overlay"></div>
                    <div className="absolute top-[35%] right-[12%] w-[15vw] h-[15vw] max-w-[200px] max-h-[200px] border border-[var(--accent)] rounded-full animate-spin-slow pointer-events-none z-10 opacity-30" style={{ animationDirection: 'reverse' }}></div>
                </div>
            </div>

            {featuredProjects.slice(0, 3).map((project: any, i: number) => {
                const isEven = i % 2 !== 0;
                const displayMedia = project.projectType === 'video' ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
                const zIndex = i + 1;

                if (i === 2) {
                    return (
                        <div key={project.id} className="stack-card flex items-center justify-center p-4 md:p-12 relative" style={{ zIndex }}>
                            <div className="w-full h-[80vh] md:h-[85vh] bg-[#0a0a0a] rounded-3xl overflow-hidden relative flex flex-col hover-trigger cursor-pointer border border-white/10 transition-transform duration-700 hover:-translate-y-2 shadow-2xl" onClick={() => setSelectedMedia?.({ url: project.mediaUrl, title: project.title, type: project.projectType || 'photo' })}>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-700 group-hover:opacity-80"></div>
                                <LazyImage src={displayMedia} alt={project.title} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1.5s] ease-out hover:scale-[1.03]" />
                                
                                <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center p-6">
                                    <span className="inline-block border border-white/20 rounded-full px-6 py-2 backdrop-blur-md bg-black/30 font-kag-mono text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-8 text-white/80">
                                        00{i+1} — {project.projectType || 'MEDIA'}
                                    </span>
                                    <h4 className="font-kag-serif italic text-[clamp(2.5rem,8vw,10rem)] text-white leading-[0.9] drop-shadow-2xl break-words">{project.title}</h4>
                                    
                                    <div className="mt-12 overflow-hidden rounded-full">
                                        <button className="border border-white/30 px-8 py-3 rounded-full font-kag-mono text-white hover:bg-white hover:text-black transition-colors duration-500 uppercase tracking-widest text-xs pointer-events-none">
                                            Eksplorasi Visual
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={project.id} className="stack-card flex items-center justify-center p-4 md:p-12" style={{ zIndex }}>
                        <div className={`w-full h-[80vh] md:h-[85vh] ${isEven ? 'bg-[#e6e4dc] text-[#0a0a0a]' : 'bg-[#111] text-[#e6e4dc]'} rounded-3xl overflow-hidden relative flex flex-col md:flex-row border ${isEven ? 'border-black/5' : 'border-white/10'} shadow-2xl transition-transform duration-700 hover:-translate-y-2`}>
                            
                            <div className={`w-full md:w-[55%] h-1/2 md:h-full overflow-hidden relative group hover-trigger cursor-pointer ${isEven ? 'order-2 md:order-1' : ''}`} onClick={() => setSelectedMedia?.({ url: project.mediaUrl, title: project.title, type: project.projectType || 'photo' })}>
                                <LazyImage src={displayMedia} alt={project.title} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
                            </div>

                            <div className={`w-full md:w-[45%] h-1/2 md:h-full p-6 md:p-16 lg:p-24 flex flex-col justify-center ${isEven ? 'order-1 md:order-2' : ''} relative`}>
                                <div className="relative z-10 flex flex-col h-full justify-center">
                                    <div className="flex items-center gap-4 mb-4 md:mb-8">
                                        <span className={`h-[1px] w-6 md:w-8 ${isEven ? 'bg-black/20' : 'bg-white/20'}`}></span>
                                        <span className={`font-kag-mono text-[10px] md:text-xs uppercase tracking-[0.2em] ${isEven ? 'text-black/60' : 'text-white/50'}`}>
                                            00{i+1} — {project.projectType || 'PROJECT'}
                                        </span>
                                    </div>
                                    
                                    <h4 className="font-kag-brutal text-[clamp(2rem,5vw,5rem)] leading-[0.9] uppercase tracking-tight break-words">
                                        {project.title}
                                    </h4>
                                    
                                    <p className={`font-kag-mono mt-8 max-w-md text-sm md:text-base line-clamp-4 leading-relaxed ${isEven ? 'text-black/70' : 'text-white/60'}`}>
                                        {project.description || 'Narasi visual yang meredefinisi ruang digital melalui pendekatan kinetik dan estetika tingkat tinggi.'}
                                    </p>
                                    
                                    <div className="mt-12">
                                        <button className={`group flex items-center gap-4 font-kag-mono uppercase tracking-widest text-xs transition-colors duration-300 ${isEven ? 'text-black hover:text-[var(--accent)]' : 'text-white hover:text-[var(--accent)]'}`} onClick={() => setSelectedMedia?.({ url: project.mediaUrl, title: project.title, type: project.projectType || 'photo' })}>
                                            <span className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isEven ? 'border-black/20 group-hover:border-[var(--accent)]' : 'border-white/20 group-hover:border-[var(--accent)]'}`}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:translate-x-1">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </span>
                                            Buka Arsip
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {showGalleryButton && (
                <div className="py-24 flex justify-center w-full relative z-20 border-t border-white/5 mt-12">
                    {isEditor ? (
                        <button className="border border-white/20 px-10 py-4 rounded-full font-kag-mono text-white/50 text-xs tracking-[0.2em] uppercase cursor-not-allowed transition-all duration-500 hover:bg-white/5">
                            Lihat Semua Proyek
                        </button>
                    ) : (
                        <Link href={`/${subdomain}/gallery`}
                              className="border border-white/20 px-10 py-4 rounded-full font-kag-mono text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 hover:scale-105">
                            Lihat Semua Proyek
                        </Link>
                    )}
                </div>
            )}
        </section>
    );
}
