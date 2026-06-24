import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function HorizontalFlowFooterBlock({ data, theme, isEditor }: any) {
    const fullName = data?.profile?.fullName || data?.fullName || "Elevate Studio";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    return (
        <section id="contact" className="bg-accent text-bg py-20 px-6 md:px-10 relative overflow-hidden flex flex-col justify-between min-h-[80vh] z-20">
            <div className="relative z-10 mt-10">
                <p className="font-mono text-[10px] font-semibold tracking-[0.3em] uppercase mb-4">
                   <EditableText value={theme?.customTexts?.hf_contact_label || '04 / Start a project'} field="hf_contact_label" entity="appearance" isEditor={isEditor} as="span" />
                </p>
                <a href={`mailto:${userEmail}`} className="inline-block group magnetic-btn" data-cursor="SAY HI">
                    <h2 className="font-display text-[14vw] md:text-[11vw] font-bold uppercase leading-[0.8] tracking-tighter text-[#050505]">
                        <EditableText value={theme?.customTexts?.hf_contact_title || "Let's Talk"} field="hf_contact_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h2>
                    <div className="w-full h-2 bg-bg transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100 mt-4"></div>
                </a>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mt-24 pt-8 border-t border-bg/20 font-mono text-[10px] uppercase tracking-widest font-semibold gap-8 text-[#050505]">
                <div className="flex gap-8">
                    {links.map((link: any, idx: number) => (
                      <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="hover:underline magnetic-btn">{link.platform}</a>
                    ))}
                    {links.length === 0 && (
                      <>
                        <a href="#" className="hover:underline magnetic-btn">Twitter / X</a>
                        <a href="#" className="hover:underline magnetic-btn">Instagram</a>
                        <a href="#" className="hover:underline magnetic-btn">LinkedIn</a>
                      </>
                    )}
                </div>
                <div className="text-right flex flex-col items-end">
                    <p>{fullName} © {new Date().getFullYear()}</p>
                    <p className="text-bg/60 mt-2">portfo.be/{subdomain}</p>
                </div>
            </div>
        </section>
    );
}
