import React from 'react';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';

export function NexusNoir3DBlock({ data }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');

    if (items3D.length === 0) return null;

    return (
        <section className="py-24 px-6 md:px-10 border-t border-[#333] relative bg-[#050505] z-20">
            <div className="max-w-7xl mx-auto">
                <h3 className="font-nn-heading text-4xl uppercase tracking-tighter mb-12 text-white">3D / Spatial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {items3D.map((p: any, i: number) => (
                    <div key={i} className="rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#222]">
                        <div className="w-full h-80 relative">
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0A0A0A" />
                        </div>
                        <div className="p-6 border-t border-[#222]">
                            <h4 className="font-nn-heading text-2xl font-bold uppercase text-white">{p.title}</h4>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
