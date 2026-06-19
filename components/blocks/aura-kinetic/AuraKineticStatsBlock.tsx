"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function AuraKineticStatsBlock({ data, theme, isEditor }: any) {
  const awardItems = data?.certificates || data?.user?.certificates || [];

  const smoothEase = [0.16, 1, 0.3, 1] as any;

  const fadeUp = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
  };

  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Glassmorphic Container */}
        <div className="glass-panel rounded-3xl border border-white/10 bg-white/[0.01] hover:border-white/20 transition-all duration-500 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            
            {/* Ambient Background Glow inside the container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--brand-accent)] opacity-[0.03] rounded-full blur-[80px] pointer-events-none" />

            <motion.div 
                initial="hidden" 
                {...{ [animationTrigger]: "visible" }} 
                viewport={{ once: true, amount: 0.1 }} 
                variants={staggerContainer} 
                className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-white/10 relative z-10"
            >
                {[
                    { label: theme?.customTexts?.aura_stat_1 || 'Total Projects', value: (data?.projects || data?.user?.projects || []).length || 24, field: 'aura_stat_1', dynamic: true },
                    { label: theme?.customTexts?.aura_stat_2 || 'Recognitions', value: awardItems.length || 5, field: 'aura_stat_2', dynamic: true },
                    { label: theme?.customTexts?.aura_stat_3 || 'Years Active', value: theme?.customTexts?.aura_stat_3_val || '05+', field: 'aura_stat_3', valField: 'aura_stat_3_val', dynamic: false },
                    { label: theme?.customTexts?.aura_stat_4 || 'Global Clients', value: theme?.customTexts?.aura_stat_4_val || '12+', field: 'aura_stat_4', valField: 'aura_stat_4_val', dynamic: false }
                ].map((stat, i) => (
                    <motion.div 
                        key={i} 
                        variants={fadeUp} 
                        className="flex flex-col items-center justify-center py-8 px-4 group relative overflow-hidden transition-all duration-500"
                    >
                        {/* Hover Circle Glow */}
                        <div className="absolute w-24 h-24 rounded-full bg-[var(--brand-accent)] opacity-0 group-hover:opacity-[0.06] blur-2xl scale-75 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

                        <span className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white group-hover:text-[var(--brand-accent)] transition-colors duration-500 tracking-tight leading-none">
                            {stat.dynamic ? stat.value : <EditableText value={stat.value as string} field={stat.valField as string} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />}
                        </span>
                        
                        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-white/80 transition-colors duration-500 mt-4 text-center">
                            <EditableText value={stat.label} field={stat.field} entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
  );
}
