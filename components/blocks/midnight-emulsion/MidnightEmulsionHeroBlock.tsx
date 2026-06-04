"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsionHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
  const [isCopied, setIsCopied] = useState(false);
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
  const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";
  const bio = data?.profile?.bio || data?.bio || "Creating clean, functional, and visually striking digital experiences with extreme attention to detail.";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;

  const nameParts = fullName.trim().split(' ');
  const displayFirstName = nameParts[0];
  const displayLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Creative';

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

  const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(userEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const canvasEase = [0.22, 1, 0.36, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
  };

  return (
    <div className="relative w-full min-h-[90vh] flex flex-col justify-center p-8 @md:p-12 @lg:p-20 border-b border-white/5 overflow-hidden bg-[#030508]">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--hl)] opacity-10 rounded-full blur-[100px]" />
      </div>

      <header className="absolute top-8 left-8 right-8 @lg:top-12 @lg:left-20 @lg:right-20 z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
            <LazyImage src={displayAvatar} alt={displayFirstName} className="w-full h-full object-cover grayscale" />
          </div>
          <span className="font-sans font-bold tracking-[0.2em] text-white uppercase text-xs">
            <EditableText value={displayFirstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
          </span>
        </div>
      </header>

      <div className="relative z-10 mt-20 max-w-5xl mx-auto w-full">
        <motion.p initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--hl)] mb-8 flex items-center gap-4">
          <span className="w-12 h-[1px] bg-[var(--hl)] opacity-50"></span>
          <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
        </motion.p>
        <motion.h1 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-serif text-6xl @md:text-8xl @lg:text-[10rem] leading-[0.85] mb-12 uppercase tracking-tighter break-words">
          <span className="block text-white">
            <EditableText value={displayFirstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
          </span>
          <span className="block text-stroke text-stroke-hover transition-all duration-500 cursor-default">
            <EditableText value={displayLastName} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
          </span>
        </motion.h1>
        <div className="flex flex-col @md:flex-row @md:items-end gap-8 justify-between">
            <motion.p initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-sans text-slate-400 font-medium leading-relaxed max-w-xl text-sm @md:text-base">
            <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />
            </motion.p>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="shrink-0">
            <button onClick={handleCopyEmail} className={`px-8 py-4 border border-white/10 hover:border-[var(--hl)] bg-white/5 hover:bg-[var(--hl)]/10 text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-md min-w-[200px] ${radiusClass}`}>
                {isCopied ? 'Access Granted' : <EditableText value={theme?.customTexts?.midnight_btn_contact || 'Initiate Contact'} field="midnight_btn_contact" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />}
            </button>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
