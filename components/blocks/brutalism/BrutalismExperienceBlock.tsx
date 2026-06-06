"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function BrutalismExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-24 px-4 md:px-8 bg-[#ffff00] border-b-[6px] border-black">
            <h2 className="text-5xl md:text-7xl font-black text-black uppercase mb-12 border-4 border-black p-4 inline-block bg-white shadow-[8px_8px_0_0_#000]">
                <EditableText entity="appearance" field="brutalism_exp_title" value={getCustomText('brutalism_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="border-4 border-black p-6 bg-white mb-8 shadow-[8px_8px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all">
                            <div className="flex-1">
                                <h3 className="text-3xl font-black uppercase text-black mb-2">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`brutalism_exp_role_${num}`} 
                                        value={getCustomText(`brutalism_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-sm font-bold bg-black text-white px-2 py-1 inline-block`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`brutalism_exp_company_${num}`} 
                                            value={getCustomText(`brutalism_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`brutalism_exp_duration_${num}`} 
                                            value={getCustomText(`brutalism_exp_duration_${num}`, defaultDuration)} 
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
