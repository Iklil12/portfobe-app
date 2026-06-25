"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function ViewfinderFooterBlock({ data, theme, isEditor }: any) {
  

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-md';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const getCardShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-2xl';
  };
  const cardShape = getCardShapeClass(theme?.buttonShape);

  const getCardStyleClass = (style?: string) => {
      if (style === 'hard' || style === 'hard-shadow') return 'border border-white/20 bg-[#050505] shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]';
      if (style === 'flat') return 'border border-white/20 bg-transparent';
      if (style === 'soft-shadow' || style === 'soft') return 'border border-white/5 bg-[#0a0a0a] shadow-2xl';
      return 'border border-white/10 bg-[#050505]';
  };
  const cardStyleClass = getCardStyleClass(theme?.cardStyle);

const animationTrigger = isEditor ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUpVariants = {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const email = data?.email || data?.user?.email || "hello@example.com";

  // Dynamic real-time Timecode
  const [timecode, setTimecode] = useState("12:00:00:00");
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const f = String(Math.floor(now.getMilliseconds() / 40)).padStart(2, '0');
      setTimecode(`${h}:${m}:${s}:${f}`);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="footer" className="w-full flex flex-col py-28 px-6 @md:px-12 @lg:px-20 bg-[#050505] shrink-0 border-t border-white/10 relative overflow-hidden @container select-none">
        
        {/* Glow Line Indicator */}
        <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] opacity-25"></div>
        
        {/* Grid Scope Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] z-0 pointer-events-none" />
        <div className="vf-scanline"></div>

        {/* Dynamic VU Meter Left (Desktop only) */}
        <div className="absolute left-10 bottom-24 hidden @lg:flex flex-col items-center gap-1 font-mono text-[7px] text-slate-500 pointer-events-none select-none z-10">
          <span className="text-[var(--primary)] font-bold">L_CH</span>
          <div className="w-2.5 h-28 bg-white/5 border border-white/10 rounded-[1px] flex flex-col justify-end gap-[1px] p-[1.5px] relative">
            <div className="w-full h-3 bg-red-600/80 animate-[pulse_0.4s_infinite_alternate]" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-full h-4 bg-yellow-500/80 animate-[pulse_0.6s_infinite_alternate]" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-full h-6 bg-green-500/80 animate-[pulse_0.5s_infinite_alternate]" style={{ animationDelay: '0.05s' }}></div>
            <div className="w-full h-8 bg-green-600/60 animate-[pulse_0.7s_infinite_alternate]"></div>
          </div>
          <span>VU</span>
        </div>

        {/* Dynamic VU Meter Right (Desktop only) */}
        <div className="absolute right-10 bottom-24 hidden @lg:flex flex-col items-center gap-1 font-mono text-[7px] text-slate-500 pointer-events-none select-none z-10">
          <span className="text-[var(--primary)] font-bold">R_CH</span>
          <div className="w-2.5 h-28 bg-white/5 border border-white/10 rounded-[1px] flex flex-col justify-end gap-[1px] p-[1.5px] relative">
            <div className="w-full h-3 bg-red-600/80 animate-[pulse_0.5s_infinite_alternate]" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-full h-4 bg-yellow-500/80 animate-[pulse_0.5s_infinite_alternate]" style={{ animationDelay: '0.05s' }}></div>
            <div className="w-full h-6 bg-green-500/80 animate-[pulse_0.7s_infinite_alternate]" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-full h-8 bg-green-600/60 animate-[pulse_0.6s_infinite_alternate]"></div>
          </div>
          <span>VU</span>
        </div>

        <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center relative z-10">
            
            {/* HUD Recording Status Frame for Footer Call to Action */}
            <div className="relative w-full border border-white/10 bg-white/[0.01] p-8 md:p-12 rounded-sm mb-12 select-none overflow-hidden">
              
              {/* Viewfinder Corner crop marks */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20"></div>
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/20"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/20"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20"></div>

              {/* Top Telemetry Line */}
              <div className="flex justify-between items-center font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-10 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
                  <span className="text-[var(--primary)] font-bold">REC STATUS // ACTIVE</span>
                </div>
                <span className="text-white/60">TC // {timecode}</span>
              </div>

              {/* Title */}
              <div className="text-center flex flex-col items-center gap-4">
                <span className="font-mono text-[9px] text-[var(--primary)] uppercase tracking-[0.3em] font-bold">
                  [ SESSION OVERVIEW / CONTACT ]
                </span>
                <h2 className="font-cinema tracking-wide text-[#F3F3F1] text-4xl @md:text-6xl uppercase leading-snug max-w-xl mx-auto">
                  <EditableText value={theme?.customTexts?.vf_footer_title || "Let's capture the next frame."} field="vf_footer_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
                </h2>
                <div className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.2em] mt-3">
                  <EditableText value={theme?.customTexts?.vf_footer_sub || "Available for creative commissions & visual direction."} field="vf_footer_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />
                </div>
              </div>
            </div>

            {/* Rotating Film/Audio Tape Reel Console */}
            <motion.div 
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
              className="flex gap-12 justify-center items-center my-8 select-none"
            >
              {/* Left Tape Spool */}
              <div className="relative w-16 h-16 ${btnShape} border border-white/10 flex items-center justify-center bg-black/40">
                <svg className="w-12 h-12 text-white/15 motion-safe:animate-[spin_24s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
                  <path d="M12 2v22M2 12h22M5 5l14 14M5 19L19 5" />
                </svg>
                {/* Simulated brown tape wound amount */}
                <div className="absolute inset-2 rounded-full border-[3px] border-[#e67e22]/20"></div>
              </div>

              {/* Tape bridge */}
              <div className="h-[1px] w-20 bg-gradient-to-r from-[#e67e22]/20 via-white/10 to-[#e67e22]/20 relative">
                <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping"></div>
              </div>

              {/* Right Tape Spool */}
              <div className="relative w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-black/40">
                <svg className="w-12 h-12 text-white/15 motion-safe:animate-[spin_24s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
                  <path d="M12 2v22M2 12h22M5 5l14 14M5 19L19 5" />
                </svg>
                {/* Less tape wound on this side */}
                <div className="absolute inset-4.5 rounded-full border-[3px] border-[#e67e22]/10"></div>
              </div>
            </motion.div>

            {/* Trigger Button */}
            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                className="flex flex-col @md:flex-row gap-6 @md:gap-12 mt-4"
            >
                <a href={`mailto:${email}`} className="relative group">
                    {/* Viewfinder brackets */}
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20 group-hover:border-[var(--primary)] transition-all duration-300"></div>
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20 group-hover:border-[var(--primary)] transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/20 group-hover:border-[var(--primary)] transition-all duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/20 group-hover:border-[var(--primary)] transition-all duration-300"></div>

                    <motion.div
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        className="flex items-center justify-center gap-3 px-8 py-4 border border-white/10 text-white transition-all duration-300 cursor-pointer uppercase font-black tracking-[0.3em] text-[10px] @sm:text-xs min-w-[220px] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]"
                    >
                        <span><EditableText value={theme?.customTexts?.vf_btn_connect || 'INITIATE CONTACT'} field="vf_btn_connect" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                    </motion.div>
                </a>
            </motion.div>

            {/* Copyright & Broadcasting Calibration Accent */}
            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                className="mt-28 w-full flex justify-between items-end border-t border-white/10 pt-8"
            >
                <div className="vf-hud-text text-white/30 tracking-widest text-[8px] @md:text-[10px] uppercase">
                    &copy; {new Date().getFullYear()} <EditableText value={data?.profile?.fullName || data?.fullName || 'JAMAL ARIFIN'} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                </div>
                
                {/* SMPTE Broadcasting Color Test Calibration Bars */}
                <div className="flex gap-1 select-none pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2.5 h-3 bg-white"></div>
                    <div className="w-2.5 h-3 bg-[#f1c40f]"></div>
                    <div className="w-2.5 h-3 bg-[#2ecc71]"></div>
                    <div className="w-2.5 h-3 bg-[#3498db]"></div>
                    <div className="w-2.5 h-3 bg-[#9b59b6]"></div>
                    <div className="w-2.5 h-3 bg-[#e74c3c]"></div>
                    <div className="w-2.5 h-3 bg-[#2c3e50]"></div>
                </div>
            </motion.div>
        </div>
    </div>
  );
}
