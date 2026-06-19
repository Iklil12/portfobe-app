"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '79, 70, 229';
};

export function NexusSplitHeroBlock({ data, theme, isEditor }: any) {
  const [isCopied, setIsCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s} GMT+7`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
  const userEmail = data?.email || data?.user?.email || `hello@username.com`;
  
  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];
  
  const rawHighlightColor = theme?.themeColor || '#4f46e5';
  const highlightColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawHighlightColor) ? rawHighlightColor : '#4f46e5';
  const hlRgb = hexToRgb(highlightColor);

  const buttonShape = theme?.buttonShape || 'rounded';
  const radiusClass = buttonShape === 'square' || buttonShape === 'hard' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';
  const cardRadiusClass = buttonShape === 'square' || buttonShape === 'hard' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-3xl' : 'rounded-2xl';

  const handleCopyEmail = (e: React.MouseEvent) => {
      e.preventDefault();
      navigator.clipboard.writeText(userEmail);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
  };

  return (
    <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative flex flex-col justify-between gap-4 @md:gap-6 w-full min-h-[100svh] @md:min-h-0 @md:h-full p-6 @md:p-8 @lg:p-10 bg-black"
        style={{ '--hl-rgb': hlRgb } as React.CSSProperties}
    >
        {/* Subtle grid and ambient background overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-[0.08] pointer-events-none z-0" style={{ backgroundColor: highlightColor }} />

        {/* Top: Avatar & Status */}
        <motion.div variants={itemVariants} className="flex items-center justify-between relative z-10">
            {/* Avatar with Camera crop corners */}
            <div className="relative group/avatar">
              <div className="absolute -inset-1.5 border border-white/0 group-hover/avatar:border-white/10 transition-all duration-300 rounded-2xl pointer-events-none">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2" style={{ borderColor: highlightColor }}></div>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2" style={{ borderColor: highlightColor }}></div>
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2" style={{ borderColor: highlightColor }}></div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2" style={{ borderColor: highlightColor }}></div>
              </div>
              <div className={`w-12 h-12 @md:w-14 @md:h-14 ${cardRadiusClass} overflow-hidden border border-white/10 shadow-2xl shrink-0`}>
                  <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-700 scale-100 group-hover/avatar:scale-105" />
              </div>
            </div>

            {/* Status indicator badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm select-none">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: highlightColor }}></span>
                <span className="w-1.5 h-1.5 rounded-full absolute" style={{ backgroundColor: highlightColor }}></span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300">
                    <EditableText value={theme?.customTexts?.nexus_status || 'Available'} field="nexus_status" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                </span>
            </div>
        </motion.div>

        {/* Identity & Bio */}
        <motion.div variants={itemVariants} className="flex flex-col relative z-10">
            {/* Tiny directory prefix */}
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest mb-2">
              // USER_PROFILE_SYS
            </span>
            
            <h1 className="font-display font-black text-3xl @lg:text-4xl tracking-tight leading-none text-white mb-3 uppercase">
                <EditableText value={data?.profile?.fullName || data?.fullName || 'Budi Arsitek'} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={40} />
            </h1>
            
            <h2 className="font-mono text-[10px] @lg:text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: highlightColor }}>
              <span className="w-2 h-[2px]" style={{ backgroundColor: highlightColor }}></span>
              <EditableText value={data?.profile?.profession || data?.profession || 'Product Designer & Engineer'} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={50} />
            </h2>
            
            <div className="font-sans text-xs @lg:text-sm text-neutral-400 leading-relaxed font-normal border-l border-white/10 pl-3 py-0.5">
                <EditableText value={data?.profile?.bio || data?.bio || 'Bridging the gap between flawless aesthetics and deep technical execution.'} field="bio" entity="profile" isEditor={isEditor} as="p" maxLength={200} />
            </div>
        </motion.div>

        {/* Bottom: Links, Location info, & Actions */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 mt-3 relative z-10">
            {/* Interactive Socials grid with prefix counters */}
            {links.length > 0 && (
                <div className="flex flex-col gap-2">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                        <EditableText value={theme?.customTexts?.nexus_connect || 'Connect'} field="nexus_connect" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </span>
                    <div className="flex flex-col gap-2">
                        {links.map((l: any, i: number) => (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white flex items-center gap-2.5 group w-max transition-colors">
                                <span className="opacity-40">0{i+1} /</span>
                                <span className="hover-underline">{l.platform}</span>
                                <i className="fas fa-arrow-up-right-from-square text-[8px] opacity-0 group-hover:opacity-60 transition-opacity"></i>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Live Telemetry Info */}
            <div className="flex justify-between items-center border-t border-white/5 pt-3 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
              <span>LOC // JAKARTA, ID</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{currentTime || "ACTIVE"}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col @xl:flex-row gap-2 w-full border-t border-white/10 pt-4">
                <a 
                  href={`mailto:${userEmail}`} 
                  className={`flex-1 bg-white text-black hover:scale-[1.02] active:scale-95 transition-all duration-300 ${radiusClass} py-3 px-4 flex items-center justify-center gap-2 font-mono font-bold text-[10px] uppercase tracking-widest whitespace-nowrap shadow-lg`}
                  style={{ boxShadow: `0 4px 20px rgba(var(--hl-rgb), 0.15)` }}
                >
                    <EditableText value={theme?.customTexts?.nexus_btn_talk || "Let's Talk"} field="nexus_btn_talk" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </a>
                <button 
                  onClick={handleCopyEmail} 
                  className={`flex-1 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 active:scale-95 transition-all duration-300 ${radiusClass} py-3 px-4 flex items-center justify-center gap-2 font-mono font-bold text-[10px] uppercase tracking-widest text-white whitespace-nowrap`}
                >
                    <EditableText value={theme?.customTexts?.nexus_btn_copy || (isCopied ? 'Copied!' : 'Copy Email')} field="nexus_btn_copy" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    {isCopied ? (
                      <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    )}
                </button>
            </div>
        </motion.div>
    </motion.div>
  );
}
