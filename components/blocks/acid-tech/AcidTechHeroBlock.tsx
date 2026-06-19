"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const profession = data?.profile?.profession || data?.profession || "Creative Director";
    const bio = data?.profile?.bio || data?.bio || "Forging high-octane visual experiences. Editing raw footage into pure adrenaline.";
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const displayAvatar = (rawAvatar.replace(/"/g, '').trim() !== "" && rawAvatar !== "null") ? rawAvatar.replace(/"/g, '').trim() : `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop`;

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const [sysTime, setSysTime] = useState("14:35:00 UTC");
    const [selectedTab, setSelectedTab] = useState("profile.log");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setSysTime(now.toISOString().replace('T', ' ').substring(0, 19) + " UTC");
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };
    const scaleUp = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: acidEase } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    return (
        <header className="relative min-h-screen flex flex-col justify-center pt-12 pb-16 overflow-hidden bg-black text-white font-mono" style={{ '--tc': themeColor } as React.CSSProperties}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan-anim {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .glow-text-acid {
                    text-shadow: 0 0 1px var(--tc), 0 0 8px var(--tc), 0 0 20px rgba(0, 255, 0, 0.2);
                }
                .glow-border-acid {
                    box-shadow: 0 0 15px rgba(0, 255, 0, 0.1);
                }
                .crt-grid {
                    background: linear-gradient(rgba(0, 255, 0, 0.02) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0, 255, 0, 0.02) 1px, transparent 1px);
                    background-size: 24px 24px;
                }
                @keyframes blink-cursor {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
                .blink {
                    animation: blink-cursor 1s infinite;
                }
            `}} />

            {/* Retro Green Grid & Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-0 crt-grid" />
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]"
                style={{
                    backgroundImage: `repeating-linear-gradient(0deg, ${themeColor}, ${themeColor} 2px, transparent 2px, transparent 4px)`
                }}
            />

            <motion.div
                initial="hidden"
                {...{ [animationTrigger]: "visible" }}
                viewport={{ once: true, amount: 0 }}
                variants={staggerContainer}
                className="px-6 md:px-16 relative z-10 flex flex-col items-start mt-2 w-full max-w-[90rem] mx-auto"
            >
                {/* Available for Projects Badge & Status Info */}
                <motion.div
                    variants={fadeUp}
                    className="mt-0 flex flex-wrap items-center gap-4 mb-8"
                >
                    <div className="border border-[var(--tc)] bg-[var(--tc)]/5 text-[var(--tc)] px-4 py-1.5 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] inline-block glow-border-acid">
                        [ <EditableText value={theme?.customTexts?.acid_hero_badge || 'Available for New Projects'} field="acid_hero_badge" entity="appearance" isEditor={isEditor} as="span" /> ]
                    </div>
                    <div className="text-zinc-600 text-[10px] uppercase tracking-widest hidden md:inline-block">
                        SYS_STATUS: <span className="text-[var(--tc)]">ONLINE</span> // TARGET_NODE: SECURE
                    </div>
                </motion.div>

                {/* Main Asymmetric HUD Grid Layout */}
                <div className="flex flex-col lg:flex-row w-full justify-between items-stretch gap-12 lg:gap-16">

                    {/* Left Panel: Content / Headers */}
                    <div className="w-full lg:max-w-[65%] flex flex-col items-start justify-between flex-1">

                        {/* IDE / Console tab bar header */}
                        <div className="w-full flex items-end justify-between border-b border-zinc-900 pr-4">
                            <div className="flex gap-1">
                                {["profile.log", "skills.sys", "config.env"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        className={`px-4 py-2 text-[9px] uppercase tracking-wider font-mono border-t border-x transition-all ${selectedTab === tab
                                            ? "bg-black border-[var(--tc)]/30 text-[var(--tc)] border-b-black translate-y-[1px] z-15 font-bold"
                                            : "bg-transparent border-transparent text-zinc-600 hover:text-zinc-400 border-b-transparent"
                                            }`}
                                    >
                                        📄 {tab}
                                    </button>
                                ))}
                            </div>
                            <span className="text-[9px] text-zinc-600 tracking-widest hidden sm:inline uppercase">
                                PORT: 8080 // LOC: IND_W_NODE
                            </span>
                        </div>

                        {/* Text Container with HUD-style neon decoration */}
                        <div className="w-full border border-zinc-900 border-t-0 p-6 md:p-10 bg-zinc-950/20 backdrop-blur-sm relative min-h-[380px] flex flex-col justify-between">
                            {/* Technical Crop Crosshairs at Corners */}
                            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[var(--tc)]/40"></div>
                            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[var(--tc)]/40"></div>
                            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[var(--tc)]/40"></div>
                            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[var(--tc)]/40"></div>

                            {/* Simulated active typing prompt line */}
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mb-4">
                                <span className="text-[var(--tc)] font-bold">visitor@iklikul.be:~$</span>
                                <span>cat {selectedTab}</span>
                                <span className="w-1.5 h-3.5 bg-[var(--tc)] blink inline-block"></span>
                            </div>

                            {/* Dynamic Panel Content based on selected Tab */}
                            <div className="flex-1 flex flex-col justify-center my-6">
                                {selectedTab === "profile.log" && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h1 className="font-extrabold uppercase tracking-tight text-[var(--tc)] mb-6 leading-[0.85] text-5xl md:text-[clamp(3.5rem,7cqi,6.5rem)] glow-text-acid">
                                            <EditableText value={firstName} field="fullName" entity="profile" isEditor={isEditor} as="span" />
                                            <br />
                                            <span
                                                className="text-transparent mt-2 inline-block"
                                                style={{ WebkitTextStroke: `1.5px ${themeColor}` }}
                                            >
                                                <EditableText value={lastName || profession} field="profession" entity="profile" isEditor={isEditor} as="span" />
                                            </span>
                                        </h1>
                                    </motion.div>
                                )}

                                {selectedTab === "skills.sys" && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2 flex flex-col gap-3 max-w-lg">
                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-[0.2em]">// INITIALIZE_KEY_CAPABILITIES</span>
                                        <div className="flex flex-col gap-2 font-mono text-xs text-zinc-400 mt-2">
                                            <div className="flex justify-between border-b border-zinc-900 pb-1">
                                                <span>&gt; INTERFACE_DEV :</span>
                                                <span className="text-[var(--tc)] font-bold">95% [STABLE]</span>
                                            </div>
                                            <div className="flex justify-between border-b border-zinc-900 pb-1">
                                                <span>&gt; DATABASE_PRISMA :</span>
                                                <span className="text-[var(--tc)] font-bold">90% [OPTIMIZED]</span>
                                            </div>
                                            <div className="flex justify-between border-b border-zinc-900 pb-1">
                                                <span>&gt; CLOUD_ARCHITECTURE :</span>
                                                <span className="text-[var(--tc)] font-bold">85% [COMPLIANT]</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {selectedTab === "config.env" && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs text-zinc-500 flex flex-col gap-1.5 py-2">
                                        <div>ENV_PRODUCTION=true</div>
                                        <div>CLIENT_KEY=AUTH_TOKEN_0x82f</div>
                                        <div>THEME_ACCENT_HEX={themeColor}</div>
                                        <div className="text-[var(--tc)]">FRAMEWORK_CORE=NEXT.JS_16.2.4_TURBOPACK</div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="w-full h-[1px] bg-[var(--tc)]/10 my-4" />

                            {/* Bio Description / Specs Panel */}
                            <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                                <p className="text-zinc-400 font-medium leading-relaxed text-xs md:text-sm max-w-xl">
                                    <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" />
                                </p>

                                {/* System specs log */}
                                <div className="flex flex-col gap-1.5 font-mono text-[9px] text-[var(--tc)]/65 uppercase tracking-wider shrink-0 md:border-l border-[var(--tc)]/20 md:pl-4 mt-4 md:mt-0">
                                    <div>[ SYSTEM_META ]</div>
                                    <div>NAME: {fullName}</div>
                                    <div>ROLE: {profession}</div>
                                    <div>TIME: {sysTime}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Hacker Camera / Avatar Box */}
                    <motion.div
                        variants={scaleUp}
                        className="w-full md:max-w-[340px] lg:max-w-[30%] mx-auto lg:mx-0 relative z-30 select-none shrink-0 flex flex-col justify-end"
                    >
                        {/* Shadow offsets */}
                        <div className="absolute inset-0 bg-black border border-[var(--tc)]/30 transform translate-x-3 translate-y-3 -z-20"></div>
                        <div className="absolute inset-0 bg-[var(--tc)]/5 transform translate-x-1.5 translate-y-1.5 -z-10 opacity-60"></div>

                        {/* Terminal Style Screen container */}
                        <div className="w-full aspect-[3/4] overflow-hidden bg-black border border-[var(--tc)]/30 hover:border-[var(--tc)] transition-all duration-300 relative flex flex-col shadow-[0_0_20px_rgba(0,255,0,0.05)]">
                            {/* Screen Header */}
                            <div className="bg-zinc-950 border-b border-zinc-900 px-3 py-2 flex justify-between items-center text-[9px] text-[var(--tc)] font-bold">
                                <span>[ MONITOR // FEED_01 ]</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                                    <span className="text-red-500">LIVE</span>
                                </div>
                            </div>

                            {/* Camera Area */}
                            <div className="relative flex-1 bg-zinc-950 overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
                                {/* Scanline active bar */}
                                <div
                                    className="absolute left-0 right-0 h-[2px] bg-[var(--tc)] opacity-60 z-20 pointer-events-none"
                                    style={{
                                        animation: 'scan-anim 3.5s linear infinite'
                                    }}
                                />

                                {/* Camera Target Node brackets */}
                                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[var(--tc)]/50 z-10 pointer-events-none"></div>
                                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[var(--tc)]/50 z-10 pointer-events-none"></div>
                                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[var(--tc)]/50 z-10 pointer-events-none"></div>
                                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[var(--tc)]/50 z-10 pointer-events-none"></div>

                                {/* Crosshair */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none z-10">
                                    <div className="w-10 h-10 border border-[var(--tc)] rounded-full flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-[var(--tc)] rounded-full"></div>
                                    </div>
                                    <div className="absolute w-12 h-[1px] bg-[var(--tc)]" />
                                    <div className="absolute h-12 w-[1px] bg-[var(--tc)]" />
                                </div>

                                <LazyImage src={displayAvatar} alt="Camera Feed" className="w-full h-full object-cover" />
                            </div>

                            {/* Screen Footer */}
                            <div className="bg-zinc-950 border-t border-zinc-900 px-3 py-1.5 flex justify-between items-center text-[8px] text-zinc-600">
                                <span>COORD: 08.19//2X</span>
                                <span>FPS: 60.00</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Hacker Log & Actions Bar */}
                <motion.div
                    variants={fadeUp}
                    className="flex flex-col lg:flex-row w-full mt-12 pt-8 border-t border-zinc-900 justify-between items-stretch gap-6"
                >
                    {/* Console matrix metrics */}
                    <div className="flex-1 bg-zinc-950/40 border border-zinc-900 p-4 text-[9px] text-zinc-500 gap-2 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-[var(--tc)]/5 text-[var(--tc)] font-bold text-[7px] border-b border-l border-zinc-900 uppercase">SYS_LOG</div>
                        <div className="font-bold">// CORE DIAGNOSTICS //</div>
                        <div className="flex items-center gap-2">
                            <span>CORE_01:</span>
                            <span className="text-[var(--tc)] bg-[var(--tc)]/10 px-1 border border-[var(--tc)]/20 font-mono">■■■■■■■■■□ 90%</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600">
                            <span>CORE_02:</span>
                            <span>■■■■□□□□□□ 40%</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col md:flex-row gap-4 items-center shrink-0 justify-center">
                        {links.length > 0 ? links.map((l: any, i: number) => (
                            <a
                                key={i} href={l.url} target="_blank" rel="noreferrer"
                                className="w-full md:w-auto text-center px-6 py-3 border border-[var(--tc)]/40 hover:border-[var(--tc)] bg-black text-[var(--tc)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--tc)] hover:text-black transition-all duration-300 shadow-[4px_4px_0px_rgba(0,255,0,0.05)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                            >
                                &gt; EXECUTE_{l.platform.toUpperCase()}()
                            </a>
                        )) : (
                            <div className="text-[var(--tc)]/40 font-bold text-xs uppercase tracking-widest">[ NO_LINK_FOUND ]</div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </header>
    );
}
