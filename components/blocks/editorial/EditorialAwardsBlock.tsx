import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function EditorialAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    if (awardItems.length === 0) return null;

    return (
        <section id="awards" className="w-full bg-white border-y border-subtle py-20 @md:py-32">
            <div className={`max-w-[1600px] mx-auto flex flex-col @lg:flex-row gap-12 @lg:gap-24 px-6 @md:px-12 @lg:px-20`}>

                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="w-full @lg:w-1/3">
                    <h2 className={`font-sans font-semibold tracking-tight text-[#111] mb-4 text-4xl @md:text-5xl`}>
                        <EditableText value={theme?.customTexts?.editorial_awards_t1 || 'Honors &'} field="editorial_awards_t1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <br /><EditableText value={theme?.customTexts?.editorial_awards_t2 || 'Awards'} field="editorial_awards_t2" entity="appearance" isEditor={isEditor} as="span" className="font-serif italic text-slate-400" maxLength={20} />
                    </h2>
                    <p className="font-sans text-sm text-slate-500 leading-relaxed">
                        <EditableText value={theme?.customTexts?.editorial_awards_sub || 'Recognition from the industry for pushing the boundaries of digital product design and engineering.'} field="editorial_awards_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={120} />
                    </p>
                </motion.div>

                <div className="w-full @lg:w-2/3 flex flex-col">
                    {awardItems.map((award: any, i: number) => {
                        const isOpen = openIndex === i;
                        return (
                            <div key={i} className="border-b border-subtle relative">
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full group flex flex-col @md:flex-row @md:items-center justify-between py-6 @md:py-8 cursor-pointer relative overflow-hidden text-left focus:outline-none"
                                >
                                    {/* Hover Line Effect */}
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--hl)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                                    <div className="flex flex-col @md:flex-row @md:items-center gap-2 @md:gap-8 w-full @md:w-3/4 mb-4 @md:mb-0">
                                        <span className="font-serif text-slate-400 italic text-lg @md:text-xl w-16">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                        <div className="flex flex-col">
                                            <h3 className="font-sans font-semibold text-xl @md:text-2xl text-[#111] group-hover:text-[var(--hl)] transition-colors">{award.title}</h3>
                                            <span className="font-sans text-xs font-medium text-slate-500 mt-1">{award.issuer}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center w-full @md:w-auto gap-8">
                                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1 rounded-full border border-subtle">{award.status || 'Verified'}</span>
                                        <div className="w-8 h-8 rounded-full border border-subtle flex items-center justify-center transition-transform duration-500 shrink-0" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                            <i className="fas fa-chevron-down text-[10px] opacity-60"></i>
                                        </div>
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: canvasEase }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-8 pt-4 flex flex-col md:flex-row gap-6 items-start">
                                                {award.mediaUrl ? (
                                                    <div className="w-full md:w-1/2 max-w-md rounded-lg overflow-hidden border border-subtle bg-slate-50 relative group/photo">
                                                        <img 
                                                            src={award.mediaUrl} 
                                                            alt={award.title} 
                                                            className="w-full h-auto max-h-[350px] object-contain mx-auto"
                                                        />
                                                        <a 
                                                            href={award.mediaUrl} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="absolute bottom-3 right-3 bg-black/60 hover:bg-black text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 flex items-center gap-1.5"
                                                        >
                                                            <i className="fas fa-expand-alt"></i> Open Fullscreen
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div className="w-full md:w-1/2 p-8 border border-dashed border-subtle rounded-lg flex flex-col items-center justify-center text-slate-400 font-sans text-xs bg-slate-50">
                                                        <i className="fas fa-image text-2xl mb-2 opacity-50"></i>
                                                        No credential image uploaded
                                                    </div>
                                                )}
                                                <div className="w-full md:w-1/2 flex flex-col justify-between self-stretch py-2">
                                                    <div className="font-sans text-sm text-slate-500 leading-relaxed">
                                                        {award.description || 'No additional description provided for this recognition.'}
                                                    </div>
                                                    {award.mediaUrl && (
                                                        <div className="mt-6">
                                                            <a 
                                                                href={award.mediaUrl} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[var(--hl)] transition-colors"
                                                            >
                                                                View Original Credentials <i className="fas fa-external-link-alt text-[8px]"></i>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
