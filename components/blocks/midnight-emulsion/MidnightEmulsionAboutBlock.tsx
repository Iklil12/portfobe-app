"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';

export function MidnightEmulsionAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
  const fullName = data?.profile?.fullName || data?.fullName || "Director Name";
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  
  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

  const canvasEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: canvasEase } }
  };

  return (
    <div id="about" className="w-full py-24 @md:py-32 px-8 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508] relative overflow-hidden @container">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex items-center gap-4 mb-16">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)]">
            <EditableText value={theme?.customTexts?.midnight_about_label || 'Director\'s Note'} field="midnight_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </span>
          <div className="h-px w-20 bg-white/10"></div>
        </motion.div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-12 @lg:gap-16 items-start">
          
          {/* Column 1: Studio Viewport Profile Photo (5cols) */}
          <motion.div 
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
            className="@lg:col-span-5 w-full flex flex-col gap-4"
          >
            <div className="relative w-full aspect-[4/5] bg-black border border-white/10 rounded-xl overflow-hidden group shadow-2xl">
              {/* Corner Viewfinder brackets */}
              <div className="absolute inset-3 pointer-events-none z-25 opacity-60">
                <div className="absolute top-0 left-0 border-t-2 border-l-2 border-[var(--hl)] w-3 h-3"></div>
                <div className="absolute top-0 right-0 border-t-2 border-r-2 border-[var(--hl)] w-3 h-3"></div>
                <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-[var(--hl)] w-3 h-3"></div>
                <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-[var(--hl)] w-3 h-3"></div>
              </div>

              {/* HUD metadata overlay */}
              <div className="absolute bottom-4 left-4 z-20 font-mono text-[8px] text-white/50 tracking-widest bg-black/60 px-2 py-1 rounded border border-white/5">
                IMAGE // PORTRAIT_01
              </div>

              <div className="absolute top-4 right-4 z-20 font-mono text-[8px] text-[var(--hl)] tracking-widest bg-black/60 px-2 py-1 rounded border border-white/5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--hl)] animate-pulse"></span>
                LIVE_FOCUS
              </div>

              {/* Shutter line sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--hl)]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-10" />

              <LazyImage 
                src={displayAvatar} 
                alt={fullName} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000 ease-out opacity-70 group-hover:opacity-100" 
              />
            </div>
          </motion.div>

          {/* Column 2: Details & Bio (7cols) */}
          <div className="@lg:col-span-7 flex flex-col gap-10">
            <motion.h2 
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} 
              className="font-serif text-3xl @md:text-5xl text-white leading-[1.2] uppercase tracking-wide"
            >
              <EditableText value={theme?.customTexts?.midnight_about_title || 'Crafting structural narratives in a digital void.'} field="midnight_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />
            </motion.h2>

            <motion.div 
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
            >
              <p className="font-sans text-sm @md:text-base text-slate-400 leading-relaxed">
                <EditableText value={theme?.customTexts?.midnight_about_desc || "A creative director focused on pushing the boundaries of visual storytelling. We blend narrative depth with structural design."} field="midnight_about_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={300} />
              </p>
            </motion.div>

            {/* Technical Metadata Table */}
            <motion.div 
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
              className="flex flex-col gap-5 border-t border-white/10 pt-10 font-sans text-xs uppercase tracking-widest text-slate-500"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4 group">
                <span className="group-hover:text-white transition-colors">
                  <EditableText value={theme?.customTexts?.midnight_lbl_origin || 'Origin'} field="midnight_lbl_origin" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                </span>
                <span className="text-white font-mono text-xs">
                  <EditableText value={theme?.customTexts?.midnight_about_loc || 'Jakarta, ID'} field="midnight_about_loc" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4 group">
                <span className="group-hover:text-white transition-colors">
                  <EditableText value={theme?.customTexts?.midnight_lbl_est || 'Est.'} field="midnight_lbl_est" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                </span>
                <span className="text-white font-mono text-xs">
                  <EditableText value={theme?.customTexts?.midnight_about_est || '2015'} field="midnight_about_est" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4 group">
                <span className="group-hover:text-white transition-colors">
                  <EditableText value={theme?.customTexts?.midnight_lbl_principal || 'Principal'} field="midnight_lbl_principal" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                </span>
                <span className="text-[var(--hl)] font-bold">
                  <EditableText value={fullName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={20} />
                </span>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
