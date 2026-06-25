"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function AuraKineticAboutBlock({ data, theme, isEditor }: any) {
  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop`;

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);
    const cardShape = btnShape;



  const revealVariants: any = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };
  
  const staggerReveal: any = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <section id="about" className="py-24 px-6 relative">
        <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0.2 }} className="flex-1 w-full">
                    <motion.div variants={revealVariants} className={`inline-block glass-panel ${btnShape} px-4 py-1.5 text-xs font-medium tracking-widest text-[var(--brand-accent)] uppercase mb-6`}>
                        <EditableText value={theme?.customTexts?.aura_about_label || 'The Studio'} field="aura_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </motion.div>
                    
                    <motion.h2 variants={revealVariants} className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-8">
                        <EditableText value={theme?.customTexts?.aura_about_title || 'Design in motion.'} field="aura_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
                    </motion.h2>
                    
                    <motion.div variants={revealVariants} className="w-full h-px bg-gradient-to-r from-white/20 to-transparent my-8"></motion.div>
                    
                    <motion.div variants={revealVariants} className="font-body text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                        <EditableText value={theme?.customTexts?.aura_about_desc || 'We are a digital agency specializing in crafting fluid, interactive, and immersive web experiences that captivate users and elevate brands.'} field="aura_about_desc" entity="appearance" isEditor={isEditor} as="p" maxLength={400} />
                    </motion.div>
                    
                    <motion.div variants={revealVariants}>
                         <a href="#services" className="inline-flex items-center gap-2 text-white hover-accent transition-colors font-medium text-lg group">
                            <span><EditableText value={theme?.customTexts?.aura_about_cta || 'Discover our capabilities'} field="aura_about_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /></span>
                            <i className="fas fa-arrow-right transform transition-transform group-hover:translate-x-2"></i>
                        </a>
                    </motion.div>
                </motion.div>

                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0.2 }} className="flex-1 w-full max-w-xl mx-auto lg:max-w-none">
                    <div className={`w-full aspect-[4/5] ${cardShape} aura-img-container p-2 glass-panel border border-white/10 shadow-2xl relative`}>
                        {/* Decorative background element behind image */}
                        <div className="absolute top-10 -right-10 w-40 h-40 rounded-full blur-[40px] opacity-50 bg-[var(--brand-accent)]"></div>
                        
                        <div className={`w-full h-full relative overflow-hidden ${cardShape}`}>
                            <img src={displayAvatar} alt="Studio" className="w-full h-full object-cover filter brightness-90 contrast-110" />
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    </section>
  );
}

