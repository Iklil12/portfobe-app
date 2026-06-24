"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export default function LayeredMonolithFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "New Layer", a: "Revealed content..." }];
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
    <div className="w-full max-w-5xl mx-auto py-24 px-4 md:px-8 group/faq">
      <div className="mb-20 text-center relative">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-800 dark:text-white uppercase relative z-10" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'FAQ'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={20} 
          />
        </h2>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black opacity-5 pointer-events-none select-none tracking-widest uppercase">
          QUESTIONS
        </div>
      </div>
      
      <div className="flex flex-col relative pb-10">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className={`relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl duration-500 group/item -mt-4 first:mt-0 z-[${faqs.length - i}] ${
                isOpen ? 'z-50 -translate-y-4' : 'hover:-translate-y-2 hover:z-40'
              }`}
              style={{ zIndex: isOpen ? 50 : faqs.length - i }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-8 md:p-10 flex justify-between items-center text-left focus:outline-none"
              >
                <div className="flex items-center gap-6 w-5/6">
                  <span className="text-4xl font-bold text-neutral-300 dark:text-neutral-700 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xl md:text-2xl font-bold tracking-tight text-neutral-800 dark:text-white w-full uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"block w-full px-1"} />
                  </span>
                </div>
                <div className="w-12 h-12 shrink-0 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-full text-xl transition-transform duration-500" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="p-8 md:p-10 pl-[6.5rem] text-neutral-600 dark:text-neutral-400 font-medium text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"block w-full px-1 min-h-[2rem]"} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute top-8 right-24 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center bg-red-50 dark:bg-red-500/10 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20"
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
        <div className="mt-8 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300 relative z-50">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-3 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all"
          >
            <i className="fas fa-plus"></i> Add Layer
          </button>
        </div>
      )}
    </div>
  );
}
