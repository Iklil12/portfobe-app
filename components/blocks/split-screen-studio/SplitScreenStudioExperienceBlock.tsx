"use client";

import React from 'react';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/components/ui/EditableText';

export function SplitScreenStudioExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <ScrollBlock 
            bg="#050805" index="EXP / 08" 
            tag={<EditableText entity="appearance" field="sss_exp_tag" value={getCustomText('sss_exp_tag', 'JOURNEY')} isEditor={isEditor} maxLength={30} as="span" />} 
            title={
                <>
                    <EditableText entity="appearance" field="sss_exp_title1" value={getCustomText('sss_exp_title1', 'WORK')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_exp_title2" value={getCustomText('sss_exp_title2', 'HISTORY.')} isEditor={isEditor} maxLength={20} as="span" />
                </>
            } 
            desc={<EditableText entity="appearance" field="sss_exp_desc" value={getCustomText('sss_exp_desc', 'Our professional journey and past collaborations.')} isEditor={isEditor} maxLength={200} as="span" />}
        >
            {({ y }: any) => (
                <div className="flex flex-col gap-8 mt-8">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="flex flex-col border-b border-white/10 pb-6 group">
                            <h3 className="font-display text-2xl md:text-3xl font-bold uppercase mb-2 group-hover:text-[var(--hl)] transition-colors">
                                <EditableText 
                                    entity="appearance" 
                                    field={`sss_exp_role_${num}`} 
                                    value={getCustomText(`sss_exp_role_${num}`, num === 1 ? 'Senior Designer' : num === 2 ? 'UX Engineer' : 'Product Designer')} 
                                    isEditor={isEditor} 
                                    maxLength={40} 
                                    as="span" 
                                />
                            </h3>
                            <div className="flex flex-col md:flex-row md:items-center justify-between font-sans text-sm text-white/50 uppercase tracking-widest gap-2">
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={`sss_exp_company_${num}`} 
                                        value={getCustomText(`sss_exp_company_${num}`, num === 1 ? 'Studio XYZ' : num === 2 ? 'Tech Startup' : 'Freelance')} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                                <span className="hidden md:block w-12 h-[1px] bg-white/20"></span>
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={`sss_exp_duration_${num}`} 
                                        value={getCustomText(`sss_exp_duration_${num}`, num === 1 ? '2022 — Present' : num === 2 ? '2020 — 2022' : '2018 — 2020')} 
                                        isEditor={isEditor} 
                                        maxLength={30} 
                                        as="span" 
                                    />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ScrollBlock>
    );
}
