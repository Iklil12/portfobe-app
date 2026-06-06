"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function MinimalistExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-24 md:py-32 px-4 md:px-8 border-t border-gray-200 bg-white">
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-gray-900 mb-12">
                <EditableText entity="appearance" field="minimalist_exp_title" value={getCustomText('minimalist_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-100">
                            <div className="flex-1">
                                <h3 className="text-xl font-medium text-gray-900">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`minimalist_exp_role_${num}`} 
                                        value={getCustomText(`minimalist_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-sm text-gray-500 font-mono`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`minimalist_exp_company_${num}`} 
                                            value={getCustomText(`minimalist_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`minimalist_exp_duration_${num}`} 
                                            value={getCustomText(`minimalist_exp_duration_${num}`, defaultDuration)} 
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
