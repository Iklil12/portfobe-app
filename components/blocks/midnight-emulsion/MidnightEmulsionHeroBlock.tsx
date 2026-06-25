"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';

export function MidnightEmulsionHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
  const [isCopied, setIsCopied] = useState(false);
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
  const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";
  const bio = data?.profile?.bio || data?.bio || "Creating clean, functional, and visually striking digital experiences with extreme attention to detail.";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const getCardShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-3xl';
  };
  const cardShape = getCardShapeClass(theme?.buttonShape);

  const getCardStyleClass = (style?: string) => {
      if (style === 'hard' || style === 'hard-shadow') return 'border border-white/20 bg-[#030508] shadow-[4px_4px_0_0_rgba(255,255,255,0.1)]';
      if (style === 'flat') return 'border border-white/10 bg-transparent';
      if (style === 'soft-shadow' || style === 'soft') return 'border border-white/5 bg-[#080b11] shadow-[0_10px_40px_rgba(0,0,0,0.5)]';
      return 'border border-white/10 bg-[#06080c] shadow-2xl';
  };
  const cardStyleClass = getCardStyleClass(theme?.cardStyle);

  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;

  const nameParts = fullName.trim().split(' ');
  const displayFirstName = nameParts[0];
  const displayLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Creative';

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;



  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(userEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const canvasEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: canvasEase } }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center p-8 @md:p-12 @lg:p-20 border-b border-white/5 overflow-hidden bg-[#030508]">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />
      
      {/* Ambient Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--hl)] opacity-5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      {/* Viewfinder Overlay Frame */}
      <div className="absolute inset-4 @md:inset-6 pointer-events-none z-10 border border-white/5">
        {/* Corner Viewfinder brackets */}
        <div className="absolute top-0 left-0 border-t border-l border-white/20 w-3 h-3"></div>
        <div className="absolute top-0 right-0 border-t border-r border-white/20 w-3 h-3"></div>
        <div className="absolute bottom-0 left-0 border-b border-l border-white/20 w-3 h-3"></div>
        <div className="absolute bottom-0 right-0 border-b border-r border-white/20 w-3 h-3"></div>

        {/* Viewfinder metadata overlays */}
        <div className="absolute top-4 left-4 font-mono text-[8px] text-[var(--hl)] uppercase tracking-[0.2em]">
          SYS_ON // ACTIVE
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[8px] text-red-500 uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          REC [RAW]
        </div>

        <div className="absolute bottom-4 left-4 font-mono text-[8px] text-slate-500 uppercase tracking-[0.2em] hidden @md:flex gap-4">
          <span>FOCAL // 35MM</span>
          <span>ISO // 400</span>
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[8px] text-slate-500 uppercase tracking-[0.2em] hidden @md:flex gap-4">
          <span>24.00 FPS</span>
          <span>SHUTTER // 1/125</span>
        </div>
      </div>

      {/* Header Profile Info */}
      <header className="absolute top-10 left-10 right-10 @lg:top-14 @lg:left-24 @lg:right-24 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${btnShape} overflow-hidden border border-white/10 shadow-lg relative`}>
            <LazyImage src={displayAvatar} alt={displayFirstName} className="w-full h-full object-cover grayscale" />
          </div>
          <span className="font-sans font-bold tracking-[0.25em] text-white uppercase text-[10px]">
            <EditableText value={displayFirstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
          </span>
        </div>
      </header>

      {/* Hero Typography Content */}
      <div className="relative z-10 mt-16 max-w-5xl mx-auto w-full flex flex-col justify-center min-h-[60vh]">
        <motion.p 
          initial="hidden" 
          {...{ [animationTrigger]: "visible" }} 
          viewport={{ once: true, amount: 0 }} 
          variants={fadeUp} 
          className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-8 flex items-center gap-4"
        >
          <span className="w-10 h-[1.5px] bg-[var(--hl)]"></span>
          <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
        </motion.p>

        <motion.h1 
          initial="hidden" 
          {...{ [animationTrigger]: "visible" }} 
          viewport={{ once: true, amount: 0 }} 
          variants={fadeUp} 
          className="font-serif text-5xl @md:text-7xl @lg:text-[9.5rem] leading-[0.9] mb-12 uppercase tracking-tighter break-words select-none"
        >
          <span className="block text-white">
            <EditableText value={displayFirstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
          </span>
          <span 
            className="block text-transparent hover:text-white transition-all duration-700 cursor-default"
            style={{ 
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style as any).WebkitTextStrokeColor = 'var(--hl)'}
            onMouseLeave={(e) => (e.currentTarget.style as any).WebkitTextStrokeColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <EditableText value={displayLastName} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
          </span>
        </motion.h1>

        <div className="flex flex-col @md:flex-row @md:items-end gap-8 justify-between mt-4">
          <motion.p 
            initial="hidden" 
            {...{ [animationTrigger]: "visible" }} 
            viewport={{ once: true, amount: 0 }} 
            variants={fadeUp} 
            className="font-sans text-slate-400 font-medium leading-relaxed max-w-xl text-sm @md:text-base"
          >
            <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />
          </motion.p>
          
          <motion.div 
            initial="hidden" 
            {...{ [animationTrigger]: "visible" }} 
            viewport={{ once: true, amount: 0 }} 
            variants={fadeUp} 
            className="shrink-0"
          >
            <button 
              onClick={handleCopyEmail} 
              className={`group relative overflow-hidden px-8 py-4 bg-white/[0.02] hover:bg-[var(--hl)] border border-white/10 hover:border-[var(--hl)] text-white hover:text-[#030508] font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-500 min-w-[200px] flex items-center justify-center gap-3 backdrop-blur-md shadow-2xl ${btnShape}`}
            >
              {/* Button light sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-0" />
              
              <span className="relative z-10 flex items-center gap-2">
                {isCopied ? (
                  'Access Granted'
                ) : (
                  <>
                    <EditableText value={theme?.customTexts?.midnight_btn_contact || 'Initiate Contact'} field="midnight_btn_contact" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                    <i className="fas fa-arrow-right text-[var(--hl)] group-hover:text-[#030508] transition-colors -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  </>
                )}
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
