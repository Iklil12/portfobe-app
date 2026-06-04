"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function MonolithStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const [currentTime, setCurrentTime] = useState("");

    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d');
    const awardItems = data?.certificates || data?.user?.certificates || [];

    useEffect(() => {
        if (isCardPreview || isEditor) return;
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [isCardPreview, isEditor]);

    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };
    
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <motion.section 
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
            className="w-full bg-[#050505] py-12 px-6 @md:px-12 border-t border-b border-white/5 grid grid-cols-2 @lg:grid-cols-4 gap-8"
        >
            {[
                { 
                  labelKey: 'monolith_stat_1', 
                  defaultLabel: 'Projects', 
                  val: archiveItems.length 
                },
                { 
                  labelKey: 'monolith_stat_2', 
                  defaultLabel: 'Awards', 
                  val: awardItems.length 
                },
                { 
                  labelKey: 'monolith_stat_3', 
                  defaultLabel: 'Experience', 
                  val: <EditableText value={theme?.customTexts?.monolith_stat_3_val || 'Pro'} field="monolith_stat_3_val" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                },
                { 
                  labelKey: 'monolith_stat_4', 
                  defaultLabel: 'Time', 
                  val: currentTime || "00:00" 
                }
            ].map((stat, idx) => (
                <motion.div key={idx} variants={fadeUp} className="flex flex-col items-start gap-2">
                    <span className="font-serif font-bold text-4xl @lg:text-5xl text-white">{stat.val}</span>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        <EditableText value={theme?.customTexts?.[stat.labelKey] || stat.defaultLabel} field={stat.labelKey} entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                    </span>
                </motion.div>
            ))}
        </motion.section>
    );
}
