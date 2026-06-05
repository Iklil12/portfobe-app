"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { BentoGridContext } from './BentoGridShell';

export function BentoGridMarqueeBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { highlightColor } = useContext(BentoGridContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const techStack = [
        { icon: 'fa-react', name: 'React', color: '#61dafb' },
        { icon: 'fa-js', name: 'JavaScript', color: '#f7df1e' },
        { icon: 'fa-node-js', name: 'Node.js', color: '#339933' },
        { icon: 'fa-figma', name: 'Figma', color: '#f24e1e' },
        { icon: 'fa-aws', name: 'AWS', color: '#ff9900' },
        { icon: 'fa-docker', name: 'Docker', color: '#2496ed' },
        { icon: 'fa-python', name: 'Python', color: '#3776ab' },
        { icon: 'fa-git-alt', name: 'Git', color: '#f34f29' },
    ];

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 w-full">
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex items-center p-6 @md:p-8 gap-6 overflow-hidden @lg:col-span-4 @lg:row-span-1 flex-row w-full`}
            >
                <div className="shrink-0 pointer-events-none">
                    <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1">
                        <EditableText value={theme?.customTexts?.bento_marquee_sub || 'Tech Stack'} field="bento_marquee_sub" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                    </p>
                    <h4 className="text-xl font-bold text-white whitespace-nowrap pointer-events-auto">
                        <EditableText value={theme?.customTexts?.bento_marquee_title || 'My Arsenal'} field="bento_marquee_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h4>
                </div>
                <div className="scroller w-full relative flex items-center group">
                    <div className={`scroller__inner ${isEditor ? '' : 'group-hover:[animation-play-state:paused]'}`}>
                        <div className="flex gap-4 pr-4">
                            {[...techStack, ...techStack, ...techStack].map((tech, i) => (
                                <div key={`t1-${i}`} className={`${cardStyleClass} ${cardRadiusClass} flex items-center justify-center w-14 h-14 shrink-0 transition-colors cursor-crosshair hover:!border-[var(--hl)]`}>
                                    <i className={`fab ${tech.icon} text-2xl text-slate-500 transition-colors duration-300 hover:text-[var(--hl)]`}></i>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
