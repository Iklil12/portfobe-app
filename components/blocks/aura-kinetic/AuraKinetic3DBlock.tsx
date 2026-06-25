"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/shared/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });

export function AuraKinetic3DBlock({ data, theme, isEditor }: any) {
  const allProjects = data?.projects || data?.user?.projects || [];
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');
  
  if (items3D.length === 0) {
      if (isEditor) {
          items3D.push({
              title: "Astronaut Model",
              description: "A 3D model of an astronaut.",
              mediaUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
          });
      } else {
          return null;
      }
  }
  
  
  const cardStyle = theme?.cardStyle || 'glassmorphism';
  const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-[var(--hl)] shadow-[6px_6px_0_0_var(--hl)]' : cardStyle === 'flat' ? 'bg-[#0a0a0c] border-2 border-white/20' : 'bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:border-white/20 hover:bg-white/10';

  const fadeUp = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  
    const getBtnShapeClass = (shape?: string) => {
        if (shape === 'hard' || shape === 'square') return 'rounded-none';
        if (shape === 'rounded') return 'rounded-xl';
        return 'rounded-full';
    };
    const btnShape = getBtnShapeClass(theme?.buttonShape);
    const cardShape = btnShape;

    


  return (
    <section className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-24 md:py-32 border-t border-white/5">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="text-center mb-10 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold px-2">
                <EditableText value={theme?.customTexts?.aura_models_title || 'Interactive Models'} field="aura_models_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
            </h2>
            <p className="font-sans text-white/50 mt-4 text-sm">
                <EditableText value={theme?.customTexts?.aura_models_subtitle || 'Explore spatial design in 3D.'} field="aura_models_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
            </p>
        </motion.div>

        <div className="flex flex-col gap-10 md:gap-16">
            {items3D.map((p: any, i: number) => (
                <motion.div
                    key={i}
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                    className={`group relative block w-full`}
                >
                    <div className={`relative w-full aspect-[4/5] sm:aspect-square md:aspect-video ${cardShape} overflow-hidden ${cardStyleClassDark} p-1.5 md:p-3 transition-all duration-500 hover:border-[var(--hl)] hover:bg-white/10`}>
                        <div className={`relative w-full h-full ${cardShape} overflow-hidden bg-[#0a0a0c]`}>
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0c" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>

                            <div className="absolute bottom-0 left-0 w-full p-5 md:p-12 flex justify-between items-end transform translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none">
                                <div className="flex flex-col">
                                    <span className="font-sans text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)] mb-2 md:mb-3 drop-shadow-md">
                                        <EditableText value={theme?.customTexts?.aura_model_label || 'Aura Asset'} field="aura_model_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> 0{i + 1}
                                    </span>
                                    <h3 className="font-serif text-2xl sm:text-3xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight md:leading-none">{p.title}</h3>
                                    {p.description && <p className="text-white/60 text-xs md:text-base max-w-xl mt-2 md:mt-4 font-sans line-clamp-2 md:line-clamp-3">{p.description}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </section>
  );
}

