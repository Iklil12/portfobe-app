import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/components/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });

export function HorizontalFlow3DBlock({ data, theme, isEditor }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    if (items3D.length === 0 && !isEditor) return null;

    return (
        <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-20">
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
               <EditableText value={theme?.customTexts?.hf_showcase3d_label || '3D Space'} field="hf_showcase3d_label" entity="appearance" isEditor={isEditor} as="span" />
            </h2>
            
            <div className={`grid grid-cols-1 ${items3D.length > 1 ? 'md:grid-cols-2' : ''} gap-8 w-full`}>
                {items3D.length > 0 ? items3D.map((p: any, i: number) => (
                    <div key={i} className="group bento-card bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 overflow-hidden relative">
                        <div className={`w-full ${items3D.length === 1 ? 'h-[50vh] md:h-[70vh]' : 'h-80'} rounded-xl overflow-hidden relative mb-6`}>
                           <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className={`font-display font-medium uppercase tracking-tight text-white mb-2 ${items3D.length === 1 ? 'text-3xl md:text-5xl' : 'text-2xl'}`}>{p.title}</h3>
                                {p.description && <p className={`font-body text-textMuted ${items3D.length === 1 ? 'text-base max-w-2xl' : 'text-sm'}`}>{p.description}</p>}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-textMuted font-mono text-xs p-10 text-center border border-white/10 rounded-2xl border-dashed">
                        No 3D projects found.
                    </div>
                )}
            </div>
        </section>
    );
}
