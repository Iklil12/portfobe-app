"use client";
import React, { useRef } from 'react';
import { EditableText } from '@/components/ui/EditableText';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function KineticAvantGardeExperienceBlock({ data, theme, isEditor, isCardPreview }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const accentColor = theme?.themeColor || '#c92a2a';
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

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
    }, { scope: containerRef, dependencies: [isEditor, isCardPreview, accentColor] });

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
                    {data?.experiences?.length > 0 ? (
                        data.experiences.map((exp: any, index: number) => (
                            <div key={index} className="pl-10 pb-24 relative timeline-item group">
                                <div className="absolute w-4 h-4 rounded-full border border-white/50 left-[-8.5px] top-2 kag-bg-void indicator transition-colors duration-300"></div>
                                <span className="font-kag-mono kag-text-blood text-sm tracking-widest">{exp.startYear} — {exp.endYear || 'SEKARANG'}</span>
                                <h4 className="font-kag-serif italic text-3xl md:text-5xl mt-2 kag-text-bone group-hover:kag-text-blood transition-colors duration-300">{exp.role}</h4>
                                <p className="font-kag-mono text-white/50 text-sm mt-4">{exp.company}</p>
                                <p className="font-kag-mono text-sm mt-4 leading-relaxed max-w-md text-white/80">{exp.description}</p>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="pl-10 pb-24 relative timeline-item group">
                                <div className="absolute w-4 h-4 rounded-full border border-white/50 left-[-8.5px] top-2 kag-bg-void indicator transition-colors duration-300"></div>
                                <span className="font-kag-mono kag-text-blood text-sm tracking-widest">SEKARANG — 2024</span>
                                <h4 className="font-kag-serif italic text-3xl md:text-5xl mt-2 kag-text-bone group-hover:kag-text-blood transition-colors duration-300">Kepala Eksperimen Visual</h4>
                                <p className="font-kag-mono text-white/50 text-sm mt-4">Studio Monolith / Jakarta</p>
                                <p className="font-kag-mono text-sm mt-4 leading-relaxed max-w-md text-white/80">Memimpin tim arsitek antarmuka dalam merumuskan ulang batasan antara seni digital dan pengalaman pengguna.</p>
                            </div>
                            <div className="pl-10 pb-24 relative timeline-item group">
                                <div className="absolute w-4 h-4 rounded-full border border-white/50 left-[-8.5px] top-2 kag-bg-void indicator transition-colors duration-300"></div>
                                <span className="font-kag-mono kag-text-blood text-sm tracking-widest">2023 — 2021</span>
                                <h4 className="font-kag-serif italic text-3xl md:text-5xl mt-2 kag-text-bone group-hover:kag-text-blood transition-colors duration-300">Desainer Produk Senior</h4>
                                <p className="font-kag-mono text-white/50 text-sm mt-4">Nexus Digital / Singapura</p>
                                <p className="font-kag-mono text-sm mt-4 leading-relaxed max-w-md text-white/80">Merancang sistem desain skala besar untuk perusahaan fintech, berfokus pada tipografi dan interaksi mikro.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
