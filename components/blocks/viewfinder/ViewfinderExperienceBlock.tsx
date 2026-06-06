"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function ViewfinderExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-24 px-4 md:px-8">
            <h2 className="text-2xl font-mono uppercase tracking-[0.2em] text-white/80 mb-12 flex items-center gap-4 before:w-8 before:h-[1px] before:bg-white/80">
                <EditableText entity="appearance" field="viewfinder_exp_title" value={getCustomText('viewfinder_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="relative pl-8 py-4 border-l border-white/20 mb-8 before:absolute before:left-[-4px] before:top-6 before:w-2 before:h-2 before:bg-white before:rounded-full">
                            <div className="flex-1">
                                <h3 className="text-xl uppercase tracking-widest text-white">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`viewfinder_exp_role_${num}`} 
                                        value={getCustomText(`viewfinder_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-xs font-mono text-white/40`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`viewfinder_exp_company_${num}`} 
                                            value={getCustomText(`viewfinder_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`viewfinder_exp_duration_${num}`} 
                                            value={getCustomText(`viewfinder_exp_duration_${num}`, defaultDuration)} 
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
