"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';

export function NexusSplitHeroBlock({ data, theme, isEditor }: any) {
  const [isCopied, setIsCopied] = useState(false);

  const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
  const userEmail = data?.email || data?.user?.email || `hello@username.com`;
  
  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];
  
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
        className="flex flex-col justify-between gap-12 w-full min-h-[100svh] p-8 @md:p-12"
    >
        {/* Top: Avatar & Status */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className={`w-16 h-16 @md:w-20 @md:h-20 ${cardRadiusClass} overflow-hidden border border-white/10 shadow-2xl shrink-0`}>
                <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border nexus-border bg-white/5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full animate-pulse bg-[var(--hl)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    <EditableText value={theme?.customTexts?.nexus_status || 'Available'} field="nexus_status" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                </span>
            </div>
        </motion.div>

        {/* Identity */}
        <motion.div variants={itemVariants} className="flex flex-col">
            <h1 className="font-display font-extrabold text-4xl @lg:text-5xl tracking-tight leading-none text-white mb-3">
                <EditableText value={data?.profile?.fullName || data?.fullName || 'Budi Arsitek'} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={40} />
            </h1>
            <h2 className="font-sans text-base @lg:text-lg font-medium text-[var(--hl)] mb-6">
                <EditableText value={data?.profile?.profession || data?.profession || 'Product Designer & Engineer'} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={50} />
            </h2>
            <div className="font-sans text-sm @lg:text-base text-slate-400 leading-relaxed font-normal">
                <EditableText value={data?.profile?.bio || data?.bio || 'Bridging the gap between flawless aesthetics and deep technical execution.'} field="bio" entity="profile" isEditor={isEditor} as="p" maxLength={200} />
            </div>
        </motion.div>

        {/* Bottom: Links & Actions */}
        <motion.div variants={itemVariants} className="flex-col gap-8 mt-10 flex @md:flex">
            {/* Interactive Socials */}
            {links.length > 0 && (
                <div className="flex flex-col gap-4">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <EditableText value={theme?.customTexts?.nexus_connect || 'Connect'} field="nexus_connect" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </span>
                    <div className="flex flex-col gap-2">
                        {links.map((l: any, i: number) => (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="font-sans text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2 group w-max">
                                <i className="fas fa-arrow-right text-[10px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[var(--hl)] transition-all duration-300"></i>
                                <span className="hover-underline">{l.platform}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col @xl:flex-row gap-3 w-full border-t nexus-border pt-8">
                <a href={`mailto:${userEmail}`} className={`flex-1 bg-white text-black hover:bg-[var(--hl)] hover:text-white transition-colors duration-300 ${radiusClass} py-3 px-4 flex items-center justify-center gap-2 font-sans font-bold text-sm whitespace-nowrap`}>
                    <EditableText value={theme?.customTexts?.nexus_btn_talk || "Let's Talk"} field="nexus_btn_talk" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <i className="fas fa-paper-plane"></i>
                </a>
                <button onClick={handleCopyEmail} className={`flex-1 bg-white/5 border nexus-border hover:bg-white/10 transition-colors duration-300 ${radiusClass} py-3 px-4 flex items-center justify-center gap-2 font-sans font-medium text-sm text-white whitespace-nowrap`}>
                    <EditableText value={theme?.customTexts?.nexus_btn_copy || (isCopied ? 'Copied!' : 'Copy Email')} field="nexus_btn_copy" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <i className={isCopied ? 'fas fa-check text-[var(--hl)]' : 'far fa-copy'}></i>
                </button>
            </div>
        </motion.div>
    </motion.div>
  );
}
