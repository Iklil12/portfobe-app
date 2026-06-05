"use client";

import React from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';

export function CinematicGalleryAwardsBlock(props: any) {
    const { data } = useCinematicGallery();

    const certificates = data?.certificates || data?.user?.certificates || [];

    if (certificates.length === 0) return null;

    return (
        <section className="panel flex-col items-center justify-center">
            <h2 className="font-serif text-3xl md:text-5xl italic mb-12 reveal-on-scroll text-[#f5f5f0]">Honors</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center flex-wrap max-w-7xl px-4 w-[90vw] md:w-auto h-[60vh] md:h-auto overflow-y-auto hide-scrollbar pointer-events-auto">
                {certificates.map((cert: any, i: number) => (
                    <div key={i} className="w-full md:w-[350px] border border-[#f5f5f0]/20 p-8 rounded-lg reveal-on-scroll bg-[#0a0a0a] shrink-0 text-center hover:bg-[#111] transition-colors duration-500 group cursor-pointer" onClick={() => cert.mediaUrl && window.open(cert.mediaUrl, '_blank')}>
                        <p className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8b8b8b] mb-4 group-hover:text-white transition-colors">{cert.year || new Date(cert.createdAt).getFullYear()}</p>
                        <h3 className="font-sans font-bold uppercase tracking-widest text-sm md:text-base text-[#f5f5f0] mb-2">{cert.title}</h3>
                        <p className="font-sans text-[10px] md:text-xs uppercase text-gray-400 group-hover:text-white/60 transition-colors">{cert.issuer}</p>
                        {cert.mediaUrl && (
                            <span className="inline-block mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b8b8b] group-hover:text-white transition-colors">
                                View <i className="fas fa-external-link-alt ml-1"></i>
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
