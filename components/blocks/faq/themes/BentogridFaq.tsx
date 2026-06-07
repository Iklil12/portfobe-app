"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function BentogridFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
        { q: "What tools do you use?", a: "Figma, React, Next.js, and Framer Motion are my primary tools." }
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
    const newFaqs = [...faqs, { q: "New Question?", a: "New Answer" }];
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
    <div className="w-full max-w-6xl mx-auto py-20 px-4 md:px-8 group/faq">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Kolom Kiri */}
        <div className="w-full md:w-1/3 shrink-0">
          <div className="sticky top-24 bg-[#f4f4f5] dark:bg-[#18181b] p-8 rounded-[32px] border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              <EditableText 
                value={theme?.customTexts?.faq_main_title || 'Got Questions?'} 
                field="faq_main_title" 
                entity="appearance" 
                isEditor={isEditor} 
                as="span" 
                maxLength={40} 
              />
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              <EditableText 
                value={theme?.customTexts?.faq_sub_title || 'Here are some of the most frequently asked questions about my workflow, pricing, and availability.'} 
                field="faq_sub_title" 
                entity="appearance" 
                isEditor={isEditor} 
                as="span" 
                maxLength={150} 
              />
            </p>
            {isEditor && (
              <button 
                onClick={handleAddItem}
                className="mt-6 w-full py-3 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
              >
                <i className="fas fa-plus"></i> Add Block
              </button>
            )}
          </div>
        </div>

        {/* Kolom Kanan Bento */}
        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <motion.div 
                key={i}
                layout
                className={`relative flex flex-col rounded-[24px] border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors duration-300 group/item ${isOpen ? 'bg-[#f4f4f5] dark:bg-[#18181b] sm:col-span-2' : 'bg-white dark:bg-black hover:bg-neutral-50 dark:hover:bg-neutral-900/50'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="p-6 text-left w-full focus:flex flex-col justify-between h-full"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="text-lg font-bold text-neutral-900 dark:text-white w-5/6" style={{ fontFamily: 'var(--font-heading)' }}>
                      <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1"} />
                    </span>
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-colors ${isOpen ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                      <i className={`fas ${isOpen ? 'fa-minus' : 'fa-plus'} text-xs`}></i>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed mt-2" style={{ fontFamily: 'var(--font-body)' }}>
                          <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem]"} />
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute top-4 right-16 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center bg-red-50 dark:bg-red-500/10 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 z-10"
                    title="Hapus Pertanyaan"
                  >
                    <i className="fas fa-trash text-[10px]"></i>
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
