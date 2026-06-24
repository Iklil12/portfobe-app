"use client";

import React from 'react';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/shared/ui/EditableText';
import { useSplitScreenStudio } from './SplitScreenStudioContext';

const ScrambleText = ({ text, isHovered }: { text: string, isHovered?: boolean }) => {
    return (
        <span className="relative inline-flex items-center justify-center whitespace-nowrap">
            {text}
        </span>
    );
};

export function SplitScreenStudioFooterBlock({ data, theme, isEditor }: any) {
    const { cursorHovered, setCursorHovered } = useSplitScreenStudio();
    
    const fullName = data?.profile?.fullName || data?.fullName || "Elevate Studio";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <ScrollBlock 
            bg="#020202" index="END / 06" 
            tag={<EditableText entity="appearance" field="sss_contact_tag" value={getCustomText('sss_contact_tag', 'CONTACT')} isEditor={isEditor} maxLength={30} as="span" />} 
            title={
                <>
                    <EditableText entity="appearance" field="sss_contact_title1" value={getCustomText('sss_contact_title1', 'LET\'S')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_contact_title2" value={getCustomText('sss_contact_title2', 'COLLABORATE.')} isEditor={isEditor} maxLength={20} as="span" />
                </>
            } 
            desc={<EditableText entity="appearance" field="sss_contact_desc" value={getCustomText('sss_contact_desc', 'We are currently taking on new projects. Reach out to discuss your next digital venture.')} isEditor={isEditor} maxLength={200} as="span" />}
        >
            {({ y }: any) => (
                <div id="contact" className="flex flex-col items-start justify-center min-h-[50vh]">
                    <p className="font-sans text-white/50 mb-4 tracking-widest text-[10px] uppercase break-words">
                        <EditableText entity="appearance" field="sss_contact_pre_title" value={getCustomText('sss_contact_pre_title', 'Got an idea?')} isEditor={isEditor} maxLength={40} as="span" />
                    </p>
                    <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold uppercase mb-12 hover:italic transition-all cursor-hover-target" style={{ lineHeight: 0.85 }} onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)}>
                        <EditableText entity="appearance" field="sss_contact_main1" value={getCustomText('sss_contact_main1', 'START A')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                        <EditableText entity="appearance" field="sss_contact_main2" value={getCustomText('sss_contact_main2', 'PROJECT.')} isEditor={isEditor} maxLength={20} as="span" />
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 mt-8">
                        <a href={`mailto:${userEmail}`} 
                           className="cursor-hover-target flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 font-display uppercase tracking-widest text-xs font-bold"
                           onMouseEnter={() => setCursorHovered('email')} onMouseLeave={() => setCursorHovered(false)}
                        >
                            <ScrambleText text="EMAIL US" isHovered={cursorHovered === 'email'} />
                        </a>
                        {links.map((l: any, i: number) => (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer" 
                               className="cursor-hover-target flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 font-display uppercase tracking-widest text-xs font-bold"
                               onMouseEnter={() => setCursorHovered(`link_${i}`)} onMouseLeave={() => setCursorHovered(false)}
                            >
                                <ScrambleText text={l.platform} isHovered={cursorHovered === `link_${i}`} />
                            </a>
                        ))}
                    </div>

                    <div className="mt-32 w-full flex justify-between items-end border-t border-white/10 pt-8 font-sans text-[10px] text-white/30 uppercase tracking-widest">
                        <span>©{new Date().getFullYear()} {fullName.toUpperCase()}.</span>
                        <span className="break-words max-w-full"><EditableText entity="appearance" field="sss_contact_rights" value={getCustomText('sss_contact_rights', 'ALL RIGHTS RESERVED.')} isEditor={isEditor} maxLength={50} as="span" /></span>
                    </div>
                </div>
            )}
        </ScrollBlock>
    );
}
