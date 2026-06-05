"use client";

import React from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';

export function CinematicGalleryTestimonialsBlock(props: any) {
    const { data } = useCinematicGallery();

    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0) return null;

    return (
        <section className="panel flex-col items-center justify-center">
            <h2 className="font-serif text-3xl md:text-5xl italic mb-12 reveal-on-scroll text-[#f5f5f0]">Client Voices</h2>
            
            {/* We use a vertical scrollable container inside the horizontal panel to allow scrolling multiple testimonials without breaking horizontal flow */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-start md:justify-center flex-nowrap md:flex-wrap max-w-7xl px-4 w-[90vw] md:w-auto h-[60vh] md:h-auto overflow-y-auto md:overflow-visible hide-scrollbar pointer-events-auto">
                {testimonials.map((t: any, i: number) => (
                    <div key={i} className="w-full md:w-[350px] border border-[#f5f5f0]/20 p-8 rounded-lg reveal-on-scroll bg-[#0a0a0a] shrink-0 hover:bg-[#111] transition-colors duration-500 group">
                        <p className="font-sans text-sm md:text-base text-gray-300 italic mb-6 group-hover:text-white transition-colors">"{t.content}"</p>
                        <div className="flex items-center gap-4">
                            {t.avatarUrl ? (
                                <img src={t.avatarUrl} alt={t.clientName || 'Client'} className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-[#f5f5f0]/10 flex items-center justify-center font-serif text-xl text-white">{(t.clientName || t.name || 'U').charAt(0)}</div>
                            )}
                            <div>
                                <h4 className="font-sans font-bold uppercase tracking-widest text-xs md:text-sm text-[#f5f5f0]">{t.clientName || t.name || 'Anonymous Client'}</h4>
                                {t.company && <span className="font-sans text-[10px] uppercase text-[#8b8b8b]">{t.company}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
