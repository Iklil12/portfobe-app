"use client";
import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';
import { useGSAP } from '@gsap/react';

export function KineticAvantGardeHeroBlock({ data, theme, isEditor }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const bio = data?.profile?.bio || data?.bio || "Mendobrak batas desain konvensional. Kami tidak mengikuti aturan.";
    const allProjects = data?.projects || data?.user?.projects || [];
    const featuredProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 3);
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    useGSAP(() => {
        const parallaxWrap = containerRef.current;
        if (!parallaxWrap) return;

        const floatingImgs = parallaxWrap.querySelectorAll('.floating-img');
        
        const onParallaxMove = (e: MouseEvent) => {
            const x = e.clientX - window.innerWidth / 2;
            const y = e.clientY - window.innerHeight / 2;

            floatingImgs.forEach(img => {
                const el = img as HTMLElement;
                const speed = parseFloat(el.getAttribute('data-speed') || '0');
                const xPos = x * speed;
                const yPos = y * speed;
                el.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        };
        const onParallaxLeave = () => {
            floatingImgs.forEach(img => {
                const el = img as HTMLElement;
                el.style.transform = `translate(0px, 0px)`;
            });
        };

        parallaxWrap.addEventListener('mousemove', onParallaxMove);
        parallaxWrap.addEventListener('mouseleave', onParallaxLeave);

        return () => {
            parallaxWrap.removeEventListener('mousemove', onParallaxMove);
            parallaxWrap.removeEventListener('mouseleave', onParallaxLeave);
        };
    }, { scope: containerRef, dependencies: [isEditor] });

    return (
        <section ref={containerRef} className="parallax-wrap kag-bg-void flex flex-col justify-center items-center" id="hero">
            <h1 className="font-kag-brutal kag-text-massive kag-text-bone z-30 relative text-center w-full select-none flex flex-col items-center leading-none" id="hero-title">
                <EditableText as="span" className="!break-normal !whitespace-nowrap" entity="appearance" field="kag_hero_top" value={getCustomText('kag_hero_top', 'VISUAL')} isEditor={isEditor} />
                <span className="kag-text-outline">
                    <EditableText as="span" className="!break-normal !whitespace-nowrap" entity="appearance" field="kag_hero_bottom" value={getCustomText('kag_hero_bottom', 'REBEL')} isEditor={isEditor} />
                </span>
            </h1>

            <div className="floating-img z-20 w-48 md:w-80 aspect-[3/4] top-[15%] left-[10%] md:left-[20%] rounded-xl overflow-hidden" data-speed="-0.05">
                <LazyImage src={data?.profile?.avatarUrl || "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=800&q=80"} alt="Hero 1" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition duration-500" />
            </div>
            
            <div className="floating-img z-0 w-40 md:w-64 aspect-square bottom-[10%] right-[10%] md:right-[15%] rounded-xl overflow-hidden" data-speed="0.08">
                <LazyImage src={featuredProjects[0]?.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"} alt="Hero 2" className="w-full h-full object-cover" />
            </div>
            
            <div className="absolute bottom-10 left-10 z-30 mix-blend-difference pointer-events-none">
                <div className="font-kag-mono text-xs kag-text-bone tracking-widest max-w-[200px] uppercase pointer-events-auto text-left">
                    <EditableText as="p" entity="profile" field="bio" value={bio} isEditor={isEditor} />
                </div>
            </div>
        </section>
    );
}
