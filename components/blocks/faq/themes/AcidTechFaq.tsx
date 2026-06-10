"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function AcidTechFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "INPUT_QUERY()", a: "AWAITING_RESPONSE..." }];
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
    <div className="w-full max-w-4xl mx-auto py-16 px-4 font-mono text-[#00ff00] group/faq">
      <div className="mb-12 border-b-2 border-[#00ff00] pb-4">
        <h2 className="text-3xl font-bold uppercase tracking-widest">
          {'>'} <EditableText 
            value={theme?.customTexts?.faq_main_title || 'SYS.FAQ_QUERY()'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={30} 
          />
        </h2>
        <div className="text-sm mt-2 opacity-70">EXECUTION STATUS: READY</div>
      </div>
      
      <div className="flex flex-col gap-6">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className={`relative border border-[#00ff00]/30 duration-100 group/item ${
                isOpen 
                  ? 'bg-[#00ff00]/10 border-[#00ff00]' 
                  : 'bg-black hover:border-[#00ff00]/60'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-4 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="text-lg uppercase w-5/6 flex items-start">
                  <span className="opacity-50 mr-2 shrink-0">[{i.toString().padStart(2, '0')}]</span>
                  <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-none block w-full px-1"} />
                </span>
                <span className="text-xl shrink-0">
                  {isOpen ? '[ - ]' : '[ + ]'}
                </span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-[#00ff00]/30"
                  >
                    <div className="p-4 bg-black/50 flex flex-col md:flex-row items-start">
                      <span className="text-[#ff00ff] mr-2 shrink-0">{'>'} RESPONSE:</span>
                      <div className="leading-relaxed opacity-90 w-full mt-2 md:mt-0">
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-none block w-full px-1 min-h-[2rem]"} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute -top-3 -right-3 text-[#ff00ff] opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center bg-black border border-[#ff00ff] hover:bg-[#ff00ff]/20 z-10"
                  title="Hapus Pertanyaan"
                >
                  <i className="fas fa-trash text-[10px]"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isEditor && (
        <div className="mt-8 flex justify-start opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00] font-mono text-sm tracking-widest transition-colors"
          >
            {'>'} EXEC_ADD_QUERY()
          </button>
        </div>
      )}
    </div>
  );
}
