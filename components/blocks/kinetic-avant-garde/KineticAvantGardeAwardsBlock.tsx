"use client";
import React, { useState } from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function KineticAvantGardeAwardsBlock({ data, theme, isEditor, setSelectedMedia }: any) {
    const certificates = data?.certificates || data?.user?.certificates || [];
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    if (certificates.length === 0) return null;

    return (
        <section className="relative kag-bg-blood kag-text-bone py-32 md:py-48 px-6 md:px-12 z-10 overflow-hidden" id="recognition" style={{ '--accent': theme?.themeColor || '#c92a2a' } as any}>
            
            {/* Elegant Noise Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-screen"></div>
            
            <div className="max-w-[90rem] mx-auto relative z-10">
                
                {/* Centered Overlapping Typography Title */}
                <div className="flex flex-col items-center justify-center mb-24 md:mb-32 relative text-center">
                    <span className="font-kag-mono text-xs uppercase tracking-[0.4em] opacity-70 mb-6 block">
                        <EditableText as="span" entity="appearance" field="kag_recog_subtitle" value={getCustomText('kag_recog_subtitle', 'BUKTI VALIDASI MURNI')} isEditor={isEditor} />
                    </span>
                    <div className="relative">
                        <span 
                            className="font-kag-serif italic text-transparent text-[clamp(4rem,12vw,12rem)] leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full text-center" 
                            style={{ WebkitTextStroke: '1px rgba(230,228,220,0.3)' }}
                        >
                            <EditableText entity="appearance" field="kag_recog_title_bg" value={getCustomText('kag_recog_title_bg', 'VALIDASI')} isEditor={isEditor} as="span" />
                        </span>
                        <h2 className="font-kag-brutal text-[clamp(4rem,10vw,10rem)] uppercase text-[#e6e4dc] tracking-tighter leading-none relative z-10">
                            <EditableText entity="appearance" field="kag_recog_title" value={getCustomText('kag_recog_title', 'REKOGNISI')} isEditor={isEditor} as="span" />
                        </h2>
                    </div>
                </div>

                {/* Elegant Interactive List - Accordion Dropdown */}
                <div className="w-full flex flex-col border-t border-[#e6e4dc]/20">
                    {certificates.map((cert: any, i: number) => {
                        const isExpanded = expandedIndex === i;
                        
                        return (
                            <div key={cert.id || i} className="flex flex-col border-b border-[#e6e4dc]/20">
                                {/* Accordion Header */}
                                <div 
                                    className="group flex flex-col lg:flex-row lg:items-center justify-between p-6 md:p-10 hover:bg-[#e6e4dc] hover:text-[var(--accent)] transition-all duration-700 cursor-pointer" 
                                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                                >
                                    <div className="flex items-center gap-6 md:gap-12 w-full lg:w-auto mb-6 lg:mb-0">
                                        <span className="font-kag-mono text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                                            {(i+1).toString().padStart(2, '0')}
                                        </span>
                                        <div className="font-kag-mono text-[10px] md:text-xs uppercase tracking-[0.2em] px-4 py-2 border border-[#e6e4dc]/30 rounded-full group-hover:border-[var(--accent)] transition-colors whitespace-nowrap">
                                            {cert.year || '2024'}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 lg:px-12">
                                        <h3 className="font-kag-serif italic text-3xl md:text-5xl capitalize tracking-tight leading-tight group-hover:text-[var(--accent)] transition-colors duration-500">
                                            {cert.title}
                                        </h3>
                                    </div>
                                    
                                    <div className="flex items-center justify-between lg:justify-end gap-8 mt-8 lg:mt-0 w-full lg:w-auto">
                                        <span className="font-kag-mono text-[10px] md:text-xs uppercase tracking-[0.25em] opacity-70 group-hover:opacity-100 font-bold transition-opacity">
                                            {cert.issuer}
                                        </span>
                                        <div className={`w-12 h-12 rounded-full border border-[#e6e4dc]/30 flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:text-[#e6e4dc] transition-all duration-500 shrink-0 ${isExpanded ? 'bg-[#e6e4dc] border-[#e6e4dc] text-[var(--accent)]' : ''}`}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`opacity-50 group-hover:opacity-100 transition-transform duration-500 ${isExpanded ? 'rotate-45' : ''}`}>
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Accordion Body (Dropdown Content) */}
                                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-6 md:p-10 pt-0 pb-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start bg-[#e6e4dc]/5">
                                        {cert.mediaUrl && (
                                            <div 
                                                className="w-full md:w-1/2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group cursor-pointer" 
                                                onClick={(e) => { e.stopPropagation(); setSelectedMedia?.({ url: cert.mediaUrl, title: cert.title, type: 'certificate' }); }}
                                            >
                                                <img src={cert.mediaUrl} alt={cert.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <span className="font-kag-mono text-xs uppercase tracking-widest bg-white text-black px-6 py-3 rounded-full flex items-center gap-2 shadow-xl">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                                                        Perbesar Gambar
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex-1 flex flex-col gap-6 justify-center h-full pt-4 md:pt-0">
                                            {cert.description ? (
                                                <p className="font-kag-mono text-sm leading-relaxed opacity-80">
                                                    {cert.description}
                                                </p>
                                            ) : (
                                                <p className="font-kag-mono text-sm leading-relaxed opacity-50 italic">
                                                    Tidak ada deskripsi tambahan untuk rekognisi ini.
                                                </p>
                                            )}
                                            {cert.credentialUrl && (
                                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-kag-mono text-xs uppercase tracking-widest text-[#e6e4dc] hover:text-[var(--accent)] transition-colors border border-white/20 hover:border-[var(--accent)] w-max px-6 py-3 rounded-full mt-4">
                                                    <span>Lihat Kredensial Resmi</span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
