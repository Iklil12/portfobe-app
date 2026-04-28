"use client";

import Link from 'next/link';
import { TEMPLATE_LIST } from '@/lib/constants';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function TemplatesSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="templates" ref={sectionRef} className="relative py-24 md:py-32 bg-[#0a0a0a] overflow-hidden border-b border-white/5">
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
  );
}
