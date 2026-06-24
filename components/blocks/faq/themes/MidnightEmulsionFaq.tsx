"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function MidnightEmulsionFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
    const newFaqs = [...faqs, { q: "Explore a thought?", a: "Reveal the unseen..." }];
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
    <div className="w-full max-w-5xl mx-auto py-24 px-4 md:px-8 group/faq relative">
      <div className="text-left mb-16 md:pl-8">
        <p className="text-[#a5b4fc] text-sm uppercase tracking-[0.3em] font-medium mb-4">
          <EditableText 
            value={theme?.customTexts?.faq_tag || 'KNOWLEDGE BASE'} 
            field="faq_tag" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={30} 
          />
        </p>
        <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-white/90" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Midnight Queries'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={40} 
          />
        </h2>
      </div>
      
      <div className="flex flex-col gap-6 relative z-10">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className={`relative rounded-[2rem] overflow-hidden duration-500 group/item border ${
                isOpen 
                  ? 'bg-gradient-to-br from-[#1e1b4b]/80 to-[#312e81]/40 border-[#6366f1]/30 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.2)]' 
                  : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full px-8 py-8 flex justify-between items-center text-left focus:outline-none"
              >
                <div className="flex items-center gap-6 w-11/12">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-500 ${isOpen ? 'bg-[#6366f1]/20 text-[#a5b4fc]' : 'bg-black/20 text-white/40'}`}>
                    0{i + 1}
                  </div>
                  <span className={`text-xl md:text-2xl font-medium tracking-tight transition-colors duration-300 w-full ${isOpen ? 'text-white' : 'text-white/80'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1"} />
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                  className={`w-10 h-10 shrink-0 flex items-center justify-center text-2xl transition-colors ${isOpen ? 'text-[#818cf8]' : 'text-white/30'}`}
                >
                  <i className={`fas ${isOpen ? 'fa-minus' : 'fa-plus'} text-lg`}></i>
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="px-8 pb-10 pl-[6.5rem] text-[#c7d2fe]/70 leading-relaxed text-lg pr-12" style={{ fontFamily: 'var(--font-body)' }}>
                      <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem]"} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute top-8 right-24 text-[#fca5a5] opacity-0 group-hover/item:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center bg-red-500/10 rounded-xl hover:bg-red-500/20"
                  title="Delete Question"
                >
                  <i className="fas fa-trash text-sm"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isEditor && (
        <div className="mt-12 flex justify-start opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300 md:pl-8">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-8 py-4 bg-[#6366f1]/10 hover:bg-[#6366f1]/20 text-[#a5b4fc] rounded-[2rem] font-medium tracking-wide transition-colors border border-[#6366f1]/30"
          >
            <i className="fas fa-plus"></i> Add Reflection
          </button>
        </div>
      )}
    </div>
  );
}
