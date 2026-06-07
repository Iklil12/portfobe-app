"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function ObsidianReelFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'faq_items', value: JSON.stringify(newFaqs) }, '*');
  };

  const handleUpdateItem = (index: number, key: 'q' | 'a', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][key] = value;
    updateFaqs(newFaqs);
  };

  const handleAddItem = () => {
    const newFaqs = [...faqs, { q: "New Chapter?", a: "The story unfolds..." }];
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
    <div className="w-full max-w-5xl mx-auto py-24 px-4 group/faq">
      <div className="flex flex-col items-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 blur-3xl pointer-events-none"></div>
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 mb-4 z-10" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Director\'s Cut'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={30} 
          />
        </h2>
        <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent z-10"></div>
      </div>
      
      <div className="flex flex-col gap-px bg-white/10 p-px rounded-[20px] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className={`relative duration-500 overflow-hidden group/item ${
                isOpen 
                  ? 'bg-black/80 backdrop-blur-2xl' 
                  : 'bg-black/40 backdrop-blur-xl hover:bg-black/60'
              } ${i === 0 ? 'rounded-t-[20px]' : ''} ${i === faqs.length - 1 ? 'rounded-b-[20px]' : ''}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-8 flex justify-between items-center text-left focus:outline-none"
              >
                <span className={`text-xl md:text-2xl font-light tracking-wide duration-500 w-11/12 ${isOpen ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-white/60'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                  <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1"} />
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-8 h-8 shrink-0 flex items-center justify-center opacity-50"
                >
                  <div className="w-full h-px bg-white absolute"></div>
                  <div className={`w-px h-full bg-white absolute transition-transform duration-500 ${isOpen ? 'scale-0' : 'scale-100'}`}></div>
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-8 pt-2 text-white/40 leading-relaxed text-lg max-w-3xl" style={{ fontFamily: 'var(--font-body)' }}>
                      <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem]"} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute top-8 right-20 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:bg-red-500/20"
                  title="Hapus Pertanyaan"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isEditor && (
        <div className="mt-10 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white/80 hover:text-white rounded-full border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] font-light uppercase tracking-[0.2em] transition-all"
          >
            <i className="fas fa-plus text-xs"></i> Add Scene
          </button>
        </div>
      )}
    </div>
  );
}
