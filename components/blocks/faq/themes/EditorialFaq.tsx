"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function EditorialFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "New Inquiry", a: "Response..." }];
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
    <div className="w-full max-w-5xl mx-auto py-24 px-6 md:px-12 bg-[#FDFBF7] dark:bg-[#1a1a1a] text-[#2c2c2c] dark:text-[#eaeaea] group/faq">
      <div className="flex flex-col items-center mb-20 text-center">
        <span className="uppercase tracking-[0.2em] text-[10px] font-semibold mb-6 pb-2 border-b border-black/20 dark:border-white/20">
          <EditableText 
            value={theme?.customTexts?.faq_tag || 'The Interview'} 
            field="faq_tag" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={30} 
          />
        </span>
        <h2 className="text-5xl md:text-7xl font-serif italic mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Curiosity & Clarity'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={40} 
          />
        </h2>
        <p className="max-w-xl text-lg font-light leading-relaxed opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_sub_title || 'A deeper look into the creative process, structured as an intimate Q&A session. Discover the methodologies that drive exceptional results.'} 
            field="faq_sub_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={200} 
          />
        </p>
      </div>
      
      <div className="flex flex-col">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border-t border-black/10 dark:border-white/10 relative group/item">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full py-8 flex flex-col md:flex-row justify-between items-start md:items-center text-left focus:group"
              >
                <div className="flex items-baseline gap-8 w-full md:w-5/6">
                  <span className="text-sm font-serif italic opacity-40 shrink-0">0{i + 1}</span>
                  <span className={`text-2xl md:text-4xl font-serif transition-colors duration-500 w-full ${isOpen ? 'italic opacity-100' : 'opacity-80 group-hover:opacity-100'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1"} />
                  </span>
                </div>
                <div className="w-10 h-10 shrink-0 border border-black/20 dark:border-white/20 rounded-full flex items-center justify-center transition-transform duration-500 mt-4 md:mt-0" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <i className="fas fa-arrow-down text-[10px] opacity-60"></i>
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-12 pl-12 md:pl-20 md:pr-24 max-w-4xl">
                      <div className="text-xl md:text-2xl font-light leading-[1.8] opacity-80 border-l px-6 border-black/20 dark:border-white/20" style={{ fontFamily: 'var(--font-body)' }}>
                        <div className="relative">
                          <span className="font-serif italic text-2xl absolute -left-4 top-0 opacity-50">"</span>
                          <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem]"} />
                          <span className="font-serif italic text-2xl absolute -right-4 bottom-0 opacity-50">"</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute top-10 right-16 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center border border-red-500/20 rounded-full hover:bg-red-500/10"
                  title="Hapus Pertanyaan"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              )}
            </div>
          );
        })}
        <div className="border-t border-black/10 dark:border-white/10"></div>
      </div>

      {isEditor && (
        <div className="mt-12 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-6 py-3 border border-black/20 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full font-serif italic text-sm transition-colors"
          >
            + New Inquiry
          </button>
        </div>
      )}
    </div>
  );
}
