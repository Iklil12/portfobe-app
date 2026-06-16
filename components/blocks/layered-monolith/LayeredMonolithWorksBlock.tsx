import React from 'react';
import Link from 'next/link';
import { getVideoThumbnail } from '@/lib/videoUtils';

export function LayeredMonolithWorksBlock({ data, setSelectedMedia }: any) {
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const allProjects = data?.projects || data?.user?.projects || [];
    const featuredProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 4);

    return (
        <div id="works" className="relative w-full">
            <div id="nav-works" className="absolute -top-20 w-full h-0 pointer-events-none invisible"></div>
            {featuredProjects.map((p: any, i: number) => {
                const isVideo = p.projectType === 'video';
                // Alternate card styles
                const bgClasses = ['bg-[#1E2328] text-white', 'bg-black text-white', 'bg-[#F5F5F0] text-[#1A1A18]', 'bg-[#1A1A18] text-white'];
                const overlayClasses = [
                    'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))',
                    'rgba(0,0,0,0.6)',
                    'linear-gradient(to top, rgba(245,245,240,1), rgba(245,245,240,0.3))',
                    'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4))'
                ];
                const chipStyles = [
                    'chip', 'chip', 'chip chip-dark text-black', 'chip'
                ];
                const styleIdx = i % bgClasses.length;

                return (
                    <section key={i} className={`stack-card ${bgClasses[styleIdx]} flex items-center justify-center relative cursor-pointer`} onClick={() => {
                        if ((isVideo || p.projectType === 'photo') && setSelectedMedia) {
                            setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                        } else if (p.mediaUrl) {
                            window.open(p.mediaUrl, '_blank');
                        }
                    }}>
                        <img src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className={`parallax-img ${styleIdx === 2 ? 'opacity-80 mix-blend-multiply filter grayscale contrast-125' : ''}`} />
                        <div className="parallax-overlay" style={{ background: overlayClasses[styleIdx] }}></div>
                        <div className={`noise ${styleIdx === 2 ? 'mix-blend-multiply opacity-5' : 'mix-blend-overlay opacity-10'}`}></div>

                        <div className="relative z-10 p-8 md:p-12 w-full h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className={`font-display text-xs tracking-[0.3em] uppercase border ${styleIdx === 2 ? 'border-black/30' : 'border-white/30'} px-4 py-2 rounded-full backdrop-blur-md`}>
                                    PRJ / 0{i + 1}
                                </span>
                                <span className="font-body text-xs tracking-widest opacity-70">
                                    {p.year || new Date().getFullYear()}
                                </span>
                            </div>

                            <div className="cursor-hover pb-24 md:pb-0 group" data-cursor-text="VIEW">
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className={chipStyles[styleIdx]}>{p.projectType || 'Project'}</span>
                                </div>
                                <h3 className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-4 group-hover:scale-[1.02] origin-left transition-transform duration-500">
                                    {p.title}
                                </h3>
                                <p className={`font-body text-sm md:text-base max-w-sm ${styleIdx === 2 ? 'text-[#1A1A18]/70 font-medium' : 'text-white/70 font-light'}`}>
                                    {p.description || 'View details of this featured project.'}
                                </p>
                            </div>
                        </div>
                    </section>
                );
            })}
            
            {/* View Gallery Card */}
            {allProjects.length > featuredProjects.length && (
                <section className="stack-card bg-brand-accent text-white flex items-center justify-center relative cursor-pointer" >
                    <div className="noise mix-blend-overlay opacity-20"></div>
                    <Link href={`/${subdomain}/gallery`}  className="relative z-10 flex flex-col items-center justify-center w-full h-full cursor-hover group" data-cursor-text="ALL">
                        <h2 className="font-display text-6xl md:text-[8rem] font-bold uppercase leading-none tracking-tighter group-hover:scale-105 transition-transform duration-500">
                            EXPLORE<br/>ARCHIVE
                        </h2>
                        <div className="mt-8 border border-white px-8 py-4 rounded-full font-display uppercase tracking-widest text-sm group-hover:bg-white group-hover:text-brand-accent transition-colors">
                            View All {allProjects.length} Projects
                        </div>
                    </Link>
                </section>
            )}
        </div>
    );
}
