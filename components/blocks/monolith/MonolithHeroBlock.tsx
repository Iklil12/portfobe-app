"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';

export function MonolithHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
    const [currentTime, setCurrentTime] = useState("");
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    const location = data?.profile?.location || data?.location || "Indonesia";

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    useEffect(() => {
        if (isCardPreview || isEditor) return;
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [isCardPreview, isEditor]);

    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <section className="sticky top-0 h-[100svh] w-full flex flex-col justify-between z-0 bg-[#050505] overflow-hidden">
            <LazyImage src={displayAvatar} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale transition-transform duration-[10s] scale-105 hover:scale-100" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/70"></div>

            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                className={`relative z-10 flex flex-col justify-between h-full p-6 @md:p-12`}
            >
                <motion.div variants={fadeUp} className={`flex justify-between items-start mt-12`}>
                    <div className="flex flex-col gap-1">
                        <span className="font-sans text-[9px] @md:text-xs font-bold uppercase tracking-[0.2em] text-[var(--hl)]">
                            <EditableText value={theme?.customTexts?.monolith_hero_based || 'Based in'} field="monolith_hero_based" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /> {location}
                        </span>
                        <span className="font-sans text-[10px] @md:text-sm font-medium text-slate-300">{currentTime || "00:00 AM"}</span>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} className={`mb-16 @md:mb-20`}>
                    <h1 className={`font-serif leading-[0.85] tracking-tight text-5xl @md:text-7xl @lg:text-[9cqi]`}>
                        <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={20} /> <br />
                        <span className="italic text-outline">
                            <EditableText value={lastName || 'PORTFOLIO'} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={20} />
                        </span>
                    </h1>
                </motion.div>
            </motion.div>
        </section>
    );
}
