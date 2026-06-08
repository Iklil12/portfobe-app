import React from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata = {
  title: 'Membedah Arsitektur SEO "Stealth Sitemap" Skala Enterprise | Portfo.be',
  description: 'Bagaimana kami meninggalkan paradigma sitemap tradisional dan mengimplementasikan Stealth Sitemap Index.',
};

export default function BlogPost() {
  return (
    <div className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen bg-black text-white antialiased selection:bg-[#D6FF00] selection:text-black dark`}>
      <Navbar isDarkBg={true} />

      {/* Hero Section */}
      <header className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-white/10 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle noise/grid background if needed, but plain black is fine */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6FF00]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-[#D6FF00] transition-colors mb-8 md:mb-12">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Arsip
          </Link>
          
          <div className="flex items-center gap-4 font-mono text-xs text-white/50 mb-6 uppercase tracking-widest">
             <span className="text-[#D6FF00]">ENGINEERING</span>
             <span>//</span>
             <span>09 JUN 2026</span>
             <span className="hidden md:inline">//</span>
             <span className="hidden md:inline">ARTIKEL 001</span>
          </div>
          
          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8 text-white">
            Membedah Arsitektur SEO "Stealth Sitemap" Skala Enterprise.
          </h1>
          
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
          Sitemap.xml sering kali menjadi file yang paling diabaikan dalam pengembangan web modern. Banyak developer hanya menggunakan pustaka bawaan, men-generate satu file raksasa, dan meninggalkannya begitu saja. Namun, ketika Anda membangun platform SaaS multi-tenant dengan potensi ratusan ribu pengguna, sitemap standar adalah sebuah celah keamanan data dan mimpi buruk bagi efisiensi crawl budget.
        </p>

        <p className="mb-8">
          Di Portfo.be, saat merancang arsitektur SEO untuk platform builder portofolio kami, kami menyadari bahwa menyerahkan daftar lengkap URL pengguna ke publik bukanlah ide yang cemerlang.
        </p>

        <p className="mb-12">
          Artikel ini membedah bagaimana kami meninggalkan paradigma sitemap tradisional dan mengimplementasikan <strong className="text-[#D6FF00]">Stealth Sitemap Index</strong>—sebuah teknik yang digunakan oleh raksasa seperti Linktree dan Notion untuk melindungi data sekaligus mendominasi mesin pencari.
        </p>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">Paradigma Lama yang Berbahaya</h2>
        
        <p className="mb-6">
          Dalam arsitektur web tradisional, Anda meletakkan file <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#D6FF00]">sitemap.xml</code> di root directory. File ini berisi tautan ke halaman utama, halaman harga, dan (jika Anda memiliki platform user-generated content) seluruh profil pengguna Anda yang berstatus publik.
        </p>

        <p className="mb-6">Masalahnya muncul saat platform Anda tumbuh:</p>

        <ol className="list-decimal pl-6 space-y-4 mb-12 marker:text-[#D6FF00] marker:font-bold">
          <li><strong className="text-white">Pencurian Data (Scraping):</strong> Kompetitor atau bot jahat hanya perlu mengunjungi <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#D6FF00]">/sitemap.xml</code> untuk mengekstrak seluruh daftar pengguna aktif Anda dalam hitungan detik.</li>
          <li><strong className="text-white">Batas Limit XML:</strong> Mesin pencari menetapkan batas ketat: maksimal 50.000 URL atau 50MB per file sitemap. Jika pengguna Anda melebihi angka ini, sitemap Anda akan ditolak mentah-mentah oleh Googlebot.</li>
          <li><strong className="text-white">Crawl Budget Exhaustion:</strong> Google memberikan "anggaran" waktu harian untuk merayapi situs Anda. Jika mereka terjebak merayapi puluhan ribu URL yang tidak berubah, halaman pengguna yang baru saja publish tidak akan terindeks selama berminggu-minggu.</li>
        </ol>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">Membangun "Stealth Sitemap"</h2>
        
        <p className="mb-8">
          Solusi dari masalah di atas bukanlah berhenti menggunakan sitemap, melainkan <strong className="text-white">menyembunyikannya dari manusia dan memecahnya untuk mesin</strong>.
        </p>
        <p className="mb-12">
          Alih-alih satu file raksasa, kami menggunakan struktur <strong>Sitemap Index</strong>. Konsepnya mirip dengan daftar isi sebuah ensiklopedia.
        </p>

        <h3 className="font-display font-bold text-2xl text-white mt-10 mb-4">1. Merombak Jalur Publik</h3>
        <p className="mb-10">
          Jalur standar <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#D6FF00]">/sitemap.xml</code> kami kunci. Jika diakses oleh browser biasa, server akan mengembalikan HTTP 404 (Not Found) atau hanya menampilkan rute halaman statis pemasaran, tanpa mengekspos profil pengguna.
        </p>

        <h3 className="font-display font-bold text-2xl text-white mt-10 mb-4">2. Memecah Node Data</h3>
        <p className="mb-6">
          Untuk data pengguna, kami men-generate rute URL acak yang sulit ditebak, misalnya <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#D6FF00]">/api/seo/core-index-xyz.xml</code>. Di dalamnya, data tidak ditumpuk, melainkan dipecah (dipaginasi) setiap 10.000 URL.
        </p>

        {/* Code block style brutalist */}
        <div className="my-8 rounded-xl overflow-hidden border border-white/20 bg-[#0a0a0a]">
          <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
             <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
             </div>
             <span className="ml-4 font-mono text-xs text-white/40">XML</span>
          </div>
          <pre className="p-6 overflow-x-auto font-mono text-sm leading-relaxed text-white/70">
            <code>{`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <sitemap>
      <loc>https://portfo.be/api/seo/users-chunk-1.xml</loc>
      <lastmod>2026-06-09T00:00:00+00:00</lastmod>
   </sitemap>
   <sitemap>
      <loc>https://portfo.be/api/seo/users-chunk-2.xml</loc>
      <lastmod>2026-06-09T00:00:00+00:00</lastmod>
   </sitemap>
</sitemapindex>`}</code>
          </pre>
        </div>

        <h3 className="font-display font-bold text-2xl text-white mt-12 mb-4">3. Pendaftaran Jalur Belakang</h3>
        <p className="mb-12">
          URL rahasia ini <strong>tidak pernah</strong> kami cantumkan di dalam <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#D6FF00]">robots.txt</code>. Sebagai gantinya, kami mengirimkan URL spesifik tersebut secara langsung ke dashboard Google Search Console dan Bing Webmaster Tools. Mesin pencari tahu di mana harus mencari, tapi kompetitor akan kebingungan.
        </p>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">Injeksi Real-Time dengan IndexNow</h2>
        <p className="mb-6">
          Sitemap adalah untuk perayapan massal mingguan. Namun, untuk platform portofolio, kecepatan adalah segalanya. Pengguna yang baru saja menekan tombol "Publish" ingin portofolio mereka muncul di mesin pencari hari itu juga.
        </p>
        <p className="mb-6">
          Untuk mengatasi jeda waktu dari Googlebot, kami menyuntikkan protokol <strong>IndexNow</strong> langsung ke dalam lapisan Server Action Next.js.
        </p>
        <p className="mb-8">
          Setiap kali status <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#D6FF00]">isLive</code> di database berubah menjadi <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#D6FF00]">true</code>, Node.js secara asinkron (fire-and-forget) mengirimkan paket Ping ke jaringan IndexNow. Ini memaksa Bing, Yahoo, dan Yandex untuk langsung merayapi URL spesifik tersebut tanpa harus menunggu jadwal baca sitemap bulanan.
        </p>

        <div className="my-8 rounded-xl overflow-hidden border border-white/20 bg-[#0a0a0a]">
          <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
             <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
             </div>
             <span className="ml-4 font-mono text-xs text-white/40">TypeScript</span>
          </div>
          <pre className="p-6 overflow-x-auto font-mono text-sm leading-relaxed text-white/70">
            <code>{`// Konsep eksekusi non-blocking IndexNow
if (isLive && subdomain) {
  const urlToPing = \`https://portfo.be/\${subdomain}\`;
  
  // Dieksekusi di background, UI pengguna tidak tertahan
  pingIndexNow(urlToPing).catch(console.error);
}`}</code>
          </pre>
        </div>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">Kesimpulan</h2>
        <p className="mb-12">
          SEO teknikal untuk aplikasi multi-tenant tidak sekadar tentang menambahkan meta tag. Ini adalah seni mengelola infrastruktur data. Dengan menyembunyikan rute sitemap dan mengombinasikannya dengan real-time ping via IndexNow, kita tidak hanya mengamankan privasi data kreator, tetapi juga memastikan karya mereka ditemukan oleh dunia dalam performa puncak.
        </p>

        {/* Share / Tags */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">SEO</span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">NEXT.JS</span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">ARCHITECTURE</span>
          </div>
          <button className="px-6 py-3 bg-white text-black font-bold font-display text-sm tracking-widest uppercase hover:bg-[#D6FF00] transition-colors rounded-full active:scale-95">
            Bagikan Artikel
          </button>
        </div>
      </article>

      {/* Footer (Simplified for article) */}
      <footer className="border-t border-white/10 mt-12 bg-zinc-950">
          <div className="p-16 text-center flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D6FF00]/5 rounded-full blur-[80px]"></div>
             <h2 className="text-white font-display font-bold text-4xl md:text-6xl tracking-tighter opacity-10 mb-4 relative z-10">PORTFO.BE</h2>
             <p className="font-mono text-xs text-white/30 uppercase tracking-widest relative z-10">End of Transmission</p>
          </div>
      </footer>
    </div>
  );
}
