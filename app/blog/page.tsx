import React from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata = {
  title: 'Portfo.be Notes - Jurnal Kreatif & Teknikal',
  description: 'Mendokumentasikan eksperimen CSS, arsitektur Next.js, dan pola pikir desain.',
};

export default function BlogPage() {
  return (
    <div className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen bg-black text-white antialiased selection:bg-brand-accent selection:text-black dark`}>
      <style dangerouslySetInnerHTML={{ __html: `
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
            background-color: #D6FF00;
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
        <header className="pt-16 border-b border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                {/* Left Massive Typo */}
                <div className="lg:col-span-8 p-6 md:p-12 lg:p-16 flex flex-col justify-end">
                    <p className="font-mono text-white/40 text-sm mb-8">[ 01 ] JURNAL TEKNIKAL & DESAIN</p>
                    <h1 className="font-display font-bold text-huge uppercase text-white">
                        Signal <br />
                        <span className="text-white/20 italic">Over</span> <br />
                        Noise.
                    </h1>
                </div>
                {/* Right Meta Info */}
                <div className="lg:col-span-4 p-6 md:p-12 lg:p-16 flex flex-col justify-between bg-zinc-950/50">
                    <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mb-12">
                        <ArrowDownRight className="w-5 h-5 text-white/50" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-medium mb-4 text-white">Catatan Pengembangan</h2>
                        <p className="text-white/50 text-sm leading-relaxed font-sans mb-8">
                            Mendokumentasikan eksperimen CSS, arsitektur Next.js, dan pola pikir desain untuk membangun masa depan web. Ditulis langsung oleh tim engineer RITIONS.
                        </p>
                        <div className="font-mono text-xs text-white/40 flex flex-col gap-2">
                            <span className="flex justify-between border-b border-white/10 pb-2"><span>ENTRI TERAKHIR:</span> <span>[ 09 JUNI 2026 ]</span></span>
                            <span className="flex justify-between border-b border-white/10 pb-2"><span>TOTAL ARTIKEL:</span> <span>[ 001 ]</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* Marquee Section */}
        <div className="border-b border-white/10 py-3 overflow-hidden bg-brand-accent text-black font-display font-bold uppercase tracking-widest text-sm">
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
                <div className="p-4 flex items-center justify-between text-brand-accent">
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
                
                {/* Item 1 (Featured) */}
                <Link href="/blog/stealth-sitemap" className="group grid grid-cols-1 lg:grid-cols-12 border-b border-white/10 hover-accent transition-all duration-300 text-white">
                    <div className="lg:col-span-1 p-6 lg:p-8 font-mono text-sm opacity-40 group-hover:opacity-100 flex items-start border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20">
                        001
                    </div>
                    <div className="lg:col-span-3 p-6 lg:p-8 font-mono text-sm border-b lg:border-b-0 lg:border-r border-white/10 group-hover:border-black/20 flex flex-col justify-between gap-4">
                        <span>09 JUN 2026</span>
                        <span className="uppercase font-bold tracking-widest">ENGINEERING</span>
                    </div>
                    <div className="lg:col-span-8 p-6 lg:p-8 flex flex-col justify-between">
                        <h3 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-6">
                            Membedah Arsitektur SEO "Stealth Sitemap" Skala Enterprise.
                        </h3>
                        <div className="flex items-center justify-between w-full">
                            <p className="font-sans text-sm opacity-60 group-hover:opacity-100 max-w-xl">
                                Mengapa memecah dan menyembunyikan sitemap adalah praktik terbaik untuk platform SaaS dengan ratusan ribu pengguna.
                            </p>
                            <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform">
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

        {/* Edge-to-Edge Footer */}
        <footer className="border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 font-mono text-xs tracking-widest uppercase">
                <div className="p-8 hover:bg-white/5 transition-colors cursor-pointer">
                    <p className="opacity-50 mb-4 text-white">LOKASI</p>
                    <p className="text-white">SURABAYA, JAWA TIMUR<br />INDONESIA</p>
                </div>
                <div className="p-8 hover:bg-white/5 transition-colors cursor-pointer">
                    <p className="opacity-50 mb-4 text-white">ENTITAS</p>
                    <p className="text-white">RITIONS CREATIF HUB<br />&copy; 2026</p>
                </div>
                <div className="p-8 hover:bg-white/5 transition-colors cursor-pointer lg:col-span-2 bg-zinc-950 flex flex-col justify-between gap-4">
                    <p className="opacity-50 text-white">BERLANGGANAN TRANSMISI</p>
                    <form className="flex border-b border-white/20 pb-2 focus-within:border-brand-accent transition-colors" action="#">
                        <input type="email" placeholder="ALAMAT@EMAIL.COM" className="bg-transparent outline-none w-full text-white placeholder-white/20" />
                        <button type="submit" className="text-brand-accent hover:text-white transition-colors">KIRIM</button>
                    </form>
                </div>
            </div>
            <div className="pt-12 pb-0 overflow-hidden flex items-end justify-center text-center border-t border-white/10">
                <h2 className="text-white font-display font-bold text-[15vw] leading-[0.75] tracking-tighter opacity-10 translate-y-4 md:translate-y-6">PORTFO.BE</h2>
            </div>
        </footer>
      </div>
    </div>
  );
}
