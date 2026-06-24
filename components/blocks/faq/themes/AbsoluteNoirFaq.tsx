"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function AbsoluteNoirFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "New Question", a: "New Answer" }];
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
    <div className="w-full max-w-6xl mx-auto py-24 px-4 bg-black text-white selection:bg-white selection:text-black group/faq">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
        {/* Kolom Kiri: Judul Rigid */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-white/20 pb-8 md:pb-0 md:pr-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4 font-mono">
            <EditableText 
              value={theme?.customTexts?.faq_tag || '03 // INQUIRIES'} 
              field="faq_tag" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={20} 
            />
          </p>
          <h2 className="text-4xl md:text-5xl font-normal tracking-tighter uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
            <EditableText 
              value={theme?.customTexts?.faq_main_title || 'Information'} 
              field="faq_main_title" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={20} 
            />
            <br />
            <EditableText 
              value={theme?.customTexts?.faq_sub_title || 'Architecture'} 
              field="faq_sub_title" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={20} 
            />
          </h2>
          {isEditor && (
            <button 
              onClick={handleAddItem}
              className="mt-12 w-full py-4 border border-white/20 text-white/50 hover:text-white hover:bg-white/5 uppercase tracking-[0.2em] text-[10px] transition-colors"
            >
              + Add Record
            </button>
          )}
        </div>
        
        {/* Kolom Kanan: Daftar FAQ */}
        <div className="md:col-span-8 flex flex-col border-t border-white/20">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className="relative border-b border-white/20 transition-colors duration-300 hover:bg-white/5 group/item"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full py-8 px-4 md:px-8 flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="text-xl md:text-2xl font-light tracking-tight w-11/12" style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1"} />
                  </span>
                  <div className="text-xl font-light w-1/12 flex justify-end">
                    {isOpen ? '—' : '+'}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-8 pb-10 text-white/50 font-light text-lg leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem]"} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete Button */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute top-8 right-24 text-white opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center border border-white/20 hover:bg-white/10"
                    title="Delete Question"
                  >
                    <i className="fas fa-trash text-[10px]"></i>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
