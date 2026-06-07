"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function NexusNoirFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "Initialize Data Node?", a: "Processing..." }];
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
    <div className="w-full max-w-6xl mx-auto py-24 px-4 group/faq">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3">
          <div className="sticky top-24">
            <h2 className="text-4xl md:text-5xl font-light tracking-widest uppercase text-white/90 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              <EditableText 
                value={theme?.customTexts?.faq_main_title || 'NEXUS'} 
                field="faq_main_title" 
                entity="appearance" 
                isEditor={isEditor} 
                as="span" 
                maxLength={20} 
              />
              <br />
              <span className="text-[#8b5cf6] font-bold">
                <EditableText 
                  value={theme?.customTexts?.faq_sub_title || 'DATA'} 
                  field="faq_sub_title" 
                  entity="appearance" 
                  isEditor={isEditor} 
                  as="span" 
                  maxLength={20} 
                />
              </span>
            </h2>
            <p className="text-white/40 font-mono text-xs uppercase tracking-[0.2em] mb-8 leading-relaxed">
              <EditableText 
                value={theme?.customTexts?.faq_desc || 'Encrypted responses to frequently queried data nodes.'} 
                field="faq_desc" 
                entity="appearance" 
                isEditor={isEditor} 
                as="span" 
                maxLength={100} 
              />
            </p>
            {isEditor && (
              <button 
                onClick={handleAddItem}
                className="w-full py-4 border border-[#8b5cf6]/30 text-[#8b5cf6] hover:bg-[#8b5cf6]/10 uppercase tracking-[0.3em] text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.2)] "
              >
                + ADD NODE
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-4">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`relative border-l-2 duration-300 bg-black/40 group/item ${
                  isOpen ? 'border-[#8b5cf6] bg-gradient-to-r from-[#8b5cf6]/10 to-transparent' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-6 md:p-8 flex justify-between items-center text-left focus:outline-none"
                >
                  <span className={`text-lg md:text-xl font-medium tracking-wide w-11/12 ${isOpen ? 'text-white' : 'text-white/60'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-none block w-full px-1"} />
                  </span>
                  <div className="text-white/40 font-mono text-sm shrink-0">
                    {isOpen ? '[-]' : '[+]'}
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
                      <div className="px-6 md:px-8 pb-8 text-white/50 leading-relaxed font-light" style={{ fontFamily: 'var(--font-body)' }}>
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-none block w-full px-1 min-h-[2rem]"} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete Button */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute top-6 right-20 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center bg-black border border-red-500/30 hover:bg-red-500/20"
                    title="Hapus Pertanyaan"
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
