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
        <section className="relative kag-bg-bone kag-text-void py-32 md:py-48 px-4 md:px-12 z-10 overflow-hidden border-t-8 kag-border-void" id="services">
            
            {/* Brutalist Grid Background */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: 'clamp(20px, 4vw, 50px) clamp(20px, 4vw, 50px)' }}></div>
            
            {/* Corner Crosshairs */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 kag-border-void opacity-100 pointer-events-none"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 kag-border-void opacity-100 pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 kag-border-void opacity-100 pointer-events-none"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 kag-border-void opacity-100 pointer-events-none"></div>

            <div className="w-full max-w-7xl mx-auto relative z-10">
                <div className="flex items-center gap-3 mb-16 md:mb-24 px-2">
                    <div className="w-3 h-3 kag-bg-blood animate-pulse"></div>
                    <h3 className="font-kag-mono kag-text-void font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
                        <EditableText entity="appearance" field="kag_services_subtitle" value={getCustomText('kag_services_subtitle', '[ LAYANAN KOMERSIAL ]')} isEditor={isEditor} />
                    </h3>
                </div>
                
                <div className="flex flex-col w-full border-t-4 kag-border-void relative">
                    {services.map((s, i) => {
                        const isVisible = customTexts[`kag_svc_${s.id}_visible`] !== 'false';
                        if (!isVisible && !isEditor) return null;

                        return (
                            <div 
                                key={s.id || i} 
                                className={`flex flex-col lg:flex-row justify-between items-start lg:items-center border-b-4 kag-border-void py-8 md:py-12 px-4 md:px-8 group hover-trigger relative transition-colors duration-500 hover:kag-bg-void hover:kag-text-bone ${
                                    !isVisible ? 'opacity-40 bg-black/5' : ''
                                }`}
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>

                                {isEditor && (
                                    <button
                                        onClick={() => toggleVisibility(s.id, isVisible)}
                                        className={`absolute top-4 right-4 z-30 px-4 py-2 text-[10px] font-mono border-2 transition-all font-bold ${
                                            isVisible 
                                                ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                                                : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
                                        }`}
                                        title={isVisible ? "Sembunyikan Layanan" : "Tampilkan Layanan"}
                                    >
                                        {isVisible ? "✕ SEMBUNYIKAN" : "➕ TAMPILKAN"}
                                    </button>
                                )}

                                <div className="w-full lg:w-2/5 flex items-start md:items-center relative z-10 mb-6 lg:mb-0">
                                    <span className="font-kag-brutal text-transparent opacity-30 text-[clamp(2rem,6vw,5rem)] leading-none -webkit-text-stroke-[1px] md:-webkit-text-stroke-[2px] -webkit-text-stroke-black group-hover:-webkit-text-stroke-white mr-4 md:mr-10 transition-all duration-500">
                                        0{i+1}
                                    </span>
                                    <div className="flex flex-col">
                                        {(!isVisible) && <span className="text-[10px] kag-text-blood font-mono font-bold mb-2">[HIDDEN]</span>}
                                        <h4 className="font-kag-brutal text-[clamp(1.5rem,4vw,4rem)] uppercase transition-transform duration-500 md:group-hover:translate-x-4 kag-text-void group-hover:kag-text-blood leading-[0.9] break-words">
                                            <EditableText value={customTexts[`kag_svc_${s.id}_title`] || s.defaultTitle} field={`kag_svc_${s.id}_title`} entity="appearance" isEditor={isEditor} as="span" />
                                        </h4>
                                    </div>
                                </div>
                                
                                <div className="w-full lg:w-2/5 font-kag-mono text-[10px] md:text-sm leading-relaxed kag-text-void opacity-80 group-hover:kag-text-bone group-hover:opacity-100 max-w-lg lg:px-10 uppercase transition-colors duration-500 relative z-10 mb-8 lg:mb-0">
                                    <EditableText value={customTexts[`kag_svc_${s.id}_desc`] || s.defaultDesc} field={`kag_svc_${s.id}_desc`} entity="appearance" isEditor={isEditor} as="span" />
                                </div>
                                
                                <div className="w-full lg:w-1/5 lg:text-right relative z-10">
                                    <div className="inline-block border-2 kag-border-void group-hover:kag-border-bone px-4 md:px-6 py-2 md:py-3 font-kag-mono font-bold text-xs md:text-base kag-text-void group-hover:kag-text-bone uppercase transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[4px_4px_0_0_#e6e4dc]">
                                        <EditableText value={customTexts[`kag_svc_${s.id}_price`] || s.defaultPrice} field={`kag_svc_${s.id}_price`} entity="appearance" isEditor={isEditor} as="span" />
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
