"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicGalleryExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-12 md:px-24 bg-[#0a0a0a] shrink-0 border-r border-white/10 relative">
            <h2 className="text-6xl md:text-8xl font-black uppercase text-white/10 absolute top-12 left-12 whitespace-nowrap">
                <EditableText entity="appearance" field="cinematicgallery_exp_title" value={getCustomText('cinematicgallery_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="flex flex-col md:flex-row gap-8 items-center border border-white/10 p-8 bg-white/5 backdrop-blur-md mb-6 w-full max-w-4xl z-10">
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-white uppercase">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`cinematicgallery_exp_role_${num}`} 
                                        value={getCustomText(`cinematicgallery_exp_role_${num}`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-sm text-white/50 tracking-widest`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`cinematicgallery_exp_company_${num}`} 
                                            value={getCustomText(`cinematicgallery_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`cinematicgallery_exp_duration_${num}`} 
                                            value={getCustomText(`cinematicgallery_exp_duration_${num}`, defaultDuration)} 
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
