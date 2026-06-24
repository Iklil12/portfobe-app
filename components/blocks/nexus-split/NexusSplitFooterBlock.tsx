"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { EditableText } from '@/shared/ui/EditableText';

export function NexusSplitFooterBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
  const userEmail = data?.email || data?.user?.email || `hello@username.com`;
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  const buttonShape = theme?.buttonShape || 'rounded';
  const radiusClass = buttonShape === 'square' || buttonShape === 'hard' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';

  const nexusEase = [0.16, 1, 0.3, 1] as any;
  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemFadeUp = {
      hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: nexusEase } }
  };

  return (
    <footer className={`flex flex-col pt-24 pb-12 px-6 @md:px-12`}>
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="flex flex-col items-start mb-20">
            <motion.span variants={itemFadeUp} className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--hl)] mb-4">
                <EditableText value={theme?.customTexts?.nexus_footer_sub || "What's Next?"} field="nexus_footer_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </motion.span>
            <motion.h2 variants={itemFadeUp} className="font-display font-extrabold text-5xl @md:text-7xl @lg:text-[6cqi] text-white leading-[0.9] mb-8">
                <EditableText value={theme?.customTexts?.nexus_footer_title || "Let's build the future."} field="nexus_footer_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
            </motion.h2>
            <motion.a variants={itemFadeUp} href={`mailto:${userEmail}`} className={`px-8 py-4 bg-white text-black hover:bg-[var(--hl)] hover:text-white ${radiusClass} font-sans font-bold text-sm uppercase tracking-widest transition-colors duration-300`}>
                <EditableText value={theme?.customTexts?.nexus_btn_touch || "Get in Touch"} field="nexus_btn_touch" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
            </motion.a>
        </motion.div>

        <div className="w-full flex flex-col @md:flex-row justify-between items-center gap-6 pt-8 border-t nexus-border font-sans font-medium text-xs text-slate-500 uppercase tracking-widest">
            <span>© {new Date().getFullYear()} {fullName}</span>
            
            {/* Socials for mobile at footer */}
            <div className="flex items-center gap-6 my-2 @md:hidden flex-wrap justify-center">
                {links.map((l: any, i: number) => (
                    <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{l.platform}</a>
                ))}
            </div>

            <Link href={`/${subdomain}`} className="hover:text-[var(--hl)] transition-colors">
                PORTFO.BE/{subdomain.toUpperCase()}
            </Link>
        </div>
    </footer>
  );
}
