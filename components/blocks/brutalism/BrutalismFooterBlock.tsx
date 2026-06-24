"use client";

import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismFooterBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { radiusClass } = useContext(BrutalismContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "JOHN DOE";
    const links = data?.links?.filter((l: any) => l.isActive !== false) || data?.user?.links?.filter((l: any) => l.isActive !== false) || [];

    const [sysTime, setSysTime] = useState("");

    useEffect(() => {
        if (isEditor) {
            setSysTime("12:00:00");
            return;
        }
        const updateTime = () => {
            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, '0');
            setSysTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [isEditor]);

    const brutalEase = [0, 0, 0, 1] as any;

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    return (
        <motion.footer initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className="w-full flex flex-col border-t-[3px] border-black">
            {/* Main Terminal Ending Card */}
            <div className="p-12 @sm:p-20 flex flex-col items-center justify-center text-center border-b-[3px] border-black bg-[var(--hl)] text-black relative overflow-hidden group select-none">
                {/* Background scanning lines pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_50%,rgba(0,0,0,0)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                
                <h2 className="custom-heading text-5xl @sm:text-7xl @md:text-[8cqi] font-black uppercase tracking-tighter leading-[0.8] mb-8 relative z-10 text-black">
                    <EditableText value={theme?.customTexts?.brutal_footer_title || 'END OF TRANSMISSION'} field="brutal_footer_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
                
                <button 
                    onClick={() => { if(!isEditor) window.scrollTo({ top: 0, behavior: 'smooth' }) }} 
                    className={`bg-black text-white font-mono font-bold uppercase px-8 py-4 text-xs @sm:text-sm border-[3px] border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:bg-white hover:text-black hover:translate-x-[3px] hover:translate-y-[3px] transition-all relative z-10 ${radiusClass}`}
                >
                    <EditableText value={theme?.customTexts?.brutal_footer_btn || 'RETURN TO TOP ▲'} field="brutal_footer_btn" entity="appearance" isEditor={isEditor} as="span" />
                </button>
            </div>

            {/* Sub-Footer / Terminal Status Dashboard */}
            <div className="p-6 bg-white font-mono text-[10px] @sm:text-xs font-bold uppercase flex flex-col @md:flex-row justify-between items-stretch @md:items-center gap-6 border-b-[3px] border-black">
                {/* System Specs */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500">
                    <span>SYS_OWNER: <span className="text-black">{fullName.toUpperCase().replace(/\s+/g, '_')}</span></span>
                    <span className="hidden @sm:inline">|</span>
                    <span>LOC: <span className="text-black">PORTFOLIO_CORE</span></span>
                    <span className="hidden @sm:inline">|</span>
                    <span>TIME: <span className="text-black">{sysTime || '00:00:00'}</span></span>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 @sm:gap-4 flex-wrap justify-start @md:justify-end items-center">
                    <span className="text-slate-400 mr-1 hidden @lg:inline">CONNECT_CHANNELS:</span>
                    {links.length > 0 ? links.map((l: any, i: number) => (
                        <a 
                            key={i} 
                            href={l.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={(e) => { if(isEditor) e.preventDefault(); }} 
                            className="bg-black text-white border-2 border-black hover:bg-[var(--hl)] hover:text-black px-3 py-1.5 transition-all text-[9px] @sm:text-[10px] uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[1px_1px_0px_0px_#000]"
                        >
                            {l.platform}
                        </a>
                    )) : <span className="text-red-500">[NO_COMM_LINKS]</span>}
                </div>
            </div>

            {/* Copyright and Legal Disclaimer Bar */}
            <div className="p-4 bg-neutral-100 font-mono text-[9px] font-bold uppercase flex flex-col @sm:flex-row justify-between items-center gap-2 text-slate-400">
                <span>© {new Date().getFullYear()} {fullName}.ALL_RIGHTS_RESERVED.</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    SECURE_STATIC_COMMS_OK
                </span>
            </div>
        </motion.footer>
    );
}
