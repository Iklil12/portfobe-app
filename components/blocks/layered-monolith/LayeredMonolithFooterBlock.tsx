import React, { useState, useEffect } from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function LayeredMonolithFooterBlock({ data, theme, isEditor = false }: any) {
    const fullName = data?.profile?.fullName || data?.fullName || "Elevate Studio";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const links = data?.links?.filter((l: any) => l.isActive !== false) || data?.user?.links?.filter((l: any) => l.isActive !== false) || [];

    const [timeString, setTimeString] = useState('00:00:00 WIB');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Jakarta',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            setTimeString(time + ' WIB');
        };
        const timer = setInterval(updateTime, 1000);
        updateTime();
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="contact" className="stack-card bg-brand-accent text-white p-8 md:p-12 flex flex-col justify-between relative" >
            <div className="noise mix-blend-overlay opacity-20"></div>
            
            <div className="grow flex flex-col items-center justify-center text-center relative z-10 w-full mt-24">
                <p className="font-body text-xs md:text-sm tracking-[0.3em] uppercase mb-8 font-medium">
                    <EditableText value={theme?.customTexts?.lm_footer_prompt || 'Ready to build something iconic?'} field="lm_footer_prompt" entity="appearance" isEditor={isEditor} as="span" maxLength={50} />
                </p>
                <a href={`mailto:${userEmail}`} className="cursor-hover group block relative" data-cursor-text="HI!">
                    <h2 className="font-display text-[12vw] font-bold uppercase leading-none tracking-tighter">
                        <EditableText value={theme?.customTexts?.lm_footer_cta || 'START A\nPROJECT'} field="lm_footer_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </h2>
                    <div className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-1 md:h-2 bg-white scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>
                </a>
            </div>

            <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-end relative z-10 font-body text-xs uppercase tracking-widest gap-4 border-t border-white/20 pt-6 mt-24 md:mt-0 pb-20 md:pb-0">
                <div className="flex flex-wrap gap-6 justify-center">
                    {links.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:underline">
                            {l.platform}
                        </a>
                    ))}
                </div>
                <div className="text-center md:text-right flex flex-col gap-1">
                    <span>© {new Date().getFullYear()} {fullName.toUpperCase()}.</span>
                    <span className="opacity-60">
                        <EditableText value={theme?.customTexts?.lm_footer_location || 'SAMPANG, IDN'} field="lm_footer_location" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> — <span className="font-display">{timeString}</span>
                    </span>
                </div>
            </div>
        </section>
    );
}
