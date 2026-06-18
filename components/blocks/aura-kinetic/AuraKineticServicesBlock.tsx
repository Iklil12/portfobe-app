"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function AuraKineticServicesBlock({ data, theme, isEditor }: any) {
  const customTexts = theme?.customTexts || {};

  const servicesData = [
      { id: '1', defaultTitle: 'Interactive Design', defaultDesc: 'Fluid UI/UX that adapts and responds to user intent.', icon: 'fa-wand-magic-sparkles' },
      { id: '2', defaultTitle: 'Creative Development', defaultDesc: 'High-performance web applications built with modern frameworks.', icon: 'fa-code' },
      { id: '3', defaultTitle: 'Motion Graphics', defaultDesc: 'Cinematic animations that tell compelling stories.', icon: 'fa-film' },
  ];

  const toggleVisibility = (id: string, currentStatus: boolean) => {
      if (!isEditor) return;
      window.parent.postMessage({
          type: 'INLINE_EDIT',
          entity: 'appearance',
          field: `aura_svc_${id}_visible`,
          value: currentStatus ? 'false' : 'true'
      }, window.location.origin);
  };

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const cardShape = theme?.cardStyle === 'hard' || theme?.cardStyle === 'hard-shadow' ? 'rounded-none' : 'rounded-3xl';

  const staggerReveal: any = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants: any = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <section id="services" className="py-24 px-6 relative">
        <div className="max-w-screen-2xl mx-auto">
            
            <div className="mb-20 text-center max-w-3xl mx-auto">
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={cardVariants} viewport={{ once: true, amount: 0.5 }}>
                    <div className={`inline-block glass-panel ${btnShape} px-4 py-1.5 text-xs font-medium tracking-widest text-white mb-6 border border-white/20`}>
                        <EditableText value={customTexts.aura_services_label || 'Expertise'} field="aura_services_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </div>
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        <EditableText value={customTexts.aura_services_title || 'What we do best.'} field="aura_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
                    </h2>
                </motion.div>
            </div>

            <motion.div 
                initial="hidden" 
                {...{ [animationTrigger]: "visible" }} 
                variants={staggerReveal} 
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {servicesData.map((service, index) => {
                    const isVisible = customTexts[`aura_svc_${service.id}_visible`] !== 'false';
                    if (!isVisible && !isEditor) return null;

                    return (
                        <motion.div 
                            key={service.id} 
                            variants={cardVariants}
                            whileHover={{ y: -10 }}
                            className={`glass-panel ${cardShape} p-8 md:p-10 relative overflow-hidden group border border-white/5 transition-all duration-500 hover:border-white/20 hover:bg-white/10 ${
                                !isVisible ? 'opacity-40 bg-white/5' : ''
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
                                    title={isVisible ? "Sembunyikan Layanan" : "Tampilkan Layanan"}
                                >
                                    {isVisible ? "✕ Sembunyikan" : "➕ Tampilkan"}
                                </button>
                            )}

                            {/* Glow effect on hover */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-accent)] rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="relative">
                                <div className={`w-14 h-14 bg-white/5 border border-white/10 ${btnShape} flex items-center justify-center mb-8 text-2xl text-[var(--brand-accent)] group-hover:scale-110 transition-transform duration-500`}>
                                    <i className={`fas ${service.icon || 'fa-cube'}`}></i>
                                </div>
                                
                                <h3 className="font-heading text-2xl font-bold mb-4 text-white">
                                    <EditableText value={customTexts[`aura_svc_${service.id}_title`] || service.defaultTitle} field={`aura_svc_${service.id}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                                </h3>
                                
                                <p className="font-body text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    <EditableText value={customTexts[`aura_svc_${service.id}_desc`] || service.defaultDesc} field={`aura_svc_${service.id}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={150} />
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    </section>
  );
}
