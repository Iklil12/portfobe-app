import React from 'react';
import dynamic from 'next/dynamic';
import { EditableText } from '@/shared/ui/EditableText';
const Interactive3DViewer = dynamic(() => import('@/shared/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });

export function NexusNoir3DBlock({ data, theme, isEditor }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');

    if (items3D.length === 0) return null;

    const accentColor = theme?.themeColor || '#4F46E5'; 

    return (
        <section className="py-20 px-6 md:px-10 border-t border-white/10 relative bg-[#050505] z-20">
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
                    <div className={isEditor ? '' : 'gs-reveal'}>
                        <p className="text-[10px] font-nn-sans font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accentColor }}>
                            <EditableText entity="appearance" field="nn_3d_subtitle" value={theme?.customTexts?.nn_3d_subtitle || '[ Spatial Artifacts ]'} isEditor={isEditor} />
                        </p>
                        <h2 className="font-nn-heading text-4xl md:text-6xl font-semibold text-white uppercase tracking-tighter">
                            <EditableText entity="appearance" field="nn_3d_title" value={theme?.customTexts?.nn_3d_title || '3D_Showcase'} isEditor={isEditor} />
                        </h2>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {items3D.map((p: any, i: number) => (
                    <div key={i} className={`glass-panel magnetic-card group ${isEditor ? '' : 'gs-reveal'}`}>
                        <div className="w-full h-80 relative overflow-hidden border-b border-white/10">
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="transparent" />
                        </div>
                        <div className="p-6">
                            <h4 className="font-nn-heading text-2xl font-bold uppercase text-white group-hover:text-[var(--accent)] transition-colors">{p.title}</h4>
                            <p className="font-nn-sans text-[10px] text-white/50 uppercase tracking-widest mt-2">{p.description || 'Interactive Spatial Model'}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
