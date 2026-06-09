"use client";

import { useEffect, useState } from 'react';

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
        { type: 'image', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop' },
        { type: 'color', bg: 'bg-[#18181b]', content: <span className="text-white font-bold text-6xl tracking-tighter flex items-center gap-1"><span className="w-10 h-10 border-4 border-white rounded-full"></span>HBO</span> },
        { type: 'image', src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop' },
        { type: 'color', bg: 'bg-[#0a0a0a] border border-white/10', content: <div className="w-24 h-24 rounded-full border-8 border-[#ff9e00] flex items-center justify-center"><span className="text-[#ff9e00] font-black text-2xl">LA</span></div> },
        { type: 'image', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
        { type: 'color', bg: 'bg-[#000000]', content: <span className="text-[#ff9e00] font-black text-7xl flex items-center justify-center"><span className="border-[12px] border-[#ff9e00] w-24 h-24 rounded-full border-r-transparent rotate-45"></span></span> },
        { type: 'image', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop' },
    ];

    return (
        <section className="bg-[#050505] text-white font-sans overflow-x-hidden w-full relative z-30 pt-24 pb-20 border-t border-white/10">
            
            <style dangerouslySetInnerHTML={{__html: `
                .wire-b-ent { border-bottom: 1px solid rgba(255,255,255,0.1); }
            `}} />

            {/* Headline Section */}
            <div className="w-full max-w-5xl mx-auto px-6 text-center mb-16 md:mb-20">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">[ SOCIAL PROOF ]</span>
                <h2 className="text-[2.5rem] md:text-6xl lg:text-[4.5rem] font-black tracking-tighter text-white leading-[1.1] uppercase">
                    Trusted by 10K+<br/>
                    <div className="h-[1.2em] overflow-hidden inline-flex mt-1 items-start justify-center min-w-[200px]">
                        <div className="flex flex-col transition-transform duration-700 ease-custom" style={{ transform: `translateY(-${currentIndex * 100}%)` }}>
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
                                    <img src={card.src} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer grayscale hover:grayscale-0 contrast-[1.2]" alt="Showcase" />
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
                                    <img src={card.src} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer grayscale hover:grayscale-0 contrast-[1.2]" alt="Showcase" />
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
