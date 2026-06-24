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
    <div className="w-full flex flex-col min-h-[60vh] group/faq">
      {/* Top Header Block: Dark background, spans 100% width */}
      <div className="w-full bg-black text-white p-12 @md:p-16 flex flex-col justify-center border-b border-white/5">
        <h2 className="text-4xl @md:text-6xl font-bold tracking-tighter mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Deep'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={20} 
          />
          {" "}
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
        <p className="text-neutral-400 text-base max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
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
          <div className="mt-8 opacity-0 group-hover/faq:opacity-100 transition-opacity">
            <button 
              onClick={handleAddItem}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
            >
              <i className="fas fa-plus text-sm"></i>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Accordion Block: Darker theme instead of bright white */}
      <div className="w-full bg-black text-white p-12 @md:p-16 flex flex-col justify-center border-b border-white/5">
        <div className="flex flex-col w-full">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`relative border-b transition-colors duration-300 group/item ${isOpen ? 'border-neutral-600' : 'border-neutral-800 hover:border-neutral-700'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="text-xl font-bold tracking-tight w-5/6" style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1 bg-transparent text-white"} />
                  </span>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-colors ${isOpen ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}>
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
                      <div className="pb-6 text-neutral-400 text-base leading-relaxed pr-12" style={{ fontFamily: 'var(--font-body)' }}>
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem] bg-transparent text-neutral-300"} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete Button */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute top-6 right-16 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center bg-red-950/40 rounded-full hover:bg-red-950"
                    title="Delete Question"
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
