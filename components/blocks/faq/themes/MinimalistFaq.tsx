"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export default function MinimalistFaq({ data, theme, isEditor }: { data: any, theme?: any, isEditor?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Parse custom FAQ items if they exist
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
    window.parent.postMessage({
      type: 'INLINE_EDIT',
      entity: 'appearance',
      field: 'faq_items',
      value: JSON.stringify(newFaqs)
    }, '*');
  };

  const handleUpdateItem = (index: number, key: 'q' | 'a', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][key] = value;
    updateFaqs(newFaqs);
  };

  const handleAddItem = () => {
    const newFaqs = [...faqs, { q: "Tulis pertanyaan baru Anda di sini...", a: "Tulis jawaban di sini..." }];
    updateFaqs(newFaqs);
    setOpenIndex(newFaqs.length - 1); // Auto-open new item
  };

  const handleRemoveItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFaqs = faqs.filter((_: any, i: number) => i !== index);
    updateFaqs(newFaqs);
    if (openIndex === index) setOpenIndex(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 group/faq text-neutral-900">
      <h2 className="text-3xl font-bold mb-10 text-center text-neutral-900" style={{ fontFamily: 'var(--font-heading)' }}>
        <EditableText 
          value={theme?.customTexts?.faq_main_title || 'Frequently Asked Questions'} 
          field="faq_main_title" 
          entity="appearance" 
          isEditor={isEditor} 
          as="span" 
          maxLength={60} 
        />
      </h2>
      
      <div className="flex flex-col gap-2">
        {faqs.map((faq: any, i: number) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border-b border-neutral-200 pb-4 mb-4 relative group/item">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex justify-between items-start text-left focus:outline-none"
              >
                <span className="text-lg font-medium pr-8 text-neutral-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  <EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"rounded-[2px] break-words break-all [word-break:break-word] whitespace-pre-wrap block w-full px-1"} />
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-light text-neutral-500 shrink-0"
                >
                  +
                </motion.span>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pt-4 text-neutral-500 leading-relaxed pr-8" style={{ fontFamily: 'var(--font-body)' }}>
                      <EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={250} className={"rounded-[2px] break-words break-all [word-break:break-word] whitespace-pre-wrap block w-full px-1 min-h-[2rem]"} />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tombol Hapus (Khusus Editor) */}
              {isEditor && (
                <button 
                  onClick={(e) => handleRemoveItem(i, e)}
                  className="absolute top-0 right-8 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center bg-red-50 rounded-full hover:bg-red-100"
                  title="Hapus Pertanyaan Ini"
                >
                  <i className="fas fa-trash text-[10px]"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Tombol Tambah (Khusus Editor) */}
      {isEditor && (
        <div className="mt-8 flex justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <i className="fas fa-plus"></i> Tambah Pertanyaan
          </button>
        </div>
      )}
    </div>
  );
}
