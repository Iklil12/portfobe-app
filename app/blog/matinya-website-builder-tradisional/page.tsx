import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { ShareButton } from '@/shared/ui/ShareButton';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matinya Website Builder Tradisional (Dan Mengapa Kami Membangun yang Baru di Era AI) | Portfo.be',
  description: 'Mengapa platform website builder tradisional era 2010-an sudah mati, dan mengapa infrastruktur terkurasi semakin krusial di era AI.',
  openGraph: {
    title: 'Matinya Website Builder Tradisional & Era Baru AI',
    description: 'Mengapa platform website builder tradisional era 2010-an sudah mati, dan mengapa infrastruktur terkurasi semakin krusial di era AI.',
    url: 'https://portfo.be/blog/matinya-website-builder-tradisional',
    siteName: 'Portfo.be',
    images: [
      {
        url: 'https://portfo.be/images/blog/traditional-builder-death.png',
        width: 1200,
        height: 630,
        alt: 'Matinya Website Builder Tradisional & Era Baru AI Illustration',
      },
    ],
    locale: 'id_ID',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matinya Website Builder Tradisional & Era Baru AI',
    description: 'Mengapa platform website builder tradisional era 2010-an sudah mati, dan mengapa infrastruktur terkurasi semakin krusial di era AI.',
    images: ['https://portfo.be/images/blog/traditional-builder-death.png'],
  },
};

export default function BlogPost() {
  return (
    <div className="font-sans min-h-screen bg-black text-white antialiased selection:bg-[#ff9e00] selection:text-black dark">
      <Navbar isDarkBg={true} />

      {/* Hero Section */}
      <header className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-white/10 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff9e00]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-[#ff9e00] transition-colors mb-8 md:mb-12">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Arsip
          </Link>

          <div className="flex items-center gap-4 font-mono text-xs text-white/50 mb-6 uppercase tracking-widest">
            <span className="text-[#ff9e00]">PRODUCT</span>
            <span>//</span>
            <span>09 JUN 2026</span>
            <span className="hidden md:inline">//</span>
            <span className="hidden md:inline">ARTIKEL 002</span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8 text-white">
            Matinya Website Builder Tradisional (Dan Mengapa Kami Membangun yang Baru di Era AI).
          </h1>

          {/* Hero Illustration */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 mt-12 mb-8 bg-zinc-900 group">
            <div className="absolute inset-0 bg-[#ff9e00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none mix-blend-overlay"></div>
            <Image
              src="/images/blog/traditional-builder-death.png"
              alt="Matinya Website Builder Tradisional & Era Baru AI Illustration"
              fill
              className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
              priority
            />
          </div>

          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/20 overflow-hidden relative flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold text-white/50">RCH</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            </div>
            <div>
              <p className="font-bold font-display tracking-wide text-white uppercase">TIM ENGINEER RITIONS</p>
              <p className="text-xs font-mono text-white/50 uppercase tracking-widest mt-0.5">Core Architecture</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <article className="px-6 py-16 md:py-24 max-w-3xl mx-auto text-lg leading-relaxed text-white/80 font-sans">

        <p className="font-medium text-xl md:text-2xl leading-relaxed text-white mb-12">
          &quot;Tolong buatkan saya website portofolio dengan tema gelap.&quot; Dalam hitungan detik, AI generatif memuntahkan ratusan baris kode HTML dan Tailwind CSS. Di titik ini, sebuah pertanyaan eksistensial muncul: Jika AI bisa membuatkan antarmuka web semudah membalik telapak tangan, apakah platform website builder sudah mati?
        </p>

        <p className="mb-8">
          Jawabannya: <strong>Ya.</strong> Website builder tradisional era 2010-an yang lambat, penuh bloatware, dan bergantung pada drag-and-drop absolut sudah mati.
        </p>

        <p className="mb-12">
          Namun, kebutuhan akan <strong className="text-[#ff9e00]">Infrastruktur Terkurasi</strong> justru semakin krusial. Di Portfo.be, kami tidak melihat AI sebagai pembunuh builder, melainkan sebagai pembersih ekosistem yang memaksa platform untuk berevolusi. Inilah alasan mengapa kami tetap membangun engine portofolio ini, dan mengapa AI saja tidak akan pernah cukup untuk menggantikan platform modern.
        </p>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">1. AI Menghasilkan &quot;Spaghetti Code&quot;, Bukan Arsitektur</h2>

        <p className="mb-6">
          Saat Anda meminta AI membuatkan tata letak (layout) yang kompleks, ia cenderung mengambil jalan pintas. AI sering kali menyelesaikan masalah responsivitas dengan menggunakan ratusan media queries statis atau tumpukan div flexbox yang tidak terstruktur (<em>div soup</em>).
        </p>

        <p className="mb-6">
          Ini mungkin terlihat bagus di pratinjau awal, tetapi saat Anda mencoba memasukkan konten asli Anda, tata letaknya hancur. Di Portfo.be, kami tidak membiarkan mesin menebak struktur. Tema-tema kami (seperti Monolith hingga Cinematic) dibangun secara manual oleh engineer dengan standar modern seperti CSS Container Queries (<code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#ff9e00]">@container</code>).
        </p>

        <p className="mb-12">
          Hasilnya? Komponen yang secara cerdas beradaptasi dengan ruangannya sendiri, bukan sekadar merespons ukuran layar. Ini adalah presisi arsitektur yang saat ini sulit dipertahankan oleh AI secara konsisten dalam skala besar.
        </p>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">2. Masalah &quot;Mil Terakhir&quot; (The Last Mile Problem)</h2>

        <p className="mb-6">
          Mari asumsikan AI berhasil memberikan Anda kode UI yang sempurna. Apa selanjutnya? Sebagai seorang profesional, Anda harus:
        </p>

        <ul className="list-disc pl-6 space-y-4 mb-8 marker:text-[#ff9e00]">
          <li>Menyiapkan repositori (GitHub).</li>
          <li>Membangun pipeline deployment (seperti Vercel).</li>
          <li>Mengonfigurasi Custom Domain dan SSL.</li>
          <li>Menyiapkan sistem database untuk menyimpan proyek-proyek Anda.</li>
          <li>Membangun sitemap dinamis dan mengurus indeksasi mesin pencari.</li>
        </ul>

        <p className="mb-12">
          AI memberi Anda batu bata, tetapi Anda tetap harus membangun rumahnya sendiri. Portfo.be mengambil alih &quot;mil terakhir&quot; ini. Kami menyediakan fondasi Next.js, keamanan data, dan SEO otomatis tingkat Enterprise (termasuk injeksi Stealth Sitemap dan IndexNow) di latar belakang. Anda mendapatkan kecepatan AI, namun dengan keandalan server produksi yang nyata.
        </p>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">3. Paradoks Pilihan dan Estetika Terkurasi</h2>

        <p className="mb-6">
          AI bisa menghasilkan jutaan variasi desain. Paradoksnya, memiliki pilihan tak terbatas sering kali melumpuhkan kreativitas (sebuah fenomena yang dikenal sebagai <em>Decision Paralysis</em>).
        </p>

        <p className="mb-6">
          Seorang UI/UX Designer atau Software Engineer biasanya sudah tahu estetika apa yang mereka inginkan: Neo-Brutalism yang tajam, Minimalist yang bersih, atau gaya Spatial yang bernuansa 3D.
        </p>

        <p className="mb-12">
          Platform builder modern bergeser dari &quot;buat apa saja&quot; menjadi &quot;kami berikan yang terbaik&quot;. Kami menghabiskan ratusan jam menyempurnakan proporsi tipografi, transisi, dan palet warna di setiap tema Portfo.be agar terlihat mahal sejak detik pertama. Anda tidak perlu mem-prompt AI berulang kali hanya untuk mendapatkan padding yang proporsional.
        </p>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">Kesimpulan</h2>

        <p className="mb-6">
          Di era AI, nilai tambah dari sebuah website builder bukan lagi tentang &quot;menyediakan alat bantu coding&quot;. AI sudah melakukan itu.
        </p>

        <p className="mb-12">
          Nilai tambah platform seperti Portfo.be terletak pada <strong>Pendapat (Opinionated Design)</strong> dan <strong>Infrastruktur</strong>. Kami membuat keputusan teknis dan desain yang sulit untuk Anda—mulai dari arsitektur Next.js hingga integrasi SEO global—sehingga Anda bisa fokus pada satu-satunya hal yang tidak bisa dilakukan oleh AI: Menceritakan kisah di balik karya-karya hebat Anda.
        </p>

        {/* Share / Tags */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">AI</span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">BUILDER</span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">DESIGN SYSTEM</span>
          </div>
          <ShareButton
            title="Matinya Website Builder Tradisional (Dan Mengapa Kami Membangun yang Baru di Era AI)"
            text="Mengapa platform website builder tradisional era 2010-an sudah mati, dan mengapa infrastruktur terkurasi semakin krusial di era AI."
            image="/images/blog/traditional-builder-death.png"
          />
        </div>
      </article>

      <Footer />
    </div>
  );
}
