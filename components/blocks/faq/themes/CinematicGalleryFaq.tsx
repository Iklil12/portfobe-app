"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function CinematicGalleryFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
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
    const newFaqs = [...faqs, { q: "New Frame", a: "Focus here" }];
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
    <div className="w-full max-w-7xl mx-auto py-24 px-4 group/faq bg-[#0a0a0a] text-white">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b border-white/10">
        <div>
          <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
            <EditableText 
              value={theme?.customTexts?.faq_tag || 'THE ARCHIVE'} 
              field="faq_tag" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={30} 
            />
          </span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
            <EditableText 
              value={theme?.customTexts?.faq_main_title || 'Questions'} 
              field="faq_main_title" 
              entity="appearance" 
              isEditor={isEditor} 
              as="span" 
              maxLength={30} 
            />
          </h2>
        </div>
        <p className="text-white/50 text-lg max-w-sm mt-6 md:mt-0 leading-relaxed font-light" style={{ fontFamily: 'var(--font-body)' }}>
          <EditableText 
            value={theme?.customTexts?.faq_desc || 'Curated answers to the most frequent inquiries from clients and collaborators.'} 
            field="faq_desc" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={150} 
          />
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <motion.div 
              key={i}
              layout
              className={`relative bg-white/5 border border-white/10 p-8 flex flex-col group/item transition-colors hover:bg-white/10 ${isOpen ? 'md:col-span-2 lg:col-span-3 bg-white/10' : ''}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full text-left focus:flex flex-col h-full justify-between"
              >
                <div className="flex justify-between items-start w-full mb-12">
                  <span className="text-3xl font-light text-white/30 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-45 bg-white text-black' : 'rotate-0 text-white'}`}>
                    <i className="fas fa-plus text-sm"></i>
                  </div>
                </div>
                <span className={`text-2xl font-medium tracking-tight mb-4 ${isOpen ? 'text-white' : 'text-white/80'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                  <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"block w-full px-1"} />
                </span>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden border-t border-white/10 mt-4 pt-6"
                  >
                    <div className="text-white/60 font-light text-lg md:text-xl leading-relaxed max-w-4xl" style={{ fontFamily: 'var(--font-body)' }}>
                      <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"block w-full px-1 min-h-[2rem]"} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Button */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute top-8 right-24 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center bg-black/50 rounded-full border border-red-500/30 hover:bg-red-500/20"
                  title="Hapus Pertanyaan"
                >
                  <i className="fas fa-trash text-sm"></i>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {isEditor && (
        <div className="mt-12 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/80 transition-colors"
          >
            <i className="fas fa-plus"></i> ADD FRAME
          </button>
        </div>
      )}
    </div>
  );
}
