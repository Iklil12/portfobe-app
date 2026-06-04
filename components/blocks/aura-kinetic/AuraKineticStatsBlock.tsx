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
    <section className="relative z-10 w-full max-w-[1000px] mx-auto px-6 py-12 md:py-20 border-y border-white/5 bg-white/[0.02]">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer} className="flex flex-wrap justify-center md:justify-between gap-10 text-center">
            {[
                { label: theme?.customTexts?.aura_stat_1 || 'Total Projects', value: (data?.projects || data?.user?.projects || []).length || 24, field: 'aura_stat_1', dynamic: true },
                { label: theme?.customTexts?.aura_stat_2 || 'Recognitions', value: awardItems.length || 5, field: 'aura_stat_2', dynamic: true },
                { label: theme?.customTexts?.aura_stat_3 || 'Years Active', value: theme?.customTexts?.aura_stat_3_val || '05+', field: 'aura_stat_3', valField: 'aura_stat_3_val', dynamic: false },
                { label: theme?.customTexts?.aura_stat_4 || 'Global Clients', value: theme?.customTexts?.aura_stat_4_val || '12+', field: 'aura_stat_4', valField: 'aura_stat_4_val', dynamic: false }
            ].map((stat, i) => (
                <motion.div key={i} variants={fadeUp} className="flex flex-col items-center">
                    <span className="font-serif text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40">
                        {stat.dynamic ? stat.value : <EditableText value={stat.value as string} field={stat.valField as string} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />}
                    </span>
                    <span className="font-sans text-xs uppercase tracking-widest text-white/50 mt-2">
                        <EditableText value={stat.label} field={stat.field} entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </span>
                </motion.div>
            ))}
        </motion.div>
    </section>
  );
}
