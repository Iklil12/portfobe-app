"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.15) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export const MinimalistAwardsBlock = ({ data, theme, isEditor, blockConfig }: any) => {
  const [openAward, setOpenAward] = useState<string | null>(null);



  const animationTrigger = isEditor ? "animate" : "whileInView";
  const awardItems = data?.certificates || data?.user?.certificates || [];

  if (awardItems.length === 0) return null;

  return (
    <section className="border-t border-gray-200 bg-gray-50/30 overflow-hidden">
      <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={cinematicBlurUp} custom={0.2} className={`p-8 @lg:p-12 pb-6`}>
        <h2 className="text-2xl font-black uppercase tracking-tighter min-heading">
          <EditableText value={theme?.customTexts?.min_awards_title || 'Honors & Awards'} field="min_awards_title" entity="appearance" isEditor={isEditor} maxLength={25} className="min-heading" />
        </h2>
      </motion.div>

      <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={getStaggerContainer(0.4, 0.2)} className="border-t border-gray-200">
        {awardItems.map((award: any, i: number) => {
          const isOpen = openAward === award.id;
          return (
            <motion.div variants={cinematicBlurUp} key={i} className="border-b border-gray-200 group">
              <div className={`px-8 @lg:px-12 py-6 flex justify-between items-center cursor-pointer transition-colors duration-500 hover:bg-gray-100 ${isOpen ? 'bg-gray-100' : 'bg-transparent'}`} onClick={() => setOpenAward(isOpen ? null : award.id)}>
                <div className="flex items-center gap-4 @md:gap-8 w-2/3">
                  <span className={`font-mono text-[10px] text-gray-400 group-hover:text-black transition-colors @md:block`}>{award.year || new Date(award.createdAt).getFullYear()}</span>
                  <h3 className="text-sm @md:text-lg font-bold tracking-tight min-heading group-hover:translate-x-2 transition-transform duration-500 ease-out">{award.title}</h3>
                </div>
                <div className="flex items-center justify-end gap-6 w-1/3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest text-gray-500 @md:block text-right truncate`}>{award.issuer}</span>
                  <motion.i animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="fas fa-chevron-down text-[10px] text-gray-400" />
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: premiumEase }} className="overflow-hidden bg-white border-t border-gray-200">
                    <div className={`px-8 @lg:px-12 py-8 flex gap-8 flex-col @md:flex-row`}>
                      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: premiumEase }} className={`bg-gray-50 border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center p-2 w-full @md:w-64`}>
                        <LazyImage src={award.mediaUrl} className="w-full h-auto object-contain grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700" alt="Certificate" />
                      </motion.div>

                      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: premiumEase }} className="flex flex-col justify-center flex-1">
                        <p className="font-bold mb-2 min-heading text-sm uppercase tracking-wider">{award.status || 'Verified Achievement'}</p>
                        <p className="text-xs text-gray-600 max-w-md leading-relaxed mb-6 opacity-90 min-body">{award.description || 'Awarded for exceptional performance and dedication in the respective field.'}</p>

                        <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-gray-500 transition-colors w-max relative group/btn min-heading">
                          <EditableText value={theme?.customTexts?.min_awards_view || 'Lihat Lampiran'} field="min_awards_view" entity="appearance" isEditor={isEditor} maxLength={20} as="span" className="min-heading" /> 
                          <i className="fas fa-arrow-right group-hover/btn:translate-x-1 transition-transform"></i>
                          <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-black transition-all duration-300 group-hover/btn:w-full"></span>
                        </a>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};
