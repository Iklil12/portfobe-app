import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LazyImage } from '@/shared/ui/LazyImage';
import { getVideoThumbnail } from '@/shared/lib/videoUtils';
import { EditableText } from '@/shared/ui/EditableText';

export function NexusNoirProjectsBlock({ data, theme, isEditor, setSelectedMedia }: any) {
    const pathname = usePathname();
    const isPreviewRoute = pathname?.includes('/preview/');
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

    const allProjects = data?.projects || data?.user?.projects || [];
    const featuredProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 4);
    const galleryProjectsCount = allProjects.filter((p: any) => p.projectType === 'photo' || p.projectType === 'video').length;
    const userPlan = data?.plan || data?.user?.plan || 'FREE';
    const showGalleryButton = userPlan !== 'FREE' && galleryProjectsCount > 4;

    const accentColor = theme?.themeColor || '#4F46E5'; 

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section id="work" className="py-20 px-6 relative z-20">
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20">
                    <div className={isEditor ? '' : 'gs-reveal'}>
                        <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>[ Selected Works ]</p>
                        <h2 className="font-nn-heading text-4xl md:text-6xl font-semibold">Digital<br/>Artifacts.</h2>
                    </div>
                    <p className={`text-[#888888] text-sm mt-4 md:mt-0 text-left md:text-right max-w-xs ${isEditor ? '' : 'gs-reveal'}`}>
                        <EditableText entity="appearance" field="nn_work_desc" value={getCustomText('nn_work_desc', 'Koleksi proyek pilihan dengan fokus pada interaktivitas dan estetika presisi.')} isEditor={isEditor} />
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 md:gap-x-10">
                    {featuredProjects.map((project: any, i: number) => {
                        const isOdd = i % 2 === 0; 
                        const displayMedia = project.projectType === 'video' ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
                        
                        return (
                            <div key={project.id} 
                                 className={`project-card magnetic-card group cursor-pointer ${isEditor ? '' : 'gs-reveal'} ${isOdd ? 'md:col-span-7' : 'md:col-span-5 md:mt-40'}`} 
                                 onClick={() => setSelectedMedia && setSelectedMedia({ url: project.mediaUrl, title: project.title, type: project.projectType || 'photo' })}>
                                <div className={`img-wrap rounded-2xl mb-6 bg-white/5 ${isOdd ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}>
                                    <LazyImage src={displayMedia} alt={project.title} className={`w-full h-full object-cover ${!isOdd ? 'grayscale group-hover:grayscale-0' : ''}`} />
                                    <div className="project-details-overlay">
                                        <span className="view-btn bg-white text-black font-medium px-6 py-3 rounded-full">View Media</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-nn-heading text-2xl md:text-3xl font-medium mb-2">{project.title}</h3>
                                        <p className="text-[#888888] text-sm mb-4 line-clamp-2">{project.description || 'Proyek digital.'}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-mono text-[#888888] mb-1">{(project.createdAt || '2024').substring(0, 4)}</span>
                                        <span className="block text-xs uppercase tracking-wider border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">{project.projectType || 'Project'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {showGalleryButton && (
                    <div className={`mt-32 text-center relative z-20 ${isEditor ? '' : 'gs-reveal'}`}>
                        {isEditor ? (
                            <button className="border border-white/20 px-8 py-3 rounded-full font-mono text-white/50 text-xs tracking-widest uppercase cursor-not-allowed">
                                [ View Full Archive ]
                            </button>
                        ) : (
                            <Link href={isPreviewRoute ? `/preview/${subdomain}/gallery` : `/${subdomain}/gallery`}
                                  className="border border-white/20 px-8 py-3 rounded-full font-mono text-white hover:bg-white hover:text-black transition duration-300 text-xs tracking-widest uppercase hover-trigger">
                                View Full Archive
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
