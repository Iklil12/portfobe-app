"use client";

import React from 'react';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/components/ui/EditableText';
import { useSplitScreenStudio } from './SplitScreenStudioContext';

export function SplitScreenStudioAboutBlock({ data, theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;
    const bio = data?.profile?.bio || data?.bio || "We believe that great design is not just how it looks, but how it feels and functions.";

    return (
        <ScrollBlock 
            bg="#050505" index="INT / 00" 
            tag={<EditableText entity="appearance" field="sss_intro_tag" value={getCustomText('sss_intro_tag', 'OVERVIEW')} isEditor={isEditor} maxLength={30} as="span" />} 
            title={
                <>
                    <EditableText entity="appearance" field="sss_intro_title1" value={getCustomText('sss_intro_title1', 'CRAFTING')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_intro_title2" value={getCustomText('sss_intro_title2', 'DIGITAL')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_intro_title3" value={getCustomText('sss_intro_title3', 'REALITIES.')} isEditor={isEditor} maxLength={20} as="span" />
                </>
            } 
            desc={<EditableText entity="profile" field="bio" value={bio} isEditor={isEditor} maxLength={200} as="span" />} 
        >
            {({ y }: any) => (
                <div className="h-[30vh] md:h-[50vh] flex items-center justify-center">
                    <p className="font-sans text-xl md:text-2xl font-light text-white/50 text-center max-w-md">
                        <EditableText entity="appearance" field="sss_intro_scroll_text" value={getCustomText('sss_intro_scroll_text', 'Scroll down to explore our selected archives, capabilities, and studio profile.')} isEditor={isEditor} maxLength={100} as="span" />
                    </p>
                </div>
            )}
        </ScrollBlock>
    );
}
