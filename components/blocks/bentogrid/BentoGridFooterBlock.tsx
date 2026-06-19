"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function BentoGridFooterBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;

    const [timeString, setTimeString] = React.useState("");
    const [timezone, setTimezone] = React.useState("UTC");

    React.useEffect(() => {
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
        const updateTime = () => {
            const now = new Date();
            setTimeString(now.toLocaleTimeString("en-US", { hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid gap-4 @lg:gap-6 grid-cols-1 @md:grid-cols-3 w-full">
            
            {/* CTA CARD (col-span-2) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-8 flex flex-col justify-between min-h-[180px] @md:col-span-2 relative group overflow-hidden`}
            >
                {/* Hover Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300 bg-[var(--hl)]" />

                <div className="flex justify-between items-center z-10">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        Node.09 // Connection Line
                    </span>
                    <span className="flex items-center gap-1.5 text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Available for projects
                    </span>
                </div>

                <div className="my-6 z-10">
                    <h3 className="text-2xl @md:text-3xl font-sans font-black text-white leading-tight uppercase tracking-tight">
                        Ready to build something great?
                    </h3>
                    <div className="mt-3">
                        <a 
                            href={isEditor ? '#' : `mailto:${userEmail}`} 
                            onClick={(e) => { if (isEditor) e.preventDefault(); }} 
                            className="text-lg @md:text-xl font-mono text-[var(--hl)] hover:text-white transition-colors duration-300"
                        >
                            {userEmail}
                        </a>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center z-10 text-[9px] font-mono text-slate-500 uppercase">
                    <span>Direct Communication</span>
                    <span>Response within 24h</span>
                </div>
            </motion.div>

            {/* STATUS / CLOCK CARD (col-span-1) */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-8 flex flex-col justify-between min-h-[180px] @md:col-span-1 relative overflow-hidden`}
            >
                <div className="flex justify-between items-center z-10">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        System Chrono
                    </span>
                    <i className="far fa-clock text-[var(--hl)] text-xs animate-pulse"></i>
                </div>

                <div className="my-4 z-10">
                    <div className="text-3xl font-mono font-black text-white tracking-widest">
                        {timeString || "00:00:00"}
                    </div>
                    <p className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-wider truncate">
                        {timezone} (LOCAL TIME)
                    </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col gap-1.5 z-10 text-[9px] font-mono text-slate-500 uppercase">
                    <div className="flex justify-between items-center w-full">
                        <span>© {new Date().getFullYear()} {fullName}</span>
                        <Link 
                            href={isEditor ? '#' : `/${subdomain}`} 
                            onClick={(e) => { if (isEditor) e.preventDefault(); }} 
                            className="hover:text-[var(--hl)] text-[8px] tracking-wider transition-colors font-black border border-white/10 px-1.5 py-0.5 rounded"
                        >
                            PORTFO.BE
                        </Link>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
