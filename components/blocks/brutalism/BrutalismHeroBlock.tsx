"use client";

import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { strokeWidth, hardShadow, hardShadowHover, radiusClass } = useContext(BrutalismContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const [isContactOpen, setIsContactOpen] = useState(false);

    const fullName = data?.profile?.fullName || data?.fullName || "JOHN DOE";
    const profession = data?.profile?.profession || data?.profession || "SYSTEM ARCHITECT";
    const bio = data?.profile?.bio || data?.bio || "Executing raw logic into brutal visual experiences. Unapologetic design systems.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `connect@${subdomain}.net`;
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=000000&textColor=ffffff`;

    const brutalEase = [0, 0, 0, 1] as any;

    const MarqueeContent = ({ keyIndex }: { keyIndex?: number }) => (
        <span key={keyIndex} className="flex items-center gap-8 px-4 pr-8">
            <span><EditableText value={theme?.customTexts?.brutal_ticker_1 || 'SYSTEM: ONLINE'} field="brutal_ticker_1" entity="appearance" isEditor={isEditor} as="span" className="!whitespace-nowrap !break-normal inline-block" /></span>
            <span><EditableText value={theme?.customTexts?.brutal_ticker_2 || '[ DATA STREAM ACTIVE ]'} field="brutal_ticker_2" entity="appearance" isEditor={isEditor} as="span" className="!whitespace-nowrap !break-normal inline-block" /></span>
            <span><EditableText value={theme?.customTexts?.brutal_ticker_3 || 'RAW OUTPUT'} field="brutal_ticker_3" entity="appearance" isEditor={isEditor} as="span" className="!whitespace-nowrap !break-normal inline-block" /></span>
            <span><EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" className="!whitespace-nowrap !break-normal inline-block" /></span>
        </span>
    );

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    const slideInHard = {
        hidden: { x: -40, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: brutalEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    return (
        <>
            <motion.header
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal}
                className={`w-full ${strokeWidth} border-t-0 border-x-0 bg-white ${!(isCardPreview || isEditor) ? 'sticky top-0 z-[100]' : 'relative z-10'}`}
            >
                {/* Ticker Tape Atas */}
                <div className={`w-full border-b-[3px] border-black overflow-hidden py-1 flex bg-[var(--hl)] text-black font-mono text-[10px] font-black uppercase tracking-widest group`}>
                    <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] w-max">
                        {[...Array(8)].map((_, i) => (
                            <MarqueeContent keyIndex={i} key={i} />
                        ))}
                    </div>
                </div>

                {/* Nav Bar Utama */}
                <div className="flex justify-between items-stretch">
                    <div className={`flex-1 border-r-[3px] border-black flex items-center bg-white ${'p-4 @sm:p-6'}`}>
                        <h2 className={"custom-heading text-lg @sm:text-2xl font-black uppercase tracking-tighter leading-none"}>
                            <EditableText value={data?.profile?.firstName || fullName.split(' ')[0]} field="firstName" entity="profile" isEditor={isEditor} as="span" className="!break-normal inline-block" /> <br /> 
                            <EditableText value={data?.profile?.lastName || (fullName.split(' ').length > 1 ? fullName.split(' ').slice(1).join(' ') : 'SYSTEM')} field="lastName" entity="profile" isEditor={isEditor} as="span" className="!break-normal inline-block" />
                        </h2>
                    </div>

                    <div className={`hidden ${'@md:flex'} font-mono text-xs font-bold uppercase`}>
                        <a href="#work" onClick={(e) => { if(isEditor) e.preventDefault(); }} className="px-8 border-r-[3px] border-black flex items-center justify-center brutal-hover-invert transition-none">
                            [ <EditableText value={theme?.customTexts?.brutal_nav_work || 'WORK_LOG'} field="brutal_nav_work" entity="appearance" isEditor={isEditor} as="span" /> ]
                        </a>
                        <a href="#awards" onClick={(e) => { if(isEditor) e.preventDefault(); }} className="px-8 border-r-[3px] border-black flex items-center justify-center brutal-hover-invert transition-none">
                            [ <EditableText value={theme?.customTexts?.brutal_nav_certs || 'CERTS'} field="brutal_nav_certs" entity="appearance" isEditor={isEditor} as="span" /> ]
                        </a>
                    </div>

                    <button
                        onClick={() => setIsContactOpen(!isContactOpen)}
                        className={`bg-black text-white font-mono text-xs @sm:text-sm font-bold uppercase flex items-center justify-center hover:bg-[var(--hl)] hover:text-black transition-none focus:outline-none px-6 @sm:px-10 ${radiusClass}`}
                    >
                        {isContactOpen ? 'CLOSE_X' : <EditableText value={theme?.customTexts?.brutal_nav_contact || 'COMMUNICATE'} field="brutal_nav_contact" entity="appearance" isEditor={isEditor} as="span" />}
                    </button>
                </div>

                {/* Dropdown Menu Kontak */}
                <div className={`w-full border-t-[3px] border-black bg-[#f4f4f0] font-mono transition-all duration-300 origin-top overflow-hidden ${isContactOpen ? 'max-h-[500px]' : 'max-h-0 border-t-0'}`}>
                    <div className={`p-6 ${'@sm:p-10'} flex flex-col ${'@md:flex-row'} gap-10`}>
                        <div className="flex-1">
                            <span className="text-[10px] font-bold bg-black text-white px-2 py-1 uppercase tracking-widest inline-block mb-4">DIRECT_LINE</span>
                            <a href={`mailto:${userEmail}`} onClick={(e) => { if(isEditor) e.preventDefault(); }} className={"block text-2xl @sm:text-4xl font-black custom-heading hover:text-[var(--hl)] hover:underline decoration-[3px] underline-offset-4 break-words"}>
                                {userEmail}
                            </a>
                        </div>
                        <div className="flex-1">
                            <span className="text-[10px] font-bold bg-black text-white px-2 py-1 uppercase tracking-widest inline-block mb-4">NETWORK_LINKS</span>
                            <div className="flex flex-col gap-2">
                                {links.length > 0 ? links.map((l: any, i: number) => (
                                    <a key={i} href={l.url} target="_blank" rel="noreferrer" onClick={(e) => { if(isEditor) e.preventDefault(); }} className="text-sm @sm:text-base font-bold uppercase hover:bg-black hover:text-white w-max px-2 transition-none">
                                        -&gt; {l.platform}
                                    </a>
                                )) : <span className="text-xs text-gray-500">NO EXTERNAL NODES.</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            <motion.section
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                className={`w-full grid grid-cols-1 ${'@md:grid-cols-12'} border-b-[3px] border-black`}
            >
                {/* Kiri: Avatar & Tagline */}
                <div className={`col-span-1 @md:col-span-4 border-b-[3px] border-black @md:border-b-0 @md:border-r-[3px] flex flex-col`}>
                    <motion.div variants={starkReveal} className={"w-full aspect-square border-b-[3px] border-black bg-gray-200 relative overflow-hidden group p-4 @sm:p-8 bg-[#f4f4f0]"}>
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '15px 15px' }}></div>
                        <LazyImage
                            src={displayAvatar}
                            className={`w-full h-full object-cover grayscale contrast-150 border-[3px] border-black ${hardShadow} ${radiusClass} transition-transform duration-300 group-hover:scale-[1.02] bg-white`}
                            alt="Profile"
                        />
                    </motion.div>
                    <div className="p-6 bg-[var(--hl)] text-black font-mono flex-1">
                        <motion.p variants={slideInHard} className={"text-xl @sm:text-2xl font-black uppercase leading-tight custom-heading"}>
                            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" />
                        </motion.p>
                    </div>
                </div>

                {/* Kanan: Bio Raksasa */}
                <div className={`col-span-1 @md:col-span-8 p-4 @sm:p-12 @lg:p-20 flex flex-col justify-center bg-white`}>
                    <motion.div variants={starkReveal} className={"mb-4 font-mono text-[9px] @sm:text-xs font-bold uppercase border-l-[3px] border-black pl-4 pointer-events-none"}>
                        ID // <EditableText value={subdomain.toUpperCase()} field="subdomain" entity="profile" isEditor={isEditor} as="span" className="pointer-events-auto" /> <br />
                        STATUS // OPERATIONAL
                    </motion.div>

                    <motion.h1 variants={starkReveal} className={"custom-heading text-sm @sm:text-lg @md:text-[1.1cqi] font-bold uppercase leading-normal tracking-tight mb-8 break-words text-left"}>
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" />
                    </motion.h1>

                    <motion.div variants={starkReveal} className="flex flex-wrap gap-4">
                        <button onClick={() => setIsContactOpen(true)} className={`flex-1 @sm:flex-none font-mono text-xs @sm:text-sm font-bold bg-black text-white px-8 py-4 border-[3px] border-black ${hardShadow} ${hardShadowHover} ${radiusClass}`}>
                            <EditableText value={theme?.customTexts?.brutal_hero_cta1 || 'INITIATE'} field="brutal_hero_cta1" entity="appearance" isEditor={isEditor} as="span" />
                        </button>
                        <a href="#work" onClick={(e) => { if(isEditor) e.preventDefault(); }} className={`flex-1 @sm:flex-none font-mono text-xs @sm:text-sm font-bold bg-white text-black px-8 py-4 border-[3px] border-black ${hardShadow} ${hardShadowHover} text-center flex items-center justify-center ${radiusClass}`}>
                            <EditableText value={theme?.customTexts?.brutal_hero_cta2 || 'SCROLL ↓'} field="brutal_hero_cta2" entity="appearance" isEditor={isEditor} as="span" />
                        </a>
                    </motion.div>
                </div>
            </motion.section>
        </>
    );
}
