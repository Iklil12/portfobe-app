"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};
const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export const AbsoluteNoirHeroBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const [isCopied, setIsCopied] = useState(false);

    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";
    const bio = data?.profile?.bio || data?.bio || "Creating clean, functional, and visually striking digital experiences with extreme attention to detail.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isEditor) return;
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const nameParts = fullName.toUpperCase().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'SYSTEM';

    return (
        <div className="w-full flex flex-col">
            {/* LOCKED MARQUEE */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={wireframeReveal} 
                className="w-full wire-border-b overflow-hidden bg-white text-black py-2 pt-8 @md:pt-2"
            >
                <div className="flex animate-ticker font-mono text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap w-max">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-8 px-4 pr-8">
                            <EditableText value={theme?.customTexts?.noir_ticker_title || 'PORTFO_BE V.2.0'} field="noir_ticker_title" entity="appearance" isEditor={isEditor} maxLength={25} className="!break-normal !whitespace-nowrap inline-block pointer-events-auto" />
                            <EditableText value={theme?.customTexts?.noir_ticker_status || '[ STATUS: ACTIVE ]'} field="noir_ticker_status" entity="appearance" isEditor={isEditor} maxLength={25} className="!break-normal !whitespace-nowrap inline-block pointer-events-auto" />
                            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={20} className="!break-normal !whitespace-nowrap inline-block pointer-events-auto" />
                            <EditableText value={theme?.customTexts?.noir_ticker_location || 'LOCATION: ID'} field="noir_ticker_location" entity="appearance" isEditor={isEditor} maxLength={20} className="!break-normal !whitespace-nowrap inline-block pointer-events-auto" />
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* HERO SECTION */}
            <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full flex flex-col @lg:flex-row wire-border-b bg-[#050505]">
                <div className="w-full @lg:w-8/12 flex flex-col">
                    <motion.div variants={wireframeReveal} className="p-6 @md:p-12 wire-border-b flex-1 flex flex-col justify-center overflow-hidden">
                        <h1 className="font-sans font-black text-[14cqw] @md:text-[12cqw] @lg:text-[8cqw] leading-[0.9] uppercase tracking-tighter break-words text-white">
                            <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                        </h1>
                        <h1 className="font-sans font-black text-[14cqw] @md:text-[12cqw] @lg:text-[8cqw] leading-[0.9] uppercase tracking-tighter break-words text-transparent" style={{ WebkitTextStroke: '2px white' }}>
                            <EditableText value={lastName || '.'} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                        </h1>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 @md:grid-cols-2">
                        <motion.div variants={wireframeReveal} className="p-6 wire-border-b @md:wire-border-b-0 @md:wire-border-r flex flex-col justify-between min-h-[200px] bg-[#050505]">
                            <span className="font-mono text-xs text-white/50 uppercase">
                                <EditableText value={theme?.customTexts?.noir_overview_label || '[ OVERVIEW ]'} field="noir_overview_label" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                            </span>
                            <div className="font-sans text-sm @md:text-base font-medium leading-relaxed mt-4 text-white">
                                <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="p" maxLength={250} />
                            </div>
                        </motion.div>
                        <motion.div variants={wireframeReveal} className="p-0 flex flex-col justify-end bg-[#050505]">
                            <button onClick={handleCopyEmail} className="w-full h-full min-h-[100px] hover-invert wire-border-t @md:wire-border-t-0 p-6 flex flex-col justify-between items-start group transition-colors text-white hover:text-black">
                                <span className="font-mono text-xs uppercase text-white/50 group-hover:text-black/50">
                                    <EditableText value={theme?.customTexts?.noir_contact_label || '[ CONTACT ]'} field="noir_contact_label" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                                </span>
                                <span className="font-sans text-2xl font-bold uppercase mt-4">
                                    {isCopied ? 'COPIED TO CLIPBOARD' : <EditableText value={theme?.customTexts?.noir_contact_button || 'INITIATE COMM'} field="noir_contact_button" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />}
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </div>

                <motion.div variants={wireframeReveal} className="w-full @lg:w-4/12 wire-border-t @lg:wire-border-t-0 @lg:wire-border-l flex flex-col bg-[#0a0a0a]">
                    <div className="p-4 wire-border-b flex justify-between font-mono text-[10px] uppercase text-white/50">
                        <EditableText value={theme?.customTexts?.noir_img_ref || 'IMG_REF_01'} field="noir_img_ref" entity="appearance" isEditor={isEditor} maxLength={15} as="span" />
                        <EditableText value={theme?.customTexts?.noir_img_res || 'HQ_RESOLUTION'} field="noir_img_res" entity="appearance" isEditor={isEditor} maxLength={15} as="span" />
                    </div>
                    <div className="w-full aspect-square @lg:aspect-auto @lg:flex-1 p-6 relative group overflow-hidden">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 z-10 pointer-events-none"></div>
                        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/20 z-10 pointer-events-none"></div>
                        {/* STRICT BLACK AND WHITE RULE APPLIED TO IMAGE */}
                        <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale-[100%] contrast-[1.4] brightness-90 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-4 wire-border-t font-mono text-xs text-center uppercase tracking-widest bg-white text-black font-bold">
                        <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={20} />
                    </div>
                </motion.div>
            </motion.section>
        </div>
    );
};
