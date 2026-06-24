"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function KineticAvantGardeSkillsBlock({ data, theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="relative kag-bg-bone kag-text-void py-32 px-6 md:px-20 z-10" id="expertise">
            <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-16">
                <EditableText entity="appearance" field="kag_expertise_subtitle" value={getCustomText('kag_expertise_subtitle', '[ KEAHLIAN INTI ]')} isEditor={isEditor} />
            </h3>
            
            <div className="flex flex-col border-t border-black/20 w-full">
                <div className="group border-b border-black/20 py-8 md:py-12 flex justify-between items-center hover-trigger relative overflow-hidden">
                    <h2 className="font-kag-brutal text-4xl md:text-8xl transition-all duration-500 ease-out group-hover:kag-text-blood group-hover:translate-x-8 z-10">
                        <EditableText entity="appearance" field="kag_skill_1" value={getCustomText('kag_skill_1', 'DIREKSI SENI')} isEditor={isEditor} />
                    </h2>
                    <span className="font-kag-mono text-lg md:text-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-8 z-10">/01</span>
                    <div className="absolute inset-0 bg-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                </div>
                
                <div className="group border-b border-black/20 py-8 md:py-12 flex justify-between items-center hover-trigger relative overflow-hidden">
                    <h2 className="font-kag-brutal text-4xl md:text-8xl transition-all duration-500 ease-out group-hover:kag-text-blood group-hover:translate-x-8 z-10">
                        <EditableText entity="appearance" field="kag_skill_2" value={getCustomText('kag_skill_2', 'DESAIN SPASIAL')} isEditor={isEditor} />
                    </h2>
                    <span className="font-kag-mono text-lg md:text-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-8 z-10">/02</span>
                    <div className="absolute inset-0 bg-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                </div>

                <div className="group border-b border-black/20 py-8 md:py-12 flex justify-between items-center hover-trigger relative overflow-hidden">
                    <h2 className="font-kag-brutal text-4xl md:text-8xl transition-all duration-500 ease-out group-hover:kag-text-blood group-hover:translate-x-8 z-10">
                        <EditableText entity="appearance" field="kag_skill_3" value={getCustomText('kag_skill_3', 'SISTEM KREATIF')} isEditor={isEditor} />
                    </h2>
                    <span className="font-kag-mono text-lg md:text-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-8 z-10">/03</span>
                    <div className="absolute inset-0 bg-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                </div>
            </div>
        </section>
    );
}
