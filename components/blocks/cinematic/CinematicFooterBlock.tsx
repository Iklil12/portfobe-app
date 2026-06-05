"use client";

import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicFooterBlock({ data, theme, isEditor }: any) {
    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;

    return (
        <footer className={`bg-white text-black text-center relative overflow-hidden group py-24 @md:py-32 px-6 @md:px-12`}>
            <a href={isEditor ? '#' : `mailto:${userEmail}`} className="relative z-10 block cursor-pointer">
                <EditableText 
                    value={theme?.customTexts?.cinematic_footer_subtitle || 'Got a project?'} 
                    field="cinematic_footer_subtitle" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    as="p" 
                    className={`font-bold uppercase tracking-[0.3em] text-gray-500 mb-4 group-hover:text-black transition cine-body text-xs @md:text-sm`} 
                />
                <EditableText 
                    value={theme?.customTexts?.cinematic_footer_title || "Let's Talk"} 
                    field="cinematic_footer_title" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    as="h2" 
                    className={`font-black uppercase tracking-tighter leading-none group-hover:-translate-y-2 transition-transform duration-500 cine-heading text-[clamp(3rem,10cqi,8rem)]`} 
                />
            </a>

            <div className={`mt-16 flex justify-between items-center font-bold text-gray-500 uppercase tracking-widest cine-body flex-col @md:flex-row mt-20 @md:mt-24 text-xs @md:text-sm`}>
                <p>© {new Date().getFullYear()} {fullName}</p>
                <p className="flex items-center gap-2">
                    <i className="fas fa-link"></i> portfo.be/{subdomain}
                </p>
            </div>
        </footer>
    );
}
