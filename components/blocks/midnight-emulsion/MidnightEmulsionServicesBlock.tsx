"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsionServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const canvasEase = [0.22, 1, 0.36, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
  };

  // Murni statis, tidak menggunakan data dari database
  const services = [
    { id: '1', defaultTitle: "Art Direction", defaultDesc: "Guiding the visual language and conceptual framework of digital narratives." },
    { id: '2', defaultTitle: "Cinematography", defaultDesc: "Capturing light and shadow to create compelling visual compositions." },
    { id: '3', defaultTitle: "Interactive Design", defaultDesc: "Building immersive digital environments with precise interaction models." }
  ];

  return (
    <div className="w-full flex flex-col py-24 @md:py-32 px-8 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508]/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--hl)] opacity-5 blur-[150px] pointer-events-none rounded-full"></div>
      
      <div className="max-w-7xl mx-auto w-full">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-16">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-4 block">
            <EditableText value={theme?.customTexts?.midnight_services_top || 'Production Capabilities'} field="midnight_services_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
          </span>
          <h2 className="font-serif text-4xl @md:text-6xl text-white uppercase tracking-wide">
            <EditableText value={theme?.customTexts?.midnight_services_title || 'Disciplines'} field="midnight_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </h2>
        </motion.div>

        <div className="flex flex-col border-t border-white/10">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
              className="group flex flex-col @md:flex-row gap-6 @md:gap-12 py-8 @md:py-12 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-500 relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--hl)] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500"></div>
              
              <div className="w-16 @md:w-24 shrink-0 px-4 @md:px-8 pt-2">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-slate-600 group-hover:text-[var(--hl)] transition-colors">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
              </div>
              
              <div className="flex flex-col gap-4 flex-1 pr-4 @md:pr-12">
                <h3 className="font-serif text-3xl @md:text-4xl text-white group-hover:text-white transition-colors">
                  <EditableText value={theme?.customTexts?.[`midnight_srv_title_${service.id}`] || service.defaultTitle} field={`midnight_srv_title_${service.id}`} entity="appearance" isEditor={isEditor} as="span" maxLength={50} />
                </h3>
                <p className="font-sans text-sm @md:text-base text-slate-400 leading-relaxed max-w-2xl">
                  <EditableText value={theme?.customTexts?.[`midnight_srv_desc_${service.id}`] || service.defaultDesc} field={`midnight_srv_desc_${service.id}`} entity="appearance" isEditor={isEditor} as="span" maxLength={200} />
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
