"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';
import { getVideoThumbnail } from '@/shared/lib/videoUtils';
import { useSplitScreenStudio } from './SplitScreenStudioContext';

const ScrambleText = ({ text, isHovered }: { text: string, isHovered?: boolean }) => {
    return (
        <span className="relative inline-flex items-center justify-center whitespace-nowrap">
            {text}
        </span>
    );
};

export function SplitScreenStudioProjectsBlock({ data, theme, isEditor }: any) {
    const { setSelectedMedia, cursorHovered, setCursorHovered } = useSplitScreenStudio();
    const pathname = usePathname();
    const isPreviewRoute = pathname?.includes('/preview/');
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
    const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
    const userPlan = data?.plan || data?.user?.plan || 'FREE';
    const showGalleryButton = userPlan !== 'FREE' && galleryProjectsCount > 4;

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    const formatTitle = (title: string) => {
        const words = title.split(' ');
        if(words.length <= 1) return title;
        return words.map((w, i) => <React.Fragment key={i}>{w}{i < words.length - 1 && <br/>}</React.Fragment>);
    };

    if (archiveItems.length === 0 && !isEditor) return null;

    // Fallback for editor if no projects
    const displayItems = archiveItems.length > 0 ? archiveItems : [
        { title: 'Project One', projectType: 'photo', description: 'Sample project description', mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
        { title: 'Project Two', projectType: 'video', description: 'Sample project description', mediaUrl: 'https://cdn.pixabay.com/video/2020/05/25/40140-425488427_large.mp4' }
    ];

    return (
        <div id="works">
            {displayItems.map((p: any, i: number) => {
                const isVideo = p.projectType === 'video';
                return (
                    <ScrollBlock 
                        key={i} isProject={true} projectData={p}
                        bg={i % 2 === 0 ? '#0A1118' : '#160c0c'} 
                        index={`PRJ / 0${i + 1}`} 
                        tag={<EditableText entity="appearance" field="sss_works_tag" value={getCustomText('sss_works_tag', 'SELECTED WORKS')} isEditor={isEditor} maxLength={30} as="span" />} 
                        title={formatTitle(p.title)} 
                        desc={p.description || `Project ${p.title} showcasing our capabilities in ${p.projectType}.`}
                    >
                            {({ y, clipPath }: any) => (
                                <div className="flex flex-col">
                                    <h2 className="md:hidden font-display text-2xl font-bold uppercase mb-6 text-white/50">PRJ 0{i+1}. {p.title}</h2>
                                    <motion.div 
                                        className="w-full aspect-[4/5] md:aspect-square overflow-hidden cursor-hover-target relative group"
                                        style={{ clipPath }}
                                        onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}
                                        onClick={() => {
                                            if (isVideo || p.projectType === 'photo') {
                                                setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                            } else if (p.mediaUrl) {
                                                window.open(p.mediaUrl, '_blank');
                                            }
                                        }}
                                    >
                                        <motion.div style={{ y }} className="w-full h-[120%] origin-center">
                                            <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out" />
                                        </motion.div>
                                        {isVideo && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white backdrop-blur-md">
                                                    <i className="fas fa-play ml-1"></i>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                    <div className="mt-8 flex justify-between items-start">
                                        <div>
                                            <h3 className="font-display text-3xl font-bold uppercase">{p.title}</h3>
                                            <p className="font-sans text-white/50 text-sm mt-2">{p.projectType}</p>
                                        </div>
                                        <span className="font-sans text-xs tracking-widest text-white/50 border border-white/20 px-3 py-1 rounded-full">2026</span>
                                    </div>
                                </div>
                            )}
                    </ScrollBlock>
                );
            })}

            {showGalleryButton && (
                <div className="w-full flex justify-center py-24 bg-[#050505]">
                    {isEditor ? (
                        <button className="cursor-not-allowed flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-colors duration-300 font-display uppercase tracking-widest text-xs font-bold text-white/50" onClick={(e) => e.preventDefault()}>
                            <ScrambleText text="EXPLORE FULL GALLERY" isHovered={false} />
                        </button>
                    ) : (
                        <Link href={isPreviewRoute ? `/preview/${subdomain}/gallery` : `/${subdomain}/gallery`}
                              className="cursor-hover-target flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 font-display uppercase tracking-widest text-xs font-bold"
                              onMouseEnter={() => setCursorHovered('gallery')} onMouseLeave={() => setCursorHovered(false)}>
                            <ScrambleText text="EXPLORE FULL GALLERY" isHovered={cursorHovered === 'gallery'} />
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
