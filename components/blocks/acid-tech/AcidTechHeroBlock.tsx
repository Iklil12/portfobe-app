"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const profession = data?.profile?.profession || data?.profession || "Creative Director";
    const bio = data?.profile?.bio || data?.bio || "Forging high-octane visual experiences. Editing raw footage into pure adrenaline.";
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const displayAvatar = (rawAvatar.replace(/"/g, '').trim() !== "" && rawAvatar !== "null") ? rawAvatar.replace(/"/g, '').trim() : `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop`;

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';
    
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-2xl' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-transparent' : cardStyle === 'flat' ? 'bg-[#09090b] border-2 border-zinc-800' : 'bg-[#09090b] border-2 border-zinc-800 hover:shadow-[8px_8px_0_0_var(--theme-color)]';

    const rawThemeColor = theme?.themeColor || "#DFFF00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#ff9e00";

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };
    const scaleUp = {
        hidden: { opacity: 0, scale: 0.85 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: acidEase } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <header className={`relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20`}>
            <motion.div 
                initial="hidden" 
                {...{ [animationTrigger]: "visible" }} 
                viewport={{ once: true, amount: 0 }} 
                variants={staggerContainer}
                className={`px-6 @md:px-12 relative z-10 flex flex-col items-start mt-10`}
            >
                <motion.div variants={fadeUp} className="acid-bg text-[#09090b] px-4 py-1.5 font-bold text-[10px] @md:text-xs uppercase tracking-[0.2em] mb-8 inline-block transform -skew-x-12 acid-body">
                    <EditableText value={theme?.customTexts?.acid_hero_badge || 'Available for New Projects'} field="acid_hero_badge" entity="appearance" isEditor={isEditor} as="span" />
                </motion.div>

                <motion.h1 variants={fadeUp} className={`acid-heading font-extrabold uppercase tracking-tighter text-[#fafafa] mb-4 w-full leading-[0.85] break-words text-5xl @md:text-[clamp(5rem,12cqi,11rem)]`}>
                    <EditableText value={firstName} field="fullName" entity="profile" isEditor={isEditor} as="span" /> <br />
                    <span className="text-transparent" style={{ WebkitTextStroke: '2px #fafafa' }}>
                        <EditableText value={lastName || profession} field="profession" entity="profile" isEditor={isEditor} as="span" />
                    </span>
                </motion.h1>

                {/* Mobile Avatar */}
                <motion.div variants={scaleUp} className={`flex @lg:hidden mt-8 mb-10 w-full justify-center relative z-30 group`}>
                    <div className="w-[85%] max-w-[280px] aspect-[4/5] relative">
                        <div className="absolute inset-0 acid-bg transform translate-x-3 translate-y-3 -z-10"></div>
                        <div className={`w-full h-full overflow-hidden ${cardStyleClassDark} ${cardRadiusClass} relative grayscale transition-all duration-700 hover:grayscale-0`}>
                            <LazyImage src={displayAvatar} alt="Hero" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} className={`flex w-full max-w-5xl border-t-2 border-zinc-800 pt-8 flex-col gap-6 mt-2 @md:flex-row @md:gap-8 @lg:gap-16 @md:mt-8`}>
                    <p className={`text-zinc-400 font-medium leading-relaxed acid-body text-sm @md:text-lg @lg:text-xl max-w-md`}>
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" />
                    </p>
                    <div className="flex flex-col gap-4 text-xs @md:text-sm font-bold uppercase tracking-widest text-zinc-300 acid-body">
                        {links.length > 0 ? links.map((l: any, i: number) => (
                            <motion.a 
                                whileHover={{ x: 5 }}
                                key={i} href={l.url} target="_blank" rel="noreferrer" 
                                className="transition w-max hover:text-white flex items-center gap-2" 
                                style={{ transition: 'color 0.3s' }} 
                                onMouseEnter={(e) => e.currentTarget.style.color = themeColor} 
                                onMouseLeave={(e) => e.currentTarget.style.color = '#d4d4d8'}
                            >
                                <i className="fas fa-arrow-right -rotate-45"></i> {l.platform}
                            </motion.a>
                        )) : (
                            <div className="text-zinc-600">NO_LINKS_DETECTED</div>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* Desktop Avatar */}
            <motion.div 
                initial={{ opacity: 0, x: 50, rotate: 5 }} 
                {...{ [animationTrigger]: { opacity: 1, x: 0, rotate: 0 } }} 
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 1, ease: acidEase }}
                className="hidden @lg:block absolute top-1/4 right-12 w-72 h-[450px] transition duration-700 z-30 group"
            >
                <div className="absolute inset-0 acid-bg transform translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
                <div className={`w-full h-full overflow-hidden ${cardStyleClassDark} ${cardRadiusClass} relative grayscale hover:grayscale-0 transition-all duration-700`}>
                    <LazyImage src={displayAvatar} alt="Hero" className="w-full h-full object-cover" />
                </div>
                {(data?.plan !== 'FREE' || data?.userPlan !== 'FREE') && (data?.plan || data?.userPlan) && (
                    <motion.div 
                        initial={{ scale: 0 }} {...{ [animationTrigger]: { scale: 1 } }} viewport={{ once: true }} transition={{ delay: 0.5, type: "spring" }}
                        className={`absolute -bottom-4 -right-4 w-12 h-12 bg-blue-500 ${radiusClass} border-4 border-black flex items-center justify-center text-white text-[14px] shadow-[5px_5px_0px_rgba(0,0,0,1)] z-40`}
                    >
                        <i className="fas fa-check"></i>
                    </motion.div>
                )}
            </motion.div>
        </header>
    );
}
