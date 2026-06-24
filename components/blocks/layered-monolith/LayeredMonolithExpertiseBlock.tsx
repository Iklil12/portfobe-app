import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function LayeredMonolithExpertiseBlock({ data, theme, isEditor = false }: any) {
    const services = data?.services || data?.user?.services || [
        { title: 'Strategy & Identity', description: 'Brand Positioning, Visual Identity Systems, Typography, Tone of Voice, Art Direction.' },
        { title: 'Spatial UX/UI', description: 'User Experience Design, Wireframing, Prototyping, Design Systems, Mobile Apps.' },
        { title: 'Creative Engineering', description: 'WebGL / 3D Experiences, GSAP Animation, React / Next.js, Headless CMS, E-Commerce.' }
    ];

    return (
        <section id="expertise-services" className="stack-card bg-[#1E2328] text-white p-8 md:p-16 flex flex-col justify-center relative" >
            <div className="noise mix-blend-overlay opacity-10"></div>
            
            <div className="w-full max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <h2 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">
                        <EditableText value={theme?.customTexts?.lm_expertise_title || 'Studio\nCapabilities.'} field="lm_expertise_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </h2>
                    <p className="font-body text-sm md:text-base max-w-xs text-white/60 font-light">
                        <EditableText value={theme?.customTexts?.lm_expertise_desc || 'Delivering end-to-end digital solutions, from conceptual strategy to flawless creative engineering.'} field="lm_expertise_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={150} />
                    </p>
                </div>

                <div className="flex flex-col border-t border-white/10">
                    {services.map((svc: any, i: number) => (
                        <div key={i} className="group flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-b border-white/10 cursor-hover transition-colors hover:bg-white/5 px-4 -mx-4 rounded-lg" data-cursor-text="INFO">
                            <div className="flex items-center gap-6 md:gap-12 w-full md:w-1/2">
                                <span className="font-display text-xs tracking-widest opacity-40">0{i + 1}</span>
                                <h3 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight group-hover:pl-4 transition-all duration-300">
                                    {svc.title || svc.name}
                                </h3>
                            </div>
                            <div className="mt-4 md:mt-0 md:w-1/2 pl-12 md:pl-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                <p className="font-body text-sm">{svc.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
