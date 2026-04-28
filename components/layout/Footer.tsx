"use client";

import Link from 'next/link';

export function Footer() {
  return (
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
  );
}
