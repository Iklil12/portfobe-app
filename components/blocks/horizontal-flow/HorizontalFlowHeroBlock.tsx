import React, { useRef } from 'react';
import { EditableText } from '@/components/ui/EditableText';
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
            <div className="absolute inset-0 z-0 opacity-40">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover hero-bg grayscale" alt="Abstract" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
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
