"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function AuraKineticFooterBlock({ data, theme, isEditor }: any) {
  const [isCopied, setIsCopied] = useState(false);
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
  const fullName = data?.profile?.fullName || data?.fullName || "Aura Studio";
  const links = data?.links || data?.user?.links || [];

  const handleCopyEmail = () => {
      navigator.clipboard.writeText(userEmail);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-full';
  };
  const radiusClass = getBtnShapeClass(theme?.buttonShape);

  const fadeUp = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <>
        <div className="relative z-10 w-full overflow-hidden border-y border-white/5 py-6 bg-[var(--hl)]/10 mt-20 backdrop-blur-md">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee { animation: marquee 20s linear infinite; }
            `}} />
            <div className="flex whitespace-nowrap animate-marquee w-max">
                {[...Array(6)].map((_, i) => (
                    <span key={i} className="font-serif text-2xl md:text-4xl italic text-white/50 px-8 flex items-center gap-8">
                        <EditableText value={theme?.customTexts?.aura_marquee || "Let's build something extraordinary."} field="aura_marquee" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                        <span className="w-3 h-3 rounded-full bg-[var(--hl)]"></span>
                    </span>
                ))}
            </div>
        </div>

        <footer className="relative z-10 w-full px-6 py-32 border-t border-white/5 bg-black/20 overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60cqi] h-[30cqi] bg-[var(--hl)] opacity-20 blur-[150px] rounded-t-full pointer-events-none"></div>

            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--hl)] mb-6">
                    <EditableText value={theme?.customTexts?.aura_footer_top || 'Got an Idea?'} field="aura_footer_top" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </span>

                <h2 className="font-serif text-5xl md:text-7xl font-bold mb-10 leading-tight">
                    <EditableText value={theme?.customTexts?.aura_footer_title1 || "Let's build something"} field="aura_footer_title1" entity="appearance" isEditor={isEditor} as="span" maxLength={40} /> <EditableText value={theme?.customTexts?.aura_footer_title2 || 'extraordinary.'} field="aura_footer_title2" entity="appearance" isEditor={isEditor} as="span" className="italic text-white/50" maxLength={30} />
                </h2>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyEmail}
                    className={`group relative overflow-hidden px-8 py-4 bg-white text-black font-sans text-sm font-bold uppercase tracking-widest ${radiusClass} shadow-[0_0_30px_rgba(255,255,255,0.2)]`}
                >
                    <div className="absolute inset-0 bg-[var(--hl)] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
                    <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors">
                        {isCopied ? 'Email Copied!' : <EditableText value={theme?.customTexts?.aura_copy_email || 'Copy Email Address'} field="aura_copy_email" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />}
                        <i className={isCopied ? 'fas fa-check' : 'far fa-envelope'}></i>
                    </span>
                </motion.button>
            </motion.div>

            <div className="relative z-10 max-w-[1400px] mx-auto mt-32 flex flex-col md:flex-row justify-between items-center gap-6 font-sans text-xs font-semibold text-white/40">
                <p>&copy; {new Date().getFullYear()} <EditableText value={fullName} field="fullName" entity="profile" isEditor={isEditor} as="span" maxLength={30} />. <EditableText value={theme?.customTexts?.aura_footer_rights || 'All rights reserved.'} field="aura_footer_rights" entity="appearance" isEditor={isEditor} as="span" maxLength={40} /></p>
                <div className="flex gap-6">
                    {links.map((l: any, i: number) => (
                        <motion.a whileHover={{ y: -2, color: '#fff' }} key={i} href={l.url} target="_blank" rel="noreferrer" className="uppercase tracking-widest transition-colors">
                            {l.platform}
                        </motion.a>
                    ))}
                </div>
            </div>
        </footer>
    </>
  );
}

