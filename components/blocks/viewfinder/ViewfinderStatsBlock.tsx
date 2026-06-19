"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function ViewfinderStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const defaultStats = [
    { label: "ACTIVE YEARS", val: "08+" },
    { label: "PROJECTS WRAPPED", val: "42" },
    { label: "HONORS", val: "18" },
    { label: "BASE OF OPS", val: "IDN" }
  ];

  const statsData = data?.stats?.length ? data.stats.slice(0, 4) : defaultStats;

  // Clapper snap animation state
  const [isClapping, setIsClapping] = useState(false);
  const [showRecIndicator, setShowRecIndicator] = useState(false);

  const handleClapAction = () => {
    if (isClapping) return;
    setIsClapping(true);
    setShowRecIndicator(true);
    
    // Reset clapping state after animation completes
    setTimeout(() => {
      setIsClapping(false);
    }, 600);

    // Hide recording indicator after 2.5 seconds
    setTimeout(() => {
      setShowRecIndicator(false);
    }, 2500);
  };

  return (
    <div id="stats" className="w-full flex flex-col py-24 px-6 @md:px-12 @lg:px-20 border-b border-white/10 bg-[#050505] text-white shrink-0 @container relative overflow-hidden">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes clapper-stick-snap {
          0% { transform: rotate(-22deg); }
          12% { transform: rotate(3deg); }
          24% { transform: rotate(-4deg); }
          36% { transform: rotate(1deg); }
          48% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes slate-board-shake {
          0% { transform: translateY(0) scale(1); }
          12% { transform: translateY(5px) scale(0.995); }
          24% { transform: translateY(-3px) scale(1.005); }
          36% { transform: translateY(1.5px) scale(1); }
          48% { transform: translateY(0) scale(1); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-clapper-stick {
          animation: clapper-stick-snap 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
        }
        .animate-slate-shake {
          animation: slate-board-shake 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
        }
      `}} />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        
        {/* Header Block */}
        <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
            className="border-b border-white/10 pb-6 mb-10 flex justify-between items-end"
        >
            <div className="flex flex-col gap-4">
              <span className="vf-hud-text uppercase tracking-[0.3em] text-[var(--primary)] font-bold text-xs">
                [ PRODUCTION DATA ]
              </span>
              <h2 className="font-cinema text-5xl @md:text-7xl text-white uppercase tracking-wide">
                <EditableText value={theme?.customTexts?.vf_log_title || 'Slate Log'} field="vf_log_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> <span style={{ color: 'var(--primary)' }}>.</span>
              </h2>
            </div>
            <span className="font-mono font-bold uppercase tracking-widest text-[9px] text-slate-500 text-right pb-1">
              <EditableText value={theme?.customTexts?.vf_log_file || 'FILE_NO: 0042'} field="vf_log_file" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </span>
        </motion.div>

        {/* Live Snapping REC Notification Badge */}
        <AnimatePresence>
          {showRecIndicator && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-28 left-6 md:left-12 bg-red-600/90 text-white font-mono text-[9px] font-bold tracking-widest px-3 py-1.5 rounded shadow-lg z-30 flex items-center gap-2 border border-red-500/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              • REC SLATE SNAP SUCCESSFUL // RUNNING SCENE
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Director's Clapperboard Slate */}
        <motion.div
          initial="hidden" 
          {...{ [animationTrigger]: "visible" }} 
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          onClick={handleClapAction}
          className="relative mt-12 group cursor-pointer select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-rotate-[1.5deg] hover:scale-[1.01]"
        >
          {/* Hinge Bracket graphic on left edge */}
          <div className="absolute -left-1.5 top-5 w-3 h-8 bg-zinc-800 border border-zinc-950 rounded-sm z-30 shadow-md"></div>

          {/* 1. Swinging Clapper Stick (Top Bar) */}
          <div 
            className={`w-full h-8 border-2 border-[#0c0d0e] rounded-t-sm select-none pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 relative ${
              isClapping ? 'animate-clapper-stick' : ''
            }`} 
            style={{
              background: 'repeating-linear-gradient(-45deg, #0c0d0e, #0c0d0e 16px, #eeeeec 16px, #eeeeec 32px)',
              transformOrigin: 'bottom left',
              // On group hover (unless clapping), swing up the clapper stick
              transform: isClapping ? undefined : 'rotate(var(--clapper-rotation, 0deg))',
            }}
          />
          {/* CSS custom variable injection via styled hover rule */}
          <style dangerouslySetInnerHTML={{__html: `
            .group:hover [style*="repeating-linear-gradient"] {
              --clapper-rotation: -16deg;
            }
          `}} />

          {/* 2. Main Clapperboard Base (Chalkboard style) */}
          <div className={`border-x-2 border-b-2 border-[#0c0d0e] rounded-b-sm bg-[#181a1d] shadow-2xl relative z-10 -mt-[2px] overflow-hidden transition-all duration-300 ${
            isClapping ? 'animate-slate-shake' : ''
          }`}>
            
            {/* Matching static bottom clapper stripe stick */}
            <div 
              className="w-full h-6 border-b-2 border-[#0c0d0e] select-none pointer-events-none" 
              style={{
                background: 'repeating-linear-gradient(-45deg, #0c0d0e, #0c0d0e 16px, #eeeeec 16px, #eeeeec 32px)'
              }}
            />

            {/* Slate Telemetry Row (Scene/Take/Roll) */}
            <div className="grid grid-cols-3 border-b-2 border-[#0c0d0e] font-mono text-[9px] font-bold tracking-[0.2em] text-[#eeeeec]/50 divide-x-2 divide-[#0c0d0e] select-none pointer-events-none bg-[#111215]">
              <div className="p-3.5 pl-4">SCENE // 01</div>
              <div className="p-3.5 pl-4">TAKE // 12</div>
              <div className="p-3.5 pl-4 text-right pr-4 text-[var(--primary)] font-black">ROLL // A08</div>
            </div>

            {/* Main Stats Grid cells */}
            <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-[#0c0d0e] border-b border-[#0c0d0e]">
              {statsData.map((stat: any, idx: number) => (
                <div 
                  key={idx} 
                  className="p-6 @md:p-8 flex flex-col justify-between hover:bg-white/[0.02] transition-colors duration-300 relative group/cell"
                >
                  {/* Visual indicator dot in cell */}
                  <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-white/5 group-hover/cell:bg-[var(--primary)] transition-all"></div>
                  
                  <span className="font-mono text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-4">
                    <EditableText value={theme?.customTexts?.[`vf_stat_lbl_${idx}`] || stat.label} field={`vf_stat_lbl_${idx}`} entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                  </span>
                  <span className="font-cinema text-5xl @xs:text-6xl @md:text-8xl leading-none text-white block select-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.05)]">
                    <EditableText value={theme?.customTexts?.[`vf_stat_val_${idx}`] || stat.val || stat.value} field={`vf_stat_val_${idx}`} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                  </span>
                </div>
              ))}
            </div>
            
            {/* Footer Slate metadata */}
            <div className="grid grid-cols-2 font-mono text-[7px] font-bold text-[#eeeeec]/30 tracking-wider p-4 px-5 select-none pointer-events-none bg-[#111215]">
              <div>CAM // RED V-RAPTOR 8K S35</div>
              <div className="text-right">LUT // CODIAC_SLOG3_TO_REC709</div>
            </div>
          </div>
        </motion.div>

        {/* Action Tip */}
        <p className="w-full text-center font-mono text-[7px] text-slate-500 uppercase tracking-widest mt-6 select-none pointer-events-none">
          * CLICK ANYWHERE ON THE SLATE TO TRIGGER PHYSICS SNAP ACTION
        </p>

      </div>
    </div>
  );
}
