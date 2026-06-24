import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/shared/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });

export function HorizontalFlow3DBlock({ data, theme, isEditor }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    if (items3D.length === 0 && !isEditor) return null;

    return (
        <section className="py-24 w-full max-w-[1600px] mx-auto px-6 md:px-12 relative z-20 bg-[#050505]">
            <div className="flex items-center gap-6 mb-16">
                <h2 className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4">
                   <span className="text-white">
                       <EditableText value={theme?.customTexts?.hf_showcase3d_label || '0X / SPATIAL DIMENSIONS'} field="hf_showcase3d_label" entity="appearance" isEditor={isEditor} as="span" />
                   </span>
                </h2>
                <div className="h-px bg-white/10 flex-1"></div>
            </div>
            
            <div className={`grid grid-cols-1 ${items3D.length > 1 ? 'lg:grid-cols-2' : ''} gap-8 w-full`}>
                {items3D.length > 0 ? items3D.map((p: any, i: number) => (
                    <div key={i} className="group flex flex-col bg-[#0a0a0a] border border-white/5 hover:border-accent transition-colors duration-500 p-6 md:p-8 relative">
                        {/* Abstract numbering */}
                        <div className="absolute top-4 right-6 font-mono text-[10px] text-white/20 tracking-[0.2em] group-hover:text-accent transition-colors z-10">
                            {(i + 1).toString().padStart(2, '0')} // 3D
                        </div>

                        <div className={`w-full ${items3D.length === 1 ? 'h-[50vh] md:h-[70vh]' : 'h-[400px]'} border border-white/5 relative mb-8 group-hover:border-white/20 transition-colors duration-500`}>
                           <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                        </div>
                        <div className="flex flex-col justify-end flex-1">
                            <h3 className={`font-display font-medium uppercase tracking-tight text-white/80 group-hover:text-white transition-colors duration-500 mb-4 ${items3D.length === 1 ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'}`}>
                                {p.title}
                            </h3>
                            {p.description && (
                                <p className={`font-body text-white/50 group-hover:text-white/70 transition-colors duration-500 ${items3D.length === 1 ? 'text-lg max-w-3xl leading-relaxed' : 'text-sm leading-relaxed max-w-xl'}`}>
                                    {p.description}
                                </p>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="text-white/30 font-mono text-xs p-16 text-center border border-dashed border-white/10 flex items-center justify-center col-span-full uppercase tracking-widest">
                        [ NO SPATIAL ENTITIES FOUND ]
                    </div>
                )}
            </div>
        </section>
    );
}
