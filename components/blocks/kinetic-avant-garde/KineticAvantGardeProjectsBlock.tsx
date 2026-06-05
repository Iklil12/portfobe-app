"use client";
import React, { useRef } from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
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

    useGSAP(() => {
        if (isCardPreview) return;
        
        const cards = gsap.utils.toArray('.stack-card') as HTMLElement[];
        cards.forEach((card, i) => {
            if (i !== cards.length - 1) { 
                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.5,
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
        <section ref={containerRef} className="relative kag-bg-void pb-[10vh]" id="gallery">
            <div className="pt-32 pb-16 px-10">
                <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-4">
                    <EditableText entity="appearance" field="kag_gallery_subtitle" value={getCustomText('kag_gallery_subtitle', '[ ARSIP PROYEK ]')} isEditor={isEditor} />
                </h3>
                <h2 className="font-kag-brutal text-6xl md:text-9xl kag-text-bone uppercase flex flex-wrap gap-4 leading-none">
                    <EditableText entity="appearance" field="kag_gallery_title1" value={getCustomText('kag_gallery_title1', 'KARYA')} isEditor={isEditor} />
                    <span className="kag-text-outline">
                        <EditableText entity="appearance" field="kag_gallery_title2" value={getCustomText('kag_gallery_title2', 'MURNI')} isEditor={isEditor} />
                    </span>
                </h2>
            </div>

            {featuredProjects.slice(0, 3).map((project: any, i: number) => {
                const isEven = i % 2 !== 0;
                const displayMedia = project.projectType === 'video' ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
                const zIndex = i + 1;

                if (i === 2) {
                    return (
                        <div key={project.id} className="stack-card flex items-center justify-center p-4 md:p-10" style={{ zIndex }}>
                            <div className="w-full h-[80vh] md:h-[90vh] bg-[#111] rounded-2xl overflow-hidden relative flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.8)] hover-trigger cursor-pointer" onClick={() => setSelectedMedia?.({ url: project.mediaUrl, title: project.title, type: project.projectType || 'photo' })}>
                                <div className="absolute inset-0 bg-black/50 z-10"></div>
                                <LazyImage src={displayMedia} alt={project.title} className="absolute inset-0 w-full h-full object-cover object-top transition duration-700 hover:scale-105" />
                                
                                <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center p-6">
                                    <span className="font-kag-mono text-white/70 text-sm uppercase tracking-widest mb-6">00{i+1} — {project.projectType || 'Media'}</span>
                                    <h4 className="font-kag-serif italic text-6xl md:text-9xl text-white">{project.title}</h4>
                                    <button className="mt-12 border border-white/50 px-8 py-3 rounded-full font-kag-mono text-white hover:bg-white hover:kag-text-blood transition duration-300 uppercase tracking-widest text-xs pointer-events-none">
                                        Eksplorasi Penuh
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={project.id} className="stack-card flex items-center justify-center p-4 md:p-10" style={{ zIndex }}>
                        <div className={`w-full h-[80vh] md:h-[90vh] ${isEven ? 'kag-bg-bone' : 'bg-[#111]'} rounded-2xl overflow-hidden relative flex flex-col md:flex-row shadow-[0_-20px_50px_rgba(0,0,0,0.8)]`}>
                            <div className={`w-full md:w-1/2 h-1/2 md:h-full overflow-hidden relative group hover-trigger cursor-pointer ${isEven ? 'order-2 md:order-1' : ''}`} onClick={() => setSelectedMedia?.({ url: project.mediaUrl, title: project.title, type: project.projectType || 'photo' })}>
                                ${isEven ? (
                                    <LazyImage src={displayMedia} alt={project.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full overflow-hidden relative">
                                        <LazyImage src={displayMedia} alt={project.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                    </div>
                                )}
                            </div>
                            <div className={`w-full md:w-1/2 h-1/2 md:h-full p-10 flex flex-col justify-center ${isEven ? 'order-1 md:order-2' : ''}`}>
                                <span className="font-kag-mono kag-text-blood text-sm uppercase tracking-widest">00{i+1} — {project.projectType || 'Project'}</span>
                                <h4 className={`font-kag-brutal text-5xl md:text-7xl ${isEven ? 'kag-text-void' : 'kag-text-bone'} mt-4 leading-none uppercase`}>
                                    {project.title}
                                </h4>
                                <p className={`font-kag-mono ${isEven ? 'kag-text-void/70' : 'kag-text-bone/60'} mt-8 max-w-sm text-sm line-clamp-4`}>
                                    {project.description || 'Tidak ada deskripsi'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {allProjects.length > 3 && (
                <div className="kag-bg-void py-20 flex justify-center w-full relative z-20 border-t border-white/5 mt-10">
                    {isEditor ? (
                        <button className="border border-white/20 px-8 py-3 rounded-full font-kag-mono text-white/50 text-xs tracking-widest uppercase cursor-not-allowed">
                            [ Lebih Banyak Proyek di Live Site ]
                        </button>
                    ) : (
                        <Link href={`/${subdomain}/gallery`}
                              className="border border-white/20 px-8 py-3 rounded-full font-kag-mono text-white hover:bg-white hover:kag-text-blood transition duration-300 text-xs tracking-widest uppercase hover-trigger">
                            Eksplorasi Arsip Penuh
                        </Link>
                    )}
                </div>
            )}
        </section>
    );
}
