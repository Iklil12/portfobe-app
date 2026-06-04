"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function ViewfinderServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  // Murni statis, tidak menggunakan data dari database
  const services = [
    { id: '1', defaultTitle: "CINEMATOGRAPHY", defaultDesc: "Capturing light and shadow to create compelling visual compositions with cinema-grade equipment." },
    { id: '2', defaultTitle: "COLOR GRADING", defaultDesc: "Developing specific visual palettes that enhance the emotional resonance of the narrative." },
    { id: '3', defaultTitle: "POST PRODUCTION", defaultDesc: "Assembling narrative structures through precise editorial rhythm and pacing." }
  ];

  return (
    <div className="w-full flex flex-col py-24 px-6 @md:px-12 @lg:px-20 border-b border-white/10 bg-[#050505] shrink-0">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-16 border-b border-white/10 pb-6 flex justify-between items-end">
          <h2 className="font-cinema text-5xl @md:text-6xl text-white uppercase tracking-wide">
            <EditableText value={theme?.customTexts?.vf_services_title || 'CAPABILITIES'} field="vf_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
          </h2>
          <span className="vf-hud-text font-bold uppercase tracking-[0.3em] text-[var(--primary)] block text-right">
            <EditableText value={theme?.customTexts?.vf_services_top || 'SYS_MODULES'} field="vf_services_top" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </span>
        </motion.div>

        <div className="grid grid-cols-1 @md:grid-cols-3 gap-6 @md:gap-12">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
              className="group flex flex-col p-8 border border-white/10 bg-[#111] hover:border-[var(--primary)] transition-colors duration-500 relative"
            >
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-transparent group-hover:border-[var(--primary)] transition-colors"></div>
              
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <span className="vf-hud-text font-bold uppercase tracking-[0.3em] text-[var(--primary)]">
                  MOD_0{index + 1}
                </span>
                <i className="fas fa-crosshairs text-white/20 group-hover:text-[var(--primary)] transition-colors"></i>
              </div>
              
              <h3 className="font-cinema text-3xl @md:text-4xl text-white group-hover:text-white transition-colors mb-4">
                <EditableText value={theme?.customTexts?.[`vf_srv_title_${service.id}`] || service.defaultTitle} field={`vf_srv_title_${service.id}`} entity="appearance" isEditor={isEditor} as="span" maxLength={50} />
              </h3>
              <p className="vf-body text-xs @md:text-sm text-[#F3F3F1]/60 leading-relaxed text-justify">
                <EditableText value={theme?.customTexts?.[`vf_srv_desc_${service.id}`] || service.defaultDesc} field={`vf_srv_desc_${service.id}`} entity="appearance" isEditor={isEditor} as="span" maxLength={200} />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
