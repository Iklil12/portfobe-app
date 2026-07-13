"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, Check, Info, ShieldAlert, Scale } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function TermsOfService() {
  const premiumEase = [0.16, 1, 0.3, 1] as const;
  const t = useTranslations('Terms');

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased selection:bg-[#ff9e00] selection:text-black">
      <Navbar isDarkBg={true} />

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 hover:text-[#ff9e00] transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> {t('backBtn')}
          </Link>
        </motion.div>
        
        <motion.header
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-7xl font-display font-bold text-white tracking-tight mb-6 leading-none">
            {t('titlePrefix')} <br/><span className="text-white/40 italic font-light">{t('titleHighlight')}</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-12 bg-white/20"></span>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">{t('lastUpdated')}</p>
          </div>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
          className="bg-zinc-950 border border-white/10 p-8 md:p-16 shadow-2xl relative"
        >
          <div className="space-y-12 text-sm md:text-base leading-relaxed font-mono text-white/70">
            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">01</span>
                {t('sec1Title')}
              </h2>
              <p className="pl-9 leading-loose">{t('sec1Desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">02</span>
                {t('sec2Title')}
              </h2>
              <p className="pl-9 leading-loose">{t('sec2Desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">03</span>
                {t('sec3Title')}
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">{t('sec3Desc')}</p>
                <div className="p-6 bg-black border border-white/10">
                   <p className="text-white font-bold text-xs uppercase tracking-widest mb-3">{t('sec3ProhibitedTitle')}</p>
                   <p className="text-white/70 text-sm leading-relaxed mb-2">{t('sec3ProhibitedDesc')}</p>
                   <ul className="list-disc pl-5 text-sm text-white/50 space-y-1">
                     <li>{t('sec3L1')}</li>
                     <li>{t('sec3L2')}</li>
                     <li>{t('sec3L3')}</li>
                     <li>{t('sec3L4')}</li>
                   </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">04</span>
                {t('sec4Title')}
              </h2>
              <ul className="list-none space-y-4 pl-9">
                <li className="flex gap-4 items-start text-white/70">
                  <Info className="w-5 h-5 text-[#ff9e00] shrink-0 mt-0.5" />
                  <span dangerouslySetInnerHTML={{ __html: t('sec4L1').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                </li>
                <li className="flex gap-4 items-start text-white/70">
                  <ShieldAlert className="w-5 h-5 text-[#ff9e00] shrink-0 mt-0.5" />
                  <span dangerouslySetInnerHTML={{ __html: t('sec4L2').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">05</span>
                {t('sec5Title')}
              </h2>
              <p className="pl-9 leading-loose">{t('sec5Desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">06</span>
                {t('sec6Title')}
              </h2>
              <p className="pl-9 leading-loose">{t('sec6Desc')}</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">07</span>
                {t('sec7Title')}
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose flex items-start gap-4">
                  <Scale className="w-8 h-8 text-[#ff9e00] shrink-0 mt-1" />
                  <span>{t('sec7Desc')}</span>
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}