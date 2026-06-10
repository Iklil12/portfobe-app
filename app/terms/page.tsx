"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, Check, Info, ShieldAlert, Scale } from 'lucide-react';

export default function TermsOfService() {
  const premiumEase = [0.16, 1, 0.3, 1] as const;

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
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </motion.div>
        
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
                Penerimaan Syarat & Ketentuan
              </h2>
              <p className="pl-9 leading-loose">Dengan mengakses, mendaftar, atau menggunakan platform Portfo.be (&quot;Layanan&quot;), Anda secara tegas menyetujui untuk terikat oleh Ketentuan Layanan ini secara penuh. Jika Anda tidak menyetujui sebagian atau seluruh ketentuan ini, Anda tidak diperkenankan untuk menggunakan platform kami.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">02</span>
                Akun dan Keamanan
              </h2>
              <p className="pl-9 leading-loose">Anda bertanggung jawab atas segala aktivitas yang terjadi di bawah akun Anda. Kami mewajibkan Anda untuk menggunakan metode autentikasi yang sah (Google OAuth). Upaya peretasan, rekayasa balik (reverse engineering), atau manipulasi kerentanan sistem pada Portfo.be akan mengakibatkan penghentian layanan secara instan dan tindakan hukum jika diperlukan.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">03</span>
                Konten Pengguna & Hak Cipta
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose">Anda mempertahankan semua hak kepemilikan atas karya dan konten yang Anda unggah (&quot;Konten Pengguna&quot;). Namun, dengan menggunakan Portfo.be, Anda memberikan kami lisensi global, non-eksklusif, dan bebas royalti untuk meng-host, mendistribusikan, memodifikasi (untuk optimasi tampilan/SEO), dan menampilkan konten Anda ke publik melalui tautan portofolio yang dibagikan.</p>
                <div className="p-6 bg-black border border-white/10">
                   <p className="text-white font-bold text-xs uppercase tracking-widest mb-3">Penggunaan yang Dilarang:</p>
                   <p className="text-white/70 text-sm leading-relaxed mb-2">Anda dilarang keras mengunggah konten yang:</p>
                   <ul className="list-disc pl-5 text-sm text-white/50 space-y-1">
                     <li>Melanggar hak cipta atau kekayaan intelektual pihak lain.</li>
                     <li>Mengandung unsur pornografi, eksploitasi anak, atau materi ilegal.</li>
                     <li>Menyebarkan malware, skrip berbahaya, atau serangan XSS/SQL Injection.</li>
                     <li>Mendistribusikan kebencian, pelecehan, atau ancaman.</li>
                   </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">04</span>
                Paket Layanan & Pembayaran (Free vs Pro)
              </h2>
              <ul className="list-none space-y-4 pl-9">
                <li className="flex gap-4 items-start text-white/70">
                  <Info className="w-5 h-5 text-[#ff9e00] shrink-0 mt-0.5" />
                  <span>**Akun Free:** Memberikan akses dasar untuk pembuatan portofolio, dibatasi oleh jumlah proyek, sertifikat, dan fitur kustomisasi. Termasuk watermark Portfo.be.</span>
                </li>
                <li className="flex gap-4 items-start text-white/70">
                  <ShieldAlert className="w-5 h-5 text-[#ff9e00] shrink-0 mt-0.5" />
                  <span>**Akun Pro:** Layanan berbayar yang menawarkan fungsionalitas penuh (tanpa batas proyek, integrasi domain kustom, analitik mendalam, dan penghapusan watermark). Pembayaran langganan diproses secara manual melalui metode transfer yang diinstruksikan oleh sistem. Pembaruan status akun dilakukan setelah proses verifikasi pembayaran berhasil. Biaya langganan bersifat tidak dapat dikembalikan (non-refundable) kecuali diwajibkan oleh hukum yang berlaku.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">05</span>
                Ketersediaan Layanan (SLA) & Analitik
              </h2>
              <p className="pl-9 leading-loose">Kami berupaya keras memastikan Portfo.be berjalan tanpa hambatan dengan performa tinggi. Namun, layanan disediakan dengan status &quot;sebagaimana adanya&quot; (as is). Kami tidak menjamin waktu aktif (uptime) 100%. Data analitik lalu lintas (Views, Clicks) dihitung menggunakan algoritma internal kami dan disajikan untuk tujuan informasional; kami tidak menjamin keakuratan metrik secara absolut akibat blokir pelacakan oleh pihak ketiga (misalnya AdBlockers).</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">06</span>
                Pemutusan dan Penangguhan
              </h2>
              <p className="pl-9 leading-loose">Kami berhak secara sepihak untuk menangguhkan, membatasi akses, atau menghapus akun Anda kapan saja tanpa pemberitahuan jika kami mendeteksi adanya pelanggaran terhadap Ketentuan Layanan ini, termasuk penipuan, penyalahgunaan fitur editor, atau beban berlebih (abuse of resources) pada server kami.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 border border-white/20 flex items-center justify-center text-white/40">07</span>
                Pembatasan Tanggung Jawab
              </h2>
              <div className="pl-9 space-y-4">
                <p className="leading-loose flex items-start gap-4">
                  <Scale className="w-8 h-8 text-[#ff9e00] shrink-0 mt-1" />
                  <span>Sejauh diizinkan oleh hukum yang berlaku, Portfo.be, beserta tim pengembang, afiliasi, dan mitranya, tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial (termasuk hilangnya data, hilangnya klien, atau gangguan bisnis) yang diakibatkan oleh penggunaan Anda terhadap platform kami.</span>
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