"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function KineticAvantGardeMarqueeBlock({ data, theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="relative overflow-hidden w-full kag-bg-void kag-text-bone py-4 transform -rotate-2 scale-110 shadow-2xl mt-12 mb-12">
            <div className="kag-marquee font-kag-brutal text-2xl tracking-widest">
                <div className="kag-marquee-item pointer-events-auto flex items-center">
                    <EditableText className="!break-normal !whitespace-nowrap inline-block" entity="appearance" field="kag_marquee_text" value={getCustomText('kag_marquee_text', 'ESTETIKA KEKACAUAN — SENI MURNI — TANPA BATAS — ESTETIKA KEKACAUAN — SENI MURNI — TANPA BATAS —')} isEditor={isEditor} as="span" />
                </div>
                <div className="kag-marquee-item pointer-events-none flex items-center" aria-hidden="true">
                    <span className="!break-normal !whitespace-nowrap inline-block">
                        {getCustomText('kag_marquee_text', 'ESTETIKA KEKACAUAN — SENI MURNI — TANPA BATAS — ESTETIKA KEKACAUAN — SENI MURNI — TANPA BATAS —')}
                    </span>
                </div>
            </div>
        </section>
    );
}
