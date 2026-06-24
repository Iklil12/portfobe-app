"use client";

import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function KineticAvantGardeServicesBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    const services = [
        { id: '1', defaultTitle: "KAMPANYE DIGITAL", defaultDesc: "Merancang narasi visual ujung-ke-ujung yang membajak perhatian audiens. Dari konsep hingga eksekusi lintas platform.", defaultPrice: "MULAI $2K" },
        { id: '2', defaultTitle: "IDENTITAS MEREK", defaultDesc: "Membangun sistem visual yang kuat, berani, dan tak tertandingi untuk merek yang menolak menjadi biasa.", defaultPrice: "MULAI $5K" },
        { id: '3', defaultTitle: "DESAIN SPASIAL", defaultDesc: "Transformasi ruang fisik menjadi pengalaman imersif yang memadukan arsitektur brutal dan seni instalasi.", defaultPrice: "SESUAI SKALA" }
    ];

    const toggleVisibility = (id: string, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `kag_svc_${id}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    return (
        <section className="relative kag-bg-bone kag-text-void py-32 px-6 md:px-20 z-10 border-t border-black/20" id="services">
            <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-16">
                <EditableText entity="appearance" field="kag_services_subtitle" value={getCustomText('kag_services_subtitle', '[ LAYANAN KOMERSIAL ]')} isEditor={isEditor} />
            </h3>
            
            <div className="flex flex-col w-full border-t border-black/20">
                {services.map((s, i) => {
                    const isVisible = customTexts[`kag_svc_${s.id}_visible`] !== 'false';
                    if (!isVisible && !isEditor) return null;

                    return (
                        <div 
                            key={s.id || i} 
                            className={`flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-black/20 py-12 group hover-trigger relative transition-all ${
                                !isVisible ? 'opacity-40 bg-black/5' : ''
                            }`}
                        >
                            {isEditor && (
                                <button
                                    onClick={() => toggleVisibility(s.id, isVisible)}
                                    className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all ${
                                        isVisible 
                                            ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                            : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                    }`}
                                    title={isVisible ? "Sembunyikan Layanan" : "Tampilkan Layanan"}
                                >
                                    {isVisible ? "✕ Sembunyikan" : "➕ Tampilkan"}
                                </button>
                            )}

                            <div className="w-full lg:w-1/3 flex items-center">
                                <span className="font-kag-mono text-black/40 text-sm mr-6">
                                    00{i+1} {!isVisible && "[HIDDEN]"}
                                </span>
                                <h4 className="font-kag-brutal text-4xl md:text-5xl uppercase transition-transform duration-500 group-hover:translate-x-4 group-hover:kag-text-blood leading-none">
                                    <EditableText value={customTexts[`kag_svc_${s.id}_title`] || s.defaultTitle} field={`kag_svc_${s.id}_title`} entity="appearance" isEditor={isEditor} as="span" />
                                </h4>
                            </div>
                            <div className="w-full lg:w-1/2 mt-6 lg:mt-0 font-kag-mono text-sm leading-relaxed text-black/70 max-w-lg lg:px-10">
                                <EditableText value={customTexts[`kag_svc_${s.id}_desc`] || s.defaultDesc} field={`kag_svc_${s.id}_desc`} entity="appearance" isEditor={isEditor} as="span" />
                            </div>
                            <div className="w-full lg:w-1/6 mt-6 lg:mt-0 lg:text-right font-kag-serif italic text-2xl md:text-3xl text-black/50 group-hover:kag-text-blood transition-colors duration-300">
                                <EditableText value={customTexts[`kag_svc_${s.id}_price`] || s.defaultPrice} field={`kag_svc_${s.id}_price`} entity="appearance" isEditor={isEditor} as="span" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
