"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function KineticAvantGardeStatsBlock({ data, theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;
    
    // Gunakan metrics dari data, atau data dummy jika kosong
    const rawMetrics = data?.metrics || data?.user?.metrics || [];
    const metrics = rawMetrics.length > 0 ? rawMetrics : [
        { value: "150+", label: "Proyek Selesai" },
        { value: "12", label: "Penghargaan Global" },
        { value: "8+", label: "Tahun Pengalaman" },
        { value: "99%", label: "Tingkat Kepuasan" }
    ];

    return (
        <section className="relative kag-bg-void kag-text-bone py-32 md:py-48 px-4 md:px-12 z-10 border-t-8 kag-border-bone overflow-hidden" id="metrics" style={{ '--accent': theme?.themeColor || '#c92a2a' } as any}>
            
            {/* Brutalist Grid Background */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: 'clamp(20px, 4vw, 50px) clamp(20px, 4vw, 50px)' }}></div>
            
            {/* Corner Crosshairs */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 kag-border-bone opacity-30 pointer-events-none"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 kag-border-bone opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 kag-border-bone opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 kag-border-bone opacity-30 pointer-events-none"></div>

            <div className="w-full max-w-7xl mx-auto relative z-10">
                <div className="flex items-center gap-3 mb-16 px-2">
                    <div className="w-3 h-3 kag-bg-blood animate-pulse"></div>
                    <h3 className="font-kag-mono kag-text-bone tracking-[0.2em] uppercase text-xs md:text-sm font-bold opacity-70">
                        <EditableText entity="appearance" field="kag_stats_subtitle" value={getCustomText('kag_stats_subtitle', '[ METRIK & DAMPAK ]')} isEditor={isEditor} />
                    </h3>
                </div>
                
                {/* Massive Blueprint Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 border-t-4 border-l-4 kag-border-bone">
                    {metrics.map((m: any, i: number) => (
                        <div 
                            key={m.id || i} 
                            className="flex flex-col justify-center items-center border-r-4 border-b-4 kag-border-bone p-6 md:p-16 lg:p-12 group hover-trigger cursor-default transition-all duration-500 hover:bg-[#e6e4dc] hover:text-[#0a0a0a] relative overflow-hidden"
                        >
                            {/* Stardust noise overlay on hover */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none mix-blend-multiply"></div>
                            
                            {/* The number */}
                            <h4 className="font-kag-brutal text-[clamp(2.5rem,6vw,7rem)] leading-none text-[#e6e4dc] group-hover:text-[var(--accent)] transition-transform duration-500 group-hover:scale-110 z-10 select-none">
                                <EditableText 
                                    value={customTexts[`kag_stat_val_${i}`] || m.value} 
                                    field={`kag_stat_val_${i}`} 
                                    entity="appearance" 
                                    isEditor={isEditor} 
                                    as="span"
                                    maxLength={10}
                                />
                            </h4>
                            
                            {/* The label */}
                            <p className="font-kag-mono font-bold text-xs md:text-sm uppercase tracking-widest text-white/50 group-hover:text-[#0a0a0a] mt-8 text-center transition-colors duration-500 z-10">
                                <EditableText 
                                    value={customTexts[`kag_stat_label_${i}`] || m.label} 
                                    field={`kag_stat_label_${i}`} 
                                    entity="appearance" 
                                    isEditor={isEditor} 
                                    as="span"
                                />
                            </p>
                            
                            {/* Absolute corners inside the cell for extra brutalism */}
                            <div className="absolute top-2 left-2 w-2 h-2 bg-[#e6e4dc] group-hover:bg-[#0a0a0a] transition-colors duration-300"></div>
                            <div className="absolute top-2 right-2 w-2 h-2 bg-[#e6e4dc] group-hover:bg-[#0a0a0a] transition-colors duration-300"></div>
                            <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#e6e4dc] group-hover:bg-[#0a0a0a] transition-colors duration-300"></div>
                            <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#e6e4dc] group-hover:bg-[#0a0a0a] transition-colors duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
