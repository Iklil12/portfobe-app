"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function SpatialExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-24 md:py-32 px-4 md:px-8 bg-black/40 backdrop-blur-xl border-t border-white/10">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 mb-16">
                <EditableText entity="appearance" field="spatial_exp_title" value={getCustomText('spatial_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all mb-4">
                            <div className="flex-1">
                                <h3 className="text-2xl font-semibold text-white">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`spatial_exp_role_${num}`} 
                                        value={getCustomText(`spatial_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-sm text-white/50 tracking-wider`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`spatial_exp_company_${num}`} 
                                            value={getCustomText(`spatial_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`spatial_exp_duration_${num}`} 
                                            value={getCustomText(`spatial_exp_duration_${num}`, defaultDuration)} 
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
