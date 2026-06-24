"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function KineticAvantGardeAwardsBlock({ data, theme, isEditor, setSelectedMedia }: any) {
    const certificates = data?.certificates || data?.user?.certificates || [];
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    if (certificates.length === 0) return null;

    return (
        <section className="relative kag-bg-blood kag-text-bone py-32 px-6 md:px-20 z-10" id="recognition">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/30 pb-6">
                    <h2 className="font-kag-brutal text-5xl md:text-7xl uppercase kag-text-bone tracking-wide">
                        <EditableText entity="appearance" field="kag_recog_title" value={getCustomText('kag_recog_title', 'REKOGNISI')} isEditor={isEditor} />
                    </h2>
                    <div className="font-kag-mono text-xs uppercase tracking-widest mt-4 md:mt-0 text-left">
                        <EditableText as="p" entity="appearance" field="kag_recog_subtitle" value={getCustomText('kag_recog_subtitle', 'Sistem Bukti Validasi Murni')} isEditor={isEditor} />
                    </div>
                </div>

                <div className="w-full font-kag-mono text-xs md:text-sm uppercase tracking-widest border border-white/30">
                    <div className="grid grid-cols-12 border-b border-white/30 bg-black/10 p-4 opacity-70">
                        <div className="col-span-2">TAHUN</div>
                        <div className="col-span-6">PENGHARGAAN / SERTIFIKASI</div>
                        <div className="col-span-4 text-right">KREDENSIAL</div>
                    </div>
                    
                    {certificates.map((cert: any, i: number) => (
                        <div key={cert.id || i} className="grid grid-cols-12 border-b border-white/30 p-4 hover:kag-bg-bone hover:kag-text-blood hover-trigger transition-colors duration-300 cursor-pointer" onClick={() => cert.url ? window.open(cert.url, '_blank') : setSelectedMedia?.({ url: cert.fileUrl, title: cert.title, type: 'certificate' })}>
                            <div className="col-span-2">{cert.year || '2024'}</div>
                            <div className="col-span-6 truncate pr-4">{cert.title}</div>
                            <div className="col-span-4 text-right truncate text-white/60 group-hover:kag-text-blood/60">{cert.issuer}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
