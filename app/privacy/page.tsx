"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, Check } from 'lucide-react';

export default function PrivacyPolicy() {
  const premiumEase = [0.16, 1, 0.3, 1] as const;

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
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
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
            Privacy <br/><span className="text-white/40 italic font-light">Policy.</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-12 bg-white/20"></span>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">Terakhir diperbarui: Juni 2026</p>
          </div>
        </motion.header>

        {/* content container */}
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
                Introduction & Authentication
              </h2>
              <p className="pl-9 leading-loose">Welcome to Portfo.be. We use **NextAuth** for secure Google-based authentication. We only collect the necessary profile data (Email, Name, Image) to personalize your experience and manage your portfolio.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">02</span>
                Data Storage & Assets
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">Your portfolio data (titles, descriptions, links) is stored in our secure database hosted on **Hostinger**. All media assets (Images, Portfolio Covers) are uploaded and served via **Cloudinary**.</p>
                <div className="p-5 bg-black border border-white/10 text-xs space-y-2">
                  <p className="text-white font-bold uppercase tracking-widest mb-2">What we store:</p>
                  <p>- Google account identifiers (encrypted).</p>
                  <p>- Portfolio content & metadata.</p>
                  <p>- Aggregated daily statistics.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">03</span>
                Visitor Analytics Tracking
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">To help you understand your audience, we collect anonymous visitor data including:</p>
                <ul className="list-none space-y-2">
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>**Views:** Every visit to your portfolio page.</span>
                   </li>
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>**Clicks:** Interactions with your project links.</span>
                   </li>
                </ul>
                <p className="italic text-white/40 text-xs mt-4">Note: Visitor IP addresses are processed for aggregation but are not permanently stored in their raw form.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">04</span>
                Cookies & Sessions
              </h2>
              <p className="pl-9 leading-loose">We use essential cookies to maintain your login session. We do not use third-party tracking cookies for advertising purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">05</span>
                Contact & Support
              </h2>
              <p className="pl-9 leading-loose">For data deletion requests or privacy inquiries, contact us at: <a href="mailto:ikliluluyun@ritions.com" className="text-[#ff9e00] hover:underline">ikliluluyun@ritions.com</a></p>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
