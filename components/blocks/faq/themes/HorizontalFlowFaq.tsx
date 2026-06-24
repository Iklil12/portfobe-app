"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function HorizontalFlowFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const newFaqs = [...faqs, { q: "New Question", a: "Answer here" }];
    updateFaqs(newFaqs);
    setOpenIndex(newFaqs.length - 1);
  };

  const handleRemoveItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFaqs = faqs.filter((_: any, i: number) => i !== index);
    updateFaqs(newFaqs);
    if (openIndex === index) setOpenIndex(null);
  };

  // Horizontal scroll hook untuk mouse wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="w-full h-full min-h-screen py-24 px-8 group/faq bg-[#f8f9fa] flex flex-col justify-center overflow-hidden">
      <div className="mb-12 shrink-0">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-900" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'FAQ'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={20} 
          />
        </h2>
        <p className="text-neutral-500 mt-4 max-w-md text-lg">
          <EditableText 
            value={theme?.customTexts?.faq_desc || 'Scroll horizontally to explore common questions.'} 
            field="faq_desc" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={100} 
          />
        </p>
      </div>
      
      <div 
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-12 pt-4 snap-x snap-mandatory hide-scrollbar relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <motion.div 
              key={i} 
              layout
              className={`relative bg-white rounded-3xl p-8 shrink-0 snap-center shadow-lg border border-neutral-100 duration-500 group/item ${
                isOpen ? 'w-[80vw] md:w-[60vw]' : 'w-[80vw] md:w-[30vw] hover:shadow-xl'
              }`}
            >
              <div className="flex flex-col h-full justify-between gap-8">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold shrink-0">
                      0{i + 1}
                    </span>
                    {isEditor && (
                      <button 
                        onClick={(e) => handleRemoveItem(i, e)}
                        className="text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center bg-red-50 rounded-full hover:bg-red-100"
                        title="Delete Question"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"block w-full px-1"} />
                  </h3>
                </div>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="text-neutral-500 text-lg leading-relaxed pt-6 border-t border-neutral-100" style={{ fontFamily: 'var(--font-body)' }}>
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"block w-full px-1 min-h-[2rem]"} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="mt-auto self-start flex items-center gap-2 text-neutral-900 font-bold uppercase tracking-widest text-sm hover:opacity-70 transition-opacity"
                >
                  {isOpen ? 'Close' : 'Read More'}
                  <i className={`fas ${isOpen ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                </button>
              </div>
            </motion.div>
          );
        })}

        {isEditor && (
          <div className="shrink-0 flex items-center justify-center w-[80vw] md:w-[20vw] px-8">
            <button 
              onClick={handleAddItem}
              className="w-full h-full min-h-[300px] rounded-3xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-4 text-neutral-400 hover:text-neutral-900 hover:border-neutral-900 transition-colors opacity-0 group-hover/faq:opacity-100"
            >
              <i className="fas fa-plus text-3xl"></i>
              <span className="font-bold uppercase tracking-widest text-sm">Add Card</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
