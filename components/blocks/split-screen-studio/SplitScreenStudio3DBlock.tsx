"use client";

import React from 'react';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/components/ui/EditableText';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { useSplitScreenStudio } from './SplitScreenStudioContext';

export function SplitScreenStudio3DBlock({ data, theme, isEditor }: any) {
    const { setCursorHovered } = useSplitScreenStudio();
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    if (items3D.length === 0 && !isEditor) return null;

    const displayItems = items3D.length > 0 ? items3D : [
        { title: 'Interactive Object', mediaUrl: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode' }
    ];

    return (
        <ScrollBlock 
            bg="#0a0a0a" index="EXP / 03" 
            tag={<EditableText entity="appearance" field="sss_3d_tag" value={getCustomText('sss_3d_tag', 'CAPABILITIES')} isEditor={isEditor} maxLength={30} as="span" />} 
            title={
                <>
                    <EditableText entity="appearance" field="sss_3d_title1" value={getCustomText('sss_3d_title1', 'WE SOLVE')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_3d_title2" value={getCustomText('sss_3d_title2', 'COMPLEX')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_3d_title3" value={getCustomText('sss_3d_title3', 'PROBLEMS.')} isEditor={isEditor} maxLength={20} as="span" />
                </>
            } 
            desc={<EditableText entity="appearance" field="sss_3d_desc" value={getCustomText('sss_3d_desc', 'A multi-disciplinary approach to digital design. We merge aesthetics with robust engineering to build scalable solutions.')} isEditor={isEditor} maxLength={200} as="span" />}
        >
            {({ y }: any) => (
                <div className="flex flex-col cursor-hover-target" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>
                    <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-12 break-words">
                        <EditableText entity="appearance" field="sss_3d_header" value={getCustomText('sss_3d_header', '3D & Spatial.')} isEditor={isEditor} maxLength={40} as="span" />
                    </h2>
                    {displayItems.map((p: any, i: number) => (
                        <div key={i} className="flex flex-col mb-16">
                            <div className="flex justify-between items-center py-6 text-white/50 border-b border-white/10 group hover:border-white hover:text-white transition-colors cursor-pointer">
                                <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wide group-hover:translate-x-4 transition-transform">0{i+1}. {p.title}</h3>
                                <i className="fas fa-plus group-hover:rotate-45 transition-transform"></i>
                            </div>
                            <div className="w-full aspect-video mt-6 bg-[#050505] relative overflow-hidden border border-white/10 pointer-events-auto">
                                <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ScrollBlock>
    );
}
