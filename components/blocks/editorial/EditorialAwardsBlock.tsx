import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function EditorialAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const awardItems = data?.certificates || data?.user?.certificates || [];

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
                    {awardItems.map((award: any, i: number) => (
                        <motion.a
                            href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                            className="group flex flex-col @md:flex-row @md:items-center justify-between border-b border-subtle py-6 @md:py-8 cursor-pointer relative overflow-hidden"
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
                                <i className="fas fa-arrow-right -rotate-45 text-slate-300 group-hover:text-[var(--hl)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"></i>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
