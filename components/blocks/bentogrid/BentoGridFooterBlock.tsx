"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function BentoGridFooterBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 w-full">
            <motion.footer 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col @md:flex-row justify-between items-center gap-6 p-8 @lg:p-10 w-full`}
            >
                <div className="flex flex-col text-center @md:text-left">
                    <h3 className="text-xl @md:text-2xl font-black text-white mb-1">Ready to build?</h3>
                    <a href={isEditor ? '#' : `mailto:${userEmail}`} onClick={(e) => { if (isEditor) e.preventDefault(); }} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        {userEmail}
                    </a>
                </div>
                
                <div className="flex flex-col items-center @md:items-end gap-4">
                    <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-slate-500">
                        <span>© {new Date().getFullYear()} {fullName}</span>
                        <Link href={isEditor ? '#' : `/${subdomain}`} onClick={(e) => { if (isEditor) e.preventDefault(); }} className="hover:text-[var(--hl)] transition-colors">PORTFO.BE</Link>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
}
