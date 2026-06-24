"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function CinematicFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "Pertanyaan Baru?", a: "Jawaban baru di sini..." }];
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
    <div className="w-full max-w-4xl mx-auto py-20 px-4 group/faq">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Answers & Insights'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={60} 
          />
        </h2>
        <div className="h-1 w-20 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      </div>
      
      <div className="flex flex-col gap-4 relative z-10">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <motion.div 
              key={i} 
              className={`relative rounded-2xl border duration-500 overflow-hidden backdrop-blur-md group/item ${
                isOpen 
                  ? 'border-white/30 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                  : 'border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-6 flex justify-between items-center text-left focus:outline-none"
              >
                <span className={`text-xl font-medium transition-colors duration-300 w-11/12 ${isOpen ? 'text-white' : 'text-white/80'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                  <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1"} />
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border transition-colors duration-300 ${isOpen ? 'border-white bg-white text-black' : 'border-white/30 text-white'}`}
                >
                  <i className="fas fa-plus text-sm"></i>
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 pb-6 text-white/60 leading-relaxed text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                      <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem]"} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute top-4 right-16 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center bg-black/50 border border-red-500/30 rounded-full hover:bg-red-500/20"
                  title="Delete Question"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {isEditor && (
        <div className="mt-8 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300 relative z-10">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-xl"
          >
            <i className="fas fa-plus"></i> Tambah Pertanyaan
          </button>
        </div>
      )}
    </div>
  );
}
