'use client';

import React, { useState } from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function LayeredMonolithAwardsBlock({ data, theme, isEditor = false }: any) {
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const brandAccent = theme?.brandAccent || '#CCFF00';

    if (awardItems.length === 0) return null;

    return (
        <section id="awards" className="stack-card bg-[#F5F5F0] text-[#1A1A18] py-24 px-6 md:px-16 flex flex-col justify-center relative overflow-hidden" >
            {/* Grid overlay subtle */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
            <div className="noise mix-blend-multiply opacity-5"></div>
            
            <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col gap-12">
                <div className="flex flex-col gap-2">
                    <p className="font-display text-xs tracking-[0.4em] uppercase opacity-55 border-l-2 border-black pl-4">
                        <EditableText value={theme?.customTexts?.lm_awards_label || 'Recognition'} field="lm_awards_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </p>
                    <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mt-2">
                        AWARDS & HONORS
                    </h2>
                </div>
                
                <div className="flex flex-col border-t border-black/10 text-sm md:text-base font-body font-medium uppercase tracking-widest">
                    {awardItems.map((award: any, i: number) => {
                        const isOpen = openIndex === i;
                        const certificateImage = award.mediaUrl || award.fileUrl;
                        const displayYear = award.year || (award.createdAt ? new Date(award.createdAt).getFullYear() : '');

                        return (
                            <div key={i} className="border-b border-black/10">
                                {/* Clickable Trigger Bar */}
                                <div 
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="flex justify-between items-center py-6 cursor-pointer group select-none transition-all duration-300 hover:px-2 hover:bg-black/[0.02]"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-xs opacity-40">0{i + 1}.</span>
                                        <span className="group-hover:translate-x-1 transition-transform duration-300 font-bold tracking-wider text-[#1A1A18]">
                                            {award.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6 md:gap-12">
                                        <span className="opacity-50 text-xs md:text-sm hidden sm:inline-block font-mono tracking-widest">{award.issuer}</span>
                                        <span className="font-mono text-xs md:text-sm">{displayYear}</span>
                                        <div className={`w-5 h-5 rounded-full border border-black/10 flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-180 bg-black text-white' : ''}`}>
                                            <i className="fas fa-chevron-down text-[8px]"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Expandable Dropdown Container */}
                                <div 
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                        isOpen ? 'max-h-[800px] opacity-100 pb-8' : 'max-h-0 opacity-0 pointer-events-none'
                                    }`}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-black/5">
                                        {/* Certificate Image Panel */}
                                        {certificateImage ? (
                                            <div className="md:col-span-6 flex flex-col gap-3">
                                                <div className="relative w-full aspect-[4/3] md:aspect-[1.4] overflow-hidden bg-black/5 border border-black/10 p-2 shadow-sm">
                                                    <img 
                                                        src={certificateImage} 
                                                        alt={award.title} 
                                                        className="w-full h-full object-contain bg-white" 
                                                        onError={(e: any) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                                <span className="font-mono text-[8px] opacity-40 uppercase tracking-widest">
                                                    [ FILE: {certificateImage.split('/').pop()} ]
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="md:col-span-6 flex items-center justify-center aspect-[1.4] bg-black/5 border border-black/10 border-dashed">
                                                <span className="font-mono text-[10px] opacity-40 uppercase tracking-wider">[ NO MEDIA ATTACHED ]</span>
                                            </div>
                                        )}

                                        {/* Certificate Details & Description */}
                                        <div className="md:col-span-6 flex flex-col justify-between gap-6 py-2">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono text-[9px] opacity-40 uppercase tracking-widest">ISSUED BY:</span>
                                                    <span className="font-body text-xs md:text-sm font-bold tracking-wider">{award.issuer}</span>
                                                </div>
                                                
                                                {award.description && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-mono text-[9px] opacity-40 uppercase tracking-widest">DESCRIPTION:</span>
                                                        <p className="font-body text-xs md:text-sm normal-case text-black/70 leading-relaxed font-medium">
                                                            {award.description}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Verify Button */}
                                            {award.url && (
                                                <div className="pt-4">
                                                    <a 
                                                        href={award.url} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="inline-flex items-center gap-2 px-4 py-2 border border-black text-xs font-mono tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
                                                    >
                                                        <span>Verify Credential</span>
                                                        <i className="fas fa-external-link-alt text-[9px]"></i>
                                                    </a>
                                                </div>
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
