"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function SplitFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    <div className="w-full flex flex-col md:flex-row min-h-[70vh] group/faq">
      {/* Kolom Kiri: Gelap */}
      <div className="w-full md:w-1/2 bg-neutral-950 text-white p-12 md:p-24 flex flex-col justify-center">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Deep'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={20} 
          />
          <br />
          <span className="text-neutral-500">
            <EditableText 
              value={theme?.customTexts?.faq_sub_title || 'Dives'} 
              field="faq_sub_title" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={20} 
            />
          </span>
        </h2>
        <p className="text-neutral-400 text-lg max-w-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_desc || 'Comprehensive answers to your most pressing questions about our collaboration.'} 
            field="faq_desc" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={150} 
          />
        </p>
        
        {isEditor && (
          <div className="mt-16 opacity-0 group-hover/faq:opacity-100 transition-opacity">
            <button 
              onClick={handleAddItem}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
            >
              <i className="fas fa-plus text-xl"></i>
            </button>
          </div>
        )}
      </div>

      {/* Kolom Kanan: Terang */}
      <div className="w-full md:w-1/2 bg-white text-neutral-950 p-12 md:p-24 flex flex-col justify-center">
        <div className="flex flex-col">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`relative border-b-2 transition-colors duration-300 group/item ${isOpen ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full py-8 flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="text-2xl font-bold tracking-tight w-5/6" style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1"} />
                  </span>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-colors ${isOpen ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                    <i className={`fas ${isOpen ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs transform ${isOpen ? 'rotate-0' : 'rotate-0'}`}></i>
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
                      <div className="pb-8 text-neutral-500 text-lg leading-relaxed pr-12" style={{ fontFamily: 'var(--font-body)' }}>
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem]"} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete Button */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute top-8 right-16 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center bg-red-50 rounded-full hover:bg-red-100"
                    title="Hapus Pertanyaan"
                  >
                    <i className="fas fa-trash text-xs"></i>
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
