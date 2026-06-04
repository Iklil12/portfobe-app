"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function SpatialServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
  // Murni statis, tidak menggunakan data dari database
  const services = [
    { id: '1', defaultTitle: 'UI/UX Design', defaultDesc: 'Intuitive interfaces that balance form and function.', icon: 'fa-palette' },
    { id: '2', defaultTitle: 'Web Development', defaultDesc: 'Performant applications built with modern technology.', icon: 'fa-code' },
    { id: '3', defaultTitle: 'Brand Strategy', defaultDesc: 'Cohesive visual systems that communicate your story.', icon: 'fa-layer-group' },
  ];

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';

  const auraAnim = isCardPreview
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 40, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const staggerContainer = isCardPreview
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      id="services"
      className="w-full px-8 py-20 @md:py-32 max-w-screen-xl mx-auto"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.div variants={auraAnim} className={`inline-flex items-center gap-2 px-4 py-2 ${radiusClass} glass-panel mb-6`}>
          <span className="text-xs font-medium text-slate-300">
            <EditableText value={theme?.customTexts?.spatial_services_label || 'Services'} field="spatial_services_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </span>
        </motion.div>
        <motion.h2 variants={auraAnim} className="font-semibold tracking-[-0.03em] text-gradient leading-tight text-4xl @md:text-5xl">
          <EditableText value={theme?.customTexts?.spatial_services_title || 'What I bring to the table.'} field="spatial_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
        </motion.h2>
      </div>

      {/* Services Grid */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-6">
        {services.slice(0, 3).map((service, i) => (
          <motion.div
            key={service.id}
            variants={auraAnim}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`glass-panel ${radiusClass} p-8 @md:p-10 border border-white/5 hover:border-white/20 transition-all duration-500 group relative overflow-hidden`}
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--hl)] rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="relative">
              <div className={`w-12 h-12 ${radiusClass} bg-white/5 border border-white/10 flex items-center justify-center text-xl text-[var(--hl)] mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <i className={`fas ${service.icon || 'fa-cube'}`}></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                <EditableText value={theme?.customTexts?.[`spatial_svc_${service.id}_title`] || service.defaultTitle} field={`spatial_svc_${service.id}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                <EditableText value={theme?.customTexts?.[`spatial_svc_${service.id}_desc`] || service.defaultDesc} field={`spatial_svc_${service.id}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={120} />
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
