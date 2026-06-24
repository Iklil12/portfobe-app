import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';
import { getVideoThumbnail } from '@/shared/lib/videoUtils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HorizontalFlowProjectsBlock({ data, theme, isEditor, setSelectedMedia }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
    
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!isEditor) {
            let mm = gsap.matchMedia();
            mm.add("(min-width: 768px)", () => {
                const horizontalWrapper = wrapperRef.current;
                const horizontalContainer = containerRef.current;
                
                if (horizontalWrapper && horizontalContainer) {
                    function getScrollAmount() {
                        let containerWidth = horizontalContainer?.scrollWidth || 0;
                        return -(containerWidth - window.innerWidth);
                    }

                    const tween = gsap.to(horizontalContainer, {
                        x: getScrollAmount,
                        ease: "none"
                    });

                    ScrollTrigger.create({
                        trigger: horizontalWrapper,
                        start: "top top",
                        end: () => `+=${getScrollAmount() * -1}`, 
                        pin: true,
                        animation: tween,
                        scrub: true,
                        invalidateOnRefresh: true 
                    });
                }
            });
        }
    }, { scope: wrapperRef, dependencies: [isEditor, archiveItems.length] });

    return (
        <section id="work" className="bg-surface relative z-20" data-cursor="DRAG" ref={wrapperRef}>
            <div className={`horizontal-wrapper ${isEditor ? '!h-auto !overflow-x-auto hide-scrollbar' : ''}`}>
                <div className="absolute top-0 left-0 w-full p-6 md:p-10 z-10 pointer-events-none flex justify-between items-end h-screen">
                    <h2 className="font-display font-bold uppercase tracking-tight opacity-10 text-6xl md:text-[8vw]">
                      <EditableText value={theme?.customTexts?.hf_archive_title || 'Archive'} field="hf_archive_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h2>
                    <div className="font-mono text-xs opacity-50 uppercase tracking-widest mb-4">
                      <EditableText value={theme?.customTexts?.hf_archive_subtitle || 'Scroll Horizontal →'} field="hf_archive_subtitle" entity="appearance" isEditor={isEditor} as="span" />
                    </div>
                </div>
                
                <div className={`horizontal-container ${isEditor ? '!h-[80vh] flex items-center' : ''}`} ref={containerRef}>
                    {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
                      const isVideo = p.projectType === 'video';

                      return (
                      <div key={i} onClick={() => setSelectedMedia && setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType || 'photo' })} className="project-card group cursor-pointer" data-cursor={isVideo ? "PLAY" : "VIEW"}>
                          <LazyImage src={isVideo ? (p.thumbnailUrl || getVideoThumbnail(p.mediaUrl)) : p.mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={p.title} />
                          
                          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500"></div>
                          
                          {isVideo && (
                              <i className="ph-fill ph-play-circle text-6xl text-white opacity-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform pointer-events-none"></i>
                          )}
                          
                          <div className="absolute top-8 left-8 flex gap-2">
                              <span className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">{p.projectType || 'Case Study'}</span>
                          </div>

                          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                              <div>
                                  <p className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-2">{new Date(p.createdAt || Date.now()).getFullYear()} / {p.projectType || 'Design'}</p>
                                  <h3 className="font-display text-4xl md:text-6xl font-bold uppercase text-white">{p.title}</h3>
                              </div>
                          </div>
                      </div>
                    )}) : (
                      [1,2,3].map((i) => (
                        <div key={i} className="project-card group" data-cursor="VIEW">
                            <img src={`https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" alt="Preview" />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500"></div>
                            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                <div>
                                    <p className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-2">2026 / Project {i}</p>
                                    <h3 className="font-display text-4xl md:text-6xl font-bold uppercase text-white">Sample Case</h3>
                                </div>
                            </div>
                        </div>
                      ))
                    )}

                    <div className="w-[10vw] h-full flex-shrink-0"></div>
                </div>
            </div>
        </section>
    );
}
