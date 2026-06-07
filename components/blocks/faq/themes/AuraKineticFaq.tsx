"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function AuraKineticFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "New Interaction", a: "Beautifully resolved..." }];
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
    <div className="w-full max-w-5xl mx-auto py-24 px-4 group/faq relative overflow-hidden bg-[#fafafa]">
      {/* Floating Aura Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-purple-300/40 to-blue-300/40 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-gradient-to-tr from-rose-300/40 to-orange-300/40 rounded-full blur-[100px] pointer-events-none" 
      />

      <div className="relative z-10 flex flex-col items-center mb-16 text-center">
        <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-neutral-800 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Common'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={20} 
          />
          {' '}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-rose-500">
            <EditableText 
              value={theme?.customTexts?.faq_sub_title || 'Grounds'} 
              field="faq_sub_title" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={20} 
            />
          </span>
        </h2>
      </div>
      
      <div className="flex flex-col gap-4 relative z-10">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className={`relative overflow-hidden rounded-[32px] duration-500 group/item ${
                isOpen 
                  ? 'bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] scale-[1.02]' 
                  : 'bg-white/40 backdrop-blur-xl border border-white/40 hover:bg-white/60'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full px-8 py-6 flex justify-between items-center text-left focus:outline-none"
              >
                <span className={`text-xl md:text-2xl tracking-tight transition-colors duration-300 w-11/12 ${isOpen ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-600'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                  <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1"} />
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-gradient-to-r from-purple-500 to-rose-500 text-white shadow-lg' : 'bg-white text-neutral-400 border border-neutral-100'}`}
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
                    <div className="px-8 pb-8 text-neutral-500 leading-relaxed text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                      <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem]"} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute top-6 right-20 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg border border-red-100 hover:bg-red-50"
                  title="Hapus Pertanyaan"
                >
                  <i className="fas fa-trash text-sm"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isEditor && (
        <div className="mt-12 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300 relative z-10">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-8 py-4 bg-white/80 hover:bg-white text-neutral-800 rounded-full border border-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] font-bold uppercase tracking-widest text-xs hover:scale-105"
          >
            <i className="fas fa-magic"></i> Add Harmony
          </button>
        </div>
      )}
    </div>
  );
}
