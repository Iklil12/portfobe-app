import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

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
        <section className={`w-full bg-[#fdfdfc] border-t border-subtle`}>
            <div className={`max-w-[1600px] mx-auto w-full grid grid-cols-2 @lg:grid-cols-4`}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                        className={`flex flex-col justify-center px-6 py-12 @md:px-12 @md:py-20 border-b @lg:border-b-0 @lg:border-r border-subtle relative group`}
                    >
                        {/* Remove right border on last item for large screens */}
                        {i === stats.length - 1 && <style>{`@media (min-width: 1024px) { .group:last-child { border-right: none; } }`}</style>}
                        
                        <h3 className="font-serif italic text-5xl @md:text-6xl @lg:text-8xl text-[#111] mb-2 group-hover:text-[var(--hl)] transition-colors duration-500">
                            <EditableText value={stat.value} field={stat.fieldVal} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                        </h3>
                        <span className="font-sans text-xs @md:text-sm font-bold uppercase tracking-widest text-slate-400">
                            <EditableText value={stat.label} field={stat.fieldLabel} entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                        </span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
