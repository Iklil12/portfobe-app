import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function HorizontalFlowHeroBlock({ data, theme, isEditor }: any) {
    const bio = data?.profile?.bio || data?.bio || "We merge architectural precision with avant-garde web technology to engineer flagship digital products for global visionaries.";
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!isEditor) {
            gsap.from(".slide-up-text", {
                y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2
            });

            gsap.to(".hero-bg", {
                y: 200, 
                scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
            });
        }
    }, { scope: containerRef, dependencies: [isEditor] });

    return (
        <section ref={containerRef} className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden px-4" id="hero">
            <div className="absolute inset-0 z-0 bg-[#050505]">
                {/* Architectural Grid - Extremely lightweight */}
                <div 
                    className="absolute inset-0 opacity-20" 
                    style={{ 
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px)', 
                        backgroundSize: '100px 100px' 
                    }}
                ></div>
                {/* Static Subtle Glow - Fast rendering, no blur filters needed */}
                <div 
                    className="absolute inset-0" 
                    style={{ 
                        background: `radial-gradient(circle at 50% 0%, ${theme?.themeColor || '#4F46E5'}15 0%, transparent 70%)` 
                    }}
                ></div>
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-80"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start mt-20">
                <p className={`font-mono text-accent tracking-[0.3em] uppercase text-xs mb-4 ${isEditor ? '' : 'slide-up-text'}`}>
                    <EditableText value={theme?.customTexts?.hf_hero_top || 'System / V2.0.26'} field="hf_hero_top" entity="appearance" isEditor={isEditor} as="span" />
                </p>
                <h1 className="font-display text-[12vw] md:text-[8vw] font-bold uppercase leading-[0.85] tracking-tight">
                    <div className="overflow-hidden"><span className={`block ${isEditor ? '' : 'slide-up-text'}`}><EditableText value={theme?.customTexts?.hf_hero_t1 || 'Shaping'} field="hf_hero_t1" entity="appearance" isEditor={isEditor} as="span" /></span></div>
                    <div className="overflow-hidden"><span className={`block ${isEditor ? '' : 'slide-up-text'}`}><EditableText value={theme?.customTexts?.hf_hero_t2 || 'Digital'} field="hf_hero_t2" entity="appearance" isEditor={isEditor} as="span" /></span></div>
                    <div className="overflow-hidden"><span className={`block text-stroke ${isEditor ? '' : 'slide-up-text'}`} data-cursor="EXPLORE"><EditableText value={theme?.customTexts?.hf_hero_t3 || 'Realities'} field="hf_hero_t3" entity="appearance" isEditor={isEditor} as="span" /></span></div>
                </h1>
                
                <div className="mt-12 flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-8">
                    <p className={`font-body text-textMuted max-w-sm text-sm leading-relaxed ${isEditor ? '' : 'slide-up-text'}`}>
                      <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} maxLength={250} />
                    </p>
                    
                    <div className={`relative w-24 h-24 flex items-center justify-center ${isEditor ? '' : 'slide-up-text'}`}>
                        <svg className="rotating-badge absolute inset-0 w-full h-full text-textMuted" viewBox="0 0 100 100">
                            <path id="textPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none"></path>
                            <text fontFamily="Inter" fontSize="10.5" fontWeight="600" letterSpacing="2" fill="currentColor">
                                <textPath href="#textPath">SCROLL TO EXPLORE • SCROLL TO EXPLORE •</textPath>
                            </text>
                        </svg>
                        <i className="ph ph-arrow-down text-xl text-accent"></i>
                    </div>
                </div>
            </div>
        </section>
    );
}
