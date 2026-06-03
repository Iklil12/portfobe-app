"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export function SpatialFooterBlock({ data, theme, isMobileView, isCardPreview, isEditor }: any) {
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
  const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  const rawHighlightColor = theme?.themeColor || '#6366f1';
  const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#6366f1';

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
  const xlCardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[48px]' : 'rounded-[32px]';

  const auraAnim = isCardPreview
      ? { hidden: { opacity: 1, y: 0, filter: "blur(0px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }
      : { hidden: { opacity: 0, y: 40, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const viewAnim = isCardPreview
      ? { initial: "visible" as const, animate: "visible" as const }
      : { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, amount: 0.1 } };

  return (
    <motion.footer
        {...viewAnim} variants={auraAnim}
        className={`mt-24 @md:mt-40 mb-10 glass-panel ${xlCardRadiusClass} flex flex-col items-center text-center relative overflow-hidden mx-8 p-10 @md:p-20`}
    >
        {/* Inner Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: highlightColor }}></div>

        <h2 className={`font-semibold tracking-tight text-white relative z-10 text-4xl @md:text-7xl`}>
            <EditableText value={theme?.customTexts?.spatial_footer_title1 || "Let's build something"} field="spatial_footer_title1" entity="appearance" isEditor={isEditor} as="span" maxLength={40} /> <br className="hidden @md:block" />
            <EditableText value={theme?.customTexts?.spatial_footer_title2 || 'extraordinary.'} field="spatial_footer_title2" entity="appearance" isEditor={isEditor} as="span" className="text-slate-400" maxLength={30} />
        </h2>

        <a href={`mailto:${userEmail}`} className={`mt-10 px-8 py-4 bg-white text-black ${radiusClass} font-semibold text-lg hover:scale-105 transition-transform duration-300 relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.3)]`}>
            <EditableText value={theme?.customTexts?.spatial_footer_cta || 'Get in touch'} field="spatial_footer_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
        </a>

        <div className="w-full mt-20 pt-8 border-t border-white/10 flex justify-between items-center relative z-10 flex-col @md:flex-row gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 rounded-full bg-[var(--hl)]"></div>
                <span>© {new Date().getFullYear()} <EditableText value={fullName} field="fullName" entity="profile" isEditor={isEditor} as="span" maxLength={30} />. <EditableText value={theme?.customTexts?.spatial_footer_rights || 'All rights reserved.'} field="spatial_footer_rights" entity="appearance" isEditor={isEditor} as="span" maxLength={40} /></span>
            </div>
            <div className="flex gap-4">
                {links.map((l: any, i: number) => (
                    <a key={i} href={l.url} target="_blank" rel="noreferrer" className={`w-10 h-10 ${radiusClass} bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors`}>
                        <i className={`fab fa-${l.platform.toLowerCase()}`}></i>
                    </a>
                ))}
            </div>
        </div>
    </motion.footer>
  );
}
