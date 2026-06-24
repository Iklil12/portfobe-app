import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/shared/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });

export function Editorial3DBlock({ data, theme, isEditor, isCardPreview }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    if (items3D.length === 0) {
        if (isEditor) {
            items3D.push({
                title: "Spatial Model",
                mediaUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
            });
        } else {
            return null;
        }
    }

    const cardRadiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[3rem]' : 'rounded-2xl';
    const cardStyle = theme?.cardStyle || 'soft';
    const cardStyleClassLight = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-white shadow-[0_30px_60px_rgba(0,0,0,0.08)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-white border-2 border-[#111] shadow-[8px_8px_0_0_#111]' : 'bg-[#fdfdfc] border border-[rgba(0,0,0,0.08)] shadow-sm';

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    return (
        <section className={`w-full max-w-[1600px] mx-auto flex flex-col px-6 py-12 @md:px-12 @lg:px-20 @md:py-24 border-t border-subtle`}>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col @md:flex-row justify-between items-start @md:items-end mb-16 @md:mb-24 gap-6">
                <h2 className={`font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl @lg:text-6xl`}>
                    <EditableText value={theme?.customTexts?.editorial_models_t1 || 'Spatial'} field="editorial_models_t1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <EditableText value={theme?.customTexts?.editorial_models_t2 || 'Models'} field="editorial_models_t2" entity="appearance" isEditor={isEditor} as="span" className="font-serif italic text-slate-400" maxLength={20} />
                </h2>
                <p className="font-sans text-sm @md:text-base font-medium text-slate-500 max-w-xs">
                    <EditableText value={theme?.customTexts?.editorial_models_sub || 'Interactive 3D environments and digital objects.'} field="editorial_models_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />
                </p>
            </motion.div>

            {items3D.length === 1 ? (
                // Single 3D Model Large Showcase
                <div className="w-full max-w-4xl mx-auto flex flex-col group transition-all duration-700">
                    <div className={`w-full ${cardRadiusClass} overflow-hidden relative mb-6 @md:mb-8 ${cardStyleClassLight} group-hover:-translate-y-2 transition-all duration-700`}>
                        <Interactive3DViewer mediaUrl={items3D[0].mediaUrl} bgColor="#fdfdfc" />
                    </div>

                    <div className="flex flex-col px-2 text-center items-center">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-3 max-w-max">
                            <EditableText value={theme?.customTexts?.editorial_model_tag || '3D Asset'} field="editorial_model_tag" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                        </span>
                        <h3 className="font-sans text-3xl @md:text-4xl font-semibold text-[#111]">{items3D[0].title}</h3>
                        {items3D[0].description && (
                            <p className="font-sans text-sm @md:text-base text-slate-500 max-w-xl mt-3 leading-relaxed">
                                {items3D[0].description}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                // Multiple 3D Models Grid
                <div className={`grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-16 @lg:gap-24`}>
                    {items3D.map((p: any, i: number) => {
                        const isEven = i % 2 !== 0;

                        return (
                            <motion.div
                                key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className={`flex flex-col group w-full ${isEven ? '@md:mt-32' : ''}`}
                            >
                                <div className={`w-full ${cardRadiusClass} overflow-hidden relative mb-6 @md:mb-8 ${cardStyleClassLight} group-hover:-translate-y-2 transition-all duration-700`}>
                                    <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#fdfdfc" />
                                </div>

                                <div className="flex flex-col px-2">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-sans text-2xl @md:text-3xl font-semibold text-[#111]">{p.title}</h3>
                                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                            <EditableText value={theme?.customTexts?.editorial_model_tag || '3D Asset'} field="editorial_model_tag" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                        </span>
                                    </div>
                                    {p.description && <p className="font-sans text-sm text-slate-500 line-clamp-2 mt-2">{p.description}</p>}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
