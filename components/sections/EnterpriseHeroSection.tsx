"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function EnterpriseHeroSection() {
    const words = ['developers.', 'designers.', 'creators.', 'agencies.', 'brands.'];
    const totalWords = words.length;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalWords);
        }, 2500);
        return () => clearInterval(interval);
    }, [totalWords]);

    const cards = [
        { type: 'image', src: '/img/creative_portrait_1781107365968.webp' },
        { type: 'color', bg: 'bg-[#18181b]', content: <div className="flex flex-col items-center justify-center leading-none"><span className="text-white font-black text-5xl md:text-6xl tracking-tighter">CREATE</span><span className="text-[#ff9e00] font-medium text-lg md:text-xl tracking-[0.2em] mt-2">BEYOND</span></div> },
        { type: 'image', src: '/img/abstract_shapes_1781107379628.webp' },
        { type: 'color', bg: 'bg-[#0a0a0a] border border-white/10', content: <div className="flex flex-col items-center justify-center"><span className="w-12 h-[2px] bg-white/50 mb-4"></span><span className="text-white font-mono text-xs md:text-sm tracking-[0.4em] uppercase">Vanguard</span><span className="w-12 h-[2px] bg-white/50 mt-4"></span></div> },
        { type: 'image', src: '/img/studio_setup_1781107390091.webp' },
        { type: 'color', bg: 'bg-[#000000]', content: <span className="text-[#ff9e00] font-black text-[100px] leading-none opacity-80">✦</span> },
        { type: 'image', src: '/img/hacker_code_1781107400239.webp' },
    ];

    return (
        <section className="bg-[#050505] text-white font-mono overflow-x-hidden w-full relative z-30 pt-24 pb-20 border-t border-white/10">

            <style dangerouslySetInnerHTML={{
                __html: `
                .wire-b-ent { border-bottom: 1px solid rgba(255,255,255,0.1); }
            `}} />

            {/* Headline Section */}
            <div className="w-full max-w-5xl mx-auto px-6 text-center mb-16 md:mb-20">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">[ SOCIAL PROOF ]</span>
                <h2 className="text-[2.5rem] md:text-6xl lg:text-[4.5rem] font-black tracking-tighter text-white leading-[1.1] uppercase">
                    Trusted by 10+<br />
                    <div className="h-[1.2em] overflow-hidden inline-flex mt-1 items-start justify-center min-w-[200px]">
                        <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: `translateY(-${currentIndex * 1.2}em)` }}>
                            {words.map((word, idx) => (
                                <span key={idx} className="block h-[1.2em] text-[#ff9e00]">{word}</span>
                            ))}
                        </div>
                    </div>
                </h2>
            </div>

            {/* Marquee Section */}
            <div className="relative w-full overflow-hidden wire-b-ent pt-4 pb-4">
                <div className="flex w-max">
                    <div className="flex gap-4 md:gap-6 animate-marquee-fast items-center px-2 hover:[animation-play-state:paused]">
                        {cards.map((card, i) => (
                            <div key={i} className={`relative w-[220px] h-[220px] md:w-[320px] md:h-[320px] overflow-hidden shrink-0 flex items-center justify-center ${card.type === 'color' ? card.bg : 'bg-zinc-900'} border border-white/10 grayscale hover:grayscale-0 transition-all duration-500`}>
                                {card.type === 'image' ? (
                                    <Image src={card.src as string} alt="Showcase" fill sizes="(max-width: 768px) 220px, 320px" loading="lazy" className="object-cover transition-transform duration-700 hover:scale-105 cursor-pointer grayscale hover:grayscale-0 contrast-[1.2]" />
                                ) : (
                                    <div className="cursor-pointer hover:scale-105 transition-transform duration-500">{card.content}</div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Duplicate for infinite scroll */}
                    <div className="flex gap-4 md:gap-6 animate-marquee-fast items-center px-2 hover:[animation-play-state:paused]" aria-hidden="true">
                        {cards.map((card, i) => (
                            <div key={i} className={`relative w-[220px] h-[220px] md:w-[320px] md:h-[320px] overflow-hidden shrink-0 flex items-center justify-center ${card.type === 'color' ? card.bg : 'bg-zinc-900'} border border-white/10 grayscale hover:grayscale-0 transition-all duration-500`}>
                                {card.type === 'image' ? (
                                    <Image src={card.src as string} alt="Showcase" fill sizes="(max-width: 768px) 220px, 320px" loading="lazy" className="object-cover transition-transform duration-700 hover:scale-105 cursor-pointer grayscale hover:grayscale-0 contrast-[1.2]" />
                                ) : (
                                    <div className="cursor-pointer hover:scale-105 transition-transform duration-500">{card.content}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
