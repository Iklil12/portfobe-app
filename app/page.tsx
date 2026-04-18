// app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  // ==========================================
  // STATE & REFS
  // ==========================================
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // ==========================================
  // EFFECTS (LIFECYCLE)
  // ==========================================
  useEffect(() => {
    // 1. Navbar Scroll Effect (Persis seperti web1.html)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // 2. Intersection Observer untuk Animasi Fade-In
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    sectionRefs.current.forEach(sec => {
      if (sec) {
        sec.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
        observer.observe(sec);
      }
    });

    // 3. Carousel Initial Scroll (Arahkan ke slide ke-2 saat awal load)
    setTimeout(() => {
      if (trackRef.current) {
        const slides = trackRef.current.querySelectorAll('.slide-item');
        if (slides.length > 1) {
          const targetSlide = slides[1] as HTMLElement;
          const targetScroll = targetSlide.offsetLeft - (trackRef.current.clientWidth / 2) + (targetSlide.offsetWidth / 2);
          trackRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
        updateActiveSlide(); // Panggil fungsi update pertama kali
      }
    }, 300);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // ==========================================
  // CAROUSEL LOGIC
  // ==========================================
  const updateActiveSlide = () => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const centerPos = track.scrollLeft + (track.clientWidth / 2);
    const slides = track.querySelectorAll('.slide-item');

    slides.forEach((slide: any) => {
      const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
      const distance = Math.abs(centerPos - slideCenter);
      
      if (distance < slide.offsetWidth / 2) {
        slide.classList.remove('grayscale', 'scale-[0.85]', 'opacity-60');
        slide.classList.add('scale-100', 'opacity-100', 'shadow-[0_0_50px_rgba(249,115,22,0.15)]');
        slide.querySelector('.indicator')?.classList.remove('opacity-0');
      } else {
        slide.classList.add('grayscale', 'scale-[0.85]', 'opacity-60');
        slide.classList.remove('scale-100', 'opacity-100', 'shadow-[0_0_50px_rgba(249,115,22,0.15)]');
        slide.querySelector('.indicator')?.classList.add('opacity-0');
      }
    });
  };

  const scrollSlider = (dir: number) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const slides = track.querySelectorAll('.slide-item');
    if (slides.length === 0) return;
    
    const slideWidth = (slides[0] as HTMLElement).offsetWidth;
    const gap = window.innerWidth >= 768 ? 40 : 24; 
    track.scrollBy({ left: dir * (slideWidth + gap), behavior: 'smooth' });
  };

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="text-gray-900 bg-white selection:bg-gray-900 selection:text-white">
      
      {/* ========================================== */}
      {/* INJEKSI CUSTOM CSS GLOBAL & FONT         */}
      {/* ========================================== */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

        * { font-family: 'Inter', sans-serif; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f9fafb; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .font-serif-classic { font-family: 'Playfair Display', serif; }

        .gradient-text {
            background: linear-gradient(135deg, #000000, #4b5563);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .nav-link { position: relative; }
        .nav-link::after {
            content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px;
            background: #000000; transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .bg-dots {
            background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
            background-size: 32px 32px;
        }

        .premium-hover { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .premium-hover:hover {
            transform: translateY(-6px);
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.06);
        }

        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .marquee { animation: marquee 40s linear infinite; }

        .carousel-padding {
            padding-left: calc(50vw - 140px);
            padding-right: calc(50vw - 140px);
        }
        @media (min-width: 768px) {
            .carousel-padding {
                padding-left: calc(50vw - 170px);
                padding-right: calc(50vw - 170px);
            }
        }
        .slide-item { transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1); }
        .indicator { transition: all 0.4s ease; }
      `}} />

      {/* ========================================== */}
      {/* NAVBAR (DIPERBAIKI PERSIS SEPERTI web1.html) */}
      {/* ========================================== */}
      <nav className={`fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300 ${isScrolled ? 'py-2 shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-4">
          <div className="flex justify-between items-center">
            
            {/* Logo Menggunakan Gambar */}
            <div className="text-2xl font-bold tracking-tight">
              <img src="/portfo.be.png" alt="Logo Portfo.be" className="h-8 md:h-10 w-auto object-contain" />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              <a href="#fitur" className="nav-link text-gray-500 hover:text-black text-sm font-medium transition-colors">Fitur</a>
              <a href="#templates" className="nav-link text-gray-500 hover:text-black text-sm font-medium transition-colors">Templates</a>
              <a href="#harga" className="nav-link text-gray-500 hover:text-black text-sm font-medium transition-colors">Harga</a>
              <a href="#testimoni" className="nav-link text-gray-500 hover:text-black text-sm font-medium transition-colors">Testimoni</a>
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/login" className="text-gray-500 hover:text-black text-sm font-medium">Log in</Link>
              <Link href="/register" className="px-7 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-all">
                Daftar Gratis
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden text-gray-900 text-xl p-2 focus:outline-none"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} transition-all duration-300`}></i>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:hidden flex-col space-y-4 pt-6 pb-4 mt-2 border-t border-gray-100`}>
            <a href="#fitur" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-black font-medium transition-colors">Fitur</a>
            <a href="#templates" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-black font-medium transition-colors">Templates</a>
            <a href="#harga" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-black font-medium transition-colors">Harga</a>
            <a href="#testimoni" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-black font-medium transition-colors">Testimoni</a>
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-50">
              <Link href="/login" className="text-gray-500 hover:text-black font-medium py-2">Log in</Link>
              <Link href="/register" className="py-3 rounded-full bg-gray-900 text-white text-center font-semibold hover:bg-black transition-all">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================== */}
      {/* HERO SECTION */}
      {/* ========================================== */}
      <section ref={addToRefs} className="min-h-screen flex items-center pt-24 bg-dots relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/90 to-white pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2 mb-8 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-900"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-600">The Visual Creator Hub "sudah terupdate"</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.05] tracking-tight">
                Tunjukkan karyamu,<br />
                <span className="text-gray-300">dapatkan klien.</span>
              </h1>
              
              <p className="text-gray-500 text-lg md:text-xl mb-12 leading-relaxed max-w-lg">
                Platform portfolio elegan khusus kreator visual. Minimalis, cepat, dan profesional. Fokuslah berkarya, kami yang urus websitemu.
              </p>
              
              <div className="flex flex-wrap gap-5 mb-12">
                <Link href="/register" className="px-10 py-4 rounded-full bg-gray-900 text-white font-bold hover:shadow-2xl hover:-translate-y-1 transition-all">
                  Mulai Sekarang
                </Link>
                <a href="#templates" className="px-10 py-4 rounded-full bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all">
                  Lihat Demo
                </a>
              </div>
            </div>
            
            <div className="relative lg:ml-auto w-full max-w-md hidden lg:block">
              <div className="relative bg-white rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100">
                <div className="text-center mb-10">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                    <img src="https://ui-avatars.com/api/?name=Iklil+Uyun&background=random" className="w-full h-full object-cover" alt="Avatar" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Iklil Uyun</h2>
                  <p className="text-gray-400 font-medium text-sm">Videografer & Editor</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center"><i className="fas fa-play text-gray-200 text-xl"></i></div>
                  <div className="aspect-square bg-gray-50 rounded-2xl"></div>
                  <div className="aspect-square bg-gray-50 rounded-2xl"></div>
                  <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center"><i className="fas fa-camera text-gray-200 text-xl"></i></div>
                </div>
                
                <div className="bg-gray-900 rounded-2xl py-4 px-6 flex justify-between items-center">
                  <span className="text-white/50 text-xs font-medium">portfo.be/iklil</span>
                  <i className="fas fa-external-link-alt text-white text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* MARQUEE SECTION */}
      {/* ========================================== */}
      <section ref={addToRefs} className="py-10 border-t border-b border-gray-100 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8 marquee w-max text-gray-300 font-bold tracking-widest text-xl uppercase">
            <div className="flex items-center space-x-12">
              <span>* VIDEOGRAFER</span>
              <span>* FOTOGRAFER</span>
              <span>* DESAINER GRAFIS</span>
              <span>* 3D ARTIST</span>
              <span>* EDITOR VIDEO</span>
              <span>* ILUSTRATOR</span>
            </div>
            <div className="flex items-center space-x-12">
              <span>* VIDEOGRAFER</span>
              <span>* FOTOGRAFER</span>
              <span>* DESAINER GRAFIS</span>
              <span>* 3D ARTIST</span>
              <span>* EDITOR VIDEO</span>
              <span>* ILUSTRATOR</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FEATURES SECTION */}
      {/* ========================================== */}
      <section id="fitur" ref={addToRefs} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Fitur Utama <span className="text-gray-300">Portfo.be</span></h2>
              <p className="text-gray-500 text-lg">Semua yang kamu butuhkan untuk tampil profesional secara online.</p>
            </div>
            <a href="#harga" className="text-gray-900 font-bold border-b-2 border-gray-900 pb-1">Lihat Harga &rarr;</a>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="premium-hover bg-gray-50 rounded-[2rem] p-10 border border-gray-100">
              <i className="fas fa-photo-video text-2xl mb-8 block"></i>
              <h3 className="text-xl font-black mb-4">Visual Grid</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Layout otomatis yang menyesuaikan dengan proporsi foto dan video karyamu.</p>
            </div>
            <div className="premium-hover bg-gray-50 rounded-[2rem] p-10 border border-gray-100">
              <i className="fas fa-bolt text-2xl mb-8 block"></i>
              <h3 className="text-xl font-black mb-4">Instant Load</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Website super cepat. Jangan biarkan klien menunggu saat melihat karyamu.</p>
            </div>
            <div className="premium-hover bg-gray-50 rounded-[2rem] p-10 border border-gray-100">
              <i className="fas fa-mobile text-2xl mb-8 block"></i>
              <h3 className="text-xl font-black mb-4">Mobile First</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Tampilan sempurna di layar HP, tempat di mana sebagian besar klien melihat link-mu.</p>
            </div>
            <div className="premium-hover bg-gray-50 rounded-[2rem] p-10 border border-gray-100">
              <i className="fas fa-shield-alt text-2xl mb-8 block"></i>
              <h3 className="text-xl font-black mb-4">SEO Ready</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Mudah ditemukan di Google ketika orang mencari namamu atau jasamu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* TEMPLATES CAROUSEL SECTION */}
      {/* ========================================== */}
      <section id="templates" ref={addToRefs} className="relative py-24 bg-dots overflow-hidden min-h-screen flex flex-col justify-center border-y border-gray-100">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] md:w-[30vw] h-[60vh] bg-orange-400/15 blur-[100px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 text-center mb-10 md:mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-gray-400"></div>
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Explore Templates</span>
            <div className="w-12 h-[1px] bg-gray-400"></div>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif-classic text-gray-900 tracking-tight">Koleksi Desain</h2>
        </div>

        <div className="relative w-full max-w-[100vw] z-10">
          <button onClick={() => scrollSlider(-1)} className="absolute left-6 md:left-[15%] lg:left-[22%] top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#f97316] text-white flex items-center justify-center z-30 hover:scale-110 transition-transform shadow-lg border-2 border-white/20 hidden md:flex">
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
          <button onClick={() => scrollSlider(1)} className="absolute right-6 md:right-[15%] lg:right-[22%] top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#f97316] text-white flex items-center justify-center z-30 hover:scale-110 transition-transform shadow-lg border-2 border-white/20 hidden md:flex">
            <i className="fas fa-arrow-right text-lg"></i>
          </button>

          <div 
            ref={trackRef} 
            onScroll={updateActiveSlide}
            className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory hide-scrollbar carousel-padding py-10 items-center h-[550px] md:h-[650px] relative"
          >
            {/* Template 1 */}
            <div className="slide-item snap-center shrink-0 w-[280px] md:w-[340px] aspect-[3/4.5] relative cursor-pointer grayscale scale-[0.85] opacity-60">
              <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm shadow-xl" alt="Theme" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-sm"></div>
              <div className="absolute bottom-10 left-0 w-full text-center px-6">
                <p className="text-[#f97316] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Bento Grid</p>
                <h3 className="text-white text-3xl md:text-4xl font-serif-classic">The Minimalist</h3>
                <div className="indicator w-10 h-[2px] bg-[#f97316] mx-auto mt-4 opacity-0"></div>
              </div>
            </div>

            {/* Template 2 */}
            <div className="slide-item snap-center shrink-0 w-[280px] md:w-[340px] aspect-[3/4.5] relative cursor-pointer grayscale scale-[0.85] opacity-60">
              <img src="https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm shadow-xl" alt="Theme" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-sm"></div>
              <div className="absolute bottom-10 left-0 w-full text-center px-6">
                <p className="text-[#f97316] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Dark Mode</p>
                <h3 className="text-white text-3xl md:text-4xl font-serif-classic">The Director</h3>
                <div className="indicator w-10 h-[2px] bg-[#f97316] mx-auto mt-4 opacity-0"></div>
              </div>
            </div>

            {/* Template 3 */}
            <div className="slide-item snap-center shrink-0 w-[280px] md:w-[340px] aspect-[3/4.5] relative cursor-pointer grayscale scale-[0.85] opacity-60">
              <img src="https://images.unsplash.com/photo-1613521140785-e85e427f8002?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm shadow-xl" alt="Theme" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-sm"></div>
              <div className="absolute bottom-10 left-0 w-full text-center px-6">
                <p className="text-[#f97316] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Earth Tones</p>
                <h3 className="text-white text-3xl md:text-4xl font-serif-classic">The Boutique</h3>
                <div className="indicator w-10 h-[2px] bg-[#f97316] mx-auto mt-4 opacity-0"></div>
              </div>
            </div>

            {/* Template 4 */}
            <div className="slide-item snap-center shrink-0 w-[280px] md:w-[340px] aspect-[3/4.5] relative cursor-pointer grayscale scale-[0.85] opacity-60">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm shadow-xl" alt="Theme" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-sm"></div>
              <div className="absolute bottom-10 left-0 w-full text-center px-6">
                <p className="text-[#f97316] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">High Contrast</p>
                <h3 className="text-white text-3xl md:text-4xl font-serif-classic">The Rebel</h3>
                <div className="indicator w-10 h-[2px] bg-[#f97316] mx-auto mt-4 opacity-0"></div>
              </div>
            </div>

            {/* Template 5 */}
            <div className="slide-item snap-center shrink-0 w-[280px] md:w-[340px] aspect-[3/4.5] relative cursor-pointer grayscale scale-[0.85] opacity-60">
              <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm shadow-xl" alt="Theme" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-sm"></div>
              <div className="absolute bottom-10 left-0 w-full text-center px-6">
                <p className="text-[#f97316] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Swiss Grid</p>
                <h3 className="text-white text-3xl md:text-4xl font-serif-classic">The Architect</h3>
                <div className="indicator w-10 h-[2px] bg-[#f97316] mx-auto mt-4 opacity-0"></div>
              </div>
            </div>

            {/* Template 6 */}
            <div className="slide-item snap-center shrink-0 w-[280px] md:w-[340px] aspect-[3/4.5] relative cursor-pointer grayscale scale-[0.85] opacity-60">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm shadow-xl" alt="Theme" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-sm"></div>
              <div className="absolute bottom-10 left-0 w-full text-center px-6">
                <p className="text-[#f97316] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Glassmorphism</p>
                <h3 className="text-white text-3xl md:text-4xl font-serif-classic">The Visionary</h3>
                <div className="indicator w-10 h-[2px] bg-[#f97316] mx-auto mt-4 opacity-0"></div>
              </div>
            </div>

            {/* Template 7 */}
            <div className="slide-item snap-center shrink-0 w-[280px] md:w-[340px] aspect-[3/4.5] relative cursor-pointer grayscale scale-[0.85] opacity-60">
              <img src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm shadow-xl" alt="Theme" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-sm"></div>
              <div className="absolute bottom-10 left-0 w-full text-center px-6">
                <p className="text-[#f97316] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Cinematic View</p>
                <h3 className="text-white text-3xl md:text-4xl font-serif-classic">The Viewfinder</h3>
                <div className="indicator w-10 h-[2px] bg-[#f97316] mx-auto mt-4 opacity-0"></div>
              </div>
            </div>

            {/* Template 8 */}
            <div className="slide-item snap-center shrink-0 w-[280px] md:w-[340px] aspect-[3/4.5] relative cursor-pointer grayscale scale-[0.85] opacity-60">
              <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm shadow-xl" alt="Theme" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-sm"></div>
              <div className="absolute bottom-10 left-0 w-full text-center px-6">
                <p className="text-[#f97316] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Fine Art Style</p>
                <h3 className="text-white text-3xl md:text-4xl font-serif-classic">The Gallery</h3>
                <div className="indicator w-10 h-[2px] bg-[#f97316] mx-auto mt-4 opacity-0"></div>
              </div>
            </div>

          </div>
        </div>

        <div className="text-center mt-2 text-gray-400 text-[10px] md:text-xs font-mono uppercase tracking-widest relative z-10 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          <span className="md:hidden animate-pulse">Geser untuk melihat &rarr;</span>
          <span className="hidden md:inline">Swipeflow • React Integration</span>
          <span className="hidden md:inline">•</span>
          <span>Created for Portfo.be</span>
        </div>
      </section>

      {/* ========================================== */}
      {/* PRICING SECTION */}
      {/* ========================================== */}
      <section id="harga" ref={addToRefs} className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Investasi <span className="text-gray-400">Karirmu</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Skalakan portofoliomu seiring dengan berkembangnya klienmu.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
            {/* Basic Plan */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-200 hover:border-gray-300 transition-colors">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Basic</h3>
              <p className="text-gray-500 mb-6 text-sm">Sempurna untuk kreator pemula</p>
              <div className="text-5xl font-extrabold mb-8 text-gray-900 tracking-tight">
                Rp0<span className="text-base font-medium text-gray-400 tracking-normal">/selamanya</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-gray-600"><i className="fas fa-check text-gray-900 text-sm"></i> <span>1 Halaman portofolio</span></li>
                <li className="flex items-center gap-3 text-gray-600"><i className="fas fa-check text-gray-900 text-sm"></i> <span>Maksimal 12 blok konten</span></li>
                <li className="flex items-center gap-3 text-gray-600"><i className="fas fa-check text-gray-900 text-sm"></i> <span>Link standar (portfo.be/nama)</span></li>
                <li className="flex items-center gap-3 text-gray-600"><i className="fas fa-check text-gray-900 text-sm"></i> <span>Template standar</span></li>
              </ul>
              <Link href="/register" className="block w-full text-center py-4 rounded-full border border-gray-300 text-gray-900 font-bold hover:bg-gray-50 transition">Mulai Gratis</Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gray-900 rounded-[2.5rem] p-10 relative shadow-2xl transform md:scale-105 premium-hover">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-white text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Paling Populer</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Pro Kreator</h3>
              <p className="text-gray-400 mb-6 text-sm">Untuk profesional & agensi mini</p>
              <div className="text-5xl font-extrabold mb-8 text-white tracking-tight">
                Rp99k<span className="text-base font-medium text-gray-500 tracking-normal">/bulan</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-gray-300"><i className="fas fa-check text-white text-sm"></i> <span>Halaman & konten tak terbatas</span></li>
                <li className="flex items-center gap-3 text-gray-300"><i className="fas fa-check text-white text-sm"></i> <span>Gunakan domain sendiri (.com/.id)</span></li>
                <li className="flex items-center gap-3 text-gray-300"><i className="fas fa-check text-white text-sm"></i> <span>Analitik mendalam (Views & Clicks)</span></li>
                <li className="flex items-center gap-3 text-gray-300"><i className="fas fa-check text-white text-sm"></i> <span>Hilangkan watermark Portfo.be</span></li>
                <li className="flex items-center gap-3 text-gray-300"><i className="fas fa-check text-white text-sm"></i> <span>Prioritas dukungan via WhatsApp</span></li>
              </ul>
              <Link href="/register" className="block w-full text-center py-4 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">Tingkatkan ke Pro</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* CTA BANNER */}
      {/* ========================================== */}
      <section ref={addToRefs} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="bg-gray-900 rounded-[3rem] py-20 px-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-dots opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tighter">Siap Menemukan <span className="text-white/40">Klien Baru?</span></h2>
              <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto">Bergabunglah dengan 1.000+ kreator lainnya yang sudah online menggunakan Portfo.be.</p>
              <Link href="/register" className="inline-block bg-white text-gray-900 px-12 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform">Buat Portfolio Gratis Sekarang</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* TESTIMONIALS */}
      {/* ========================================== */}
      <section id="testimoni" ref={addToRefs} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Kisah <span className="text-gray-400">Sukses</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Bagaimana Portfo.be membantu kreator memenangkan klien.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-[2rem] p-10 border border-gray-100 premium-hover">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xl">JA</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Jamal Arifin</h4>
                  <p className="text-gray-500 text-sm">Videografer Komersial</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg italic">
                "Desainnya yang minimalis membuat klien fokus murni pada karya video saya. Sejak pakai Portfo.be, konversi dari calon klien yang bertanya menjadi deal meningkat drastis."
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-[2rem] p-10 border border-gray-100 premium-hover">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 font-bold text-xl border border-gray-300">DP</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Dinda Prameswari</h4>
                  <p className="text-gray-500 text-sm">UI/UX Designer</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg italic">
                "Sebagai desainer, saya butuh platform yang bersih dan tidak berlebihan. Portfo.be memberikan kanvas yang sempurna. Setup cuma 10 menit, langsung siap dikirim ke rekruter."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FAQ SECTION */}
      {/* ========================================== */}
      <section ref={addToRefs} className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Pertanyaan <span className="text-gray-400">Umum</span></h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="faq-item bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all">
              <button onClick={() => toggleFaq(0)} className="w-full text-left px-8 py-5 font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition">
                <span>Apakah benar-benar gratis?</span>
                <i className={`fas fa-chevron-down text-gray-400 text-sm transition-transform duration-300 ${openFaq === 0 ? 'rotate-180' : ''}`}></i>
              </button>
              <div className={`px-8 text-gray-500 text-sm leading-relaxed border-t border-gray-50 transition-all duration-300 ${openFaq === 0 ? 'max-h-40 py-6 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden border-t-0'}`}>
                Ya, paket Basic gratis selamanya tanpa batasan waktu. Kamu bisa menggunakan fitur dasar yang sudah sangat cukup untuk memulai menampilkan portofoliomu.
              </div>
            </div>
            
            <div className="faq-item bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all">
              <button onClick={() => toggleFaq(1)} className="w-full text-left px-8 py-5 font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition">
                <span>Bisa embed video dari YouTube/Vimeo?</span>
                <i className={`fas fa-chevron-down text-gray-400 text-sm transition-transform duration-300 ${openFaq === 1 ? 'rotate-180' : ''}`}></i>
              </button>
              <div className={`px-8 text-gray-500 text-sm leading-relaxed border-t border-gray-50 transition-all duration-300 ${openFaq === 1 ? 'max-h-40 py-6 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden border-t-0'}`}>
                Tentu. Kami merekomendasikan embed link YouTube, Vimeo, atau TikTok agar halaman portofoliomu tetap memuat dengan cepat tanpa mengurangi kualitas video aslinya.
              </div>
            </div>
            
            <div className="faq-item bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all">
              <button onClick={() => toggleFaq(2)} className="w-full text-left px-8 py-5 font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition">
                <span>Bagaimana cara setting domain sendiri (Pro)?</span>
                <i className={`fas fa-chevron-down text-gray-400 text-sm transition-transform duration-300 ${openFaq === 2 ? 'rotate-180' : ''}`}></i>
              </button>
              <div className={`px-8 text-gray-500 text-sm leading-relaxed border-t border-gray-50 transition-all duration-300 ${openFaq === 2 ? 'max-h-40 py-6 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden border-t-0'}`}>
                Setelah berlangganan paket Pro, kamu akan mendapatkan panduan untuk mengarahkan CNAME/A Record dari penyedia domainmu ke server kami. Proses ini biasanya memakan waktu kurang dari 24 jam.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FOOTER */}
      {/* ========================================== */}
      <footer className="py-20 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1">
              <div className="text-2xl font-black mb-6 tracking-tight">Portfo.be</div>
              <p className="text-gray-400 text-sm leading-relaxed">Platform kebanggaan kreator Indonesia. Simpel, elegan, dan profesional.</p>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-8">Produk</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-500">
                <li><a href="#fitur" className="hover:text-black">Fitur</a></li>
                <li><a href="#harga" className="hover:text-black">Harga</a></li>
                <li><a href="#templates" className="hover:text-black">Showcase</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-8">Bantuan</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-500">
                <li><a href="#" className="hover:text-black">FAQ</a></li>
                <li><a href="#" className="hover:text-black">Kontak Kami</a></li>
                <li><a href="#" className="hover:text-black">Pusat Panduan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-8">Sosial Media</h4>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-black text-xl transition-colors"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-gray-400 hover:text-black text-xl transition-colors"><i className="fab fa-tiktok"></i></a>
                <a href="#" className="text-gray-400 hover:text-black text-xl transition-colors"><i className="fab fa-twitter"></i></a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-300 text-[10px] font-black uppercase tracking-widest">
            <p>&copy; 2026 Portfo.be. All Rights Reserved.</p>
            <p className="mt-4 md:mt-0">Made with Passion in Indonesia</p>
          </div>
        </div>
      </footer>

    </div>
  );
}