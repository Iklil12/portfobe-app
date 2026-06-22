"use client";

import React, { useState } from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';

export function CinematicGalleryTestimonialsBlock({ theme, isEditor }: any) {
    const { data } = useCinematicGallery();
    const getCustomText = (key: string, fallback: string) => theme?.customTexts?.[key] || fallback;
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0) return null;

    const active = testimonials[activeIndex] || testimonials[0];
    const total = testimonials.length;

    const goNext = () => setActiveIndex((prev) => (prev + 1) % total);
    const goPrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

    return (
        <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-8 md:px-24 bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
            {/* Vignette Shadow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
            
            {/* Ambient Glow */}
            <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute -top-48 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Section Label */}
            <div className="absolute top-[8vh] left-8 md:top-[12vh] md:left-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
                <div className="text-white/40 text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-mono">
                    [ SECTION 07 // TESTIMONIAL ]
                </div>
                <h2 className="font-serif italic text-3xl md:text-5xl text-white leading-none">
                    <EditableText 
                        entity="appearance" 
                        field="cinematicgallery_testimonials_title" 
                        value={getCustomText('cinematicgallery_testimonials_title', 'Suara Klien')} 
                        isEditor={isEditor} 
                        maxLength={40} 
                        as="span" 
                    />
                </h2>
            </div>

            {/* Giant Decorative Quote */}
            <div className="absolute top-[15vh] right-8 md:right-24 text-white/[0.03] text-[200px] md:text-[300px] font-serif leading-none pointer-events-none select-none z-0">
                &ldquo;
            </div>

            {/* Main Testimonial Content — centered vertically */}
            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col justify-center pointer-events-auto mt-[12vh] md:mt-[8vh]">
                {/* Quote Text */}
                <blockquote className="mb-6 md:mb-14" key={activeIndex}>
                    <p className="font-serif italic text-lg md:text-3xl lg:text-4xl text-white/90 leading-relaxed md:leading-[1.5] tracking-wide">
                        &ldquo;{active.content}&rdquo;
                    </p>
                </blockquote>

                {/* Thin animated divider */}
                <div className="w-12 h-[1px] bg-white/20 mb-6 md:mb-8"></div>

                {/* Client Info */}
                <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-12">
                    {active.avatarUrl ? (
                        <LazyImage 
                            src={active.avatarUrl} 
                            alt={active.clientName || 'Client'} 
                            className="w-11 h-11 md:w-16 md:h-16 rounded-full object-cover border border-white/10 grayscale hover:grayscale-0 transition-all duration-500" 
                        />
                    ) : (
                        <div className="w-11 h-11 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-serif text-lg md:text-2xl text-white/50">
                            {(active.clientName || active.name || 'U').charAt(0)}
                        </div>
                    )}
                    <div>
                        <h4 className="font-sans font-bold uppercase tracking-wider text-xs md:text-base text-white">
                            {active.clientName || active.name || 'Anonymous'}
                        </h4>
                        {active.company && (
                            <span className="text-[9px] md:text-xs font-mono text-white/30 uppercase tracking-widest">
                                {active.company}
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation Controls */}
                {total > 1 && (
                    <div className="flex items-center gap-6">
                        {/* Prev / Next Arrows */}
                        <button 
                            onClick={goPrev}
                            className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300 hover:bg-white/5"
                        >
                            <i className="fas fa-arrow-left text-[10px]"></i>
                        </button>
                        <button 
                            onClick={goNext}
                            className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300 hover:bg-white/5"
                        >
                            <i className="fas fa-arrow-right text-[10px]"></i>
                        </button>

                        {/* Counter */}
                        <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
                            [ {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} ]
                        </span>

                        {/* Dot indicators */}
                        <div className="flex items-center gap-2 ml-auto">
                            {testimonials.map((_: any, idx: number) => (
                                <button 
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                        idx === activeIndex 
                                            ? 'bg-white w-5' 
                                            : 'bg-white/20 hover:bg-white/40'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
