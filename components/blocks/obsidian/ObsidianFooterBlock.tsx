"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function ObsidianFooterBlock({ data, theme, isEditor }: any) {
  const fullName = data?.profile?.fullName || data?.fullName || "Lacete Studio";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
  const links = data?.links?.filter((l: any) => l.isActive !== false) || data?.user?.links?.filter((l: any) => l.isActive !== false) || [];

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-md';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const revealVariants: any = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };
  
  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <footer id="contact" className="pt-32 pb-10 px-6 border-t border-[rgba(255,255,255,0.1)] bg-[#030303]">
        <div className="max-w-screen-2xl mx-auto">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="text-center mb-32">
                <h2 className="font-heading text-6xl md:text-[8rem] font-medium tracking-tight mb-8">
                    <EditableText value={theme?.customTexts?.obs_footer_title || "Let's create."} field="obs_footer_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                </h2>
                <p className="font-body text-[#8a8a93] text-lg mb-10 max-w-xl mx-auto">
                    <EditableText value={theme?.customTexts?.obs_footer_desc || 'Have an idea in mind? Let us tell your story and leave a lasting impression.'} field="obs_footer_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />
                </p>
                <a href={`mailto:${userEmail}`} className={`inline-block obsidian-btn-primary px-10 py-5 ${btnShape} font-medium text-lg transition-transform hover:scale-105 duration-300`}>
                    <EditableText value={theme?.customTexts?.obs_footer_btn || 'Get in touch'} field="obs_footer_btn" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </a>
            </motion.div>

            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="flex flex-col md:flex-row justify-between items-center border-t border-[rgba(255,255,255,0.1)] pt-10 font-body text-sm text-[#8a8a93]">
                <p>&copy; {new Date().getFullYear()} {fullName}. All Rights Reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    {links.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover-accent transition-colors capitalize">
                            {l.platform}
                        </a>
                    ))}
                </div>
            </motion.div>
        </div>
    </footer>
  );
}
