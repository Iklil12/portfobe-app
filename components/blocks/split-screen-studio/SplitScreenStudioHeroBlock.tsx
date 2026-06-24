"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { EditableText } from '@/shared/ui/EditableText';
import { useSplitScreenStudio } from './SplitScreenStudioContext';

const ScrambleText = ({ text, isHovered }: { text: string, isHovered?: boolean }) => {
    return (
        <span className="relative inline-flex items-center justify-center whitespace-nowrap">
            {text}
        </span>
    );
};

export function SplitScreenStudioHeroBlock({ data, theme, isEditor }: any) {
    const { activeSection, setCursorHovered } = useSplitScreenStudio();
    const [currentTime, setCurrentTime] = useState("00:00:00");

    const fullName = data?.profile?.fullName || data?.fullName || "Elevate Studio";
    const profession = data?.profile?.profession || data?.profession || "Independent Agency";
    const bio = data?.profile?.bio || data?.bio || "We believe that great design is not just how it looks, but how it feels and functions.";
    const location = data?.profile?.location || data?.location || "Indonesia";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    const [localCursorHovered, setLocalCursorHovered] = useState<boolean | string>(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        
        let interval: NodeJS.Timeout | null = null;
        if (!isEditor) {
            interval = setInterval(updateTime, 1000);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isEditor]);

    const handleMouseEnter = (val: string | boolean) => {
        setLocalCursorHovered(val);
        setCursorHovered(val);
    };

    const handleMouseLeave = () => {
        setLocalCursorHovered(false);
        setCursorHovered(false);
    };

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start gap-4">
                <div className="max-w-[50%] md:max-w-[60%] break-words">
                    <h2 className="font-display text-2xl font-bold uppercase tracking-wider leading-tight">
                        <EditableText entity="profile" field="fullName" value={fullName} isEditor={isEditor} maxLength={50} as="span" />
                    </h2>
                    <p className="font-sans text-xs text-white/50 mt-2 tracking-widest uppercase">
                        <EditableText entity="profile" field="profession" value={profession} isEditor={isEditor} maxLength={50} as="span" />
                    </p>
                </div>
                <div className="hidden md:flex gap-6 font-sans text-xs tracking-widest uppercase text-white/50 shrink-0">
                    <Link href="#works" className="hover:text-white transition-colors">
                        <EditableText entity="appearance" field="sss_nav_works" value={getCustomText('sss_nav_works', 'Works')} isEditor={isEditor} maxLength={20} as="span" />
                    </Link>
                    <Link href="#contact" className="hover:text-white transition-colors">
                        <EditableText entity="appearance" field="sss_nav_contact" value={getCustomText('sss_nav_contact', 'Contact')} isEditor={isEditor} maxLength={20} as="span" />
                    </Link>
                </div>
            </div>

            {/* Dynamic Content (Desktop) */}
            <div className="hidden md:block my-24 md:my-0">
                <div className="overflow-hidden mb-6 flex items-center gap-4">
                    <span className="font-sans text-[10px] tracking-[0.3em] text-white/50 border border-white/10 px-4 py-2 rounded-full transition-all">
                        {activeSection.index}
                    </span>
                    <span className="font-sans text-xs tracking-widest text-white/50 uppercase transition-all">
                        {activeSection.tag}
                    </span>
                </div>
                
                <AnimatePresence mode="wait">
                    <motion.h1 
                        key={activeSection.index as string}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.9] tracking-tight mb-6 break-words break-all"
                    >
                        {activeSection.title}
                    </motion.h1>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.p 
                        key={`desc-${activeSection.index as string}`}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                        className="font-sans text-white/50 max-w-sm leading-relaxed"
                    >
                        {activeSection.desc}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Mobile Header Override */}
            <div className="md:hidden mt-12 mb-20">
                <h1 className="font-display text-5xl font-bold uppercase leading-tight mb-4" dangerouslySetInnerHTML={{ __html: 'CRAFTING<br>DIGITAL<br>REALITIES.' }} />
                <p className="font-sans text-white/50 text-sm leading-relaxed">{bio}</p>
            </div>

            {/* Footer Info */}
            <div className="flex items-end justify-between border-t border-white/10 pt-8 mt-auto">
                <div className="font-sans text-[10px] tracking-widest text-white/50 uppercase flex flex-col gap-1">
                    <span>LOCAL TIME / <span className="text-white font-mono ml-1">{currentTime}</span></span>
                    <span>{location}</span>
                </div>
                <a href={`mailto:${userEmail}`} 
                   className="cursor-hover-target font-display text-lg hover:italic transition-all uppercase tracking-wider hidden md:block"
                   onMouseEnter={() => handleMouseEnter('talk')} onMouseLeave={handleMouseLeave}
                >
                    <ScrambleText text="LET'S TALK" isHovered={localCursorHovered === 'talk'} /> <i className="ph ph-arrow-down-right inline-block ml-1"></i>
                </a>
            </div>
        </>
    );
}
