"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import Link from 'next/link';

export function ViewfinderFooterBlock({ data, theme, isEditor }: any) {
  const animationTrigger = isEditor ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUpVariants = {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const email = data?.email || data?.user?.email || "hello@example.com";

  return (
    <div id="footer" className="w-full flex flex-col py-32 px-6 @md:px-12 @lg:px-20 bg-[#050505] shrink-0 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] opacity-20"></div>
        <div className="vf-scanline"></div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center relative z-10">
            <motion.h2
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                className="font-cinema tracking-wide text-[#F3F3F1] text-[clamp(48px,12cqw,120px)] uppercase leading-none mb-6"
            >
                <EditableText value={theme?.customTexts?.vf_footer_title || 'END OF TAPE'} field="vf_footer_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> <span style={{ color: 'var(--primary)' }}>.</span>
            </motion.h2>

            <motion.p
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                className="vf-hud-text font-bold uppercase tracking-[0.4em] text-white/40 mb-16"
            >
                <EditableText value={theme?.customTexts?.vf_footer_sub || 'TRANSMISSION_TERMINATED'} field="vf_footer_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
            </motion.p>

            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                className="flex flex-col @md:flex-row gap-6 @md:gap-12"
            >
                <a href={`mailto:${email}`}>
                    <motion.div
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                        className="flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white transition-all duration-300 cursor-pointer uppercase font-black tracking-[0.3em] text-[10px] @sm:text-xs min-w-[200px]"
                    >
                        <span><EditableText value={theme?.customTexts?.vf_btn_connect || 'INITIATE CONTACT'} field="vf_btn_connect" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                    </motion.div>
                </a>
            </motion.div>

            <motion.div
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                className="mt-32 w-full flex justify-between items-end border-t border-white/10 pt-8"
            >
                <div className="vf-hud-text text-white/30 tracking-widest text-[8px] @md:text-[10px] uppercase">
                    &copy; {new Date().getFullYear()} <EditableText value={data?.profile?.fullName || data?.fullName || 'JAMAL ARIFIN'} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                </div>
                <div className="flex gap-2">
                    <div className="w-1 h-4 bg-white/20"></div>
                    <div className="w-1 h-4 bg-white/40"></div>
                    <div className="w-1 h-4 bg-[var(--primary)]"></div>
                </div>
            </motion.div>
        </div>
    </div>
  );
}
