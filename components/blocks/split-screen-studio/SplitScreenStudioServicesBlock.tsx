"use client";

import React from 'react';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/components/ui/EditableText';
import { useSplitScreenStudio } from './SplitScreenStudioContext';

export function SplitScreenStudioServicesBlock({ theme, isEditor }: any) {
    const { setCursorHovered } = useSplitScreenStudio();
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    const toggleVisibility = (num: number, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `sss_svc_${num}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    const services = [1, 2, 3];

    return (
        <ScrollBlock 
            bg="#080808" index="SVC / 02" 
            tag={<EditableText entity="appearance" field="sss_services_tag" value={getCustomText('sss_services_tag', 'EXPERTISE')} isEditor={isEditor} maxLength={30} as="span" />} 
            title={
                <>
                    <EditableText entity="appearance" field="sss_services_title1" value={getCustomText('sss_services_title1', 'CORE')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_services_title2" value={getCustomText('sss_services_title2', 'SERVICES.')} isEditor={isEditor} maxLength={20} as="span" />
                </>
            } 
            desc={<EditableText entity="appearance" field="sss_services_desc" value={getCustomText('sss_services_desc', 'What we bring to the table.')} isEditor={isEditor} maxLength={200} as="span" />}
        >
            {({ y }: any) => (
                <div className="flex flex-col gap-8 mt-8" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>
                    {services.map((num) => {
                        const isVisible = customTexts[`sss_svc_${num}_visible`] !== 'false';
                        if (!isVisible && !isEditor) return null;

                        return (
                            <div 
                                key={num} 
                                className={`flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-b border-white/10 group hover:border-[var(--hl)] transition-all relative ${
                                    !isVisible ? 'opacity-40 bg-white/[0.02]' : ''
                                }`}
                            >
                                {isEditor && (
                                    <button
                                        onClick={() => toggleVisibility(num, isVisible)}
                                        className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all ${
                                            isVisible 
                                                ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                                : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                        }`}
                                        title={isVisible ? "Sembunyikan" : "Tampilkan"}
                                    >
                                        {isVisible ? "✕ Sembunyikan" : "➕ Tampilkan"}
                                    </button>
                                )}

                                <div className="w-full md:w-2/3">
                                    <h3 className="font-display text-2xl md:text-4xl font-bold uppercase mb-2 group-hover:text-[var(--hl)] transition-colors">
                                        <EditableText 
                                            entity="appearance" 
                                            field={`sss_service_title_${num}`} 
                                            value={getCustomText(`sss_service_title_${num}`, num === 1 ? 'Digital Strategy' : num === 2 ? 'Brand Identity' : 'Web Development')} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                        {!isVisible && " [HIDDEN]"}
                                    </h3>
                                    <p className="font-sans text-sm text-white/50">
                                        <EditableText 
                                            entity="appearance" 
                                            field={`sss_service_desc_${num}`} 
                                            value={getCustomText(`sss_service_desc_${num}`, num === 1 ? 'Crafting comprehensive roadmaps for digital success.' : num === 2 ? 'Building cohesive visual systems for modern brands.' : 'Scalable architectures and performant web apps.')} 
                                            isEditor={isEditor} 
                                            maxLength={100} 
                                            as="span" 
                                        />
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0 font-sans text-xs tracking-widest uppercase border border-white/20 px-4 py-2 rounded-full group-hover:border-[var(--hl)] group-hover:text-[var(--hl)] transition-colors">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`sss_service_price_${num}`} 
                                        value={getCustomText(`sss_service_price_${num}`, num === 1 ? 'Custom' : num === 2 ? 'From $5k' : 'From $10k')} 
                                        isEditor={isEditor} 
                                        maxLength={20} 
                                        as="span" 
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </ScrollBlock>
    );
}
