"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsionExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-24 px-6 md:px-12 bg-[#020202] border-t border-white/10">
            <h2 className="text-3xl md:text-5xl font-mono text-white/90 mb-12 uppercase tracking-tight">
                <EditableText entity="appearance" field="midnightemulsion_exp_title" value={getCustomText('midnightemulsion_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="p-6 bg-white/[0.02] border border-white/10 mb-4 hover:bg-white/[0.05] transition-colors">
                            <div className="flex-1">
                                <h3 className="text-xl font-mono text-white">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`midnightemulsion_exp_role_${num}`} 
                                        value={getCustomText(`midnightemulsion_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-xs text-white/50 font-mono uppercase tracking-widest mt-2 block`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`midnightemulsion_exp_company_${num}`} 
                                            value={getCustomText(`midnightemulsion_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`midnightemulsion_exp_duration_${num}`} 
                                            value={getCustomText(`midnightemulsion_exp_duration_${num}`, defaultDuration)} 
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
