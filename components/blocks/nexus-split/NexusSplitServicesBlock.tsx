"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function NexusSplitServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const services = [
      { id: '1', defaultTitle: 'SYSTEM ARCHITECTURE', defaultDesc: 'Designing scalable and robust technical foundations for enterprise-grade applications.', defaultPrice: '5,000' },
      { id: '2', defaultTitle: 'UI/UX ENGINEERING', defaultDesc: 'Crafting pixel-perfect, highly interactive user interfaces that bridge aesthetics and functionality.', defaultPrice: '3,000' },
      { id: '3', defaultTitle: 'PERFORMANCE OPTIMIZATION', defaultDesc: 'Analyzing and refactoring codebases to achieve maximum speed and efficiency.', defaultPrice: '2,000' },
      { id: '4', defaultTitle: 'TECHNICAL CONSULTING', defaultDesc: 'Providing expert guidance on modern tech stacks, infrastructure, and team workflows.', defaultPrice: '1,500' }
  ];

  const buttonShape = theme?.buttonShape || 'rounded';
  const cardRadiusClass = buttonShape === 'square' || buttonShape === 'hard' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-3xl' : 'rounded-2xl';

  const nexusEase = [0.16, 1, 0.3, 1] as any;
  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: { staggerChildren: 0.25, delayChildren: 0.1 }
      }
  };
  const itemFadeUp = {
      hidden: { opacity: 0, y: 60, filter: 'blur(15px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: nexusEase } }
  };
  const gridItemVariants = {
      hidden: { opacity: 0, y: 80, scale: 0.85, filter: 'blur(20px)' },
      visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.2, ease: nexusEase } }
  };

  return (
    <motion.section 
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
        className="flex flex-col pt-16 @lg:pt-24 pb-16 border-b nexus-border"
    >
        <motion.div variants={itemFadeUp} className="mb-10 px-6 @md:px-12 flex justify-between items-end">
            <h2 className="font-display font-extrabold text-4xl @lg:text-6xl text-white">
                <EditableText value={theme?.customTexts?.nexus_services_title || 'Capabilities'} field="nexus_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </h2>
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 hidden @sm:block">
                // <EditableText value={theme?.customTexts?.nexus_services_subtitle || 'Operational'} field="nexus_services_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
            </span>
        </motion.div>

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-px bg-white/10 border-y nexus-border">
            {services.map((s, i) => (
                <motion.div
                    key={s.id}
                    variants={gridItemVariants}
                    className="bg-[#050505] p-8 @md:p-12 hover:bg-white/5 transition-colors group relative"
                >
                    <div className="flex justify-between items-start mb-6">
                        <span className="font-sans text-xs font-bold text-white/30 tracking-[0.2em]">0{i + 1}</span>
                        <div className="h-px w-12 bg-white/20 mt-2 group-hover:w-24 group-hover:bg-[var(--hl)] transition-all duration-700 ease-out"></div>
                    </div>
                    <h3 className="font-display font-bold text-2xl @md:text-3xl text-white mb-4 group-hover:text-[var(--hl)] transition-colors">
                        <EditableText value={theme?.customTexts?.[`nexus_svc_${s.id}_title`] || s.defaultTitle} field={`nexus_svc_${s.id}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                    </h3>
                    <p className="font-sans text-sm @md:text-base text-slate-400 leading-relaxed mb-12 max-w-sm">
                        <EditableText value={theme?.customTexts?.[`nexus_svc_${s.id}_desc`] || s.defaultDesc} field={`nexus_svc_${s.id}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={120} />
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                        <span className={`px-4 py-2 bg-white/5 border border-white/10 font-sans text-[10px] font-bold uppercase tracking-wider text-white ${cardRadiusClass}`}>
                            <EditableText value={theme?.customTexts?.nexus_services_from || 'From'} field="nexus_services_from" entity="appearance" isEditor={isEditor} as="span" maxLength={10} /> $<EditableText value={theme?.customTexts?.[`nexus_svc_${s.id}_price`] || s.defaultPrice} field={`nexus_svc_${s.id}_price`} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    </motion.section>
  );
}
