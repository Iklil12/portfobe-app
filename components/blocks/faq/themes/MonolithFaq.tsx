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
    window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'faq_items', value: JSON.stringify(newFaqs) }, window.location.origin);
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

  const buttonShape = theme?.buttonShape || 'rounded';
  const cardRadius = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-3xl' : 'rounded-2xl';

  return (
    <div className="w-full bg-[#050505] py-20 @md:py-32 px-6 @md:px-12 group/faq">
      {/* Header */}
      <div className="flex flex-col @md:flex-row @md:justify-between @md:items-end gap-4 mb-12 @md:mb-20">
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">
            <EditableText 
              value={theme?.customTexts?.faq_label || 'Knowledge Base'} 
              field="faq_label" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={25} 
            />
          </span>
          <h2 className="font-serif text-4xl @md:text-6xl @lg:text-[5.5cqi] leading-[0.9] text-white">
            <EditableText 
              value={theme?.customTexts?.faq_main_title || 'Frequently Asked'} 
              field="faq_main_title" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={25} 
            />
            <br/>
            <span className="italic text-[var(--hl)]">
              <EditableText 
                value={theme?.customTexts?.faq_main_subtitle || 'Questions'} 
                field="faq_main_subtitle" 
                entity="appearance" 
                isEditor={isEditor} 
                as="span" 
                maxLength={20} 
              />
            </span>
          </h2>
        </div>
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hidden @md:block">
          {String(faqs.length).padStart(2, '0')} items
        </span>
      </div>
      
      {/* FAQ Items */}
      <div className="flex flex-col w-full">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className="relative border-t border-white/[0.06] group/item"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center gap-4 @md:gap-8 py-6 @md:py-10 text-left transition-colors duration-300"
              >
                {/* Index */}
                <span className="shrink-0 font-serif text-lg @md:text-2xl text-white/[0.08] group-hover/item:text-white/15 transition-colors duration-500 w-8 @md:w-12 tabular-nums select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Question */}
                <span className="flex-1 font-serif text-lg @md:text-2xl @lg:text-3xl text-white group-hover/item:text-[var(--hl)] transition-colors duration-500 leading-snug">
                  <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className="block w-full" />
                </span>

                {/* Toggle Icon */}
                <div className={`shrink-0 w-8 h-8 @md:w-10 @md:h-10 flex items-center justify-center border transition-all duration-500 rounded-full ${isOpen ? 'border-[var(--hl)]/30 bg-[var(--hl)]/10 text-[var(--hl)]' : 'border-white/10 text-white/20 group-hover/item:border-white/20 group-hover/item:text-white/40'}`}>
                  <svg 
                    className={`w-3 h-3 @md:w-3.5 @md:h-3.5 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 @md:pb-12 pl-12 @md:pl-20 pr-12 @md:pr-20">
                      <div className="font-sans text-sm @md:text-base text-white/30 leading-relaxed max-w-2xl">
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className="block w-full min-h-[2rem]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute top-6 right-0 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 rounded-full"
                  title="Delete Question"
                >
                  <i className="fas fa-times text-[10px]"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom border */}
      <div className="w-full h-[1px] bg-white/[0.06]"></div>

      {/* Add Button (Editor Only) */}
      {isEditor && (
        <div className="mt-12 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddItem}
            className="px-8 py-3 border border-dashed border-white/15 hover:border-[var(--hl)]/40 text-white/40 hover:text-[var(--hl)] uppercase tracking-[0.3em] text-[9px] font-sans font-bold transition-all duration-300 bg-white/[0.02] hover:bg-[var(--hl)]/[0.04]"
          >
            + Tambah FAQ
          </button>
        </div>
      )}
    </div>
  );
}
