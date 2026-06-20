"use client";

import React, { useState } from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicGalleryAwardsBlock({ theme, isEditor }: any) {
    const { data } = useCinematicGallery();
    const getCustomText = (key: string, fallback: string) => theme?.customTexts?.[key] || fallback;
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const certificates = data?.certificates || data?.user?.certificates || [];

    if (certificates.length === 0) return null;

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-6 md:px-24 bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
            {/* Vignette Shadow Theater Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
            
            {/* Ambient Lens Flare Glow */}
            <div className="absolute -top-48 -right-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Cinematic Header Area */}
            <div className="absolute top-[8vh] left-6 md:top-[12vh] md:left-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
                <div className="text-white/40 text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-mono">
                    [ SECTION 06 // RECOGNITION ]
                </div>
                <h2 className="font-serif italic text-3xl md:text-5xl text-white leading-none">
                    <EditableText 
                        entity="appearance" 
                        field="cinematicgallery_awards_title" 
                        value={getCustomText('cinematicgallery_awards_title', 'Penghargaan')} 
                        isEditor={isEditor} 
                        maxLength={40} 
                        as="span" 
                    />
                </h2>
            </div>

            {/* Awards List */}
            <div className="w-full max-w-5xl mx-auto z-10 mt-[13vh] md:mt-[16vh] h-[68vh] md:h-[63vh] overflow-y-auto cinematic-scrollbar pointer-events-auto pr-3">
                <div className="flex flex-col gap-3 pb-6">
                    {certificates.map((cert: any, i: number) => {
                        const isExpanded = expandedIndex === i;
                        const hasImage = cert.mediaUrl && (
                            cert.mediaUrl.endsWith('.jpg') || 
                            cert.mediaUrl.endsWith('.jpeg') || 
                            cert.mediaUrl.endsWith('.png') || 
                            cert.mediaUrl.endsWith('.webp') || 
                            cert.mediaUrl.endsWith('.gif') ||
                            cert.mediaUrl.includes('/image') ||
                            cert.mediaUrl.includes('cloudinary') ||
                            cert.mediaUrl.includes('supabase')
                        );

                        return (
                            <div key={i} className="flex flex-col">
                                {/* Card Header */}
                                <div 
                                    className={`group relative flex flex-col md:flex-row md:items-center gap-3 md:gap-4 border p-4 md:p-6 bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-md transition-all duration-500 ease-out hover:bg-white/[0.05] hover:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer ${isExpanded ? 'border-white/20 bg-white/[0.04]' : 'border-white/5'}`}
                                    onClick={() => hasImage ? toggleExpand(i) : (cert.mediaUrl && window.open(cert.mediaUrl, '_blank'))}
                                >
                                    {/* Corner Viewfinder brackets on Hover */}
                                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-20">
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40"></div>
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40"></div>
                                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40"></div>
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40"></div>
                                    </div>

                                    {/* Year Badge */}
                                    <div className="text-[9px] md:text-[10px] font-mono text-white/40 tracking-wider bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-sm uppercase group-hover:text-white group-hover:border-white/25 transition-all duration-300 min-w-[70px] text-center z-10">
                                        {cert.year || new Date(cert.createdAt).getFullYear()}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 z-10">
                                        <h3 className="font-sans font-bold text-white uppercase tracking-wider text-xs md:text-base">
                                            {cert.title}
                                        </h3>
                                        <p className="text-[9px] md:text-xs font-mono text-white/30 uppercase tracking-widest mt-1">
                                            {cert.issuer}
                                        </p>
                                    </div>

                                    {/* Expand/Link indicator */}
                                    {cert.mediaUrl && (
                                        <div className="z-10 flex items-center gap-2">
                                            {hasImage ? (
                                                <span className={`text-[8px] font-mono tracking-widest uppercase flex items-center gap-1.5 transition-all duration-300 ${isExpanded ? 'text-white/70' : 'text-white/30 group-hover:text-white/70'}`}>
                                                    <i className={`fas fa-chevron-down text-[7px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
                                                    {isExpanded ? 'Tutup' : 'Lihat Foto'}
                                                </span>
                                            ) : (
                                                <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase group-hover:text-white/70 transition-colors duration-300 flex items-center gap-1.5">
                                                    Lihat <i className="fas fa-external-link-alt text-[7px]"></i>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Expandable Image Dropdown */}
                                {hasImage && (
                                    <div 
                                        className={`overflow-hidden transition-all duration-500 ease-out border-x border-white/5 bg-black/40 ${isExpanded ? 'max-h-[500px] border-b border-white/10 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="p-4 md:p-6 flex items-center justify-center">
                                            <img 
                                                src={cert.mediaUrl} 
                                                alt={cert.title} 
                                                className="max-w-full max-h-[420px] object-contain rounded-sm border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
