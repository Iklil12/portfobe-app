"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function LayeredMonolithExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full min-h-[100vh] py-32 px-6 md:px-16 bg-[#111] text-white flex flex-col justify-center relative stack-card">
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-16 relative z-10">
                <EditableText entity="appearance" field="layeredmonolith_exp_title" value={getCustomText('layeredmonolith_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="bg-black/40 p-8 border border-white/10 backdrop-blur-md mb-6 relative z-10 hover:bg-black/60 transition-all">
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`layeredmonolith_exp_role_${num}`} 
                                        value={getCustomText(`layeredmonolith_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-sm text-white/60 tracking-widest uppercase mt-4 block`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`layeredmonolith_exp_company_${num}`} 
                                            value={getCustomText(`layeredmonolith_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`layeredmonolith_exp_duration_${num}`} 
                                            value={getCustomText(`layeredmonolith_exp_duration_${num}`, defaultDuration)} 
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
