"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

export const MinimalistFooterBlock = ({ data, theme, isEditor, blockConfig }: any) => {


  const animationTrigger = isEditor ? "animate" : "whileInView";
  const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";

  return (
    <motion.footer initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={cinematicBlurUp} custom={0.2} className={`p-8 text-center flex gap-4 bg-gray-100 border-t border-gray-200 min-body flex-col @md:flex-row @md:text-left justify-between @lg:p-12`}>
      <p className="text-[10px] font-mono text-gray-500">
        © {new Date().getFullYear()} {fullName}. <EditableText value={theme?.customTexts?.min_footer_rights || 'All Rights Reserved.'} field="min_footer_rights" entity="appearance" isEditor={isEditor} maxLength={30} as="span" className="min-body" />
      </p>
      <span className="text-[10px] font-bold uppercase tracking-widest text-black min-heading">portfo.be/{subdomain}</span>
    </motion.footer>
  );
};
