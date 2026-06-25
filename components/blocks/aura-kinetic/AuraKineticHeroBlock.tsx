"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

export function AuraKineticHeroBlock({ data, theme, isEditor }: any) {
  const fullName = data?.profile?.fullName || data?.fullName || "Aura Studio";
  const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";
  const bio = data?.profile?.bio || data?.bio || "Creating clean, functional, and visually striking digital experiences with extreme attention to detail.";
  
  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

  const smoothEase = [0.16, 1, 0.3, 1] as any;

  const fadeUp = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
  };

  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  
    const getBtnShapeClass = (shape?: string) => {
        if (shape === 'hard' || shape === 'square') return 'rounded-none';
        if (shape === 'rounded') return 'rounded-xl';
        return 'rounded-full';
    };
    const btnShape = getBtnShapeClass(theme?.buttonShape);
    const cardShape = btnShape;

    


  return (
    <section className="relative z-10 w-full max-w-[1400px] mx-auto min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-20">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={staggerContainer} className="flex flex-col items-center">

            <motion.div variants={fadeUp} className="mb-8">
                <div className={`w-24 h-24 md:w-32 md:h-32 ${btnShape} overflow-hidden border-2 border-white/10 p-1 mb-6 mx-auto group`}>
                    <LazyImage src={displayAvatar} alt={fullName} className={`w-full h-full object-cover ${btnShape} group-hover:scale-110 transition-transform duration-700`} />
                </div>
                <span className={`px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md ${btnShape} font-sans text-xs font-semibold text-[var(--hl)] flex items-center gap-2 max-w-max mx-auto cursor-default hover:bg-white/10 transition-colors`}>
                    <span className={`w-2 h-2 ${btnShape} bg-[var(--hl)] animate-pulse shadow-[0_0_10px_var(--hl)]`}></span>
                    <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight leading-[1.1] mb-6 max-w-4xl">
                <EditableText value={theme?.customTexts?.aura_hero_title1 || 'Designing'} field="aura_hero_title1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <EditableText value={theme?.customTexts?.aura_hero_title2 || 'Fluid'} field="aura_hero_title2" entity="appearance" isEditor={isEditor} as="span" className="text-gradient-animate italic" maxLength={20} /> <EditableText value={theme?.customTexts?.aura_hero_title3 || '& Interactive Experiences.'} field="aura_hero_title3" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
            </motion.h1>

            <motion.div variants={fadeUp} className="font-sans text-white/50 font-medium text-base md:text-lg max-w-2xl leading-relaxed mb-10">
                <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="p" maxLength={250} />
            </motion.div>

        </motion.div>

        {/* Scroll Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-16 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span className="font-sans text-[10px] uppercase tracking-widest font-bold">
                <EditableText value={theme?.customTexts?.aura_scroll_text || 'Scroll'} field="aura_scroll_text" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
            </span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
        </motion.div>
    </section>
  );
}
