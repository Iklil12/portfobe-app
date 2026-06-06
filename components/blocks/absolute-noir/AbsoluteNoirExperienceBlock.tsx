"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function AbsoluteNoirExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-32 px-4 md:px-12 bg-black">
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-widest mb-16 text-center">
                <EditableText entity="appearance" field="absolutenoir_exp_title" value={getCustomText('absolutenoir_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="border border-white/20 p-8 mb-8 hover:bg-white hover:text-black transition-all duration-500 group">
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold uppercase mb-2">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`absolutenoir_exp_role_${num}`} 
                                        value={getCustomText(`absolutenoir_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-sm font-mono opacity-60`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`absolutenoir_exp_company_${num}`} 
                                            value={getCustomText(`absolutenoir_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`absolutenoir_exp_duration_${num}`} 
                                            value={getCustomText(`absolutenoir_exp_duration_${num}`, defaultDuration)} 
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
