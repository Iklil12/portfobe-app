"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function CinematicHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const profession = data?.profile?.profession || data?.profession || "Director & Editor";
    const bio = data?.profile?.bio || data?.bio || "Transforming raw vision into cinematic reality. Specializing in high-end commercials and visual storytelling.";
    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const displayAvatar = (rawAvatar.replace(/"/g, '').trim() !== "" && rawAvatar !== "null") ? rawAvatar.replace(/"/g, '').trim() : `https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=2067&auto=format&fit=crop`;
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const themeColor = theme?.themeColor || "#ff9e00";

    const pathname = usePathname();
    const isPreviewRoute = pathname?.includes('/preview/');
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

    return (
        <div className="relative">
            {/* NAVBAR */}
            <nav className={`absolute top-0 left-0 w-full z-50 mix-blend-difference flex justify-between items-center cine-body p-6`}>
                <div className={`font-black tracking-tighter cine-heading text-xl`}>{firstName[0]}{lastName ? lastName[0] : ''}.</div>
                <div className={`flex font-bold uppercase tracking-widest gap-4 @md:gap-6 text-xs @md:text-sm items-center`}>
                    <EditableText value={theme?.customTexts?.cinematic_nav_work || 'Work'} field="cinematic_nav_work" entity="appearance" isEditor={isEditor} as="a" href="#work" className="hover:cine-accent transition" />
                    <Link href={isPreviewRoute ? `/preview/${subdomain}/gallery` : `/${subdomain}/gallery`} className="hover:cine-accent transition">
                        <EditableText value={theme?.customTexts?.cinematic_nav_gallery || 'Gallery'} field="cinematic_nav_gallery" entity="appearance" isEditor={isEditor} as="span" />
                    </Link>
                    <EditableText value={theme?.customTexts?.cinematic_nav_info || 'Info'} field="cinematic_nav_info" entity="appearance" isEditor={isEditor} as="a" href="#about" className="hover:cine-accent transition" />
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className="relative min-h-[90vh] flex flex-col justify-end pb-16 px-6 @md:px-12 overflow-hidden pt-32">
                <div className="absolute inset-0 z-0 @container">
                    <LazyImage src={displayAvatar} alt="Hero Background" className="w-full h-full object-cover grayscale opacity-30 scale-105 animate-[pulse_10s_ease-in-out_infinite]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
                </div>

                <div className={`relative z-10 w-full flex justify-between gap-6 flex-col @lg:flex-row @lg:items-end @lg:gap-10`}>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        {...{ [animationTrigger]: { opacity: 1, y: 0 } }} 
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full min-w-0"
                    >
                        <p className={`text-gray-400 font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3 cine-body text-xs @md:text-sm`}>
                            <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: themeColor }}></span>
                            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" className="truncate" />
                        </p>

                        <h1 className={`font-black leading-[0.85] tracking-tighter uppercase cine-heading break-words w-full text-[clamp(4rem,10cqi,10rem)]`}>
                            <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" /><br />
                            <span className="text-transparent break-words w-full block" style={{ WebkitTextStroke: `2px ${themeColor === '#000000' ? '#ffffff' : themeColor}` }}>
                                <EditableText value={lastName || 'Portfolio'} field="lastName" entity="profile" isEditor={isEditor} as="span" />
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        {...{ [animationTrigger]: { opacity: 1, y: 0 } }} 
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`cine-body w-full @lg:max-w-sm text-left @lg:text-right pb-4 @lg:pb-6 shrink-0`}
                    >
                        <div className={`cine-body text-gray-400 leading-relaxed text-sm @md:text-base mt-6 @lg:mt-0`}>
                            <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="p" />
                        </div>
                        <div className={`mt-6 flex flex-wrap gap-4 justify-start @lg:justify-end`}>
                            {links.map((l: any, i: number) => (
                                <a key={i} href={l.url} target="_blank" rel="noreferrer" className={`text-white hover:cine-accent transition font-bold uppercase tracking-widest text-xs @md:text-sm`}>{l.platform}</a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </header>
        </div>
    );
}
