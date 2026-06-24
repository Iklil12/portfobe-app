"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

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
    <div className="w-full flex flex-col min-h-[60vh] bg-[#050505] group/faq relative overflow-hidden">
      {/* Header Block */}
      <div className="w-full p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-12 h-[1px] bg-white/20"></span>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
            <EditableText 
              value={theme?.customTexts?.faq_sub_title || 'Inquiries'} 
              field="faq_sub_title" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={20} 
            />
          </span>
        </div>

        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[0.9] -ml-1">
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Deep Dives'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={40} 
          />
        </h2>
        
        <p className="text-white/50 text-sm max-w-xl leading-relaxed">
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
              className="px-6 py-3 border border-white/20 text-white/70 hover:bg-white hover:text-black font-mono text-xs uppercase tracking-widest transition-all"
            >
              + Add Question
            </button>
          </div>
        )}
      </div>

      {/* Accordion List Block */}
      <div className="w-full px-8 md:px-12 lg:px-16 pb-16 flex flex-col">
        <div className="flex flex-col w-full border-t border-white/10">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`relative border-b transition-colors duration-300 group/item ${isOpen ? 'border-white/30' : 'border-white/5 hover:border-white/20'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full py-6 md:py-8 flex justify-between items-center text-left focus:outline-none"
                >
                  <span className={`text-xl md:text-2xl font-medium tracking-tight w-5/6 transition-colors ${isOpen ? 'text-white' : 'text-white/70 group-hover/item:text-white'}`}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full bg-transparent"} />
                  </span>
                  <div className={`w-10 h-10 rounded-full border shrink-0 flex items-center justify-center transition-all duration-300 ${isOpen ? 'border-white bg-white text-black rotate-45' : 'border-white/20 text-white/50 group-hover/item:border-white/50'}`}>
                    <i className="ph ph-plus text-lg"></i>
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
                      <div className="pb-8 pt-2 text-white/50 text-sm md:text-base leading-relaxed pr-12">
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={400} className={"rounded-[2px] block w-full min-h-[2rem] bg-transparent"} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete Button */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute top-6 right-16 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center bg-red-500/10 rounded-full hover:bg-red-500 hover:text-white"
                    title="Delete Question"
                  >
                    <i className="ph ph-trash text-sm"></i>
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
