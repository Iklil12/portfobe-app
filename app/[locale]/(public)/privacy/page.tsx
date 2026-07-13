"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const premiumEase = [0.16, 1, 0.3, 1] as const;
  const t = useTranslations('Privacy');

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased selection:bg-[#ff9e00] selection:text-black">
      <Navbar isDarkBg={true} />

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 hover:text-[#ff9e00] transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> {t('backBtn')}
          </Link>
        </motion.div>
        
        {/* Header */}
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

        {/* Content container */}
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
              <div className="pl-9 space-y-4">
                <p className="leading-loose">{t('sec2Desc')}</p>
                <div className="p-5 bg-black border border-white/10 text-xs space-y-4">
                  <div>
                    <p className="text-white font-bold uppercase tracking-widest mb-2">{t('sec2A')}</p>
                    <p dangerouslySetInnerHTML={{ __html: t('sec2ADesc').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                  </div>
                  <div>
                    <p className="text-white font-bold uppercase tracking-widest mb-2">{t('sec2B')}</p>
                    <p>{t('sec2BDesc')}</p>
                  </div>
                  <div>
                    <p className="text-white font-bold uppercase tracking-widest mb-2">{t('sec2C')}</p>
                    <p>{t('sec2CDesc')}</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">03</span>
                {t('sec3Title')}
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">{t('sec3Desc')}</p>
                <ul className="list-none space-y-2">
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>{t('sec3L1')}</span>
                   </li>
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>{t('sec3L2')}</span>
                   </li>
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>{t('sec3L3')}</span>
                   </li>
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>{t('sec3L4')}</span>
                   </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">04</span>
                {t('sec4Title')}
              </h2>
              <p className="pl-9 leading-loose" dangerouslySetInnerHTML={{ __html: t('sec4Desc').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
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
              <div className="pl-9 space-y-4">
                <p className="leading-loose">{t('sec6Desc')}</p>
                <div className="p-5 bg-black border border-white/10 text-xs space-y-2">
                  <p dangerouslySetInnerHTML={{ __html: t('sec6L1').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                  <p dangerouslySetInnerHTML={{ __html: t('sec6L2').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/"(.*?)"/g, '&quot;$1&quot;') }}></p>
                  <p dangerouslySetInnerHTML={{ __html: t('sec6L3').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">07</span>
                {t('sec7Title')}
              </h2>
              <p className="pl-9 leading-loose">{t('sec7Desc')} <a href="mailto:ikliluluyun@ritions.com" className="text-[#ff9e00] hover:underline">ikliluluyun@ritions.com</a></p>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
