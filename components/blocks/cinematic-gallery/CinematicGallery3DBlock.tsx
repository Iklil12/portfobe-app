"use client";

import React from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';

export function CinematicGallery3DBlock(props: any) {
    const { data } = useCinematicGallery();

    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');

    if (items3D.length === 0) return null;

    return (
        <section className="panel flex-col items-center justify-center">
            <h2 className="font-serif text-3xl md:text-5xl italic mb-8 reveal-on-scroll text-[#f5f5f0]">Interactive Models</h2>
            <div className="w-[90vw] h-[50vh] md:w-[60vw] md:h-[65vh] bg-[#0a0a0a] rounded-lg overflow-hidden relative reveal-on-scroll border border-white/10 group">
                <Interactive3DViewer mediaUrl={items3D[0].mediaUrl} bgColor="#050505" />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 pointer-events-none bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500">
                    <h3 className="font-serif text-white text-2xl md:text-4xl">{items3D[0].title}</h3>
                    {items3D[0].description && (
                        <p className="font-sans text-xs text-gray-400 mt-2 max-w-lg">{items3D[0].description}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
