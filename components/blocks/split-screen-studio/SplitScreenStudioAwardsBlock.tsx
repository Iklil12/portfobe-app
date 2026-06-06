"use client";

import React from 'react';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/components/ui/EditableText';

export function SplitScreenStudioAwardsBlock({ data, theme, isEditor }: any) {
    const awardItems = data?.certificates || data?.user?.certificates || [];

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    if (awardItems.length === 0 && !isEditor) return null;

    const displayAwards = awardItems.length > 0 ? awardItems : [
        { title: 'Site of the Day', issuer: 'Awwwards', year: '2026' },
        { title: 'FWA of the Day', issuer: 'FWA', year: '2026' }
    ];

    return (
        <ScrollBlock 
            bg="#111111" index="AWD / 04" 
            tag={<EditableText entity="appearance" field="sss_awards_tag" value={getCustomText('sss_awards_tag', 'RECOGNITION')} isEditor={isEditor} maxLength={30} as="span" />} 
            title={
                <>
                    <EditableText entity="appearance" field="sss_awards_title1" value={getCustomText('sss_awards_title1', 'DRIVEN BY')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_awards_title2" value={getCustomText('sss_awards_title2', 'AESTHETICS')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_awards_title3" value={getCustomText('sss_awards_title3', '& LOGIC.')} isEditor={isEditor} maxLength={20} as="span" />
                </>
            } 
            desc={<EditableText entity="appearance" field="sss_awards_desc" value={getCustomText('sss_awards_desc', 'We believe that great design is not just how it looks, but how it feels and functions.')} isEditor={isEditor} maxLength={200} as="span" />}
        >
            {({ y }: any) => (
                <div className="flex flex-col">
                    <h2 className="font-display text-2xl md:text-3xl font-bold uppercase mb-8 leading-snug">
                        "<EditableText entity="appearance" field="sss_agency_quote" value={getCustomText('sss_agency_quote', 'We build digital flagship stores, immersive portfolios, and web applications that defy the ordinary.')} isEditor={isEditor} maxLength={200} as="span" />"
                    </h2>

                    <div className="border-t border-white/10 pt-8 mt-8">
                        <h4 className="font-sans text-[10px] tracking-widest uppercase text-white/50 mb-8 break-words">
                            <EditableText entity="appearance" field="sss_agency_rec" value={getCustomText('sss_agency_rec', 'Selected Recognition')} isEditor={isEditor} maxLength={40} as="span" />
                        </h4>
                        <div className="flex flex-col gap-6">
                            {displayAwards.map((a: any, i: number) => (
                                <div key={i} className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                                    <h5 className="font-display text-xl uppercase">{a.title}</h5>
                                    <div className="flex items-center gap-4 text-white/50 font-sans text-sm">
                                        <span>{a.issuer}</span>
                                        <span className="w-12 h-[1px] bg-white/20"></span>
                                        <span>{a.year || new Date(a.createdAt || Date.now()).getFullYear()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </ScrollBlock>
    );
}
