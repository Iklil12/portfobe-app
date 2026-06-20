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
    window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'faq_items', value: JSON.stringify(newFaqs) }, window.location.origin);
  };

  const handleUpdateItem = (index: number, key: 'q' | 'a', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][key] = value;
    updateFaqs(newFaqs);
  };

  const handleAddItem = () => {
    const newFaqs = [...faqs, { q: "New Question", a: "Answer details go here." }];
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
    <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-6 md:px-24 bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden text-white">
      {/* Vignette Shadow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
      
      {/* Ambient Glow */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Cinematic Header */}
      <div className="absolute top-[8vh] left-6 md:top-[12vh] md:left-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <div className="text-white/40 text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-mono">
          <EditableText 
            value={theme?.customTexts?.faq_tag || '[ SECTION 08 // INQUIRIES ]'} 
            field="faq_tag" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={30} 
          />
        </div>
        <h2 className="font-serif italic text-3xl md:text-5xl text-white leading-none">
          <EditableText 
            value={theme?.customTexts?.faq_main_title || 'Pertanyaan'} 
            field="faq_main_title" 
            entity="appearance" 
            isEditor={isEditor} 
            as="span" 
            maxLength={30} 
          />
        </h2>
      </div>

      {/* FAQ Scrollable Container */}
      <div className="w-full max-w-4xl mx-auto z-10 mt-[13vh] md:mt-[18vh] h-[68vh] md:h-[61vh] overflow-y-auto cinematic-scrollbar pointer-events-auto pr-3 flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i}
                className={`group/item relative border transition-all duration-300 ease-out bg-gradient-to-br from-white/[0.01] to-transparent backdrop-blur-sm ${
                  isOpen ? 'border-white/20 bg-white/[0.03]' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                }`}
              >
                {/* Viewfinder corner brackets on active or hover */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out z-20 ${isOpen ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'}`}>
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30"></div>
                </div>

                {/* Accordion Trigger */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left p-4 md:p-6 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <span className="font-mono text-xs md:text-sm text-white/30 group-hover/item:text-white/60 transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-sans font-bold text-xs md:text-sm uppercase tracking-wider transition-colors duration-300 ${
                      isOpen ? 'text-white' : 'text-white/70 group-hover/item:text-white'
                    }`}>
                      <EditableText 
                        value={faq.q} 
                        onChange={(val) => handleUpdateItem(i, "q", val)} 
                        isEditor={isEditor} 
                        maxLength={150} 
                        className="block w-full px-1" 
                      />
                    </span>
                  </div>

                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen 
                      ? 'border-white/40 bg-white text-black rotate-45' 
                      : 'border-white/10 text-white/40 group-hover/item:border-white/20 group-hover/item:text-white'
                  }`}>
                    <i className="fas fa-plus text-[9px] md:text-[10px]"></i>
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden border-t border-white/5 mx-5 md:mx-6"
                    >
                      <div className="py-5 text-xs md:text-sm text-white/60 leading-relaxed font-mono tracking-wide">
                        <EditableText 
                          value={faq.a} 
                          onChange={(val) => handleUpdateItem(i, "a", val)} 
                          isEditor={isEditor} 
                          maxLength={250} 
                          className="block w-full px-1 min-h-[2rem]" 
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remove Button for Editor */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute top-4 right-14 text-white/30 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all w-7 h-7 flex items-center justify-center bg-black/40 border border-white/10 rounded-sm hover:border-red-500/30"
                    title="Hapus Pertanyaan"
                  >
                    <i className="fas fa-trash text-[10px]"></i>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Question Button inside the scrollable area at the bottom */}
        {isEditor && (
          <div className="mt-8 mb-4 flex justify-center">
            <button 
              onClick={handleAddItem}
              className="flex items-center gap-2 px-6 py-3 border border-white/15 bg-white/5 hover:bg-white hover:text-black font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300 rounded-sm"
            >
              <i className="fas fa-plus text-[8px]"></i> Tambah Pertanyaan
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
