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
            Ketentuan <br/><span className="text-white/40 italic font-light">Layanan.</span>
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
                Persetujuan Ketentuan
              </h2>
              <p className="pl-9 leading-loose">Dengan mengakses dan menggunakan Portfo.be ("Layanan"), Anda setuju untuk terikat oleh Ketentuan Layanan ini. Layanan kami dirancang untuk membantu para kreator menampilkan karya mereka melalui portofolio web yang dinamis.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">02</span>
                Pendaftaran Akun
              </h2>
              <p className="pl-9 leading-loose">Portfo.be menggunakan autentikasi sosial (Google) via NextAuth. Dengan masuk, Anda memberikan kami akses ke informasi profil dasar (email dan nama). Anda bertanggung jawab penuh untuk menjaga keamanan sesi akun Anda.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">03</span>
                Model Berlangganan (Free vs Pro)
              </h2>
              <ul className="list-none space-y-4 pl-9">
                <li className="flex gap-4 items-start text-white/70">
                  <Info className="w-5 h-5 text-[#ff9e00] shrink-0 mt-0.5" />
                  <span>**Akun Free:** Terbatas untuk 1 Proyek, 2 Sertifikat, tema dasar, dan analisis standar dengan tanda air (watermark) Portfobe.</span>
                </li>
                <li className="flex gap-4 items-start text-white/70">
                  <ShieldAlert className="w-5 h-5 text-[#ff9e00] shrink-0 mt-0.5" />
                  <span>**Akun Pro:** Proyek & Sertifikat tak terbatas, semua tema premium, tanpa watermark, kustomisasi domain, dan dashboard analisis mendalam serta SEO.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">04</span>
                Lisensi Konten & Media
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">Anda memegang kepemilikan penuh atas karya Anda sendiri. Namun, dengan mengunggah aset melalui **Cloudinary** ke platform kami, Anda memberikan Portfo.be lisensi global untuk menghosting dan menampilkan konten Anda pada URL publik portofolio Anda.</p>
                <div className="p-6 bg-black border border-white/10">
                   <p className="text-white font-bold text-xs uppercase tracking-widest mb-3">Ketersediaan Portofolio:</p>
                   <p className="text-white/50 text-sm leading-relaxed">Secara bawaan, portofolio Anda bersifat publik. Siapa pun yang memiliki tautan Anda dapat melihat proyek dan metrik analisis Anda (jika diaktifkan).</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">05</span>
                Analisis & Agregasi Data
              </h2>
              <p className="pl-9 leading-loose">Kami melacak jumlah kunjungan ("Views") dan klik ("Clicks") pada portofolio Anda untuk memberikan wawasan analisis. Data ini diagregasikan secara berkala melalui sistem cron job otomatis. Kami tidak menjual data lalu lintas ini kepada pihak ketiga.</p>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}