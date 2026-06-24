"use client";

import React from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { EditableText } from '@/shared/ui/EditableText';

export function CinematicGalleryFooterBlock(props: any) {
    const { isEditor, data, theme } = useCinematicGallery();

    const fullName = data?.profile?.fullName || data?.fullName || "Ruang Studio";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "ruang";
    const userEmail = data?.email || data?.user?.email || `studio@${subdomain}.art`;
    const links = data?.links?.filter((l: any) => l.isActive !== false) || data?.user?.links?.filter((l: any) => l.isActive !== false) || [];

    return (
        <section className="panel flex-col items-center justify-center bg-[#f5f5f0] text-[#050505] relative">
            <div className="text-center w-full relative z-10 px-4">
                <p className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 md:mb-8 font-bold text-[#8b8b8b]">
                    <EditableText value={theme?.customTexts?.cg_footer_cta_label || 'Mari Ciptakan Sesuatu'} field="cg_footer_cta_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                </p>
                <a href={isEditor ? '#' : `mailto:${userEmail}`} className="font-serif cg-text-huge italic hover-trigger block" style={{ lineHeight: 1 }}>
                    <EditableText value={theme?.customTexts?.cg_footer_cta || 'Sapa.'} field="cg_footer_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </a>
            </div>
            
            <div className="absolute bottom-6 md:bottom-8 w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-end font-sans text-[10px] md:text-xs tracking-widest uppercase font-bold gap-4 md:gap-0">
                <p>© {new Date().getFullYear()} {fullName}</p>
                <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
                    {links.length > 0 ? (
                        links.map((l: any, i: number) => (
                            <a key={i} href={isEditor ? '#' : l.url} target="_blank" rel="noreferrer" className="hover-trigger hover:text-[#8b8b8b] transition-colors pointer-events-auto">
                                {l.platform}
                            </a>
                        ))
                    ) : (
                        <>
                            <a href="#" className="hover-trigger hover:text-[#8b8b8b] transition-colors pointer-events-auto">Instagram</a>
                            <a href="#" className="hover-trigger hover:text-[#8b8b8b] transition-colors pointer-events-auto">Behance</a>
                            <a href="#" className="hover-trigger hover:text-[#8b8b8b] transition-colors pointer-events-auto">LinkedIn</a>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
