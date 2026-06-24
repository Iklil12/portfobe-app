"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export default function KineticAvantGardeFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "NEW QUESTION?", a: "ANSWER GOES HERE" }];
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
    <div className="w-full max-w-[100vw] mx-auto py-24 px-4 bg-[#FF3300] overflow-hidden text-white relative flex flex-col items-center group/faq">
      
      {/* Background Kinetic Text */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10 flex items-center justify-center">
        <h1 className="text-[20vw] font-black leading-none whitespace-nowrap tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
          FAQ FAQ FAQ
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <h2 className="text-6xl md:text-8xl font-black mb-16 tracking-tighter uppercase leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Got'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={20} 
          />
          <br/>
          <span className="text-black">
            <EditableText 
              value={theme?.customTexts?.faq_sub_title || 'Questions?'} 
              field="faq_sub_title" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={20} 
            />
          </span>
        </h2>
        
        <div className="flex flex-col border-t-8 border-black">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`relative border-b-4 border-black duration-300 group/item ${isOpen ? 'bg-black text-[#FF3300]' : 'bg-transparent text-white hover:bg-black/10'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full py-8 px-6 flex justify-between items-center text-left focus:group"
                >
                  <span className="text-3xl md:text-4xl font-bold uppercase tracking-tight w-5/6" style={{ fontFamily: 'var(--font-heading)' }}>
                    <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-none block w-full px-1"} />
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ duration: 0.4, ease: "anticipate" }}
                    className={`w-16 h-16 rounded-full shrink-0 flex items-center justify-center border-4 transition-colors ${isOpen ? 'border-[#FF3300] text-[#FF3300]' : 'border-black text-black group-hover:bg-black group-hover:text-[#FF3300]'}`}
                  >
                    <i className="fas fa-plus text-2xl"></i>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-12 pt-4 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl text-white" style={{ fontFamily: 'var(--font-body)' }}>
                        <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-none block w-full px-1 min-h-[2rem]"} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete Button */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute top-8 right-24 text-white opacity-0 group-hover/item:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center bg-black border-4 border-black hover:bg-white hover:text-black z-10"
                    title="Delete Question"
                  >
                    <i className="fas fa-trash text-sm"></i>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {isEditor && (
        <div className="mt-16 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300 relative z-10 w-full max-w-5xl">
          <button 
            onClick={handleAddItem}
            className="flex items-center justify-center gap-2 w-full py-6 bg-black text-white text-2xl font-black uppercase tracking-tight hover:bg-white hover:text-black transition-colors border-8 border-black"
          >
            <i className="fas fa-plus"></i> ADD ANOTHER
          </button>
        </div>
      )}
    </div>
  );
}
