"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function AuraKineticExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-32 px-4 md:px-16 overflow-hidden relative">
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent mix-blend-difference mb-16 outline-text">
                <EditableText entity="appearance" field="aurakinetic_exp_title" value={getCustomText('aurakinetic_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-md mb-6 hover:scale-[1.02] transition-transform">
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-white">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`aurakinetic_exp_role_${num}`} 
                                        value={getCustomText(`aurakinetic_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-sm text-white/60 font-mono`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`aurakinetic_exp_company_${num}`} 
                                            value={getCustomText(`aurakinetic_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`aurakinetic_exp_duration_${num}`} 
                                            value={getCustomText(`aurakinetic_exp_duration_${num}`, defaultDuration)} 
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
