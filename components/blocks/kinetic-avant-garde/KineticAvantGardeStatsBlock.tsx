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
        <section className="relative kag-bg-void kag-text-bone py-32 px-6 md:px-20 z-10 border-t border-white/20" id="metrics">
            <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-16">
                <EditableText entity="appearance" field="kag_stats_subtitle" value={getCustomText('kag_stats_subtitle', '[ METRIK & DAMPAK ]')} isEditor={isEditor} />
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-y border-white/20 py-20">
                {metrics.map((m: any, i: number) => (
                    <div key={m.id || i} className="flex flex-col justify-center items-center group hover-trigger cursor-default">
                        <h4 className="font-kag-brutal text-7xl md:text-8xl lg:text-9xl kag-text-bone group-hover:kag-text-blood transition-colors duration-500 select-none">
                            {m.value}
                        </h4>
                        <p className="font-kag-mono text-xs uppercase tracking-widest text-white/50 mt-6 text-center group-hover:text-white transition-colors duration-300">
                            {m.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
