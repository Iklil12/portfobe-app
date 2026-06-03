"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function SpatialAwardsBlock({ data, theme, isMobileView, isCardPreview, isEditor }: any) {
  const awardItems = data?.certificates || data?.user?.certificates || [];

  if (awardItems.length === 0 && !isEditor) return null;

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
  const xlCardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[48px]' : 'rounded-[32px]';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0f1115] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[8px_8px_0_0_#ffffff]' : 'glass-panel border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]';

  const auraAnim = isCardPreview
      ? { hidden: { opacity: 1, y: 0, filter: "blur(0px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }
      : { hidden: { opacity: 0, y: 40, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const viewAnim = isCardPreview
      ? { initial: "visible" as const, animate: "visible" as const }
      : { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, amount: 0.1 } };

  return (
    <div id="awards" className={`flex flex-col w-full mt-24 @md:mt-32 px-8`}>
        <motion.div {...viewAnim} variants={auraAnim} className="mb-8">
            <h2 className={`font-medium tracking-tight text-white text-4xl`}>
                <EditableText value={theme?.customTexts?.spatial_awards_title || 'Recognitions'} field="spatial_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
            </h2>
        </motion.div>

        {awardItems.length === 0 && isEditor && (
            <div className={`w-full p-12 ${cardStyleClass} ${xlCardRadiusClass} flex flex-col items-center justify-center text-center opacity-70`}>
                <i className="fas fa-award text-4xl text-slate-500 mb-4"></i>
                <p className="text-slate-400">Tambahkan sertifikat/penghargaan untuk menampilkannya di sini.</p>
            </div>
        )}

        <div className="flex flex-col border-t border-white/10">
            {awardItems.slice(0, 5).map((award: any, i: number) => (
                <motion.a
                    href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                    {...viewAnim} variants={auraAnim}
                    className={`flex flex-col @md:flex-row @md:items-center justify-between py-6 border-b border-white/5 group cursor-pointer gap-4 @md:gap-0`}
                >
                    <div className="flex items-center gap-4 @md:gap-6 w-full @md:w-auto">
                        <span className="text-xs font-mono text-slate-500 w-10 shrink-0">{award.year || new Date(award.createdAt).getFullYear()}</span>
                        <div className="flex flex-col">
                            <h4 className="text-lg @md:text-xl font-medium text-white group-hover:text-[var(--hl)] transition-colors">{award.title}</h4>
                            <span className="text-xs text-slate-400 mt-1">{award.issuer}</span>
                        </div>
                    </div>
                    <div className={`flex items-center justify-between @md:justify-end w-full @md:w-auto`}>
                        <p className="text-sm text-slate-500 line-clamp-1 max-w-xs hidden @lg:block">{award.description}</p>
                        <div className={`w-10 h-10 ${radiusClass} border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all @md:ml-8`}>
                            <i className="fas fa-arrow-right -rotate-45 text-slate-400 group-hover:text-white transition-colors"></i>
                        </div>
                    </div>
                </motion.a>
            ))}
        </div>
    </div>
  );
}
