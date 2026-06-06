"use client";

import React from 'react';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/components/ui/EditableText';
import { useSplitScreenStudio } from './SplitScreenStudioContext';

export function SplitScreenStudioStatsBlock({ theme, isEditor }: any) {
    const { setCursorHovered } = useSplitScreenStudio();
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <ScrollBlock 
            bg="#030303" index="STT / 03" 
            tag={<EditableText entity="appearance" field="sss_stats_tag" value={getCustomText('sss_stats_tag', 'IMPACT')} isEditor={isEditor} maxLength={30} as="span" />} 
            title={
                <>
                    <EditableText entity="appearance" field="sss_stats_title1" value={getCustomText('sss_stats_title1', 'BY THE')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_stats_title2" value={getCustomText('sss_stats_title2', 'NUMBERS.')} isEditor={isEditor} maxLength={20} as="span" />
                </>
            } 
            desc={<EditableText entity="appearance" field="sss_stats_desc" value={getCustomText('sss_stats_desc', 'Measurable impact of our work.')} isEditor={isEditor} maxLength={200} as="span" />}
        >
            {({ y }: any) => (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="flex flex-col border border-white/10 p-8 hover:bg-white/5 transition-colors">
                            <span className="font-display text-5xl md:text-7xl font-bold uppercase text-[var(--hl)] mb-4">
                                <EditableText 
                                    entity="appearance" 
                                    field={`sss_stat_value_${num}`} 
                                    value={getCustomText(`sss_stat_value_${num}`, num === 1 ? '50+' : num === 2 ? '120+' : '10')} 
                                    isEditor={isEditor} 
                                    maxLength={20} 
                                    as="span" 
                                />
                            </span>
                            <span className="font-sans text-xs tracking-widest uppercase text-white/50">
                                <EditableText 
                                    entity="appearance" 
                                    field={`sss_stat_label_${num}`} 
                                    value={getCustomText(`sss_stat_label_${num}`, num === 1 ? 'Global Clients' : num === 2 ? 'Projects Completed' : 'Years Experience')} 
                                    isEditor={isEditor} 
                                    maxLength={40} 
                                    as="span" 
                                />
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </ScrollBlock>
    );
}
