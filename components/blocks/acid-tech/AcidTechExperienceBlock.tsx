"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-24 px-6 md:px-12 bg-black border-y border-[#00ff00]">
            <h2 className="text-4xl md:text-5xl font-mono text-[#00ff00] mb-12 uppercase">
                <EditableText entity="appearance" field="acidtech_exp_title" value={getCustomText('acidtech_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="border border-[#00ff00]/30 p-6 mb-6 hover:bg-[#00ff00]/10 transition-colors">
                            <div className="flex-1">
                                <h3 className="text-2xl font-mono text-[#00ff00]">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`acidtech_exp_role_${num}`} 
                                        value={getCustomText(`acidtech_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-xs font-mono text-[#00ff00]/60 mt-2 block`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`acidtech_exp_company_${num}`} 
                                            value={getCustomText(`acidtech_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`acidtech_exp_duration_${num}`} 
                                            value={getCustomText(`acidtech_exp_duration_${num}`, defaultDuration)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
