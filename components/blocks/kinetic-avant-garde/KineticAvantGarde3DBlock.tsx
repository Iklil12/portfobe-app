"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/components/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });

export function KineticAvantGarde3DBlock({ data, theme, isEditor }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    if (items3D.length === 0) return null;

    return (
        <section className="relative kag-bg-void py-32 px-6 md:px-20 z-10 border-t border-white/20">
            <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-16">
                <EditableText entity="appearance" field="kag_3d_subtitle" value={getCustomText('kag_3d_subtitle', '[ DIMENSI KETIGA ]')} isEditor={isEditor} />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {items3D.map((p: any, i: number) => (
                <div key={i} className="group rounded-2xl overflow-hidden relative bg-[#111] border border-white/10">
                    <div className="w-full h-80 relative">
                        <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#111" />
                    </div>
                    <div className="p-6 border-t border-white/10">
                        <h3 className="font-kag-brutal text-3xl kag-text-bone uppercase">{p.title}</h3>
                    </div>
                </div>
                ))}
            </div>
        </section>
    );
}
