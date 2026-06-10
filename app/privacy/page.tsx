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
            Kebijakan <br/><span className="text-white/40 italic font-light">Privasi.</span>
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
                Pendahuluan & Autentikasi
              </h2>
              <p className="pl-9 leading-loose">Selamat datang di Portfo.be. Kami menggunakan **NextAuth** untuk autentikasi yang aman berbasis Google. Kami hanya mengumpulkan data profil yang diperlukan (Email, Nama, Gambar) untuk mempersonalisasi pengalaman Anda dan mengelola portofolio Anda.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">02</span>
                Penyimpanan Data & Aset
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">Data portofolio Anda (judul, deskripsi, tautan) disimpan di database aman kami yang dihosting di **Hostinger**. Semua aset media (Gambar, Sampul Portofolio) diunggah dan disajikan melalui **Cloudinary**.</p>
                <div className="p-5 bg-black border border-white/10 text-xs space-y-2">
                  <p className="text-white font-bold uppercase tracking-widest mb-2">Yang kami simpan:</p>
                  <p>- Identifikasi akun Google (terenkripsi).</p>
                  <p>- Konten & metadata portofolio.</p>
                  <p>- Statistik harian yang diagregasikan.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">03</span>
                Pelacakan Analisis Pengunjung
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">Untuk membantu Anda memahami audiens Anda, kami mengumpulkan data pengunjung anonim termasuk:</p>
                <ul className="list-none space-y-2">
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>**Views:** Setiap kunjungan ke halaman portofolio Anda.</span>
                   </li>
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>**Clicks:** Interaksi dengan tautan proyek Anda.</span>
                   </li>
                </ul>
                <p className="italic text-white/40 text-xs mt-4">Catatan: Alamat IP pengunjung diproses untuk keperluan agregasi tetapi tidak disimpan secara permanen dalam bentuk mentahnya.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">04</span>
                Cookie & Sesi
              </h2>
              <p className="pl-9 leading-loose">Kami menggunakan cookie penting untuk menjaga sesi login Anda. Kami tidak menggunakan cookie pelacakan pihak ketiga untuk tujuan periklanan.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">05</span>
                Kontak & Bantuan
              </h2>
              <p className="pl-9 leading-loose">Untuk permintaan penghapusan data atau pertanyaan seputar privasi, hubungi kami di: <a href="mailto:ikliluluyun@ritions.com" className="text-[#ff9e00] hover:underline">ikliluluyun@ritions.com</a></p>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
