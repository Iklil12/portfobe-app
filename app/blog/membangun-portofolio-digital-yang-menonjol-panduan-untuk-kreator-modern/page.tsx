import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { ShareButton } from '@/components/ui/ShareButton';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Membangun Portofolio Digital yang Menonjol: Panduan untuk Kreator Modern | Portfo.be',
  description: 'Membangun portofolio digital di era modern bukan sekadar memindahkan karya, melainkan menciptakan etalase profesional sekaligus alat negosiasi terkuat.',
  openGraph: {
    title: 'Membangun Portofolio Digital yang Menonjol: Panduan untuk Kreator Modern',
    description: 'Membangun portofolio digital di era modern bukan sekadar memindahkan karya, melainkan menciptakan etalase profesional sekaligus alat negosiasi terkuat.',
    url: 'https://portfo.be/blog/membangun-portofolio-digital-yang-menonjol-panduan-untuk-kreator-modern',
    siteName: 'Portfo.be',
    images: [
      {
        url: 'https://portfo.be/images/blog/digital-portfolio-showcase.png',
        width: 1200,
        height: 630,
        alt: 'Membangun Portofolio Digital yang Menonjol Illustration',
      },
    ],
    locale: 'id_ID',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Membangun Portofolio Digital yang Menonjol: Panduan untuk Kreator Modern',
    description: 'Membangun portofolio digital di era modern bukan sekadar memindahkan karya, melainkan menciptakan etalase profesional sekaligus alat negosiasi terkuat.',
    images: ['https://portfo.be/images/blog/digital-portfolio-showcase.png'],
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
            <span className="text-[#ff9e00]">UI/UX DESIGN</span>
            <span>//</span>
            <span>17 JUN 2026</span>
            <span className="hidden md:inline">//</span>
            <span className="hidden md:inline">ARTIKEL 004</span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8 text-white">
            Membangun Portofolio Digital yang Menonjol: Panduan untuk Kreator Modern.
          </h1>

          {/* Hero Illustration */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 mt-12 mb-8 bg-zinc-900 group">
            <div className="absolute inset-0 bg-[#ff9e00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none mix-blend-overlay"></div>
            <Image
              src="/images/blog/digital-portfolio-showcase.png"
              alt="Membangun Portofolio Digital yang Menonjol Illustration"
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
              <p className="text-xs font-mono text-white/50 uppercase tracking-widest mt-0.5">Design & Experience</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <article className="px-6 py-16 md:py-24 max-w-3xl mx-auto text-lg leading-relaxed text-white/80 font-sans">

        <p className="font-medium text-xl md:text-2xl leading-relaxed text-white mb-12">
          Membangun portofolio digital di era modern bukan sekadar memindahkan tumpukan karya masa lalu ke dalam sebuah folder daring, melainkan menciptakan etalase profesional sekaligus alat negosiasi terkuat yang dimiliki seorang kreator. Kesan pertama kini terjadi dalam hitungan mikrodetik, sehingga cara penyajian menjadi sama pentingnya dengan karya itu sendiri. Banyak profesional sering terjebak pada kesalahan klasik dengan memajang segala hal yang pernah mereka kerjakan. Padahal, kunci utama dari portofolio yang mematikan adalah keberanian untuk melakukan kurasi yang kejam terhadap karya sendiri.
        </p>

        <p className="mb-8">
          Sebuah portofolio yang berkelas sekelas <em>Enterprise</em> idealnya hanya menampilkan segelintir proyek terbaik yang paling mewakili arah karir yang dituju. Klien atau perekrut tidak memiliki waktu untuk menyaring puluhan gambar atau barisan kode. Menyeleksi karya dengan kualitas tertinggi jauh lebih berdampak secara psikologis daripada menampilkan kuantitas yang melimpah. Reputasi sebuah portofolio sering kali dinilai dari karya terlemah yang ada di dalamnya, sehingga menyingkirkan proyek yang kurang relevan atau sudah usang adalah langkah fundamental yang tidak bisa ditawar.
        </p>

        <p className="mb-8">
          Setelah proses kurasi selesai, desain antarmuka portofolio harus dirancang untuk bertindak sebagai panggung yang sunyi, bukan menjadi saingan yang berisik bagi karya itu sendiri. Terlalu banyak kreator yang menghias situs mereka dengan animasi berlebihan atau elemen UI yang saling bertabrakan. Pendekatan terbaik adalah mengisolasi kanvas dengan desain minimalis, membiarkan karya visual benar-benar menjadi bintang utama. Penggunaan estetika ruang gelap dengan tipografi yang tegas sangat efektif untuk menciptakan kontras yang dramatis, membuat setiap lekuk karya fotografi, desain antarmuka, maupun render visual terlihat jauh lebih tajam dan eksklusif.
        </p>

        <p className="mb-8">
          Namun, visual yang memukau saja belum cukup jika tidak disertai dengan konteks penyelesaian masalah. Di balik keindahan estetika, klien sebenarnya membayar untuk cara berpikir dan proses kreatif. Setiap karya yang dipamerkan wajib didampingi dengan narasi singkat yang terstruktur mengenai tantangan awal yang dihadapi, pendekatan teknis yang dieksekusi, serta solusi akhir yang diberikan. Penjelasan yang lugas dan profesional ini akan menjembatani jarak antara karya seni visual dan nilai bisnis yang dicari oleh para pemangku kepentingan.
        </p>

        <p className="mb-12">
          Pada akhirnya, ketangguhan teknis dari situs portofolio itu sendiri adalah cerminan langsung dari standar kerja sang kreator. Sebuah situs yang mampu memuat aset visual beresolusi tinggi secara instan dan beradaptasi dengan mulus di berbagai ukuran layar tanpa merusak tata letak menunjukkan tingkat profesionalisme yang tidak main-main. Perpaduan antara kurasi karya yang ketat, desain antarmuka yang tidak mendistraksi, serta performa situs yang responsif akan memberikan pengalaman premium yang sulit dilupakan oleh siapa pun yang mengunjunginya.
        </p>

        {/* Share / Tags */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">PORTFOLIO</span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">CREATIVE</span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">UI/UX DESIGN</span>
          </div>
          <ShareButton
            title="Membangun Portofolio Digital yang Menonjol: Panduan untuk Kreator Modern"
            text="Membangun portofolio digital di era modern bukan sekadar memindahkan karya, melainkan menciptakan etalase profesional sekaligus alat negosiasi terkuat."
            image="/images/blog/digital-portfolio-showcase.png"
          />
        </div>
      </article>

      <Footer />
    </div>
  );
}
