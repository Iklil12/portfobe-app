"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function AcidFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "INTERROGATE ME.", a: "HERE IS THE TRUTH." }];
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
    <div className="w-full max-w-5xl mx-auto py-20 px-4 group/faq relative overflow-hidden bg-[#e0e0e0] text-black">
      {/* Distressed Background Elements */}
      <div className="absolute top-10 -left-10 w-64 h-64 bg-black rounded-full mix-blend-overlay filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-10 -right-10 w-64 h-64 bg-black rounded-full mix-blend-overlay filter blur-3xl opacity-20 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="block transform -rotate-3 text-[#ff003c]">
              <EditableText value={theme?.customTexts?.faq_title_1 || 'THE'} field="faq_title_1" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
            </span>
            <span className="block transform translate-x-4">
              <EditableText value={theme?.customTexts?.faq_title_2 || 'ACID'} field="faq_title_2" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
            </span>
            <span className="block transform -rotate-1 translate-y-2 text-[#fff]" style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}>
              <EditableText value={theme?.customTexts?.faq_title_3 || 'TEST'} field="faq_title_3" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
            </span>
          </h2>
        </div>
        
        <div className="md:w-2/3 flex flex-col gap-4">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`relative border-2 border-black p-1 duration-300 group/item ${
                  isOpen ? 'bg-black shadow-[4px_4px_0px_#ff003c]' : 'bg-transparent hover:bg-black/5 '
                }`}
                style={{ clipPath: isOpen ? 'polygon(0% 0%, 100% 0%, 98% 100%, 2% 98%)' : 'none' }}
              >
                <div className={`border-2 border-dashed ${isOpen ? 'border-white/30' : 'border-black/30'}`}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full p-4 md:p-6 flex justify-between items-center text-left focus:outline-none"
                  >
                    <span className={`text-2xl md:text-3xl font-black uppercase tracking-tighter w-5/6 ${isOpen ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                      <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-none block w-full px-1"} />
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className={`w-10 h-10 shrink-0 flex items-center justify-center font-black text-2xl ${isOpen ? 'text-[#ff003c]' : 'text-black'}`}
                    >
                      X
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-[#ff003c] text-white"
                      >
                        <div className="p-4 md:p-6 text-xl font-bold uppercase" style={{ fontFamily: 'var(--font-body)' }}>
                          <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"focus:bg-black/10 rounded-none block w-full px-1 min-h-[2rem]"} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Delete Button */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute -top-3 -right-3 text-white opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center bg-black border-2 border-[#ff003c] hover:scale-110 z-20"
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

      {isEditor && (
        <div className="mt-12 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300 relative z-20">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-8 py-4 bg-black text-white border-4 border-black hover:bg-[#ff003c] font-black text-2xl uppercase tracking-tighter shadow-[8px_8px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-2 hover:translate-x-2 transition-all"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <i className="fas fa-exclamation-triangle"></i> INJECT NEW ROW
          </button>
        </div>
      )}
    </div>
  );
}
