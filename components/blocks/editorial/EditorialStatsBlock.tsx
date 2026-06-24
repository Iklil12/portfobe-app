import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function EditorialStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const stats = [
        {
            value: theme?.customTexts?.editorial_stat1_val || "12+",
            fieldVal: "editorial_stat1_val",
            label: theme?.customTexts?.editorial_stat1_label || "Years of Experience",
            fieldLabel: "editorial_stat1_label"
        },
        {
            value: theme?.customTexts?.editorial_stat2_val || "80+",
            fieldVal: "editorial_stat2_val",
            label: theme?.customTexts?.editorial_stat2_label || "Global Clients",
            fieldLabel: "editorial_stat2_label"
        },
        {
            value: theme?.customTexts?.editorial_stat3_val || "150",
            fieldVal: "editorial_stat3_val",
            label: theme?.customTexts?.editorial_stat3_label || "Projects Delivered",
            fieldLabel: "editorial_stat3_label"
        },
        {
            value: theme?.customTexts?.editorial_stat4_val || "14",
            fieldVal: "editorial_stat4_val",
            label: theme?.customTexts?.editorial_stat4_label || "Industry Awards",
            fieldLabel: "editorial_stat4_label"
        }
    ];

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    return (
        <section className="w-full bg-[#fdfdfc] border-t border-b border-subtle overflow-hidden">
            <div className="max-w-[1600px] mx-auto w-full grid grid-cols-2 @lg:grid-cols-4">
                {stats.map((stat, i) => {
                    // Border classes for perfect responsive grid (2x2 on mobile, 1x4 on desktop)
                    const borderClasses = `
                        px-6 py-12 @md:px-12 @md:py-20 flex flex-col justify-between relative group transition-colors duration-500 hover:bg-[#fbfbfa]
                        ${i === 0 ? 'border-r border-b @lg:border-b-0' : ''}
                        ${i === 1 ? 'border-b @lg:border-b-0 @lg:border-r' : ''}
                        ${i === 2 ? 'border-r' : ''}
                        border-subtle
                    `;

                    return (
                        <motion.div
                            key={i}
                            initial="hidden" 
                            {...{ [animationTrigger]: "visible" }} 
                            viewport={{ once: true, amount: 0.1 }} 
                            variants={fadeUp}
                            className={borderClasses}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-mono text-[9px] @md:text-[10px] tracking-widest text-slate-400">
                                    [ 0{i + 1} ]
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[var(--hl)] transition-colors duration-300"></span>
                            </div>

                            <div>
                                <h3 className="font-serif italic text-5xl @md:text-6xl @lg:text-8xl text-[#111] mb-3 group-hover:text-[var(--hl)] transition-colors duration-500 leading-none">
                                    <EditableText value={stat.value} field={stat.fieldVal} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                                </h3>
                                <p className="font-sans text-[10px] @md:text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-[#111] transition-colors duration-300">
                                    <EditableText value={stat.label} field={stat.fieldLabel} entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
