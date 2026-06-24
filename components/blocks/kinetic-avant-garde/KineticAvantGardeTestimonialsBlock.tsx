"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

export function KineticAvantGardeTestimonialsBlock({ data, theme, isEditor }: any) {
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    if (testimonials.length === 0) return null;

    return (
        <section className="relative kag-bg-bone py-32 md:py-48 px-6 md:px-12 z-10 border-b border-black/10 overflow-hidden" id="testimonials" style={{ '--accent': theme?.themeColor || '#c92a2a' } as any}>
            
            <div className="max-w-[90rem] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 md:mb-28">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-[2px] bg-[var(--accent)]"></div>
                            <h3 className="font-kag-mono text-[#0a0a0a] tracking-[0.4em] uppercase text-xs md:text-sm font-bold opacity-70">
                                <EditableText entity="appearance" field="kag_testi_subtitle" value={getCustomText('kag_testi_subtitle', 'SUARA KLIEN')} isEditor={isEditor} />
                            </h3>
                        </div>
                        <h2 className="font-kag-brutal text-5xl md:text-7xl uppercase text-[#0a0a0a] tracking-tighter leading-none">
                            <EditableText entity="appearance" field="kag_testi_title" value={getCustomText('kag_testi_title', 'TESTIMONIAL')} isEditor={isEditor} />
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full">
                    {testimonials.map((t: any, i: number) => (
                        <div key={t.id || i} className="group flex flex-col p-8 md:p-10 border border-black/10 bg-transparent hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-700 rounded-3xl relative">
                            
                            {/* Decorative Quote Mark */}
                            <div className="absolute top-6 right-8 font-kag-serif italic text-7xl text-black/5 group-hover:text-[var(--accent)]/10 transition-colors duration-500 pointer-events-none">
                                "
                            </div>

                            <p className="font-kag-serif italic text-2xl md:text-3xl leading-snug tracking-tight text-[#0a0a0a] mb-12 relative z-10 group-hover:text-black transition-colors">
                                "{t.content}"
                            </p>
                            
                            <div className="mt-auto pt-6 border-t border-black/10 flex flex-col gap-5">
                                <div className="flex items-center gap-4">
                                    {t.avatarUrl ? (
                                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-black/10 shadow-sm">
                                            <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                                        </div>
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-[#0a0a0a] flex items-center justify-center font-kag-brutal text-[#e6e4dc] text-2xl shrink-0 group-hover:bg-[var(--accent)] transition-colors duration-500">
                                            {t.clientName.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex flex-col justify-center">
                                        <h4 className="font-kag-brutal text-2xl uppercase tracking-tighter text-[#0a0a0a] leading-none mb-1.5 group-hover:text-[var(--accent)] transition-colors duration-500">{t.clientName}</h4>
                                        {t.company && <p className="font-kag-mono text-[10px] uppercase tracking-widest text-black/50 font-bold">{t.company}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
                                    {[...Array(t.rating || 5)].map((_, idx) => (
                                        <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#0a0a0a] group-hover:text-[var(--accent)] transition-colors duration-500">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
