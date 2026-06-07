"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function MonolithFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "New Block", a: "Solid answer" }];
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
    <div className="w-full max-w-6xl mx-auto py-24 px-4 group/faq bg-[#eae8e3]">
      <div className="bg-[#dcdad4] p-12 md:p-24 shadow-[20px_20px_60px_#bcbbaf,-20px_-20px_60px_#ffffff]">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-800 mb-16 uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Answers'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={20} 
          />
        </h2>
        
        <div className="flex flex-col gap-8">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`relative bg-[#eae8e3] p-8 md:p-12 duration-300 group/item ${
                  isOpen ? 'shadow-[inset_10px_10px_20px_#bcbbaf,inset_-10px_-10px_20px_#ffffff]' : 'shadow-[10px_10px_20px_#bcbbaf,-10px_-10px_20px_#ffffff] hover:translate-y-1 hover:translate-x-1'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex flex-col md:flex-row justify-between items-start md:items-center text-left focus:gap-6"
                >
                  <span className="text-2xl md:text-3xl font-black text-neutral-700 tracking-tight uppercase w-full md:w-5/6" style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"block w-full px-1"} />
                  </span>
                  <div className="w-12 h-12 shrink-0 bg-neutral-800 text-white flex items-center justify-center text-2xl font-light">
                    {isOpen ? '—' : '+'}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 text-neutral-600 font-medium text-lg md:text-xl leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"block w-full px-1 min-h-[2rem]"} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete Button */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute top-4 right-4 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center bg-red-100 hover:bg-red-200"
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
          <div className="mt-16 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300">
            <button 
              onClick={handleAddItem}
              className="flex items-center justify-center gap-4 w-full py-8 bg-neutral-800 text-white font-bold text-2xl uppercase tracking-widest shadow-[10px_10px_20px_#bcbbaf,-10px_-10px_20px_#ffffff] hover:translate-y-1 hover:translate-x-1 transition-all"
            >
              <i className="fas fa-plus"></i> ADD BLOCK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
