"use client";

import React from 'react';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/shared/ui/EditableText';

export function SplitScreenStudioTestimonialsBlock({ data, theme, isEditor }: any) {
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    if (testimonials.length === 0 && !isEditor) return null;

    const displayTestimonials = testimonials.length > 0 ? testimonials : [
        { content: "An incredible studio that exceeded our expectations.", clientName: "John Doe", company: "Acme Corp" }
    ];

    return (
        <ScrollBlock 
            bg="#0f0f0f" index="REV / 05" 
            tag={<EditableText entity="appearance" field="sss_testi_tag" value={getCustomText('sss_testi_tag', 'TESTIMONIALS')} isEditor={isEditor} maxLength={30} as="span" />} 
            title={
                <>
                    <EditableText entity="appearance" field="sss_testi_title1" value={getCustomText('sss_testi_title1', 'WORDS')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_testi_title2" value={getCustomText('sss_testi_title2', 'FROM')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_testi_title3" value={getCustomText('sss_testi_title3', 'CLIENTS.')} isEditor={isEditor} maxLength={20} as="span" />
                </>
            } 
            desc={<EditableText entity="appearance" field="sss_testi_desc" value={getCustomText('sss_testi_desc', 'What people say about our work.')} isEditor={isEditor} maxLength={200} as="span" />}
        >
            {({ y }: any) => (
                <div className="flex flex-col">
                    <h4 className="font-sans text-[10px] tracking-widest uppercase text-white/50 mb-8 break-words">
                        <EditableText entity="appearance" field="sss_agency_feedback" value={getCustomText('sss_agency_feedback', 'Client Feedback')} isEditor={isEditor} maxLength={40} as="span" />
                    </h4>
                    <div className="flex flex-col gap-12">
                        {displayTestimonials.map((t: any, i: number) => (
                            <div key={i} className="flex flex-col">
                                <p className="font-display text-xl md:text-2xl italic leading-relaxed text-white/80">"{t.content}"</p>
                                <div className="flex items-center gap-4 mt-6">
                                    <h5 className="font-sans text-sm font-bold uppercase tracking-widest">{t.clientName}</h5>
                                    <span className="text-white/30">—</span>
                                    <span className="font-sans text-xs text-white/50">{t.company}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ScrollBlock>
    );
}
