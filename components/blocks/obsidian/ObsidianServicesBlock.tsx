"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function ObsidianServicesBlock({ data, theme, isEditor }: any) {
  const customTexts = theme?.customTexts || {};

  const services = [
      { id: '1', title: 'Post-Production', description: 'Offering comprehensive editing services to enhance video quality, including color correction, sound editing, and special effects.' },
      { id: '2', title: 'Creative Development', description: 'Our creative team can create the scripts for your next commercial or film, ensuring the narrative aligns perfectly with your brand identity.' },
      { id: '3', title: 'Drone & Aerial Video', description: 'We are commercial drone licensed and offer aerial photos and videos for real estate and other projects.' }
  ];

  const toggleVisibility = (index: number, currentStatus: boolean) => {
      if (!isEditor) return;
      window.parent.postMessage({
          type: 'INLINE_EDIT',
          entity: 'appearance',
          field: `obsidian_svc_${index}_visible`,
          value: currentStatus ? 'false' : 'true'
      }, window.location.origin);
  };

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
    <section id="services" className="py-16 md:py-24 px-6 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-4">
                    <div className="sticky top-32">
                        <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                            <EditableText value={customTexts.obs_services_label || 'What we do'} field="obs_services_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                        </span>
                        <h2 className="font-heading text-4xl md:text-5xl font-medium">
                            <EditableText value={customTexts.obs_services_title || 'Our Services'} field="obs_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                        </h2>
                    </div>
                </motion.div>
                
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="md:col-span-8 flex flex-col">
                    {services.map((svc: any, i: number) => {
                        const isVisible = customTexts[`obsidian_svc_${i}_visible`] !== 'false';
                        if (!isVisible && !isEditor) return null;

                        return (
                            <motion.div 
                                key={i} 
                                variants={revealVariants} 
                                className={`border-t border-[rgba(255,255,255,0.1)] py-10 group cursor-default relative ${
                                    !isVisible ? 'opacity-40 bg-zinc-950/20' : ''
                                }`}
                            >
                                {isEditor && (
                                    <button
                                        onClick={() => toggleVisibility(i, isVisible)}
                                        className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all ${
                                            isVisible 
                                                ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                                : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                        }`}
                                        title={isVisible ? "Sembunyikan" : "Tampilkan"}
                                    >
                                        {isVisible ? "✕ Hide" : "➕ Show"}
                                    </button>
                                )}

                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-heading text-2xl md:text-3xl font-medium group-hover-accent transition-all duration-300">
                                        <EditableText value={customTexts[`svc_${i}_title`] || svc.title || svc.name || 'Service Title'} field={`svc_${i}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                                        {!isVisible && " [HIDDEN]"}
                                    </h3>
                                    <i className="fas fa-arrow-right text-xl opacity-0 group-hover:opacity-100 transition-opacity group-hover-accent"></i>
                                </div>
                                <p className="font-body text-[#8a8a93] leading-relaxed max-w-2xl">
                                    <EditableText value={customTexts[`svc_${i}_desc`] || svc.description || 'Service description goes here...'} field={`svc_${i}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={200} />
                                </p>
                            </motion.div>
                        );
                    })}
                    <div className="border-t border-[rgba(255,255,255,0.1)]"></div>
                </motion.div>
            </div>
        </div>
    </section>
  );
}
