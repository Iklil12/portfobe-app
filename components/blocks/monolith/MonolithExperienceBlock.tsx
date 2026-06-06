"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function MonolithExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-32 px-6 md:px-16 bg-[#0a0a0a]">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-20">
                <EditableText entity="appearance" field="monolith_exp_title" value={getCustomText('monolith_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="flex flex-col py-8 border-b-2 border-white/10 hover:border-white/50 transition-colors">
                            <div className="flex-1">
                                <h3 className="text-4xl font-bold uppercase text-white">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`monolith_exp_role_${num}`} 
                                        value={getCustomText(`monolith_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-lg text-white/40 uppercase mt-2`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`monolith_exp_company_${num}`} 
                                            value={getCustomText(`monolith_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`monolith_exp_duration_${num}`} 
                                            value={getCustomText(`monolith_exp_duration_${num}`, defaultDuration)} 
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
