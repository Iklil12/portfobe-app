import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';

export function LayeredMonolith3DBlock({ data, theme, isEditor = false }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');

    if (items3D.length === 0) return null;

    return (
        <section id="expertise-3d" className="stack-card bg-black text-white p-8 md:p-16 flex flex-col justify-center relative" >
            <div id="nav-expertise" className="absolute -top-20 w-full h-0 pointer-events-none invisible"></div>
            <div className="noise mix-blend-overlay opacity-10"></div>
            <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col h-full justify-center">
                <p className="font-display text-xs tracking-[0.3em] uppercase opacity-50 border-l border-brand-accent pl-4 mb-8">
                    <EditableText value={theme?.customTexts?.lm_3d_label || '3D Experience'} field="lm_3d_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {items3D.map((p: any, i: number) => (
                    <div key={i} className="group rounded-2xl overflow-hidden relative border border-white/10 bg-[#111]">
                        <div className="w-full h-80 relative">
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#111" />
                        </div>
                        <div className="p-6">
                            <h3 className="font-display font-bold uppercase tracking-tight text-xl">{p.title}</h3>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
