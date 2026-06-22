import React, { useRef } from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';

export function LayeredMonolithTestimonialBlock({ data, theme, isEditor = false }: any) {
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const sliderRef = useRef<HTMLDivElement>(null);

    const brandAccent = theme?.brandAccent || '#CCFF00';

    if (testimonials.length === 0) return null;

    const scrollSlider = (direction: 'left' | 'right') => {
        const slider = sliderRef.current;
        if (!slider) return;
        const scrollAmount = 400;
        slider.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <section id="testimonials" className="stack-card bg-[#1A1A18] text-white py-28 px-6 md:px-16 flex flex-col justify-center relative overflow-hidden" >
            {/* Dark tech background grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
            <div className="noise mix-blend-overlay opacity-10"></div>
            
            <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col min-h-[70vh] justify-center">
                {/* Centered Header Section */}
                <div className="flex flex-col items-center text-center mb-16 gap-4">
                    <p className="font-display text-xs tracking-[0.4em] uppercase opacity-60 flex items-center justify-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: brandAccent }}></span>
                        <EditableText value={theme?.customTexts?.lm_testi_label || 'Client Feedback'} field="lm_testi_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                        CLIENT <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>LOGS.</span>
                    </h2>
                    <p className="font-mono text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest max-w-lg leading-relaxed">
                        // SECURE VERIFIED LOGS // TRUSTED BY DEVELOPERS, PROJECT MANAGERS, AND TEAMS WORLDWIDE.
                    </p>
                </div>
                
                {/* Horizontal Scroll Testimonial Row */}
                <div 
                    ref={sliderRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-8 no-scrollbar cursor-grab active:cursor-grabbing w-full"
                >
                    {testimonials.map((t: any, i: number) => (
                        <div 
                            key={i} 
                            className="min-w-[85vw] md:min-w-[520px] snap-center bg-black/40 border border-white/5 hover:border-white/10 transition-colors duration-300 p-8 md:p-10 rounded-none flex flex-col justify-between relative group/card"
                        >
                            {/* Decorative corner lines */}
                            <div className="absolute top-0 left-0 w-2 h-[1px] bg-white/20 group-hover/card:bg-white/40 transition-colors"></div>
                            <div className="absolute top-0 left-0 w-[1px] h-2 bg-white/20 group-hover/card:bg-white/40 transition-colors"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-white/20 group-hover/card:bg-white/40 transition-colors"></div>
                            <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-white/20 group-hover/card:bg-white/40 transition-colors"></div>
                            
                            {/* Giant Quote Icon in background */}
                            <div className="absolute right-8 top-4 font-display font-black text-9xl text-white/[0.02] select-none pointer-events-none group-hover/card:text-white/[0.04] transition-colors">
                                ”
                            </div>

                            <div className="mb-8 font-mono text-[9px] text-white/30 tracking-wider flex justify-between items-center border-b border-white/5 pb-4">
                                <span>LOG_REF: TESTI_00{i + 1}</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></span>
                                    VERIFIED
                                </span>
                            </div>

                            <p className="font-display text-lg md:text-xl font-medium leading-relaxed mb-12 text-white/90 relative z-10">
                                "{t.content}"
                            </p>
                            
                            <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                                {t.avatarUrl || t.avatar ? (
                                    <LazyImage 
                                        src={t.avatarUrl || t.avatar} 
                                        alt={t.clientName || t.name || 'Client'} 
                                        className="w-12 h-12 rounded-none object-cover grayscale border border-white/10 group-hover/card:grayscale-0 transition-all duration-500" 
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-none bg-white/5 flex items-center justify-center font-display font-bold text-white/80 border border-white/10">
                                        {(t.clientName || 'U').charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-display font-bold uppercase tracking-tight text-sm text-white">{t.clientName}</h4>
                                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mt-0.5">
                                        {t.position} {t.company ? `AT ${t.company}` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Slider Navigation Controls */}
                <div className="flex justify-center items-center gap-6 mt-8">
                    <button 
                        onClick={() => scrollSlider('left')}
                        className="w-10 h-10 border border-white/10 hover:border-white/30 flex items-center justify-center transition-all bg-white/5 hover:bg-white/10 rounded-none group"
                        aria-label="Previous testimonials"
                    >
                        <i className="fas fa-chevron-left text-[10px] text-white/60 group-hover:text-white transition-colors"></i>
                    </button>
                    <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase">// SCROLL TO PAN</span>
                    <button 
                        onClick={() => scrollSlider('right')}
                        className="w-10 h-10 border border-white/10 hover:border-white/30 flex items-center justify-center transition-all bg-white/5 hover:bg-white/10 rounded-none group"
                        aria-label="Next testimonials"
                    >
                        <i className="fas fa-chevron-right text-[10px] text-white/60 group-hover:text-white transition-colors"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}
