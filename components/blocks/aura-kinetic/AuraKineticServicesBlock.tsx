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
    <section id="services" className="py-24 px-6 relative overflow-hidden bg-transparent">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand-accent)] opacity-[0.03] rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-20 text-center max-w-3xl mx-auto">
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={cardVariants} viewport={{ once: true, amount: 0.5 }}>
                    <div className={`inline-block glass-panel ${btnShape} px-5 py-2 text-xs font-mono tracking-[0.2em] text-[var(--brand-accent)] mb-6 border border-white/10 bg-white/5`}>
                        <EditableText value={customTexts.aura_services_label || 'Expertise'} field="aura_services_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </div>
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
                        <EditableText value={customTexts.aura_services_title || 'What we do best.'} field="aura_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
                    </h2>
                </motion.div>
            </div>

            {/* Asymmetrical Cards without Icons */}
            <motion.div 
                initial="hidden" 
                {...{ [animationTrigger]: "visible" }} 
                variants={staggerReveal} 
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                {servicesData.map((service, index) => {
                    const isVisible = customTexts[`aura_svc_${service.id}_visible`] !== 'false';
                    if (!isVisible && !isEditor) return null;

                    return (
                        <motion.div 
                            key={service.id} 
                            variants={cardVariants}
                            className={`glass-panel ${cardShape} p-6 md:p-10 relative overflow-hidden group border border-white/10 transition-all duration-500 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col justify-between min-h-[260px] md:min-h-[380px] ${
                                !isVisible ? 'opacity-40 bg-white/5' : ''
                            }`}
                        >
                            {isEditor && (
                                <button
                                    onClick={() => toggleVisibility(service.id, isVisible)}
                                    className={`absolute top-4 right-4 z-30 px-2.5 py-0.5 text-[9px] font-mono border transition-all rounded-full ${
                                        isVisible 
                                            ? 'border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' 
                                            : 'border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white'
                                    }`}
                                    title={isVisible ? "Sembunyikan Layanan" : "Tampilkan Layanan"}
                                >
                                    {isVisible ? "✕ Sembunyikan" : "➕ Tampilkan"}
                                </button>
                            )}

                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--brand-accent)]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <div className="absolute -right-20 -top-20 w-48 h-48 bg-[var(--brand-accent)] rounded-full blur-[60px] opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none" />

                            {/* Top part: Label & Giant Number */}
                            <div className="flex justify-between items-start z-10">
                                <span className="font-mono text-[10px] md:text-xs tracking-widest text-white/30 group-hover:text-[var(--brand-accent)] transition-colors duration-500 font-bold uppercase">
                                    Capability
                                </span>
                                <span className="text-5xl md:text-8xl font-black font-mono leading-none text-white/[0.02] group-hover:text-[var(--brand-accent)]/15 select-none transition-all duration-700">
                                    {(index + 1).toString().padStart(2, '0')}
                                </span>
                            </div>

                            {/* Middle part: Title & Description */}
                            <div className="mt-4 md:mt-6 z-10">
                                <h3 className="font-heading text-lg md:text-3xl font-extrabold mb-2 md:mb-4 text-white uppercase tracking-tight">
                                    <EditableText value={customTexts[`aura_svc_${service.id}_title`] || service.defaultTitle} field={`aura_svc_${service.id}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                                </h3>
                                
                                <p className="font-body text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors font-light text-xs md:text-base">
                                    <EditableText value={customTexts[`aura_svc_${service.id}_desc`] || service.defaultDesc} field={`aura_svc_${service.id}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={150} />
                                </p>
                            </div>

                            {/* Bottom part: Kinetic loading line indicator */}
                            <div className="w-full h-[3px] bg-white/5 mt-4 md:mt-8 rounded-full overflow-hidden relative z-10">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[var(--brand-accent)] to-pink-500 rounded-full transition-transform duration-700 ease-out origin-left scale-x-0 group-hover:scale-x-100 shadow-[0_0_8px_var(--brand-accent)]" />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    </section>
  );
}
