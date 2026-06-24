"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export default function HorizontalFlowFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  let faqs = [];
  try {
    if (theme?.customTexts?.faq_items) {
      faqs = JSON.parse(theme.customTexts.faq_items);
    } else {
      faqs = data?.items || [
        { q: "What services do you offer?", a: "I specialize in UI/UX design, frontend development, and branding." },
        { q: "What is your typical process?", a: "My process involves research, wireframing, high-fidelity design, and then implementation." },
        { q: "Do you take on freelance projects?", a: "Yes, I am currently open to freelance opportunities and contract roles." },
      ];
    }
  } catch (e) {
    faqs = [];
  }

  const updateFaqs = (newFaqs: any[]) => {
    if (!isEditor) return;
    window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'faq_items', value: JSON.stringify(newFaqs) }, window.location.origin);
  };

  const handleUpdateItem = (index: number, key: 'q' | 'a', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][key] = value;
    updateFaqs(newFaqs);
  };

  const handleAddItem = () => {
    const newFaqs = [...faqs, { q: "New Question", a: "Answer here" }];
    updateFaqs(newFaqs);
    setOpenIndex(newFaqs.length - 1);
  };

  const handleRemoveItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFaqs = faqs.filter((_: any, i: number) => i !== index);
    updateFaqs(newFaqs);
    if (openIndex === index) setOpenIndex(null);
  };

  return (
    <div className="w-full h-full py-32 group/faq bg-[#050505] overflow-hidden relative z-20">
      
      {/* Background Ambient */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
            <h2 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-[0.85]">
              <EditableText 
                value={theme?.customTexts?.faq_main_title || 'INQUIRIES'} 
                field="faq_main_title" 
                entity="appearance" 
                isEditor={isEditor} 
                as="span" 
                maxLength={20} 
              />
            </h2>
            <p className="font-mono text-xs md:text-sm text-accent uppercase tracking-[0.3em] max-w-xs text-left md:text-right border-l md:border-l-0 md:border-r border-white/20 pl-4 md:pl-0 md:pr-4 py-2">
              <EditableText 
                value={theme?.customTexts?.faq_desc || '0X / FREQUENTLY ASKED QUESTIONS'} 
                field="faq_desc" 
                entity="appearance" 
                isEditor={isEditor} 
                as="span" 
                maxLength={100} 
              />
            </p>
        </div>
      
        <div className="flex flex-col border-t border-white/20 relative z-10 w-full">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`relative group/item flex flex-col border-b border-white/10 transition-colors duration-500 cursor-pointer ${
                  isOpen ? 'bg-[#0a0a0a]' : 'hover:bg-[#080808]'
                }`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {/* Main Row */}
                <div className="w-full flex items-start gap-6 md:gap-12 py-10 md:py-16 px-4 md:px-8 relative overflow-hidden">
                  
                  {/* Delete Button (Editor Only) */}
                  {isEditor && (
                    <button 
                      onClick={(e) => handleRemoveItem(i, e)}
                      className="absolute top-1/2 -translate-y-1/2 -left-2 bg-red-500 text-white opacity-0 group-hover/item:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 z-20 text-[10px]"
                      title="Delete Question"
                    >
                      ✕
                    </button>
                  )}

                  {/* Index Number */}
                  <div className="font-mono text-sm md:text-base text-white/30 tracking-[0.2em] w-12 shrink-0 pt-2 md:pt-4">
                    {(i + 1).toString().padStart(2, '0')}
                  </div>

                  {/* Question */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className={`font-display uppercase tracking-tighter transition-colors duration-500 leading-[0.9] pr-12 md:pr-24 ${isOpen ? 'text-4xl md:text-6xl text-accent' : 'text-3xl md:text-5xl text-white group-hover/item:text-white/80'}`}>
                      <div onClick={(e) => isEditor && e.stopPropagation()}>
                        <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"block w-full px-1"} />
                      </div>
                    </h3>
                  </div>

                  {/* Toggle Icon */}
                  <div className={`absolute top-10 md:top-16 right-4 md:right-8 w-12 h-12 border border-white/10 rounded-full flex items-center justify-center transition-transform duration-500 shrink-0 ${isOpen ? 'rotate-45 bg-white text-black' : 'text-white'}`}>
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 0V14M0 7H14" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
                  
                {/* Answer Content */}
                <div 
                  className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="pl-24 md:pl-[6.5rem] pr-4 md:pr-32 pb-16">
                    <div className="font-body text-white/60 text-lg md:text-xl leading-relaxed pt-8 border-t border-white/10">
                      <div onClick={(e) => isEditor && e.stopPropagation()}>
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={500} className={"block w-full px-1 min-h-[2rem]"} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Massive Hollow Index (Background Detail) */}
                <div className="absolute bottom-4 right-8 font-display text-[8rem] md:text-[12rem] font-bold tracking-tighter text-transparent opacity-5 group-hover/item:opacity-10 transition-opacity pointer-events-none leading-none -z-10" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>
                  {(i + 1).toString().padStart(2, '0')}
                </div>
              </div>
            );
          })}

          {isEditor && (
            <div className="w-full flex justify-end mt-12">
              <button 
                onClick={handleAddItem}
                className="flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-white text-white hover:text-black font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300"
              >
                <span>+ Append Inquiry</span>
                <div className="w-12 h-[1px] bg-current"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
