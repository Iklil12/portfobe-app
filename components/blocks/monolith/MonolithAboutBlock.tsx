"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function MonolithAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const profession = data?.profile?.profession || data?.profession || "Creative Director & Designer";
    const bio = data?.profile?.bio || data?.bio || "We craft digital experiences that transcend the ordinary. Merging aesthetic elegance with relentless engineering.";
    const links = data?.links?.filter((l: any) => l.isActive !== false) || data?.user?.links?.filter((l: any) => l.isActive !== false) || [];

    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    return (
        <section id="about" className={`relative z-10 w-full bg-white text-black mt-[-20px] rounded-t-[30px] @md:rounded-t-[50px] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pt-16 pb-20 px-6 @md:pt-32 @md:pb-40 @md:px-12`}>
            <div className={`flex justify-between items-start mx-auto max-w-[1800px] flex-col gap-8 @md:flex-row @md:gap-20`}>
                <div className={`w-full @md:w-2/3`}>
                    <motion.h2 
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                        className={`font-serif leading-tight text-3xl @md:text-5xl @lg:text-[3.5cqi]`}
                    >
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={200} />
                    </motion.h2>
                </div>
                
                <div className={`w-full flex flex-col gap-6 @md:gap-8 @md:w-1/3`}>
                    <motion.p initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className={`font-sans font-medium text-slate-600 leading-relaxed border-l-2 border-black text-sm pl-4 @md:text-xl @md:pl-6`}>
                        <EditableText value={theme?.customTexts?.monolith_about_prefix || 'I am a'} field="monolith_about_prefix" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> <strong className="text-black"><EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={50} /></strong> <EditableText value={theme?.customTexts?.monolith_about_suffix || 'specializing in pushing the boundaries of digital and visual aesthetics.'} field="monolith_about_suffix" entity="appearance" isEditor={isEditor} as="span" maxLength={150} />
                    </motion.p>
                    
                    <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className={`flex flex-col gap-3 mt-4 @md:mt-8`}>
                        <span className="font-sans text-[10px] @md:text-xs font-bold uppercase tracking-widest text-slate-400">
                            <EditableText value={theme?.customTexts?.monolith_about_connect || 'Connect'} field="monolith_about_connect" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                        </span>
                        <div className="flex flex-wrap gap-3">
                            {links.map((l: any, i: number) => (
                                <a key={i} href={l.url} target="_blank" rel="noreferrer" className={`rounded-full border border-black hover:bg-black hover:text-white transition-colors font-sans font-bold uppercase tracking-wider px-4 py-2 text-[10px] @md:px-6 @md:py-3 @md:text-sm`}>
                                    {l.platform}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

        </section>
    );
}
