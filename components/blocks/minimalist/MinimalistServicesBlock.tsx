"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.15) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export const MinimalistServicesBlock = ({ data, theme, isEditor }: any) => {
  const customTexts = theme?.customTexts || {};

  const services = [
    { id: '1', defaultTitle: 'Minimalist Layout', defaultDesc: 'Clean, grid-based compositions that let content breathe.' },
    { id: '2', defaultTitle: 'Clean Typography', defaultDesc: 'Carefully paired typefaces for maximum legibility and impact.' },
    { id: '3', defaultTitle: 'High-end Visuals', defaultDesc: 'Polished imagery and motion that elevates the brand experience.' }
  ];

  const toggleVisibility = (id: string, currentStatus: boolean) => {
    if (!isEditor) return;
    window.parent.postMessage({
        type: 'INLINE_EDIT',
        entity: 'appearance',
        field: `min_svc_${id}_visible`,
        value: currentStatus ? 'false' : 'true'
    }, window.location.origin);
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <motion.section
      initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
      variants={getStaggerContainer(0, 0.1)}
      className="border-b border-gray-200"
    >
      <div className="p-8 @md:p-12 border-b border-gray-200">
        <motion.p variants={cinematicBlurUp} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 min-heading">
          <EditableText value={customTexts.min_services_label || 'Services'} field="min_services_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} className="min-heading" />
        </motion.p>
        <motion.h2 variants={cinematicBlurUp} className="text-2xl font-black tracking-tighter uppercase min-heading">
          <EditableText value={customTexts.min_services_title || 'What I Do'} field="min_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} className="min-heading" />
        </motion.h2>
      </div>

      <div className="flex flex-col">
        {services.map((service, i) => {
          const isVisible = customTexts[`min_svc_${service.id}_visible`] !== 'false';
          if (!isVisible && !isEditor) return null;

          return (
            <motion.div
              key={service.id}
              variants={cinematicBlurUp}
              className={`p-8 @md:px-12 border-b border-gray-200 last:border-b-0 group cursor-default flex flex-col @md:flex-row @md:items-center @md:justify-between gap-2 @md:gap-8 hover:bg-gray-50 transition-all duration-300 relative ${
                !isVisible ? 'opacity-40 bg-gray-50/50' : ''
              }`}
            >
              {isEditor && (
                <button
                  onClick={() => toggleVisibility(service.id, isVisible)}
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

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-gray-300 min-w-[24px]">
                  0{i + 1} {!isVisible && "[HIDDEN]"}
                </span>
                <h3 className="text-lg @md:text-xl font-black tracking-tighter uppercase min-heading group-hover:translate-x-2 transition-transform duration-300">
                  <EditableText value={customTexts[`min_svc_${service.id}_title`] || service.defaultTitle} field={`min_svc_${service.id}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} className="min-heading" />
                </h3>
              </div>
              <p className="text-xs @md:text-sm font-medium text-gray-400 w-full @md:w-1/2 min-body leading-relaxed group-hover:-translate-x-2 transition-transform duration-300">
                <EditableText value={customTexts[`min_svc_${service.id}_desc`] || service.defaultDesc} field={`min_svc_${service.id}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={120} className="min-body" />
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};
