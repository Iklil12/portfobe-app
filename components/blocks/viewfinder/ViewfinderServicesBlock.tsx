"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function ViewfinderServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
  const customTexts = theme?.customTexts || {};
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const toggleVisibility = (id: string, currentStatus: boolean) => {
    if (!isEditor) return;
    window.parent.postMessage({
        type: 'INLINE_EDIT',
        entity: 'appearance',
        field: `vf_svc_${id}_visible`,
        value: currentStatus ? 'false' : 'true'
    }, window.location.origin);
  };

  const services = [
    { 
      id: '1', 
      defaultTitle: "CINEMATOGRAPHY", 
      defaultDesc: "Capturing light and shadow to create compelling visual compositions with cinema-grade equipment.",
      lens: "ANAMORPHIC PRIMES",
      focal: "35MM / 50MM / 85MM"
    },
    { 
      id: '2', 
      defaultTitle: "COLOR GRADING", 
      defaultDesc: "Developing specific visual palettes that enhance the emotional resonance of the narrative.",
      lens: "RESOLVE STUDIO",
      focal: "S-LOG3 / LOG-C / ACES"
    },
    { 
      id: '3', 
      defaultTitle: "POST PRODUCTION", 
      defaultDesc: "Assembling narrative structures through precise editorial rhythm and pacing.",
      lens: "PREMIERE & OFFLINE",
      focal: "PRORES RAW / DNXHR"
    }
  ];

  return (
    <div className="w-full flex flex-col py-24 px-6 @md:px-12 @lg:px-20 border-b border-white/10 bg-[#050505] shrink-0 @container relative overflow-hidden">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Header Block */}
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-16 border-b border-white/10 pb-6 flex justify-between items-end">
          <h2 className="font-cinema text-5xl @md:text-7xl text-white uppercase tracking-wide">
            <EditableText value={customTexts.vf_services_title || 'Capabilities'} field="vf_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> <span style={{ color: 'var(--primary)' }}>.</span>
          </h2>
          <span className="vf-hud-text font-bold uppercase tracking-[0.3em] text-[var(--primary)] block text-right text-xs">
            <EditableText value={customTexts.vf_services_top || 'SYS_MODULES'} field="vf_services_top" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </span>
        </motion.div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 @md:grid-cols-3 gap-6 @md:gap-8">
          {services.map((service, index) => {
            const isVisible = customTexts[`vf_svc_${service.id}_visible`] !== 'false';
            if (!isVisible && !isEditor) return null;

            return (
              <motion.div 
                key={service.id}
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                className={`group flex flex-col p-8 border border-white/10 bg-[#0b0b0b]/60 hover:bg-[#111] hover:border-[var(--primary)] transition-all duration-500 relative rounded shadow-xl ${
                  !isVisible ? 'opacity-40 bg-zinc-950/20' : ''
                }`}
              >
                {/* Corner viewfinder brackets */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20 group-hover:border-[var(--primary)] transition-colors"></div>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20 group-hover:border-[var(--primary)] transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/20 group-hover:border-[var(--primary)] transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/20 group-hover:border-[var(--primary)] transition-colors"></div>

                {isEditor && (
                  <button
                    onClick={() => toggleVisibility(service.id, isVisible)}
                    className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all cursor-pointer ${
                        isVisible 
                            ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                            : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                    }`}
                    title={isVisible ? "Sembunyikan" : "Tampilkan"}
                  >
                    {isVisible ? "✕ Hide" : "➕ Show"}
                  </button>
                )}

                {/* Subsystem tag header */}
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 select-none">
                  <span className="vf-hud-text font-bold uppercase tracking-[0.25em] text-[var(--primary)] text-[10px]">
                    MOD_0{index + 1} {!isVisible && "[HIDDEN]"}
                  </span>
                  <i className="fas fa-crosshairs text-white/20 group-hover:text-[var(--primary)] transition-all group-hover:rotate-90 duration-500 text-sm"></i>
                </div>
                
                {/* Title */}
                <h3 className="font-cinema text-3xl @md:text-4xl text-white group-hover:text-[var(--primary)] transition-colors mb-4">
                  <EditableText value={customTexts[`vf_srv_title_${service.id}`] || service.defaultTitle} field={`vf_srv_title_${service.id}`} entity="appearance" isEditor={isEditor} as="span" maxLength={50} />
                </h3>
                
                {/* Description */}
                <p className="vf-body text-xs @md:text-sm text-[#F3F3F1]/60 leading-relaxed text-justify flex-1">
                  <EditableText value={customTexts[`vf_srv_desc_${service.id}`] || service.defaultDesc} field={`vf_srv_desc_${service.id}`} entity="appearance" isEditor={isEditor} as="span" maxLength={200} />
                </p>

                {/* Overhauled lens/post specific metadata stats */}
                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between font-mono text-[8px] text-slate-500 tracking-wider select-none">
                  <div className="flex flex-col gap-0.5">
                    <span>SYS // {service.lens}</span>
                    <span>RANGE // {service.focal}</span>
                  </div>
                  <div className="text-right flex items-end">
                    <span className="text-[var(--primary)] font-bold">LOCK: 100%</span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
