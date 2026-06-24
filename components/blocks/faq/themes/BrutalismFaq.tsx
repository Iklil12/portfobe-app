"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function BrutalismFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "NEW QUESTION?", a: "YOUR ANSWER HERE." }];
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
    <div className="w-full max-w-5xl mx-auto py-8 @sm:py-16 px-4 group/faq">
      <h2 className="text-3xl @xs:text-4xl @sm:text-5xl font-black uppercase mb-12 tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
        <span className="bg-black text-white px-4 py-2 inline-block -rotate-2">
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'FAQ'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={30} 
          />
        </span>
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className={`relative border-4 border-black duration-200 group/item ${
                isOpen 
                  ? 'bg-[#ccff00] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1' 
                  : 'bg-white hover:bg-neutral-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-4 @sm:p-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="text-base @sm:text-xl font-bold uppercase tracking-tight w-5/6" style={{ fontFamily: 'var(--font-heading)' }}>
                  <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-none block w-full px-1"} />
                </span>
                <span className="text-2xl @sm:text-3xl font-black font-mono shrink-0">
                  {isOpen ? '-' : '+'}
                </span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t-4 border-black"
                  >
                    <div className="p-4 @sm:p-5 font-medium text-xs @sm:text-base leading-relaxed bg-white text-black" style={{ fontFamily: 'var(--font-body)' }}>
                      <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-none block w-full px-1 min-h-[2rem]"} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute -top-4 -right-4 text-white opacity-0 group-hover/item:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center bg-red-600 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110"
                  title="Delete Question"
                >
                  <i className="fas fa-times text-lg font-black"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isEditor && (
        <div className="mt-12 flex justify-start opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 text-lg font-black uppercase tracking-tight transition-all"
          >
            <i className="fas fa-plus"></i> ADD ITEM
          </button>
        </div>
      )}
    </div>
  );
}
