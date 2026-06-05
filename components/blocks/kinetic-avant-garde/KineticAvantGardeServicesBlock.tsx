"use client";
import React from 'react';

import { EditableText } from '@/components/ui/EditableText';

export function KineticAvantGardeServicesBlock({ data, theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    const rawServices = data?.services || data?.user?.services || [];
    const services = rawServices.length > 0 ? rawServices : [
        { title: "KAMPANYE DIGITAL", description: "Merancang narasi visual ujung-ke-ujung yang membajak perhatian audiens. Dari konsep hingga eksekusi lintas platform.", price: "MULAI $2K" },
        { title: "IDENTITAS MEREK", description: "Membangun sistem visual yang kuat, berani, dan tak tertandingi untuk merek yang menolak menjadi biasa.", price: "MULAI $5K" },
        { title: "DESAIN SPASIAL", description: "Transformasi ruang fisik menjadi pengalaman imersif yang memadukan arsitektur brutal dan seni instalasi.", price: "SESUAI SKALA" }
    ];

    return (
        <section className="relative kag-bg-bone kag-text-void py-32 px-6 md:px-20 z-10 border-t border-black/20" id="services">
            <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-16">
                <EditableText entity="appearance" field="kag_services_subtitle" value={getCustomText('kag_services_subtitle', '[ LAYANAN KOMERSIAL ]')} isEditor={isEditor} />
            </h3>
            
            <div className="flex flex-col w-full border-t border-black/20">
                {services.map((s: any, i: number) => (
                    <div key={s.id || i} className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-black/20 py-12 group hover-trigger">
                        <div className="w-full lg:w-1/3 flex items-center">
                            <span className="font-kag-mono text-black/40 text-sm mr-6">00{i+1}</span>
                            <h4 className="font-kag-brutal text-4xl md:text-5xl uppercase transition-transform duration-500 group-hover:translate-x-4 group-hover:kag-text-blood leading-none">
                                {s.title}
                            </h4>
                        </div>
                        <div className="w-full lg:w-1/2 mt-6 lg:mt-0 font-kag-mono text-sm leading-relaxed text-black/70 max-w-lg lg:px-10">
                            {s.description}
                        </div>
                        <div className="w-full lg:w-1/6 mt-6 lg:mt-0 lg:text-right font-kag-serif italic text-2xl md:text-3xl text-black/50 group-hover:kag-text-blood transition-colors duration-300">
                            {s.price || "Sesuai Proyek"}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
