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
                Pendahuluan
              </h2>
              <p className="pl-9 leading-loose">Selamat datang di Portfo.be. Privasi Anda adalah prioritas utama kami. Kebijakan Privasi ini menjelaskan secara komprehensif bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan platform pembuatan portofolio kami. Dengan mengakses dan menggunakan Portfo.be, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">02</span>
                Informasi yang Kami Kumpulkan
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">Kami mengumpulkan berbagai jenis informasi untuk memberikan dan meningkatkan layanan kami kepada Anda:</p>
                <div className="p-5 bg-black border border-white/10 text-xs space-y-4">
                  <div>
                    <p className="text-white font-bold uppercase tracking-widest mb-2">A. Informasi Profil & Autentikasi</p>
                    <p>Kami menggunakan **NextAuth** untuk integrasi Single Sign-On (SSO) melalui Google. Kami mengumpulkan alamat email, nama lengkap, dan foto profil Anda secara eksklusif untuk keperluan autentikasi dan identifikasi akun.</p>
                  </div>
                  <div>
                    <p className="text-white font-bold uppercase tracking-widest mb-2">B. Konten Pengguna</p>
                    <p>Segala materi yang Anda unggah, termasuk teks portofolio, tautan proyek, deskripsi, gambar sampul, serta widget yang disematkan (seperti Canva, Penpot, Github).</p>
                  </div>
                  <div>
                    <p className="text-white font-bold uppercase tracking-widest mb-2">C. Data Analitik & Penggunaan</p>
                    <p>Kami secara otomatis mengumpulkan log kunjungan portofolio Anda, interaksi klik pada tautan Anda, serta data performa halaman untuk disajikan kembali di Dashboard Analitik Anda.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">03</span>
                Bagaimana Kami Menggunakan Informasi Anda
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">Informasi yang dikumpulkan digunakan secara eksklusif untuk tujuan berikut:</p>
                <ul className="list-none space-y-2">
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>Membuat, mengelola, dan mempersonalisasi portofolio publik Anda.</span>
                   </li>
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>Menyediakan wawasan (insights) analitik performa portofolio Anda.</span>
                   </li>
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>Memverifikasi bukti pembayaran manual untuk aktivasi langganan Pro Anda.</span>
                   </li>
                   <li className="flex gap-3 items-center">
                     <Check className="w-4 h-4 text-[#ff9e00]" />
                     <span>Meningkatkan SEO dan visibilitas pencarian global portofolio Anda.</span>
                   </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">04</span>
                Infrastruktur & Berbagi Data
              </h2>
              <p className="pl-9 leading-loose">Data Anda disimpan pada infrastruktur cloud yang dikelola dengan standar keamanan industri. Database kami beroperasi secara aman, dan semua aset media diunggah, dioptimalkan, serta disajikan melalui jaringan pengiriman konten (CDN) terpercaya seperti **Cloudinary**. Kami **tidak pernah menjual** data pribadi atau analitik lalu lintas Anda kepada pihak ketiga atau pengiklan.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">05</span>
                Cookie & Sesi
              </h2>
              <p className="pl-9 leading-loose">Portfo.be hanya menggunakan cookie esensial (first-party cookies) dan penyimpanan lokal (session storage/local storage) yang mutlak diperlukan untuk menjaga sesi login Anda tetap aktif, mengamankan proses pembaruan data, dan mencegah manipulasi analitik (misalnya pencegahan double-counting kunjungan).</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">06</span>
                Hak & Kontrol Pengguna
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">Anda memegang kendali penuh atas data Anda:</p>
                <div className="p-5 bg-black border border-white/10 text-xs space-y-2">
                  <p>- **Akses & Pembaruan:** Anda dapat mengedit profil dan portofolio Anda kapan saja melalui dashboard editor.</p>
                  <p>- **Penghapusan Data:** Anda berhak menghapus akun Anda. Fitur &quot;Hapus Akun&quot; di dashboard kami akan menghapus profil Anda, semua portofolio, dan media terkait secara permanen.</p>
                  <p>- **Visibilitas:** Anda menentukan publikasi karya Anda dan apakah mesin pencari diizinkan untuk mengindeks portofolio Anda.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">07</span>
                Hubungi Kami
              </h2>
              <p className="pl-9 leading-loose">Jika Anda memiliki pertanyaan mendalam mengenai kebijakan privasi ini atau ingin mengajukan permintaan terkait data pribadi Anda, silakan hubungi tim keamanan dan privasi kami di: <a href="mailto:ikliluluyun@ritions.com" className="text-[#ff9e00] hover:underline">ikliluluyun@ritions.com</a></p>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
