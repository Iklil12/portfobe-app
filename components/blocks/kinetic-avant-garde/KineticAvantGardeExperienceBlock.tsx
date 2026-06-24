"use client";
import React, { useRef, useState, useEffect } from 'react';
import { EditableText } from '@/components/ui/EditableText';
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
            if (indicator) {
                gsap.to(indicator, {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    scale: 1.5,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        toggleActions: 'play reverse play reverse'
                    }
                });
            }
        });
    }, { scope: containerRef, dependencies: [isEditor, isCardPreview, accentColor, experiences] });

    return (
        <section ref={containerRef} className="relative kag-bg-void kag-text-bone py-32 px-6 md:px-20 z-10 overflow-hidden border-t border-white/20" id="chronology">
            <div className="flex flex-col md:flex-row gap-16 md:gap-20 max-w-7xl mx-auto">
                <div className="md:w-1/3">
                    <div className="md:sticky md:top-32">
                        <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-4">
                            <EditableText entity="appearance" field="kag_history_subtitle" value={getCustomText('kag_history_subtitle', '[ RIWAYAT ]')} isEditor={isEditor} />
                        </h3>
                        <h2 className="font-kag-brutal text-6xl md:text-8xl leading-none">
                            <EditableText entity="appearance" field="kag_history_title" value={getCustomText('kag_history_title', 'KRONOLOGI KARIR')} isEditor={isEditor} />
                        </h2>
                        <div className="font-kag-mono text-white/60 mt-6 text-sm max-w-xs text-left">
                            <EditableText as="p" entity="appearance" field="kag_history_desc" value={getCustomText('kag_history_desc', 'Evolusi pemikiran dan eksekusi lintas waktu dan dimensi kreatif.')} isEditor={isEditor} />
                        </div>
                    </div>
                </div>

                <div className="md:w-2/3 border-l border-white/20 relative mt-10 md:mt-0 pt-10">
                    {experiences.map((exp: any, index: number) => (
                        <div key={index} className="pl-10 pb-24 relative timeline-item group">
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                    title="Delete Experience"
                                >
                                    ✕
                                </button>
                            )}
                            <div className="absolute w-4 h-4 rounded-full border border-white/50 left-[-8.5px] top-2 kag-bg-void indicator transition-colors duration-300"></div>
                            <span className="font-kag-mono kag-text-blood text-sm tracking-widest">
                                <EditableText 
                                    value={exp.duration} 
                                    onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                    isEditor={isEditor} 
                                    maxLength={40} 
                                    as="span" 
                                />
                            </span>
                            <h4 className="font-kag-serif italic text-3xl md:text-5xl mt-2 kag-text-bone group-hover:kag-text-blood transition-colors duration-300">
                                <EditableText 
                                    value={exp.role} 
                                    onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                    isEditor={isEditor} 
                                    maxLength={50} 
                                    as="span" 
                                />
                            </h4>
                            <p className="font-kag-mono text-white/50 text-sm mt-4">
                                <EditableText 
                                    value={exp.company} 
                                    onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                    isEditor={isEditor} 
                                    maxLength={50} 
                                    as="span" 
                                />
                            </p>
                            <p className="font-kag-mono text-sm mt-4 leading-relaxed max-w-md text-white/80">
                                <EditableText 
                                    value={exp.description} 
                                    onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                    isEditor={isEditor} 
                                    as="span" 
                                />
                            </p>
                        </div>
                    ))}
                    {isEditor && (
                        <div className="flex justify-center mt-12 w-full col-span-full pl-10">
                            <button
                                onClick={handleAddItem}
                                className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                            >
                                + Tambah Pengalaman
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
