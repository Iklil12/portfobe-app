"use client";
import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function KineticAvantGardeHeroBlock({ data, theme, isEditor }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const bio = data?.profile?.bio || data?.bio || "Mendobrak batas desain konvensional. Kami tidak mengikuti aturan.";
    const allProjects = data?.projects || data?.user?.projects || [];
    const featuredProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 3);
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    useGSAP(() => {
        const parallaxWrap = containerRef.current;
        if (!parallaxWrap) return;

        // Entrance Animation
        gsap.fromTo('.hero-text-line', 
            { y: 100, opacity: 0, skewY: 5 },
            { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.2 }
        );
        gsap.fromTo('.floating-img',
            { scale: 0.8, opacity: 0, rotation: -5 },
            { scale: 1, opacity: 1, rotation: 0, duration: 1.5, stagger: 0.3, ease: "expo.out", delay: 0.5 }
        );
        gsap.fromTo('.bio-text',
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1 }
        );

        // Mouse Parallax
        const floatingImgs = parallaxWrap.querySelectorAll('.floating-img');
        const onParallaxMove = (e: MouseEvent) => {
            const x = e.clientX - window.innerWidth / 2;
            const y = e.clientY - window.innerHeight / 2;

            floatingImgs.forEach(img => {
                const el = img as HTMLElement;
                const speed = parseFloat(el.getAttribute('data-speed') || '0');
                const xPos = x * speed;
                const yPos = y * speed;
                gsap.to(el, { x: xPos, y: yPos, duration: 0.8, ease: "power2.out" });
            });
            
            // Subtle title parallax
            if (titleRef.current) {
                gsap.to(titleRef.current, { x: x * 0.02, y: y * 0.02, duration: 1, ease: "power2.out" });
            }
        };

        const onParallaxLeave = () => {
            floatingImgs.forEach(img => {
                const el = img as HTMLElement;
                gsap.to(el, { x: 0, y: 0, duration: 1, ease: "power2.out", overwrite: true });
            });
            if (titleRef.current) {
                gsap.to(titleRef.current, { x: 0, y: 0, duration: 1, ease: "power2.out", overwrite: true });
            }
        };

        if (!isEditor) {
            parallaxWrap.addEventListener('mousemove', onParallaxMove);
            parallaxWrap.addEventListener('mouseleave', onParallaxLeave);
        }

        return () => {
            parallaxWrap.removeEventListener('mousemove', onParallaxMove);
            parallaxWrap.removeEventListener('mouseleave', onParallaxLeave);
        };
    }, { scope: containerRef, dependencies: [isEditor] });

    return (
        <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#050505] flex flex-col justify-center items-center" id="hero">
            {/* Background Noise & Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
            
            {/* Background Infinite Marquee */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[200vw] flex opacity-[0.03] pointer-events-none overflow-hidden rotate-[-2deg]">
                <div className="animate-marquee-fast whitespace-nowrap flex items-center">
                    <span className="text-[15vw] font-black text-white px-8">VOID</span>
                    <span className="text-[15vw] font-black text-white px-8 text-transparent" style={{ WebkitTextStroke: '2px white' }}>DYNAMIC</span>
                    <span className="text-[15vw] font-black text-white px-8">VOID</span>
                    <span className="text-[15vw] font-black text-white px-8 text-transparent" style={{ WebkitTextStroke: '2px white' }}>DYNAMIC</span>
                    <span className="text-[15vw] font-black text-white px-8">VOID</span>
                    <span className="text-[15vw] font-black text-white px-8 text-transparent" style={{ WebkitTextStroke: '2px white' }}>DYNAMIC</span>
                </div>
            </div>

            {/* Images */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="floating-img absolute z-10 w-[45vw] md:w-[28vw] aspect-[3/4] top-[10%] md:top-[15%] left-[5%] md:left-[15%] rounded-none overflow-hidden shadow-2xl shadow-black/50" data-speed="-0.06">
                    <div className="absolute inset-0 bg-black/20 z-10 mix-blend-overlay"></div>
                    <LazyImage src={data?.profile?.avatarUrl || "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=800&q=80"} alt="Hero 1" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition duration-700 ease-in-out scale-105 hover:scale-100" />
                </div>
                
                <div className="floating-img absolute z-20 w-[40vw] md:w-[22vw] aspect-square bottom-[25%] md:bottom-[15%] right-[5%] md:right-[15%] rounded-none overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10" data-speed="0.1">
                    <LazyImage src={featuredProjects[0]?.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"} alt="Hero 2" className="w-full h-full object-cover filter contrast-125" />
                </div>
            </div>

            {/* Main Title with Mix Blend Mode */}
            <h1 ref={titleRef} className="font-kag-brutal text-[clamp(2.5rem,14vw,15rem)] text-white z-30 relative text-center w-full px-4 select-none flex flex-col items-center leading-[0.85] mix-blend-difference pointer-events-auto" id="hero-title">
                <div className="overflow-visible pb-2 md:pb-4 w-full">
                    <div className="hero-text-line block w-full">
                        <EditableText as="span" className="!break-words !whitespace-normal md:!whitespace-nowrap inline-block hover:scale-[1.02] transition-transform duration-500 cursor-default leading-[0.9]" entity="appearance" field="kag_hero_top" value={getCustomText('kag_hero_top', 'VISUAL')} isEditor={isEditor} />
                    </div>
                </div>
                <div className="overflow-visible w-full">
                    <div className="hero-text-line block text-transparent w-full" style={{ WebkitTextStroke: 'clamp(1px, 0.4vw, 3px) white' }}>
                        <EditableText as="span" className="!break-words !whitespace-normal md:!whitespace-nowrap inline-block hover:scale-[1.02] transition-transform duration-500 cursor-default leading-[0.9]" entity="appearance" field="kag_hero_bottom" value={getCustomText('kag_hero_bottom', 'REBEL')} isEditor={isEditor} />
                    </div>
                </div>
            </h1>

            {/* Bottom Accent / Bio */}
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-30 pointer-events-none bio-text w-[calc(100%-3rem)] md:w-auto">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="w-8 md:w-12 h-1 bg-white/80"></div>
                    <div className="font-kag-mono text-[10px] md:text-xs text-white/80 tracking-[0.1em] max-w-[80%] md:max-w-[280px] pointer-events-auto text-left leading-relaxed mix-blend-difference">
                        <EditableText as="p" entity="profile" field="bio" value={bio} isEditor={isEditor} />
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-30 hidden md:flex flex-col items-center gap-2 mix-blend-difference bio-text">
                <span className="font-kag-mono text-[10px] text-white/60 tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
                <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white animate-bounce"></div>
                </div>
            </div>
        </section>
    );
}
