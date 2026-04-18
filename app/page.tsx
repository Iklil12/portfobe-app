// app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ==========================================
// DATA STATIS 
// ==========================================
const TEMPLATE_LIST = [
  { id: 1, image: "/showcase/contoh1.png", category: "Bento Grid", title: "The Minimalist" },
  { id: 2, image: "/showcase/contoh2.png", category: "Dark Mode", title: "The Director" },
  { id: 3, image: "/showcase/contoh3.png", category: "Earth Tones", title: "The Boutique" },
  { id: 4, image: "/showcase/contoh4.png", category: "High Contrast", title: "The Rebel" },
  { id: 5, image: "/showcase/contoh5.png", category: "Swiss Grid", title: "The Architect" },
  { id: 6, image: "/showcase/contoh6.png", category: "Glassmorphism", title: "The Visionary" },
  { id: 7, image: "/showcase/contoh7.png", category: "Cinematic View", title: "The Viewfinder" },
  { id: 8, image: "/showcase/contoh8.png", category: "Fine Art Style", title: "The Gallery" }
];

const FEATURE_LIST = [
  { id: 1, title: "Website Design and Development", desc: "Our creative engine automatically snaps your assets into a perfect, masonry-style grid instantly." },
  { id: 2, title: "Advertising and Marketing Campaigns", desc: "Global CDN edge routing ensures your heavy video files load blazingly fast anywhere in the world." },
  { id: 3, title: "Creative Consulting and Development", desc: "90% of clients open links on their phones. We optimized everything for thumbs and small screens." },
  { id: 4, title: "Branding and Identity Design", desc: "Search engine architecture designed to help your personal brand dominate the front page of Google." }
];

const FAQ_LIST = [
  { id: 0, q: "Apakah benar-benar gratis?", a: "Ya, paket Starter gratis selamanya tanpa batasan waktu. Kamu bisa menggunakan fitur dasar yang sudah sangat cukup untuk memulai." },
  { id: 1, q: "Bisa embed video dari YouTube/Vimeo?", a: "Tentu. Kami merekomendasikan embed link YouTube, Vimeo, atau TikTok agar halaman portofoliomu tetap memuat dengan cepat tanpa membebani kuota." },
  { id: 2, q: "Bagaimana cara setting domain sendiri (.com)?", a: "Setelah upgrade ke paket Pro, kamu akan mendapat panduan 2 langkah mudah untuk menyambungkan domain pribadimu ke server kami." }
];

const MARQUEE_TEXTS = ["VIDEOGRAFER", "FOTOGRAFER", "DESAINER GRAFIS", "3D ARTIST", "EDITOR VIDEO", "ILUSTRATOR"];

// ==========================================
// KOMPONEN UTAMA
// ==========================================
export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Smooth Scroll Reveal Animasi
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
          entry.target.classList.remove('opacity-0', 'translate-y-12', 'scale-[0.98]');
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

    sectionRefs.current.forEach(sec => {
      if (sec) {
        sec.classList.add('transition-all', 'duration-[1000ms]', 'ease-[cubic-bezier(0.22,1,0.36,1)]', 'opacity-0', 'translate-y-12', 'scale-[0.98]', 'will-change-transform', 'will-change-opacity');
        observer.observe(sec);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Lock mobile scroll saat menu aktif
  useEffect(() => {
    if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <div className="text-slate-900 bg-[#FAFAFA] font-sans selection:bg-[#ff9e00]/30 selection:text-slate-900 overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        html { scroll-behavior: smooth; }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Navbar Hover Effect */
        .nav-link { position: relative; }
        .nav-link::after {
            content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px;
            background: #0f172a; transition: width 0.3s ease; border-radius: 2px;
        }
        .nav-link:hover::after { width: 100%; }

        .bg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
        }

        /* LOOPING ANIMATIONS (Blobs & Marquee) */
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee { animation: marquee 35s linear infinite; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 8s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}} />

      {/* NAVBAR - DIPERBAIKI (BUG BORDER HILANG, SESUAI GAMBAR REFERENSI PILL) */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex justify-center ${isScrolled ? 'pt-4 px-4' : 'pt-6 px-6 md:px-12'}`}>
        <div className={`flex justify-between items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] w-full rounded-full ${isScrolled ? 'bg-white/90 backdrop-blur-md border border-slate-300 shadow-[0_10px_40px_rgba(0,0,0,0.05)] px-6 py-3 max-w-4xl' : 'bg-transparent border border-transparent px-0 py-0 max-w-7xl'}`}>
          
          <Link href="/" className="flex items-center cursor-pointer group">
            <img src="/portfo.be.png" alt="Portfo.be Logo" className="h-6 md:h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-10">
            {['Features', 'Templates', 'Pricing'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors">{item}</a>
            ))}
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login" className="text-slate-600 hover:text-slate-900 text-sm font-bold px-5 py-2 hover:bg-slate-100 rounded-full transition-colors">Log in</Link>
            <Link href="/register" className="px-7 py-2.5 rounded-full bg-[#0f172a] text-white text-sm font-bold hover:bg-black transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 flex items-center gap-2 group">
              Get Started
            </Link>
          </div>
          
          {/* Hamburger Mobile */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-900 focus:outline-none bg-slate-100 hover:bg-slate-200 w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all">
            <i className="fas fa-bars text-sm"></i>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU (SIDE DRAWER) */}
      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      
      <div className={`fixed top-0 right-0 w-[85%] max-w-sm h-[100dvh] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <span className="flex items-center">
                <img src="/portfo.be.png" alt="Portfo.be Logo" className="h-6 w-auto object-contain" />
            </span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 active:scale-90 transition-transform">
                <i className="fas fa-times"></i>
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 mt-4">
            {['Features', 'Templates', 'Pricing'].map((item, i) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-extrabold text-3xl hover:text-[#ff9e00] transition-colors flex items-center justify-between group" style={{animationDelay: `${i * 100}ms`}}>
                    {item} <i className="fas fa-chevron-right text-sm text-slate-300 group-hover:text-[#ff9e00] group-hover:translate-x-2 transition-transform"></i>
                </a>
            ))}
        </div>
        <div className="p-6 border-t border-slate-100 flex flex-col gap-3">
            <Link href="/login" className="block w-full text-slate-900 font-bold py-4 text-center bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Log in</Link>
            <Link href="/register" className="block w-full py-4 rounded-xl bg-slate-900 text-white text-center font-bold shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
              Get Started Free <i className="fas fa-bolt text-yellow-400"></i>
            </Link>
        </div>
      </div>

      {/* HERO SECTION DENGAN LOOPING BLOBS BACKGROUND */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-[#FAFAFA] pointer-events-none z-0"></div>
        
        {/* Animated Background Blobs (Sangat Keren & Profesional) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ff9e00]/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-pink-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10" ref={addToRefs}>
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
            
            <div className="w-full lg:w-1/2 lg:pr-8 text-center lg:text-left flex flex-col items-center lg:items-start">
              
              <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] tracking-tighter leading-[1.05] text-slate-900 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2 md:gap-x-4 mb-8">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">Showcase</span>
                  <div className="w-24 md:w-36 h-12 md:h-16 rounded-full overflow-hidden inline-block align-middle shadow-[0_8px_15px_rgba(0,0,0,0.1)] shrink-0 hover:scale-105 transition-transform duration-500 cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Creative team" />
                  </div>
                  <span className="font-light text-slate-500 italic">Work.</span>
                  <div className="w-full basis-full h-0"></div>
                  <span className="font-extrabold">Land More</span>
                  <span className="font-light text-slate-500">Clients.</span>
              </h1>
              
              <p className="text-slate-500 text-lg md:text-xl mb-10 leading-relaxed max-w-md font-medium text-center lg:text-left">
                The minimalist portfolio builder designed exclusively for visual creators. Zero coding, lightning-fast, and unapologetically beautiful.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 relative">
                {/* Efek denyut (Pulse Glow) di belakang tombol utama */}
                <div className="absolute top-0 left-0 w-full sm:w-auto h-full bg-[#ff9e00]/60 blur-xl rounded-full animate-pulse pointer-events-none"></div>
                
                <Link href="/register" className="relative z-10 inline-flex items-center gap-4 pl-8 pr-2 py-2 rounded-full bg-[#ff9e00] hover:bg-[#e68e00] active:scale-95 transition-all group shadow-[0_10px_30px_rgba(255,158,0,0.3)]">
                    <span className="text-[11px] font-black uppercase tracking-widest text-black">Start Building</span>
                    <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center text-white group-hover:bg-slate-800 transition-colors duration-300">
                        <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                    </div>
                </Link>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-4 py-2">
                    <i className="fas fa-star text-yellow-400 animate-pulse"></i> Free Forever Plan
                </span>
              </div>
            </div>
            
            {/* Floating Mockup (Kanan) */}
            <div className="w-full lg:w-1/2 relative hidden md:block h-[550px]">
              <div className="absolute right-0 top-16 w-[65%] h-[400px] bg-slate-200 rounded-[2rem] overflow-hidden shadow-2xl animate-float" style={{ animationDelay: '1s' }}>
                <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="Mockup Background" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>
              
              <div className="absolute left-4 top-32 w-[55%] h-[380px] bg-white/90 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white z-10 flex flex-col animate-float hover:scale-105 transition-transform duration-500 cursor-pointer group">
                <div className="h-12 bg-slate-50/50 border-b border-slate-100 flex items-center px-5 gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-400 group-hover:bg-red-500 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 group-hover:bg-yellow-500 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400 group-hover:bg-emerald-500 transition-colors"></div>
                  <div className="ml-4 flex-1 h-6 bg-white rounded-md border border-slate-200 flex items-center px-3 shadow-sm">
                      <i className="fas fa-lock text-[8px] text-slate-300 mr-2"></i>
                      <span className="text-[9px] font-mono text-slate-400">portfo.be/creator</span>
                  </div>
                </div>
                <div className="p-6 flex-1 overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-tr from-orange-100 to-orange-50 rounded-full p-1 border border-orange-200 shadow-sm group-hover:rotate-[360deg] transition-transform duration-[2s]">
                            <img src="https://ui-avatars.com/api/?name=CR&background=fff&color=ea580c" className="w-full h-full rounded-full" alt="avatar"/>
                        </div>
                        <div>
                            <div className="w-24 h-4 bg-slate-800 rounded-full mb-2"></div>
                            <div className="w-16 h-3 bg-slate-300 rounded-full"></div>
                        </div>
                    </div>
                    <div className="w-full h-16 bg-slate-50 border border-slate-100 rounded-xl mb-3 flex items-center px-4 gap-3 hover:bg-slate-100 transition-colors"><i className="fab fa-instagram text-slate-400 text-lg"></i><div className="w-1/2 h-2 bg-slate-300 rounded-full"></div></div>
                    <div className="w-full h-16 bg-slate-50 border border-slate-100 rounded-xl flex items-center px-4 gap-3 hover:bg-slate-100 transition-colors"><i className="fab fa-behance text-slate-400 text-lg"></i><div className="w-1/2 h-2 bg-slate-300 rounded-full"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-8 border-y border-slate-200 bg-white overflow-hidden relative z-30">
        <div className="flex space-x-12 marquee w-max text-slate-300 font-extrabold tracking-widest text-lg md:text-xl uppercase">
          {[1, 2, 3].map((group) => (
              <div key={group} className="flex items-center space-x-12">
                  {MARQUEE_TEXTS.map((txt, i) => (
                      <span key={i} className="flex items-center gap-12 hover:text-[#ff9e00] transition-colors cursor-default">
                          <span className="text-[#ff9e00]/50">*</span>
                          <span>{txt}</span>
                      </span>
                  ))}
              </div>
          ))}
        </div>
      </section>

      {/* FEATURES ACCORDION */}
      <section id="features" ref={addToRefs} className="bg-[#0a0a0a] pt-24 md:pt-32 pb-0 flex flex-col relative overflow-hidden">
        {/* Subtle moving stars in background */}
        <div className="absolute top-10 left-[20%] w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-[10%] w-2 h-2 bg-white rounded-full opacity-20 animate-pulse animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-20 w-full relative z-10">
          <div className="max-w-2xl relative">
            <div className="absolute -top-32 -right-64 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none hidden lg:block animate-pulse animation-delay-4000"></div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white leading-tight">Built for speed.<br/><span className="text-slate-500 font-light">Designed to impress.</span></h2>
          </div>
        </div>
        
        <div className="w-full border-t border-b border-white/10 flex flex-col md:flex-row h-auto md:h-[450px] relative z-10">
          {FEATURE_LIST.map((feat) => {
            const isActive = activeFeature === feat.id;

            return (
              <div 
                key={feat.id} 
                onMouseEnter={() => window.innerWidth >= 768 && setActiveFeature(feat.id)}
                onMouseLeave={() => window.innerWidth >= 768 && setActiveFeature(null)}
                onClick={() => setActiveFeature(isActive ? null : feat.id)}
                className={`relative flex-1 p-8 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-[#0a0a0a] ${isActive ? 'md:flex-[1.4] bg-[#111111]' : ''}`}
              >
                <div className={`absolute top-0 left-0 w-full h-[2px] transition-colors duration-500 z-10 ${isActive ? 'bg-[#ff9e00]' : 'bg-transparent'}`}></div>
                
                <div className="relative h-full flex flex-col">
                  <h3 className={`text-2xl lg:text-3xl font-bold text-white pr-4 tracking-tight leading-snug transform transition-all duration-500 ${isActive ? 'mb-4 md:-translate-y-2' : 'mb-4 md:mb-6'}`}>
                    {feat.title}
                  </h3>
                  
                  <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? 'grid-rows-[1fr] opacity-100 md:translate-y-0 mb-6' : 'grid-rows-[0fr] opacity-0 md:translate-y-8 mb-0'}`}>
                    <div className="overflow-hidden">
                      <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-sm pt-2">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto relative w-12 h-12 shrink-0">
                    <div className={`absolute bottom-0 left-0 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 transition-all duration-300 ${isActive ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}>
                      <i className="fas fa-arrow-right text-[10px]"></i>
                    </div>
                    
                    <div className={`absolute bottom-0 left-0 w-12 h-12 rounded-full bg-[#ff9e00] flex items-center justify-center text-black transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive ? 'opacity-100 scale-100 shadow-[0_0_20px_rgba(255,158,0,0.3)] rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
                      <i className="fas fa-arrow-right text-sm"></i>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TEMPLATES - HIGH-END MASONRY GRID */}
      <section id="templates" ref={addToRefs} className="relative py-24 md:py-32 bg-[#0a0a0a] overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff9e00]/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">Start with a<br/><span className="text-slate-500 font-light">masterpiece.</span></h2>
              <p className="text-slate-400 text-lg font-medium">World-class layouts curated by top designers. Customize every pixel.</p>
            </div>
            <Link href="/register" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all duration-300 group shrink-0 shadow-lg">
              Explore All <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 group-hover:translate-x-1 transition-transform duration-300"></i>
            </Link>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {TEMPLATE_LIST.map((item, index) => {
              const aspectClass = index % 2 === 0 ? 'aspect-[4/5]' : 'aspect-square';
              
              return (
                <div key={item.id} className="group relative rounded-[2rem] overflow-hidden bg-[#111] break-inside-avoid shadow-2xl hover:shadow-[0_20px_50px_rgba(255,158,0,0.1)] transition-all duration-700 cursor-pointer">
                  
                  <div className={`w-full overflow-hidden ${aspectClass}`}>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]" 
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <div className="flex justify-between items-end gap-4">
                      <div>
                        <p className="text-[#ff9e00] text-[10px] font-black uppercase tracking-widest mb-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                          {item.category}
                        </p>
                        <h3 className="text-white text-2xl lg:text-3xl font-bold tracking-tight">
                          {item.title}
                        </h3>
                      </div>
                      <div className="w-12 h-12 shrink-0 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-[#ff9e00] group-hover:border-[#ff9e00] group-hover:text-black transition-all duration-500 hover:scale-110 shadow-lg">
                        <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-500"></i>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING - DIPERBAIKI BUG TOMBOL MENGEcil & WARNA SESUAI REFERENSI */}
      <section id="pricing" ref={addToRefs} className="relative py-24 md:py-32 bg-[#0e0e16] overflow-hidden border-t border-white/5">
        <div className="absolute top-20 left-[10%] w-3 h-3 bg-orange-400 rounded-full blur-[1px] animate-float"></div>
        <div className="absolute top-40 left-[5%] w-6 h-6 bg-emerald-400/50 rounded-full blur-[4px] animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/4 right-[15%] w-2 h-2 bg-purple-400 rounded-full blur-[1px] animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 right-[5%] w-4 h-4 bg-blue-400 rounded-full blur-[2px] animate-float" style={{animationDelay: '2s'}}></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Simple pricing</h2>
            <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">
              Get started with Portfo.be today and experience the power of seamless portfolio creation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* BASIC CARD */}
            <div className="bg-[#15151a] rounded-[2rem] p-8 md:p-10 border border-white/5 hover:border-white/20 transition-colors flex flex-col group">
              <h3 className="text-2xl font-medium text-[#facc15] mb-3">Starter</h3>
              <p className="text-slate-400 text-sm font-medium mb-8 h-10 leading-relaxed">Everything you need to launch your visual portfolio.</p>
              
              <div className="mb-8">
                  <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter">Rp0</span>
              </div>
              
              <Link href="/register" className="block w-full text-center py-4 rounded-xl bg-white text-slate-900 font-bold text-[12px] uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all mb-10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Get Started
              </Link>
              
              <ul className="space-y-5 flex-1">
                {['1 Portfolio Page', 'Up to 12 Content Blocks', 'Standard portfo.be/name link', 'Community Support'].map((list, i) => (
                    <li key={i} className="group/item flex items-start gap-4 text-slate-300 text-sm font-medium leading-relaxed hover:text-white transition-all duration-300 cursor-default">
                      <div className="w-5 h-5 rounded-full bg-[#a855f7] flex items-center justify-center shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300">
                        <i className="fas fa-check text-[10px] text-white"></i>
                      </div>
                      <span className="group-hover/item:translate-x-1 transition-transform duration-300">{list}</span>
                    </li>
                ))}
              </ul>
            </div>
            
            {/* PRO CARD */}
            <div className="bg-[#15151a] rounded-[2rem] p-8 md:p-10 border border-white/10 hover:border-purple-500/50 transition-all duration-500 flex flex-col relative overflow-hidden group hover:shadow-[0_0_50px_rgba(168,85,247,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-medium text-[#c084fc] mb-3">Pro Creator</h3>
                <p className="text-slate-400 text-sm font-medium mb-8 h-10 leading-relaxed">Advanced features, custom domain, and analytics dashboard.</p>
                
                <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter">Rp99k</span>
                    <span className="text-slate-500 font-medium">/mo</span>
                </div>
                
                <Link href="/register" className="block w-full text-center py-4 rounded-xl bg-white text-slate-900 font-bold text-[12px] uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all mb-10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Get Started
                </Link>
                
                <ul className="space-y-5 flex-1">
                  {['Unlimited Pages & Blocks', 'Custom Domain (.com/.id)', 'Advanced Analytics Dashboard', 'Remove Portfo.be Badge', 'Priority Support'].map((list, i) => (
                      <li key={i} className="group/item flex items-start gap-4 text-slate-300 text-sm font-medium leading-relaxed hover:text-white transition-all duration-300 cursor-default">
                        <div className="w-5 h-5 rounded-full bg-[#a855f7] flex items-center justify-center shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300">
                          <i className="fas fa-check text-[10px] text-white"></i>
                        </div>
                        <span className="group-hover/item:translate-x-1 transition-transform duration-300">{list}</span>
                      </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={addToRefs} className="py-24 bg-white border-t border-slate-100 relative">
        <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Frequently Asked.</h2>
          </div>
          
          <div className="space-y-4">
            {FAQ_LIST.map((faq) => (
                <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                  <button onClick={() => toggleFaq(faq.id)} className="w-full text-left px-6 py-6 font-bold text-slate-800 flex justify-between items-center transition-colors">
                    <span className="text-lg pr-4">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${openFaq === faq.id ? 'bg-slate-900 text-white shadow-md rotate-180' : 'bg-slate-100 text-slate-400 rotate-0'}`}>
                        <i className="fas fa-chevron-down text-sm"></i>
                    </div>
                  </button>
                  <div className={`px-6 text-slate-500 text-sm md:text-base font-medium leading-relaxed transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${openFaq === faq.id ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0 overflow-hidden'}`}>
                    {faq.a}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEGA FOOTER */}
      <footer className="bg-[#050505] text-slate-400 pt-24 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            <div className="bg-[#111] rounded-[2.5rem] p-10 md:p-16 mb-24 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#ff9e00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                <div className="relative z-10 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">Ready to launch?</h2>
                    <p className="text-slate-400 font-medium">Join thousands of visual creators on Portfo.be today.</p>
                </div>
                <Link href="/register" className="shrink-0 px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-[#ff9e00] hover:text-black active:scale-95 transition-all duration-300 shadow-lg flex items-center gap-3 z-10 group/btn">
                    Get Started Free <i className="fas fa-arrow-right text-xs group-hover/btn:translate-x-1 transition-transform"></i>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-20">
                <div className="col-span-2 lg:col-span-2 pr-0 md:pr-12">
                    <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2 mb-6">
                        <img src="/portfo.be.png" alt="Portfo.be Logo" className="h-8 md:h-10 w-auto object-contain brightness-0 invert" />
                    </div>
                    <p className="text-sm font-medium leading-relaxed mb-8 text-slate-500 max-w-sm">The premier hub for visual creators to showcase work, share links, and land high-paying clients without writing a single line of code.</p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-blue-500 hover:scale-110 hover:-translate-y-1 transition-all duration-300"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-pink-600 hover:scale-110 hover:-translate-y-1 transition-all duration-300"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 hover:-translate-y-1 transition-all duration-300"><i className="fab fa-tiktok"></i></a>
                    </div>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-6">Platform</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><a href="#features" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Features</a></li>
                        <li><a href="#templates" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Templates</a></li>
                        <li><a href="#pricing" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Pricing</a></li>
                        <li><a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Changelog</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-6">Resources</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Help Center</a></li>
                        <li><a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Community</a></li>
                        <li><a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Creator Blog</a></li>
                        <li><a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Hire an Expert</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-600">
                <p>&copy; {new Date().getFullYear()} Portfo.be Inc.</p>
                <p>Designed in Indonesia <i className="fas fa-heart text-red-500 ml-1 animate-pulse"></i></p>
            </div>
        </div>
      </footer>

    </div>
  );
}