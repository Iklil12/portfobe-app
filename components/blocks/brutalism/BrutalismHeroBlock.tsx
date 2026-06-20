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
            <span>⚡ <EditableText value={theme?.customTexts?.brutal_ticker_1 || 'SYSTEM: ONLINE'} field="brutal_ticker_1" entity="appearance" isEditor={isEditor} as="span" className="!whitespace-nowrap !break-normal inline-block" /></span>
            <span>✦ <EditableText value={theme?.customTexts?.brutal_ticker_2 || '[ DATA STREAM ACTIVE ]'} field="brutal_ticker_2" entity="appearance" isEditor={isEditor} as="span" className="!whitespace-nowrap !break-normal inline-block" /></span>
            <span>⚡ <EditableText value={theme?.customTexts?.brutal_ticker_3 || 'RAW OUTPUT'} field="brutal_ticker_3" entity="appearance" isEditor={isEditor} as="span" className="!whitespace-nowrap !break-normal inline-block" /></span>
            <span>✦ <EditableText value={profession.toUpperCase()} field="profession" entity="profile" isEditor={isEditor} as="span" className="!whitespace-nowrap !break-normal inline-block" /></span>
        </span>
    );

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-scanline {
                    animation: scanline 3s linear infinite;
                }
            `}} />
            <motion.header
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal}
                className={`w-full ${strokeWidth} border-t-0 border-x-0 bg-white ${!(isCardPreview || isEditor) ? 'sticky top-0 z-[100]' : 'relative z-10'}`}
            >
                {/* Ticker Tape Atas - Mengikuti Highlight Color */}
                <div className="w-full border-b-[3px] border-black overflow-hidden py-2 flex bg-[var(--hl)] text-black font-mono text-[10px] font-black uppercase tracking-widest group">
                    <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] w-max">
                        {[...Array(8)].map((_, i) => (
                            <MarqueeContent keyIndex={i} key={i} />
                        ))}
                    </div>
                </div>

                {/* Nav Bar Utama */}
                <div className="flex justify-between items-stretch border-b-[3px] border-black h-20 bg-white">
                    <div className="border-r-[3px] border-black flex items-center px-6 sm:px-8 gap-2 bg-neutral-50">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black animate-pulse"></span>
                        <h2 className="font-mono text-sm font-black uppercase tracking-widest">
                            <EditableText value={data?.profile?.firstName || fullName.split(' ')[0]} field="firstName" entity="profile" isEditor={isEditor} as="span" />
                        </h2>
                    </div>

                    <div className="hidden md:flex font-mono text-xs font-black uppercase">
                        <a href="#work" onClick={(e) => { if(isEditor) e.preventDefault(); }} className="px-8 border-r-[3px] border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-150">
                            [ <EditableText value={theme?.customTexts?.brutal_nav_work || 'WORK_LOG'} field="brutal_nav_work" entity="appearance" isEditor={isEditor} as="span" /> ]
                        </a>
                        <a href="#awards" onClick={(e) => { if(isEditor) e.preventDefault(); }} className="px-8 border-r-[3px] border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-150">
                            [ <EditableText value={theme?.customTexts?.brutal_nav_certs || 'CERTS'} field="brutal_nav_certs" entity="appearance" isEditor={isEditor} as="span" /> ]
                        </a>
                    </div>

                    <button
                        onClick={() => setIsContactOpen(!isContactOpen)}
                        className={`bg-black text-white font-mono text-xs sm:text-sm font-bold uppercase flex items-center justify-center hover:bg-[var(--hl)] hover:text-black transition-all duration-150 focus:outline-none px-6 sm:px-10 gap-2`}
                    >
                        <i className={`fas ${isContactOpen ? 'fa-times' : 'fa-terminal'} text-xs`}></i>
                        {isContactOpen ? 'CLOSE_X' : <EditableText value={theme?.customTexts?.brutal_nav_contact || 'COMMUNICATE'} field="brutal_nav_contact" entity="appearance" isEditor={isEditor} as="span" />}
                    </button>
                </div>

                {/* Dropdown Menu Kontak */}
                <div className={`w-full bg-[#f4f4f0] font-mono transition-all duration-300 origin-top overflow-hidden ${isContactOpen ? 'max-h-[500px] border-b-[3px] border-black' : 'max-h-0 border-t-0'}`}>
                    <div className="p-6 sm:p-10 flex flex-col md:flex-row gap-6 bg-[#ffff00] border-b-[3px] border-black">
                        <div className="flex-1 p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                            <span className="text-[10px] font-black bg-black text-white px-2 py-1 uppercase tracking-widest inline-block mb-4">DIRECT_LINE</span>
                            <a href={`mailto:${userEmail}`} onClick={(e) => { if(isEditor) e.preventDefault(); }} className="block text-lg sm:text-2xl font-black custom-heading hover:text-[#ff0055] hover:underline decoration-[3px] underline-offset-4 break-words">
                                &gt; {userEmail}
                            </a>
                        </div>
                        <div className="flex-1 p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                            <span className="text-[10px] font-black bg-black text-white px-2 py-1 uppercase tracking-widest inline-block mb-4">NETWORK_NODES</span>
                            <div className="flex flex-col gap-3">
                                {links.length > 0 ? links.map((l: any, i: number) => (
                                    <a key={i} href={l.url} target="_blank" rel="noreferrer" onClick={(e) => { if(isEditor) e.preventDefault(); }} className="text-sm font-bold uppercase hover:bg-black hover:text-white w-max px-2 py-0.5 transition-colors border border-transparent hover:border-black">
                                        -&gt; {l.platform}
                                    </a>
                                )) : <span className="text-xs text-gray-500">NO EXTERNAL LINKS.</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Layout Utama - Full Width Name Banner followed by Split Content */}
            <motion.section
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                className="w-full flex flex-col border-b-[3px] border-black bg-white"
            >
                {/* Banner Nama Raksasa (Full Width) */}
                <div className="border-b-[3px] border-black p-6 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative overflow-hidden">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
                    
                    <div className="relative">
                        <h1 className="custom-heading text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight text-black leading-none break-words relative z-10 select-none">
                            {fullName}
                        </h1>
                        <span aria-hidden="true" className="absolute left-1 top-1 sm:left-1.5 sm:top-1.5 text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight text-[var(--hl)] leading-none break-words select-none z-0 opacity-50">
                            {fullName}
                        </span>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2 items-center relative z-10">
                        <span className="font-mono text-xs font-black bg-[var(--hl)] text-black px-2 py-0.5 border-2 border-black uppercase">
                            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" />
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider hidden sm:inline">
                            // SECURE_NODE: {subdomain.toUpperCase()}.PORTFO.BE
                        </span>
                    </div>
                </div>

                {/* Split Row: Bio (Kiri) dan Operator ID Card (Kanan) */}
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    
                    {/* Kiri: Bio Raksasa & CTAs */}
                    <div className="col-span-1 lg:col-span-8 p-6 sm:p-12 flex flex-col justify-between border-b-[3px] border-black lg:border-b-0 lg:border-r-[3px] border-black bg-white">
                        <div className="max-w-3xl">
                            {/* Meta status info */}
                            <div className="mb-6 font-mono text-[9px] sm:text-xs font-bold uppercase border-l-[4px] border-[var(--hl)] pl-4 text-slate-500 select-none">
                                NODE_STATUS // <span className="text-[var(--hl)] font-black">ACTIVE // OPERATIONAL</span> <br />
                                DATABASE_FEED // CONNECTION_ESTABLISHED
                            </div>

                            <p className="custom-body font-mono text-lg sm:text-2xl font-black uppercase leading-tight text-black/90 mb-10 max-w-2xl">
                                <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" />
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 relative z-10 mt-8">
                            <button onClick={() => setIsContactOpen(true)} className={`group flex-1 sm:flex-none font-mono text-xs sm:text-sm font-black bg-[var(--hl)] text-black px-8 py-5 border-[3px] border-black ${hardShadow} ${hardShadowHover} ${radiusClass} flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors duration-200`}>
                                <EditableText value={theme?.customTexts?.brutal_hero_cta1 || 'INITIATE_CONTACT'} field="brutal_hero_cta1" entity="appearance" isEditor={isEditor} as="span" />
                                <span className="font-bold transform group-hover:translate-x-1 transition-transform duration-150">→</span>
                            </button>
                            <a href="#work" onClick={(e) => { if(isEditor) e.preventDefault(); }} className={`flex-1 sm:flex-none font-mono text-xs sm:text-sm font-black bg-white text-black px-8 py-5 border-[3px] border-black ${hardShadow} ${hardShadowHover} text-center flex items-center justify-center gap-2 ${radiusClass} hover:bg-[var(--hl)] transition-colors duration-200`}>
                                <EditableText value={theme?.customTexts?.brutal_hero_cta2 || 'EXPLORE_WORK'} field="brutal_hero_cta2" entity="appearance" isEditor={isEditor} as="span" />
                            </a>
                        </div>
                    </div>

                    {/* Kanan: Operator ID Card Floating Widget */}
                    <div className="col-span-1 lg:col-span-4 p-8 sm:p-12 bg-[var(--hl)] flex items-center justify-center min-h-[360px] relative overflow-hidden">
                        {/* Half-tone dots pattern */}
                        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2.5px, transparent 3px)', backgroundSize: '12px 12px' }}></div>

                        {/* ID Card Widget */}
                        <div className="w-full max-w-[280px] border-[3px] border-black bg-white p-5 shadow-[8px_8px_0_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0_0_#000] transition-all relative group cursor-pointer">
                            {/* Sticker Authorized */}
                            <div className="absolute -top-3 -left-3 bg-red-500 text-white font-black font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border-2 border-black rotate-[-12deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20 group-hover:rotate-[-6deg] transition-transform select-none">
                                APPROVED_OP
                            </div>

                            {/* Card Header */}
                            <div className="border-b-2 border-black pb-2 mb-4 flex justify-between items-center text-[8px] font-black font-mono text-slate-500 uppercase tracking-widest">
                                <span>OPERATOR_PASS</span>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-black"></span>
                            </div>

                            {/* Avatar Frame */}
                            <div className="w-full aspect-square border-[3px] border-black overflow-hidden bg-gray-200 relative">
                                <LazyImage
                                    src={displayAvatar}
                                    className="w-full h-full object-cover grayscale contrast-125 mix-blend-multiply opacity-90 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-300"
                                    alt="Profile ID"
                                />
                                {/* Cyber Scanline overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--hl)]/30 to-transparent w-full h-[200%] -translate-y-1/2 animate-scanline pointer-events-none z-10"></div>
                            </div>

                            {/* Barcode & ID Details */}
                            <div className="mt-4 flex items-center justify-between font-mono text-[9px] text-slate-500 border-t border-dashed border-black/20 pt-3">
                                <div className="flex flex-col">
                                    <span className="font-bold text-black uppercase">{fullName.split(' ')[0]}</span>
                                    <span>ID // {subdomain.toUpperCase()}</span>
                                </div>
                                {/* Simulated Barcode */}
                                <div className="flex items-stretch h-6 gap-[2px] bg-black p-[2px] border border-black">
                                    <div className="w-[3px] bg-white"></div>
                                    <div className="w-[1px] bg-white"></div>
                                    <div className="w-[4px] bg-white"></div>
                                    <div className="w-[2px] bg-white"></div>
                                    <div className="w-[1px] bg-white"></div>
                                    <div className="w-[5px] bg-white"></div>
                                    <div className="w-[2px] bg-white"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </motion.section>
        </>
    );
}
