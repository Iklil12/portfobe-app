"use client";

import { useState } from 'react';
import { FAQ_LIST } from '@/shared/constants/constants';

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <section className="py-24 bg-[#050505] border-t border-white/10 relative">
      
      <style dangerouslySetInnerHTML={{__html: `
          .wire-b-faq { border-bottom: 1px solid rgba(255,255,255,0.1); }
          .hover-invert-faq:hover { background-color: white !important; color: black !important; }
      `}} />

      <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-12 text-center">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-4">[ SUPPORT ]</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase">Frequently Asked.</h2>
        </div>

        <div className="flex flex-col">
          {FAQ_LIST.map((faq) => (
            <div key={faq.id} className="wire-b-faq">
              <button 
                onClick={() => toggleFaq(faq.id)} 
                className="w-full text-left px-0 py-6 font-bold text-white flex justify-between items-center transition-colors hover:text-[#ff9e00] group"
              >
                <span className="text-base md:text-lg pr-4 uppercase tracking-tight font-black">{faq.q}</span>
                <div className={`w-8 h-8 border border-white/20 flex items-center justify-center transition-all duration-300 shrink-0 group-hover:bg-[#ff9e00] group-hover:border-[#ff9e00] group-hover:text-black ${openFaq === faq.id ? 'bg-white text-black rotate-45' : 'text-white/40 rotate-0'}`}>
                  <i className="fas fa-plus text-xs"></i>
                </div>
              </button>
              <div className={`text-white/50 text-sm md:text-base font-medium leading-relaxed transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${openFaq === faq.id ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0 overflow-hidden'}`}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
