import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

export function EditorialHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
    const [isCopied, setIsCopied] = useState(false);

    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const bio = data?.profile?.bio || data?.bio || "Creating clean, functional, and visually striking digital experiences with extreme attention to detail.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[2rem]';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <section className={`relative w-full max-w-[1600px] mx-auto flex flex-col justify-center min-h-[90svh] px-6 @md:px-12 @lg:px-20`}>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer} className="flex flex-col @md:flex-row items-center justify-between gap-12 @lg:gap-24 h-full">
                
                {/* Left Typography */}
                <div className="flex flex-col w-full @md:w-3/5 order-2 @md:order-1">
                    <motion.span variants={fadeUp} className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-4">
                        <span className="w-8 h-[1px] bg-slate-300"></span>
                        <EditableText value={theme?.customTexts?.editorial_hero_top || 'Creative Portfolio'} field="editorial_hero_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </motion.span>

                    <motion.h1 variants={fadeUp} className={`font-sans font-semibold tracking-tight text-[#111] leading-[1.05] mb-8 text-5xl @md:text-6xl @lg:text-[6.5cqi]`}>
                        <EditableText value={theme?.customTexts?.editorial_hero_t1 || 'Designing'} field="editorial_hero_t1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <EditableText value={theme?.customTexts?.editorial_hero_t2 || 'clarity'} field="editorial_hero_t2" entity="appearance" isEditor={isEditor} as="span" className="font-serif italic text-slate-500" maxLength={20} /> <EditableText value={theme?.customTexts?.editorial_hero_t3 || 'out of complexity.'} field="editorial_hero_t3" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </motion.h1>

                    <motion.div variants={fadeUp} className={`font-sans text-slate-500 font-medium leading-relaxed max-w-xl text-base @md:text-lg @lg:text-xl`}>
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="p" maxLength={250} />
                    </motion.div>

                    <motion.div variants={fadeUp} className="flex items-center gap-4 mt-10">
                        <a href={`mailto:${userEmail}`} className={`px-6 py-3 @md:px-8 @md:py-4 ${radiusClass} bg-[#111] text-white font-sans text-sm @md:text-base font-medium hover:bg-[var(--hl)] transition-colors duration-300 shadow-xl shadow-black/10`}>
                            <EditableText value={theme?.customTexts?.editorial_hero_btn || 'Get in touch'} field="editorial_hero_btn" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                        </a>
                        <button onClick={handleCopyEmail} className={`px-6 py-3 @md:px-8 @md:py-4 ${radiusClass} bg-white border border-subtle text-[#111] font-sans text-sm @md:text-base font-medium hover:bg-slate-50 transition-colors duration-300 flex items-center gap-2`}>
                            {isCopied ? 'Email Copied' : <EditableText value={theme?.customTexts?.editorial_hero_copy || 'Copy Email'} field="editorial_hero_copy" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />} <i className={isCopied ? 'fas fa-check text-[var(--hl)]' : 'far fa-copy text-slate-400'}></i>
                        </button>
                    </motion.div>
                </div>

                {/* Right Portrait Image */}
                <motion.div variants={fadeUp} className={`w-full @md:w-2/5 order-1 @md:order-2 flex justify-center @md:justify-end mb-4 @md:mb-0`}>
                    <div className={`relative ${radiusClass} overflow-hidden shadow-soft border border-subtle w-full aspect-square max-w-sm @md:w-[90%] @md:aspect-[3/4] @md:max-w-md`}>
                        <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
}
