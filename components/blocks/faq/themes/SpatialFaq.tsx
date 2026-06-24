"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export default function SpatialFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    <div className="w-full max-w-3xl mx-auto py-24 px-6 group/faq">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-semibold tracking-tight text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Frequent Inquiries'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={40} 
          />
        </h2>
        <p className="text-xl text-white/50 max-w-xl mx-auto font-medium" style={{ fontFamily: 'var(--font-body)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_sub_title || 'Everything you need to know about my services and process.'} 
            field="faq_sub_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={100} 
          />
        </p>
      </div>
      
      <div className="flex flex-col gap-6 relative z-10">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="relative group/item">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 group-hover/item:bg-white/10 transition-colors duration-500"></div>
              
              <div className="relative p-2">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="text-2xl font-medium text-white/90 tracking-tight w-5/6" style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1"} />
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/5 shrink-0"
                  >
                    <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-sm`}></i>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -10 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-2 text-white/60 text-lg leading-relaxed font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem]"} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete Button */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute -top-2 -right-2 text-white opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center bg-red-500/80 backdrop-blur-md rounded-full shadow-lg hover:bg-red-500"
                    title="Delete Question"
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isEditor && (
        <div className="mt-8 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300 relative z-10">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-[32px] font-medium transition-colors shadow-lg border border-white/10"
          >
            <i className="fas fa-plus"></i> Add Question
          </button>
        </div>
      )}
    </div>
  );
}
