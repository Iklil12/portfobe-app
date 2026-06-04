import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';

export function EditorialAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop`;

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    const cardRadiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[3rem]' : 'rounded-2xl';

    return (
        <section id="about" className={`w-full max-w-[1600px] mx-auto flex flex-col px-6 py-12 @md:px-12 @lg:px-20 @md:py-24 border-t border-subtle`}>
            <div className="flex flex-col @lg:flex-row gap-12 @lg:gap-24 items-start">
                
                {/* Left: Section Header */}
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="w-full @lg:w-1/3 flex flex-col">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 border-b border-subtle pb-4 inline-block w-max">
                        <EditableText value={theme?.customTexts?.editorial_about_label || 'The Studio'} field="editorial_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </span>
                    <h2 className="font-serif italic text-4xl @md:text-5xl @lg:text-6xl text-[#111] leading-tight mt-2">
                        <EditableText value={theme?.customTexts?.editorial_about_title || 'A philosophy of reduction and clarity.'} field="editorial_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
                    </h2>
                </motion.div>

                {/* Right: Content Columns */}
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="w-full @lg:w-2/3 flex flex-col @md:flex-row gap-10">
                    <div className="w-full @md:w-1/2">
                        <div className="font-sans text-base @md:text-lg text-slate-600 leading-relaxed drop-cap">
                            <EditableText value={theme?.customTexts?.editorial_about_desc1 || 'We believe that the best design is invisible. It removes friction, communicates intent, and elevates the user experience without drawing unnecessary attention to itself.'} field="editorial_about_desc1" entity="appearance" isEditor={isEditor} as="p" maxLength={400} />
                        </div>
                    </div>
                    <div className="w-full @md:w-1/2 flex flex-col gap-8">
                        <div className="font-sans text-sm @md:text-base text-slate-500 leading-relaxed">
                            <EditableText value={theme?.customTexts?.editorial_about_desc2 || 'Based in a multidisciplinary environment, our approach borrows heavily from editorial design, modern architecture, and kinetic typography. We treat every pixel as a deliberate choice.'} field="editorial_about_desc2" entity="appearance" isEditor={isEditor} as="p" maxLength={400} />
                        </div>
                        <div className={`w-full aspect-[16/9] ${cardRadiusClass} overflow-hidden shadow-soft border border-subtle`}>
                            <LazyImage src={displayAvatar} alt="Studio" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                        </div>
                    </div>
                </motion.div>

            </div>
            
            {/* Global style for Drop Cap */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .drop-cap p::first-letter {
                    float: left;
                    font-family: ${theme?.fontHeading || 'Newsreader'}, serif;
                    font-size: 4.5rem;
                    line-height: 0.8;
                    padding-right: 0.15em;
                    padding-top: 0.05em;
                    color: var(--hl);
                    font-style: italic;
                }
            `}} />
        </section>
    );
}
