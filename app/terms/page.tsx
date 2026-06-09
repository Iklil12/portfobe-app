"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, Check, Info, ShieldAlert } from 'lucide-react';

export default function TermsOfService() {
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
            Terms of <br/><span className="text-white/40 italic font-light">Service.</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-12 bg-white/20"></span>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">Terakhir diperbarui: Juni 2026</p>
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
                Acceptance of Terms
              </h2>
              <p className="pl-9 leading-loose">By accessing and using Portfo.be ("the Service"), you agree to be bound by these Terms of Service. Our service is designed to help creators showcase their work through dynamic web portfolios.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">02</span>
                Account Registration
              </h2>
              <p className="pl-9 leading-loose">Portfo.be uses social authentication (Google) via NextAuth. By logging in, you grant us access to basic profile information (email and name). You are responsible for maintaining the security of your account session.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">03</span>
                Subscription Models (Free vs Pro)
              </h2>
              <ul className="list-none space-y-4 pl-9">
                <li className="flex gap-4 items-start text-white/70">
                  <Info className="w-5 h-5 text-[#ff9e00] shrink-0 mt-0.5" />
                  <span>**Free Account:** Limited to 4 projects, basic themes, and standard analytics.</span>
                </li>
                <li className="flex gap-4 items-start text-white/70">
                  <ShieldAlert className="w-5 h-5 text-[#ff9e00] shrink-0 mt-0.5" />
                  <span>**Pro Account:** Unlimited projects, premium themes (Acid, Cinematic, etc.), custom domain support, and advanced analytics dashboard.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">04</span>
                Content Licensing & Media
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">You retain all ownership of your work. However, by uploading assets via **Cloudinary** to our platform, you grant Portfo.be a worldwide license to host and display your content on your public URL.</p>
                <div className="p-6 bg-black border border-white/10">
                   <p className="text-white font-bold text-xs uppercase tracking-widest mb-3">Portfolio Availability:</p>
                   <p className="text-white/50 text-sm leading-relaxed">Your portfolio is public by default. Anyone with your link can view your projects and analytics (if enabled).</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">05</span>
                Analytics & Data Aggregation
              </h2>
              <p className="pl-9 leading-loose">We track "Views" and "Clicks" on your portfolio to provide you with insights. This data is aggregated daily via an automated cron job. We do not sell this traffic data to third parties.</p>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}