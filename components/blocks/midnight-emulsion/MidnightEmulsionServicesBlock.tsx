"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function MidnightEmulsionServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
  const customTexts = theme?.customTexts || {};
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const canvasEase = [0.22, 1, 0.36, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
  };

  const toggleVisibility = (id: string, currentStatus: boolean) => {
    if (!isEditor) return;
    window.parent.postMessage({
        type: 'INLINE_EDIT',
        entity: 'appearance',
        field: `midnight_srv_${id}_visible`,
        value: currentStatus ? 'false' : 'true'
    }, window.location.origin);
  };

  const services = [
    { id: '1', defaultTitle: "Art Direction", defaultDesc: "Guiding the visual language and conceptual framework of digital narratives." },
    { id: '2', defaultTitle: "Cinematography", defaultDesc: "Capturing light and shadow to create compelling visual compositions." },
    { id: '3', defaultTitle: "Interactive Design", defaultDesc: "Building immersive digital environments with precise interaction models." }
  ];

  return (
    <div className="w-full flex flex-col py-16 @md:py-32 px-4 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508]/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--hl)] opacity-5 blur-[150px] pointer-events-none rounded-full"></div>
      
      <div className="max-w-7xl mx-auto w-full">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-10 @md:mb-16">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2 @md:mb-4 block">
            <EditableText value={customTexts.midnight_services_top || 'Production Capabilities'} field="midnight_services_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
          </span>
          <h2 className="font-serif text-3xl @xs:text-4xl @md:text-6xl text-white uppercase tracking-wide">
            <EditableText value={customTexts.midnight_services_title || 'Disciplines'} field="midnight_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </h2>
        </motion.div>
 
        <div className="flex flex-col border-t border-white/10">
          {services.map((service, index) => {
            const isVisible = customTexts[`midnight_srv_${service.id}_visible`] !== 'false';
            if (!isVisible && !isEditor) return null;
 
            return (
              <motion.div 
                key={service.id}
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                className={`group flex flex-row gap-4 @md:gap-12 py-5 @md:py-12 border-b border-white/10 hover:bg-white/[0.02] transition-all duration-500 relative ${
                  !isVisible ? 'opacity-40 bg-zinc-950/20' : ''
                }`}
              >
                {isEditor && (
                  <button
                    onClick={() => toggleVisibility(service.id, isVisible)}
                    className={`absolute top-2 right-2 z-30 px-2 py-0.5 text-[8px] @md:text-[10px] font-mono border transition-all ${
                        isVisible 
                            ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                            : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                    }`}
                    title={isVisible ? "Sembunyikan" : "Tampilkan"}
                  >
                    {isVisible ? "✕ Hide" : "➕ Show"}
                  </button>
                )}
 
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--hl)] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500"></div>
                
                <div className="w-10 @md:w-24 shrink-0 px-1 @md:px-8 pt-1 @md:pt-2">
                  <span className="font-sans text-[10px] @md:text-xs font-bold uppercase tracking-[0.3em] text-slate-600 group-hover:text-[var(--hl)] transition-colors">
                    {(index + 1).toString().padStart(2, '0')} {!isVisible && "[HIDDEN]"}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1.5 @md:gap-4 flex-1 pr-2 @md:pr-12">
                  <h3 className="font-serif text-xl @xs:text-2xl @md:text-4xl text-white group-hover:text-white transition-colors">
                    <EditableText value={customTexts[`midnight_srv_title_${service.id}`] || service.defaultTitle} field={`midnight_srv_title_${service.id}`} entity="appearance" isEditor={isEditor} as="span" maxLength={50} />
                  </h3>
                  <p className="font-sans text-xs @md:text-base text-slate-400 leading-relaxed max-w-2xl">
                    <EditableText value={customTexts[`midnight_srv_desc_${service.id}`] || service.defaultDesc} field={`midnight_srv_desc_${service.id}`} entity="appearance" isEditor={isEditor} as="span" maxLength={200} />
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
