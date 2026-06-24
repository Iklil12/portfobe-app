"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

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
    window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'faq_items', value: JSON.stringify(newFaqs) }, window.location.origin);
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

  const rawThemeColor = theme?.themeColor || "#00ff00";
  const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

  return (
    <section className="w-full bg-[#000000] py-24 border-y border-[var(--tc)]/20 relative overflow-hidden text-white font-mono" style={{ '--tc': themeColor } as React.CSSProperties}>
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-16 flex flex-col md:flex-row gap-16">
        <div className="md:w-1/3">
          <div className="font-mono text-[10px] text-[var(--tc)]/60 uppercase tracking-[0.3em] mb-2">[ SYS_QUERY.LOG ]</div>
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-[0.9] text-[var(--tc)]">
            <EditableText value={theme?.customTexts?.faq_title_2 || 'FAQS'} field="faq_title_2" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
          </h2>
          <div className="mt-6 text-zinc-500 text-xs leading-relaxed max-w-xs hidden md:block">
            &gt; SYSTEM STATUS: ONLINE<br />
            &gt; TOTAL QUERIES: {faqs.length}<br />
            &gt; CLICK NODE TO EXECUTE RESPONSE_
          </div>
        </div>
        
        <div className="md:w-2/3 flex flex-col gap-4">
          {faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`relative border transition-all duration-300 group/item ${
                  isOpen ? 'bg-[#050505] border-[var(--tc)] shadow-[0_0_15px_rgba(0,255,0,0.05)]' : 'bg-transparent border-zinc-800 hover:border-[var(--tc)]/40 hover:bg-[var(--tc)]/[0.02]'
                }`}
              >
                <div className="p-1">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full p-4 md:p-6 flex justify-between items-center text-left focus:outline-none"
                  >
                    <span className={`text-sm md:text-base font-bold uppercase tracking-wider w-5/6 ${isOpen ? 'text-[var(--tc)]' : 'text-zinc-300'}`}>
                      [0{i + 1}] <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className="rounded-none inline px-1 bg-transparent border-0 focus:ring-0 focus:outline-none" />
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className={`w-6 h-6 shrink-0 flex items-center justify-center font-bold text-sm ${isOpen ? 'text-[var(--tc)]' : 'text-zinc-500'}`}
                    >
                      {isOpen ? '✕' : '+'}
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-black/60 border-t border-zinc-900"
                      >
                        <div className="p-4 md:p-6 text-sm text-zinc-400 font-mono leading-relaxed">
                           <span className="text-[var(--tc)] mr-2">&gt; RESPONSE:</span>
                           <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className="focus:bg-zinc-900 rounded-none inline px-1 bg-transparent border-0 focus:ring-0 focus:outline-none" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Delete Button */}
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemoveItem(i, e)}
                    className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center bg-black border border-red-500/50 hover:bg-red-500 hover:text-white z-20 text-[10px]"
                    title="Delete Question"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {isEditor && (
        <div className="mt-12 flex justify-center relative z-20">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-6 py-3 bg-black text-[var(--tc)] border border-[var(--tc)] hover:bg-[var(--tc)] hover:text-black font-bold text-xs uppercase tracking-widest transition-all duration-300"
          >
            + INJECT NEW ROW
          </button>
        </div>
      )}
    </section>
  );
}
