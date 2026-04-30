"use client";

import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function PricingSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="pricing" ref={sectionRef} className="relative py-24 md:py-32 bg-[#0e0e16] overflow-hidden border-t border-white/5">
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
                {['Unlimited Pages & Blocks', 'Custom Domain (.com/.id) coming soon', 'Advanced Analytics Dashboard', 'Remove Portfo.be Badge', 'Priority Support'].map((list, i) => (
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
  );
}
