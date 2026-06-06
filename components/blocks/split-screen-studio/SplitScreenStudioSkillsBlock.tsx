"use client";

import React from 'react';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/components/ui/EditableText';

export function SplitScreenStudioSkillsBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <ScrollBlock 
            bg="#0f0a0a" index="SKL / 07" 
            tag={<EditableText entity="appearance" field="sss_skills_tag" value={getCustomText('sss_skills_tag', 'CAPABILITIES')} isEditor={isEditor} maxLength={30} as="span" />} 
            title={
                <>
                    <EditableText entity="appearance" field="sss_skills_title1" value={getCustomText('sss_skills_title1', 'TECHNICAL')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_skills_title2" value={getCustomText('sss_skills_title2', 'ARSENAL.')} isEditor={isEditor} maxLength={20} as="span" />
                </>
            } 
            desc={<EditableText entity="appearance" field="sss_skills_desc" value={getCustomText('sss_skills_desc', 'Tools and technologies we master.')} isEditor={isEditor} maxLength={200} as="span" />}
        >
            {({ y }: any) => (
                <div className="flex flex-col gap-6 mt-8">
                    {[1, 2, 3].map((num) => {
                        const defaultName = num === 1 ? 'UI/UX Design' : num === 2 ? 'Frontend Development' : 'Creative Direction';
                        const defaultProficiency = num === 1 ? '95' : num === 2 ? '90' : '85';
                        const val = parseInt(getCustomText(`sss_skill_prof_${num}`, defaultProficiency) || '0', 10);
                        const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                        
                        return (
                            <div key={num} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-white/80 font-display uppercase text-lg">
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`sss_skill_name_${num}`} 
                                            value={getCustomText(`sss_skill_name_${num}`, defaultName)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`sss_skill_prof_${num}`} 
                                            value={getCustomText(`sss_skill_prof_${num}`, defaultProficiency)} 
                                            isEditor={isEditor} 
                                            maxLength={3} 
                                            as="span" 
                                        />%
                                    </span>
                                </div>
                                <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-[var(--hl)] transition-all duration-1000 ease-out"
                                        style={{ width: `${safeVal}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </ScrollBlock>
    );
}
