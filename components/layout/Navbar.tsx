"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, Zap, ArrowUpRight, ArrowRight } from 'lucide-react';

export function Navbar({ isDarkBg = false }: { isDarkBg?: boolean } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  const navItems = [
    { label: 'Features', href: '/#features' },
    { label: 'Templates', href: '/#templates' },
    { label: 'Learn', href: '#', hasMegaMenu: true },
    { label: 'Pricing', href: '/pricing' }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <>
      <nav className={`nav-system-font animate-hero-nav fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex justify-center ${isScrolled ? 'pt-4 px-4' : 'pt-6 px-6 md:px-12'}`}>
        <div className={`flex justify-between items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] w-full rounded-full ${isScrolled ? 'bg-white/90 backdrop-blur-md border border-slate-300 shadow-[0_10px_40px_rgba(0,0,0,0.05)] px-6 py-3 max-w-4xl' : 'bg-transparent border border-transparent px-0 py-0 max-w-7xl'}`}>

          <Link href="/" className="flex items-center cursor-pointer group">
            <img src="/portfo.be.png" alt="Portfo.be Logo" className={`h-6 md:h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300 ${!isScrolled && isDarkBg ? 'invert brightness-0' : ''}`} />
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => {
              if (item.hasMegaMenu) {
                return (
                  <div key={item.label} className="group relative py-2">
                    <span className={`cursor-pointer nav-link text-sm font-normal transition-colors flex items-center gap-1 ${!isScrolled && isDarkBg ? 'text-white hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}>
                      {item.label}
                    </span>
                    
                    {/* Elegant 2-Column Mega Menu Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200/60 flex flex-col w-[760px] cursor-default overflow-hidden">
                        
                        {/* Top Content Area */}
                        <div className="p-8 pb-6 flex gap-10">
                           {/* Left Column */}
                           <div className="flex-1 flex flex-col gap-7">
                              <Link href="/blog" className="group/item flex gap-4 items-start">
                                 <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:text-[#ff9e00] group-hover/item:bg-orange-50 group-hover/item:border-orange-100 transition-all duration-300 shadow-sm shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                 </div>
                                 <div className="flex flex-col">
                                    <h4 className="font-bold text-slate-900 group-hover/item:text-[#ff9e00] transition-colors mb-1.5 flex items-center gap-2">
                                      Engineering Blog 
                                      <span className="bg-slate-900 text-[#D6FF00] text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">New</span>
                                    </h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Deep dives into architecture, design systems, and frontend optimizations.</p>
                                 </div>
                              </Link>

                              <Link href="#" className="group/item flex gap-4 items-start">
                                 <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:text-blue-500 group-hover/item:bg-blue-50 group-hover/item:border-blue-100 transition-all duration-300 shadow-sm shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                 </div>
                                 <div className="flex flex-col">
                                    <h4 className="font-bold text-slate-900 group-hover/item:text-blue-600 transition-colors mb-1.5">Creator Showcases</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Discover how top professionals use Portfo.be to stand out in the industry.</p>
                                 </div>
                              </Link>
                           </div>
                           
                           {/* Divider */}
                           <div className="w-px bg-slate-100"></div>

                           {/* Right Column */}
                           <div className="flex-1 flex flex-col gap-7">
                              <Link href="#" className="group/item flex gap-4 items-start">
                                 <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:text-emerald-500 group-hover/item:bg-emerald-50 group-hover/item:border-emerald-100 transition-all duration-300 shadow-sm shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                                 </div>
                                 <div className="flex flex-col">
                                    <h4 className="font-bold text-slate-900 group-hover/item:text-emerald-600 transition-colors mb-1.5">Knowledge Base</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Everything you need to know to build and manage your portfolio effectively.</p>
                                 </div>
                              </Link>

                              <Link href="#" className="group/item flex gap-4 items-start">
                                 <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:text-purple-500 group-hover/item:bg-purple-50 group-hover/item:border-purple-100 transition-all duration-300 shadow-sm shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                                 </div>
                                 <div className="flex flex-col">
                                    <h4 className="font-bold text-slate-900 group-hover/item:text-purple-600 transition-colors mb-1.5">Platform Guide</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">A step-by-step masterclass on editor tools and advanced layout settings.</p>
                                 </div>
                              </Link>
                           </div>
                        </div>

                        {/* Bottom Horizontal Spotlight Banner (Edge to Edge) */}
                        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between group/feat cursor-pointer relative overflow-hidden border-t border-slate-800">
                           {/* Subtle Gradient Glow */}
                           <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-[#D6FF00]/15 to-transparent opacity-50 group-hover/feat:opacity-100 transition-opacity duration-700"></div>
                           
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-[84px] h-[84px] rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 shadow-lg">
                                 <img src="/minimalist_chair_3d.png" className="w-full h-full object-cover opacity-90 group-hover/feat:opacity-100 group-hover/feat:scale-110 transition-all duration-700"/>
                              </div>
                              <div className="flex flex-col py-1">
                                 <span className="text-[#D6FF00] font-black text-[10px] uppercase tracking-widest mb-1.5">Major Update</span>
                                 <h4 className="font-bold text-white text-lg mb-1 group-hover/feat:text-[#D6FF00] transition-colors">Dynamic Canvas 2.0</h4>
                                 <p className="text-xs text-slate-400 max-w-[340px] leading-relaxed">Unlock the power of unlimited layout flexibility and highly responsive web elements with our new visual engine.</p>
                              </div>
                           </div>
                           
                           <Link href="#" className="relative z-10 bg-white/10 hover:bg-[#D6FF00] hover:text-black text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm whitespace-nowrap active:scale-95">
                              Explore Update <ArrowRight className="w-4 h-4 group-hover/feat:translate-x-1.5 transition-transform" />
                           </Link>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link key={item.label} href={item.href} className={`nav-link text-sm font-normal transition-colors ${!isScrolled && isDarkBg ? 'text-white hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login" className={`text-sm font-normal px-5 py-2 rounded-full transition-colors ${!isScrolled && isDarkBg ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>Log in</Link>
            <Link href="/register" className={`px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center gap-2 group ${!isScrolled && isDarkBg ? 'bg-white text-black hover:bg-gray-200 hover:shadow-white/20' : 'bg-[#0f172a] text-white hover:bg-black hover:shadow-slate-900/20'}`}>
              Get Started
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden focus:outline-none w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all ${!isScrolled && isDarkBg ? 'text-white bg-white/10 hover:bg-white/20' : 'text-slate-900 bg-slate-100 hover:bg-slate-200'}`}>
            <Menu className="w-5 h-5" />
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
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 mt-4">
          {navItems.map((item, i) => {
            if (item.hasMegaMenu) {
              const isExpanded = expandedMobileMenu === item.label;
              return (
                <div key={item.label} className="flex flex-col gap-4" style={{ animationDelay: `${i * 100}ms` }}>
                  <button 
                    onClick={() => setExpandedMobileMenu(isExpanded ? null : item.label)} 
                    className="w-full text-slate-800 font-extrabold text-3xl hover:text-[#ff9e00] transition-colors flex items-center justify-between group"
                  >
                    {item.label} 
                    <ChevronRight className={`w-6 h-6 text-slate-300 group-hover:text-[#ff9e00] transition-transform duration-300 ${isExpanded ? 'rotate-90 text-[#ff9e00]' : ''}`} />
                  </button>
                  
                  {/* Sub menu items for mobile */}
                  <div className={`flex flex-col gap-5 pl-4 border-l-[3px] border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[400px] mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                     <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-slate-500 hover:text-slate-900 transition-colors">Knowledge Base</Link>
                     <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-slate-500 hover:text-slate-900 transition-colors">Platform Guide</Link>
                     <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-slate-500 hover:text-slate-900 flex items-center gap-3 transition-colors">Engineering Blog <span className="text-[10px] bg-[#D6FF00] text-black px-2 py-0.5 rounded-sm uppercase tracking-widest">New</span></Link>
                     <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-slate-500 hover:text-slate-900 transition-colors">Creator Showcases</Link>
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.label} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-extrabold text-3xl hover:text-[#ff9e00] transition-colors flex items-center justify-between group" style={{ animationDelay: `${i * 100}ms` }}>
                {item.label} <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-[#ff9e00] group-hover:translate-x-2 transition-transform" />
              </Link>
            );
          })}
        </div>
        <div className="p-6 border-t border-slate-100 flex flex-col gap-3">
          <Link href="/login" className="block w-full text-slate-900 font-bold py-4 text-center bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Log in</Link>
          <Link href="/register" className="block w-full py-4 rounded-xl bg-slate-900 text-white text-center font-bold shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
            Get Started Free <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </Link>
        </div>
      </div>
    </>
  );
}
