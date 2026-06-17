import React from 'react';
import Image from 'next/image';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
    title: 'Portfo.be Notes - Jurnal Kreatif & Teknikal',
    description: 'Mendokumentasikan eksperimen CSS, arsitektur Next.js, dan pola pikir desain.',
};

export default function BlogPage() {
    return (
        <div className="font-sans min-h-screen bg-black text-white antialiased selection:bg-[#ff9e00] selection:text-black dark">
            <style dangerouslySetInnerHTML={{
                __html: `
        .blog-wrapper {
            background-color: #000000; 
            color: #ffffff;
        }
        
        .blog-wrapper::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
        
        .text-huge {
            font-size: clamp(3rem, 10vw, 9rem);
            line-height: 0.85;
            letter-spacing: -0.04em;
        }

        .marquee-content {
            display: flex;
            animation: marquee 20s linear infinite;
            will-change: transform;
        }
        @keyframes marquee {
            0% { transform: translateX(0) translateZ(0); }
            100% { transform: translateX(-50%) translateZ(0); }
        }

        .hover-invert:hover {
            background-color: #ffffff;
            color: #000000;
        }
        .hover-accent:hover {
            background-color: #ff9e00;
            color: #000000;
        }
        .hover-accent:hover h3 {
            color: #000000;
        }
        
        /* Hide scrollbar */
        .no-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
      `}} />

            <div className="blog-wrapper w-full min-h-screen relative">
                <Navbar isDarkBg />

                {/* Top Grid Layout (Edge to Edge) */}
                <header className="relative pt-32 pb-20 md:pt-48 md:pb-28 overflow-hidden border-b border-white/10">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-[600px] lg:w-[800px] h-[600px] lg:h-[800px] bg-[#ff9e00]/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">

                            {/* Left Massive Typo */}
                            <div className="lg:col-span-8 flex flex-col justify-end">
                                <h1 className="font-display font-bold text-huge uppercase text-white leading-[0.85] tracking-tighter">
                                    <span className="block hover:text-[#ff9e00] hover:translate-x-4 transition-all duration-500 cursor-default">The</span>
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white/20 to-white/60 italic hover:from-white/40 hover:to-white transition-all duration-500 cursor-default">Creator</span>
                                    <span className="block hover:text-[#ff9e00] hover:translate-x-4 transition-all duration-500 cursor-default">Blog.</span>
                                </h1>
                            </div>

                            {/* Right Meta Info */}
                            <div className="lg:col-span-4 lg:pl-12 lg:border-l border-white/10 flex flex-col justify-between h-full">
                                <div className="hidden lg:flex w-14 h-14 border border-white/20 rounded-full items-center justify-center mb-auto hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.05)] cursor-pointer">
                                    <ArrowDownRight className="w-6 h-6" />
                                </div>

                                <div className="mt-12 lg:mt-auto">
                                    <h2 className="text-2xl font-display font-bold mb-4 text-white tracking-tight">Eksplorasi & Cerita</h2>
                                    <p className="text-white/60 text-sm leading-relaxed font-sans mb-8 max-w-sm">
                                        Selamat datang di blog resmi Portfo.be! Tempat kami berbagi wawasan seputar SEO, inspirasi desain, pengembangan arsitektur web modern, dan panduan sukses untuk para kreator visual. Ditulis langsung oleh tim <span className="text-white font-bold">RITIONS.</span>
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 font-mono text-xs text-white/40">
                                        <div className="flex flex-col gap-2 p-4 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                            <span className="opacity-50">ENTRI TERAKHIR</span>
                                            <span className="text-white font-medium">17 JUNI 2026</span>
                                        </div>
                                        <div className="flex flex-col gap-2 p-4 border border-[#ff9e00]/20 rounded-2xl bg-[#ff9e00]/5 hover:bg-[#ff9e00]/10 hover:border-[#ff9e00]/40 transition-all duration-300 group">
                                            <span className="opacity-50 text-[#ff9e00] group-hover:opacity-80 transition-opacity">TOTAL ARTIKEL</span>
                                            <span className="text-[#ff9e00] font-bold text-lg">004</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </header>

                {/* Marquee Section */}
                <div className="border-b border-white/10 py-3 overflow-hidden bg-[#ff9e00] text-black font-display font-bold uppercase tracking-widest text-sm">
                    <div className="marquee-content w-[200%]">
                        <span className="px-8 whitespace-nowrap">TRENDING: NEXT.JS APP ROUTER //</span>
                        <span className="px-8 whitespace-nowrap">CSS CONTAINER QUERIES //</span>
                        <span className="px-8 whitespace-nowrap">FLUTTER STATE MANAGEMENT //</span>
                        <span className="px-8 whitespace-nowrap">NEO-BRUTALISM UI //</span>
                        <span className="px-8 whitespace-nowrap">SEO ENTERPRISE //</span>
                        {/* Duplicate for seamless loop */}
                        <span className="px-8 whitespace-nowrap">TRENDING: NEXT.JS APP ROUTER //</span>
                        <span className="px-8 whitespace-nowrap">CSS CONTAINER QUERIES //</span>
                        <span className="px-8 whitespace-nowrap">FLUTTER STATE MANAGEMENT //</span>
                        <span className="px-8 whitespace-nowrap">NEO-BRUTALISM UI //</span>
                        <span className="px-8 whitespace-nowrap">SEO ENTERPRISE //</span>
                    </div>
                </div>

                <main>
                    {/* Filter Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-4 border-b border-white/10 font-display text-sm tracking-wider uppercase divide-y md:divide-y-0 md:divide-x divide-white/10">
                        <div className="p-4 flex items-center justify-between text-[#ff9e00]">
                            <span>INDEX</span>
                            <span>(ALL)</span>
                        </div>
                        <Link href="#" className="p-4 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-between">
                            <span>UI/UX DESIGN</span>
                            <span className="text-xs opacity-50">14</span>
                        </Link>
                        <Link href="#" className="p-4 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-between">
                            <span>ENGINEERING</span>
                            <span className="text-xs opacity-50">21</span>
                        </Link>
                        <Link href="#" className="p-4 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-between">
                            <span>PRODUCT</span>
                            <span className="text-xs opacity-50">07</span>
                        </Link>
                    </div>

                    {/* Article List (Tabular / Enterprise Style) */}
                    <div className="flex flex-col border-b border-white/10">

                        {/* Item 4 */}
                        <Link href="/blog/membangun-portofolio-digital-yang-menonjol-panduan-untuk-kreator-modern" className="group grid grid-cols-1 lg:grid-cols-12 border-b border-white/10 hover-accent transition-all duration-300 text-white">
                            <div className="lg:col-span-1 p-6 lg:p-8 font-mono text-sm opacity-40 group-hover:opacity-100 flex items-start border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20">
                                004
                            </div>
                            <div className="lg:col-span-2 p-6 lg:p-8 font-mono text-sm border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20 flex flex-col justify-between gap-4">
                                <span>17 JUN 2026</span>
                                <span className="uppercase font-bold tracking-widest">UI/UX DESIGN</span>
                            </div>
                            <div className="lg:col-span-3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20">
                                <div className="relative w-full h-48 lg:h-full min-h-[140px] rounded-xl overflow-hidden border border-white/10 group-hover:border-black/20 bg-zinc-900">
                                    <Image
                                        src="/images/blog/digital-portfolio-showcase.png"
                                        alt="Membangun Portofolio Digital yang Menonjol Thumbnail"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                                    />
                                </div>
                            </div>
                            <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
                                <h3 className="font-display text-2xl md:text-4xl font-medium tracking-tight mb-6">
                                    Membangun Portofolio Digital yang Menonjol: Panduan untuk Kreator Modern
                                </h3>
                                <div className="flex items-center justify-between w-full">
                                    <p className="font-sans text-sm opacity-60 group-hover:opacity-100 max-w-md">
                                        Membangun portofolio digital di era modern bukan sekadar memindahkan karya, melainkan menciptakan etalase profesional sekaligus alat negosiasi terkuat yang dimiliki seorang kreator.
                                    </p>
                                    <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform shrink-0">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Item 3 */}
                        <Link href="/blog/mengapa-profil-linkedin-saja-tidak-cukup-untuk-bersaing-di-tahun-2026" className="group grid grid-cols-1 lg:grid-cols-12 border-b border-white/10 hover-accent transition-all duration-300 text-white">
                            <div className="lg:col-span-1 p-6 lg:p-8 font-mono text-sm opacity-40 group-hover:opacity-100 flex items-start border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20">
                                003
                            </div>
                            <div className="lg:col-span-2 p-6 lg:p-8 font-mono text-sm border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20 flex flex-col justify-between gap-4">
                                <span>11 JUN 2026</span>
                                <span className="uppercase font-bold tracking-widest">PRODUCT</span>
                            </div>
                            <div className="lg:col-span-3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20">
                                <div className="relative w-full h-48 lg:h-full min-h-[140px] rounded-xl overflow-hidden border border-white/10 group-hover:border-black/20 bg-zinc-900">
                                    <Image
                                        src="/images/blog/linkedin-vs-portfolio.png"
                                        alt="Mengapa Profil LinkedIn Saja Tidak Cukup Thumbnail"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                                    />
                                </div>
                            </div>
                            <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
                                <h3 className="font-display text-2xl md:text-4xl font-medium tracking-tight mb-6">
                                    Mengapa Profil LinkedIn Saja Tidak Cukup untuk Bersaing di Tahun 2026?
                                </h3>
                                <div className="flex items-center justify-between w-full">
                                    <p className="font-sans text-sm opacity-60 group-hover:opacity-100 max-w-md">
                                        Mengapa mengandalkan LinkedIn sebagai satu-satunya "senjata" untuk menarik klien atau pekerjaan impian adalah sebuah kesalahan besar, dan pentingnya membangun panggung digital mandiri.
                                    </p>
                                    <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform shrink-0">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Item 2 */}
                        <Link href="/blog/matinya-website-builder-tradisional" className="group grid grid-cols-1 lg:grid-cols-12 border-b border-white/10 hover-accent transition-all duration-300 text-white">
                            <div className="lg:col-span-1 p-6 lg:p-8 font-mono text-sm opacity-40 group-hover:opacity-100 flex items-start border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20">
                                002
                            </div>
                            <div className="lg:col-span-2 p-6 lg:p-8 font-mono text-sm border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20 flex flex-col justify-between gap-4">
                                <span>09 JUN 2026</span>
                                <span className="uppercase font-bold tracking-widest">PRODUCT</span>
                            </div>
                            <div className="lg:col-span-3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20">
                                <div className="relative w-full h-48 lg:h-full min-h-[140px] rounded-xl overflow-hidden border border-white/10 group-hover:border-black/20 bg-zinc-900">
                                    <Image
                                        src="/images/blog/traditional-builder-death.png"
                                        alt="Matinya Website Builder Tradisional Thumbnail"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                                    />
                                </div>
                            </div>
                            <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
                                <h3 className="font-display text-2xl md:text-4xl font-medium tracking-tight mb-6">
                                    Matinya Website Builder Tradisional (Dan Mengapa Kami Membangun yang Baru di Era AI).
                                </h3>
                                <div className="flex items-center justify-between w-full">
                                    <p className="font-sans text-sm opacity-60 group-hover:opacity-100 max-w-md">
                                        Mengapa platform website builder tradisional era 2010-an sudah mati, dan mengapa infrastruktur terkurasi semakin krusial di era AI.
                                    </p>
                                    <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform shrink-0">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Item 1 (Featured) */}
                        <Link href="/blog/stealth-sitemap" className="group grid grid-cols-1 lg:grid-cols-12 border-b border-white/10 hover-accent transition-all duration-300 text-white">
                            <div className="lg:col-span-1 p-6 lg:p-8 font-mono text-sm opacity-40 group-hover:opacity-100 flex items-start border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20">
                                001
                            </div>
                            <div className="lg:col-span-2 p-6 lg:p-8 font-mono text-sm border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20 flex flex-col justify-between gap-4">
                                <span>09 JUN 2026</span>
                                <span className="uppercase font-bold tracking-widest">ENGINEERING</span>
                            </div>
                            <div className="lg:col-span-3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20">
                                <div className="relative w-full h-48 lg:h-full min-h-[140px] rounded-xl overflow-hidden border border-white/10 group-hover:border-black/20 bg-zinc-900">
                                    <Image
                                        src="/images/blog/stealth-sitemap-hero.png"
                                        alt="Stealth Sitemap Thumbnail"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                                    />
                                </div>
                            </div>
                            <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
                                <h3 className="font-display text-2xl md:text-4xl font-medium tracking-tight mb-6">
                                    Membedah Arsitektur SEO "Stealth Sitemap" Skala Enterprise.
                                </h3>
                                <div className="flex items-center justify-between w-full">
                                    <p className="font-sans text-sm opacity-60 group-hover:opacity-100 max-w-md">
                                        Mengapa memecah dan menyembunyikan sitemap adalah praktik terbaik untuk platform SaaS dengan ratusan ribu pengguna.
                                    </p>
                                    <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform shrink-0">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                    </div>

                    {/* Load More (Brutalist Button) */}
                    <div className="w-full">
                        <button className="w-full py-12 md:py-24 text-white font-display font-bold text-2xl md:text-4xl uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-4">
                            [ MUAT ARSIP SEBELUMNYA ]
                        </button>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
