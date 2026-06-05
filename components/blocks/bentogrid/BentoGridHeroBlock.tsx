"use client";

import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { BentoGridContext } from './BentoGridShell';

export function BentoGridHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { highlightColor } = useContext(BentoGridContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const [isCopied, setIsCopied] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    // Update Jam Real-Time
    useEffect(() => {
        if (isCardPreview || isEditor) return; // Skip interval di card preview untuk mencegah re-render terus menerus
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [isCardPreview, isEditor]);

    // Data Parsing
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const firstName = fullName.split(' ')[0];
    const profession = data?.profile?.profession || data?.profession || "Software Engineer & UI/UX Enthusiast";
    const bio = data?.profile?.bio || data?.bio || "Mengubah ide rumit menjadi antarmuka elegan dan pengalaman digital yang tak terlupakan.";
    const location = data?.profile?.location || data?.location || "Indonesia";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d');
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    const githubLink = links.find((l: any) => l.platform.toLowerCase().includes('github'));
    const linkedinLink = links.find((l: any) => l.platform.toLowerCase().includes('linkedin'));

    // Theme Setup
    const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 w-full">
            {/* HERO CARD */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col justify-between p-8 @lg:p-12 @lg:col-span-3 @lg:row-span-3`}
            >
                <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] blur-[120px] rounded-full mix-blend-screen pointer-events-none opacity-30 @container" style={{ backgroundColor: highlightColor }}></div>

                {/* Identitas Atas */}
                <div className="relative z-10 flex flex-col mt-2 @lg:mt-8">
                    <h1 className={`font-black tracking-tighter text-white uppercase text-[5rem] @md:text-[8rem] @lg:text-[10rem] leading-[0.8] mb-2`}>
                        <EditableText value={firstName} field="fullName" entity="profile" isEditor={isEditor} />
                    </h1>
                    <h2 className={`font-extrabold tracking-tight text-transparent bg-clip-text text-3xl @md:text-5xl @lg:text-6xl mb-6`} style={{ backgroundImage: `linear-gradient(to right, ${highlightColor}, #ffffff)` }}>
                        <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} />
                    </h2>
                    <p className={`text-slate-400 font-medium leading-relaxed max-w-2xl text-base @lg:text-xl mt-4`}>
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" />
                    </p>
                </div>

                {/* Interaksi Bawah */}
                <div className={`relative z-10 flex w-full flex-row gap-4 mt-16`}>
                    <div onClick={handleCopyEmail} className={`flex-1 bg-[#1a1a1d] hover:bg-[#222226] border border-white/5 flex items-center gap-3 @md:gap-4 cursor-pointer transition-colors group shadow-lg ${radiusClass} p-2 pr-6`}>
                        <div className={`${radiusClass} bg-black/50 flex shrink-0 items-center justify-center group-hover:bg-[var(--hl)] group-hover:text-black transition-colors w-12 h-12`}>
                            <i className={`fas ${isCopied ? 'fa-check' : 'fa-paper-plane'} text-lg`}></i>
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden pointer-events-none">
                            <span className={`text-slate-500 font-bold uppercase tracking-widest leading-none text-[10px] mb-1.5`}>
                                <EditableText value={theme?.customTexts?.bento_hero_send || 'Send a Message'} field="bento_hero_send" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                            </span>
                            <span className={`font-bold text-white truncate leading-none group-hover:text-[var(--hl)] transition-colors text-sm @md:text-base`}>
                                {isCopied ? 'Copied to clipboard!' : userEmail}
                            </span>
                        </div>
                    </div>

                    <div className={`bg-[#1a1a1d] border border-white/5 flex flex-col justify-center shadow-lg relative overflow-hidden @sm:w-1/3 ${radiusClass} p-2 px-6 items-center text-center`}>
                        <i className={`fas fa-globe-asia absolute text-white/5 pointer-events-none -right-2 -bottom-4 text-5xl`}></i>
                        <div className={`flex z-10 w-full flex-col items-center pointer-events-none`}>
                            <span className={`text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1`}>
                                <EditableText value={location} field="location" entity="profile" isEditor={isEditor} as="span" className="pointer-events-auto" />
                            </span>
                            <span className={`font-bold text-white text-sm @md:text-base`}>{currentTime || "00:00"}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* AVATAR BOX */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card p-2 relative group @lg:col-span-1 @lg:row-span-3`}
            >
                <div className="w-full h-full rounded-[24px] overflow-hidden relative bg-[#1a1a1d]">
                    <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>
            </motion.div>

        </div>
    );
}
