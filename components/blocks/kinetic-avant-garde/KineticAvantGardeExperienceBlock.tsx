"use client";
import React, { useRef, useState, useEffect } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function KineticAvantGardeExperienceBlock({ theme, isEditor, isCardPreview }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const accentColor = theme?.themeColor || '#c92a2a';
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    let experiences = [];
    try {
        if (customTexts.experience_items) {
            experiences = JSON.parse(customTexts.experience_items);
        } else {
            experiences = [
                { role: 'Kepala Eksperimen Visual', company: 'Studio Monolith / Jakarta', duration: '2024 — SEKARANG', description: 'Memimpin tim arsitek antarmuka dalam merumuskan ulang batasan antara seni digital dan pengalaman pengguna.' },
                { role: 'Desainer Produk Senior', company: 'Nexus Digital / Singapura', duration: '2021 — 2023', description: 'Merancang sistem desain skala besar untuk perusahaan fintech, berfokus pada tipografi dan interaksi mikro.' }
            ];
        }
    } catch (e) {
        experiences = [];
    }

    const updateExperiences = (newExps: any[]) => {
        if (!isEditor) return;
        window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'experience_items', value: JSON.stringify(newExps) }, window.location.origin);
    };

    const handleUpdateItem = (index: number, key: 'role' | 'company' | 'duration' | 'description', value: string) => {
        const newExps = [...experiences];
        newExps[index][key] = value;
        updateExperiences(newExps);
    };

    const handleAddItem = () => {
        const newExps = [...experiences, { role: "Role Baru", company: "Perusahaan Baru", duration: "Tahun — Tahun", description: "Deskripsi pekerjaan baru." }];
        updateExperiences(newExps);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExps = experiences.filter((_: any, i: number) => i !== index);
        updateExperiences(newExps);
    };

    useGSAP(() => {
        if (isCardPreview) return;

        const timelineItems = gsap.utils.toArray('.timeline-item') as HTMLElement[];
        timelineItems.forEach(item => {
            const indicator = item.querySelector('.indicator');
            const card = item.querySelector('.exp-card');
            
            if (indicator && card) {
                gsap.set(card, { opacity: 0, x: 20 });
                
                gsap.to(indicator, {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    rotate: 90,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        toggleActions: 'play reverse play reverse'
                    }
                });

                gsap.to(card, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 75%',
                    }
                });
            }
        });
    }, { scope: containerRef, dependencies: [isEditor, isCardPreview, accentColor, experiences] });

    return (
        <section ref={containerRef} className="relative kag-bg-void kag-text-bone py-32 md:py-48 px-4 md:px-12 z-10 overflow-hidden border-t-8 kag-border-bone" id="chronology">
            
            {/* Brutalist Grid Background (Light grid for dark background) */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: 'clamp(20px, 4vw, 50px) clamp(20px, 4vw, 50px)' }}></div>

            {/* Corner Crosshairs */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 kag-border-bone opacity-30 pointer-events-none"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 kag-border-bone opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 kag-border-bone opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 kag-border-bone opacity-30 pointer-events-none"></div>

            <div className="flex flex-col xl:flex-row gap-16 md:gap-24 max-w-7xl mx-auto relative z-10">
                <div className="xl:w-1/3">
                    <div className="xl:sticky xl:top-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-3 h-3 kag-bg-blood rounded-none animate-pulse"></div>
                            <h3 className="font-kag-mono kag-text-bone opacity-70 tracking-[0.2em] uppercase text-xs md:text-sm font-bold">
                                <EditableText entity="appearance" field="kag_history_subtitle" value={getCustomText('kag_history_subtitle', '[ RIWAYAT ]')} isEditor={isEditor} />
                            </h3>
                        </div>
                        <h2 className="font-kag-brutal text-[clamp(2.5rem,8vw,6rem)] leading-[0.85] uppercase">
                            <EditableText entity="appearance" field="kag_history_title" value={getCustomText('kag_history_title', 'KRONOLOGI KARIR')} isEditor={isEditor} />
                        </h2>
                        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t-4 kag-border-bone w-24 mb-6"></div>
                        <div className="font-kag-mono text-white/60 text-sm max-w-xs text-left uppercase leading-relaxed">
                            <EditableText as="p" entity="appearance" field="kag_history_desc" value={getCustomText('kag_history_desc', 'Evolusi pemikiran dan eksekusi lintas waktu dan dimensi kreatif.')} isEditor={isEditor} />
                        </div>
                    </div>
                </div>

                <div className="xl:w-2/3 border-l-[6px] md:border-l-[8px] kag-border-bone relative mt-10 xl:mt-0 pt-10">
                    {experiences.map((exp: any, index: number) => (
                        <div key={index} className="pl-8 md:pl-16 pb-24 relative timeline-item group">
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                    title="Delete Experience"
                                >
                                    ✕
                                </button>
                            )}
                            
                            {/* Massive Brutalist Indicator */}
                            <div className="absolute w-6 h-6 md:w-8 md:h-8 border-4 kag-border-bone left-[-15px] md:left-[-20px] top-0 kag-bg-void indicator transition-colors duration-300"></div>
                            
                            {/* The Experience Card Box */}
                            <div className="exp-card relative mt-[-8px]">
                                {/* The solid shadow behind the box */}
                                <div className="absolute top-2 left-2 w-full h-full kag-bg-blood -z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"></div>
                                
                                <div className="kag-bg-bone kag-text-void p-5 md:p-10 border-[4px] kag-border-void relative">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4 md:mb-6 border-b-2 kag-border-void pb-4 md:pb-6">
                                        <h4 className="font-kag-brutal text-2xl md:text-5xl uppercase leading-[0.9] break-words">
                                            <EditableText 
                                                value={exp.role} 
                                                onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                                isEditor={isEditor} 
                                                maxLength={50} 
                                                as="span" 
                                            />
                                        </h4>
                                        <span className="font-kag-mono text-[10px] md:text-sm tracking-widest kag-bg-void kag-text-bone px-2 py-1 md:px-3 md:py-1.5 whitespace-nowrap self-start">
                                            <EditableText 
                                                value={exp.duration} 
                                                onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                                isEditor={isEditor} 
                                                maxLength={40} 
                                                as="span" 
                                            />
                                        </span>
                                    </div>
                                    <p className="font-kag-mono font-bold text-xs md:text-base uppercase tracking-wider mb-4 kag-text-blood break-words">
                                        <EditableText 
                                            value={exp.company} 
                                            onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </p>
                                    <p className="font-kag-serif text-sm md:text-xl leading-relaxed max-w-2xl opacity-90">
                                        <EditableText 
                                            value={exp.description} 
                                            onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                            isEditor={isEditor} 
                                            as="span" 
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isEditor && (
                        <div className="flex justify-center mt-12 w-full pl-8 md:pl-16">
                            <button
                                onClick={handleAddItem}
                                className="px-8 py-4 border-4 kag-border-bone kag-text-bone hover:kag-bg-bone hover:kag-text-void uppercase tracking-widest text-[12px] font-mono font-bold transition-all duration-300 w-full shadow-[8px_8px_0_0_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]"
                            >
                                + TAMBAH PENGALAMAN
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
