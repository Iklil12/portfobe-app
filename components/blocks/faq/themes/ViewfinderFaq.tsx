"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export default function ViewfinderFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "New Target", a: "Detail here" }];
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
    <div className="w-full max-w-7xl mx-auto py-24 px-4 md:px-10 relative group/faq">
      {/* Viewfinder Crosshairs (Corners) */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-black/40 dark:border-white/40 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-[1.5px] border-r-[1.5px] border-black/40 dark:border-white/40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[1.5px] border-l-[1.5px] border-black/40 dark:border-white/40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-black/40 dark:border-white/40 pointer-events-none"></div>

      {/* Focus Ring Decorator */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2 opacity-20 pointer-events-none flex items-center justify-center">
        <div className="w-64 h-64 border border-dashed border-black/50 dark:border-white/50 rounded-full animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute w-2 h-2 bg-red-500 rounded-full"></div>
      </div>

      <div className="relative z-10 text-center mb-16">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="h-px w-8 bg-black/30 dark:bg-white/30"></div>
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            <EditableText 
              value={theme?.customTexts?.faq_tag || 'REC / FAQ'} 
              field="faq_tag" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={20} 
            />
          </span>
          <div className="h-px w-8 bg-black/30 dark:bg-white/30"></div>
        </div>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Focus'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={20} 
          />
          {' '}
          <span className="italic font-serif lowercase text-neutral-400">
            <EditableText 
              value={theme?.customTexts?.faq_sub_title_1 || 'on'} 
              field="faq_sub_title_1" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={10} 
            />
          </span>
          {' '}
          <EditableText 
            value={theme?.customTexts?.faq_sub_title_2 || 'Questions'} 
            field="faq_sub_title_2" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={20} 
          />
        </h2>
      </div>
      
      <div className="flex flex-col gap-2 max-w-4xl mx-auto relative z-10">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className={`relative border-[1.5px] duration-300 group/item ${isOpen ? 'border-black dark:border-white' : 'border-neutral-200 dark:border-neutral-800'}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-6 md:p-8 flex justify-between items-center text-left focus:outline-none"
              >
                <div className="flex items-center gap-6 w-5/6">
                  <span className="font-mono text-[10px] text-neutral-400 shrink-0">[{String(i + 1).padStart(2, '0')}]</span>
                  <span className="text-xl md:text-2xl font-medium uppercase tracking-tight w-full" style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] block w-full px-1"} />
                  </span>
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                  <div className={`absolute w-full h-px bg-current transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}></div>
                  <div className={`absolute w-px h-full bg-current transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}></div>
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
                    <div className="px-6 md:px-8 pb-8 pl-[84px] md:pl-[92px] text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-serif">
                      <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] block w-full px-1 min-h-[2rem]"} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute top-6 right-20 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center border border-red-500/30 rounded-full hover:bg-red-500/10"
                  title="Delete Question"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isEditor && (
        <div className="mt-8 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300 relative z-10">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-6 py-2 border-[1.5px] border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
          >
            + ADD FRAME
          </button>
        </div>
      )}
    </div>
  );
}
