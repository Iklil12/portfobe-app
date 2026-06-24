"use client";
import React, { useRef, useState } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function HorizontalFlowAwardsBlock({ data, theme, isEditor, setSelectedMedia }: any) {
    const customTexts = theme?.customTexts || {};
    let awardsList: any[] = [];
    
    try {
        if (customTexts.hf_awards_items) {
            awardsList = JSON.parse(customTexts.hf_awards_items);
        } else {
            const defaultAwards = data?.certificates || data?.user?.certificates || [];
            if (defaultAwards.length > 0) {
                awardsList = defaultAwards.map((a: any) => ({
                    title: a.title,
                    issuer: a.issuer,
                    year: a.year || new Date(a.createdAt).getFullYear().toString(),
                    imageUrl: a.mediaUrl || ""
                }));
            } else {
                awardsList = [
                    { title: "SITE OF THE DAY", issuer: "AWWWARDS", year: "2026", imageUrl: "" },
                    { title: "DEVELOPER AWARD", issuer: "CSS DESIGN", year: "2025", imageUrl: "" }
                ];
            }
        }
    } catch (e) {
        awardsList = [];
    }

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!isEditor) {
            gsap.fromTo('.hf-award-row', 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power4.out"
                }
            );
        }
    }, { scope: containerRef, dependencies: [awardsList.length, isEditor] });

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const updateAwards = (newList: any[]) => {
        if (!isEditor) return;
        window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'hf_awards_items', value: JSON.stringify(newList) }, window.location.origin);
    };

    const handleUpdateItem = (index: number, key: string, val: string) => {
        const newList = [...awardsList];
        newList[index][key] = val;
        updateAwards(newList);
    };

    const handleAddItem = () => {
        const newList = [...awardsList, { title: "NEW AWARD", issuer: "ORGANIZATION", year: new Date().getFullYear().toString(), imageUrl: "" }];
        updateAwards(newList);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newList = awardsList.filter((_: any, i: number) => i !== index);
        updateAwards(newList);
    };

    const handleMediaSelect = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!setSelectedMedia) {
            alert("Media library is only available in the dashboard editor.");
            return;
        }
        setSelectedMedia({
            onSelect: (url: string) => handleUpdateItem(index, 'imageUrl', url)
        });
    };

    return (
        <section ref={containerRef} className="py-24 w-full relative z-20 bg-[#050505] overflow-hidden" id="awards">
            <div className="absolute -left-[20%] top-0 w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
                <div className="flex items-center gap-6 mb-20">
                    <h2 className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4">
                       <span className="text-white">
                           <EditableText value={theme?.customTexts?.hf_recognition_label || '0X / RECOGNITIONS'} field="hf_recognition_label" entity="appearance" isEditor={isEditor} as="span" />
                       </span>
                    </h2>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>
                
                <div className="border-t border-white/20">
                    {awardsList.map((award: any, index: number) => {
                        const isExpanded = expandedIndex === index;
                        return (
                            <div 
                                key={index} 
                                className={`hf-award-row group flex flex-col border-b border-white/10 transition-colors duration-500 ${isExpanded ? 'bg-[#0a0a0a]' : 'hover:bg-[#0a0a0a]'} ${isEditor ? '' : 'opacity-0'}`}
                            >
                                {/* Main Row */}
                                <div 
                                    className="w-full flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-8 py-8 md:py-12 px-4 md:px-8 cursor-pointer relative"
                                    onClick={() => toggleExpand(index)}
                                >
                                    {/* Delete Button */}
                                    {isEditor && (
                                        <button
                                            onClick={(e) => handleRemoveItem(index, e)}
                                            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] z-50 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Award"
                                        >
                                            ✕
                                        </button>
                                    )}

                                    {/* Index */}
                                    <div className="font-mono text-xs text-white/30 tracking-[0.2em] w-8 shrink-0">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </div>
                                    
                                    {/* Title */}
                                    <div className="flex-1 min-w-[250px]">
                                        <h3 className={`font-display text-3xl md:text-5xl uppercase tracking-tighter transition-colors duration-500 ${isExpanded ? 'text-accent' : 'text-white group-hover:text-white/80'}`}>
                                            <div onClick={(e) => isEditor && e.stopPropagation()}>
                                                <EditableText 
                                                    value={award.title} 
                                                    onChange={(val) => handleUpdateItem(index, 'title', val)} 
                                                    isEditor={isEditor} 
                                                    maxLength={50} 
                                                    as="span" 
                                                />
                                            </div>
                                        </h3>
                                    </div>
                                    
                                    {/* Issuer & Year */}
                                    <div className="flex items-center gap-8 md:gap-16">
                                        <div className="font-mono text-xs md:text-sm text-white/50 uppercase tracking-widest text-right">
                                            <div onClick={(e) => isEditor && e.stopPropagation()}>
                                                <EditableText 
                                                    value={award.issuer} 
                                                    onChange={(val) => handleUpdateItem(index, 'issuer', val)} 
                                                    isEditor={isEditor} 
                                                    maxLength={40} 
                                                    as="span" 
                                                />
                                            </div>
                                        </div>
                                        <div className="font-mono text-xs md:text-sm text-white border border-white/20 px-3 py-1 rounded-full">
                                            <div onClick={(e) => isEditor && e.stopPropagation()}>
                                                <EditableText 
                                                    value={award.year} 
                                                    onChange={(val) => handleUpdateItem(index, 'year', val)} 
                                                    isEditor={isEditor} 
                                                    maxLength={4} 
                                                    as="span" 
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Expand Icon */}
                                        <div className={`w-10 h-10 border border-white/10 rounded-full flex items-center justify-center transition-transform duration-500 ${isExpanded ? 'rotate-45 bg-white text-black' : 'text-white'}`}>
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7 0V14M0 7H14" stroke="currentColor" strokeWidth="1.5"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Accordion Content (Photo Dropdown) */}
                                <div 
                                    className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="px-4 md:px-8 pb-12 pt-4">
                                        <div className="w-full max-w-4xl mx-auto border border-white/10 bg-[#020202] aspect-[16/9] md:aspect-[21/9] relative group/img overflow-hidden">
                                            {award.imageUrl ? (
                                                <img src={award.imageUrl} alt={award.title} className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 scale-105 hover:scale-100" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="font-mono text-xs tracking-widest text-white/20 uppercase">[ NO EVIDENCE PROVIDED ]</span>
                                                </div>
                                            )}
                                            
                                            {isEditor && (
                                                <button
                                                    onClick={(e) => handleMediaSelect(index, e)}
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center font-mono text-xs tracking-widest text-white uppercase backdrop-blur-sm"
                                                >
                                                    {award.imageUrl ? 'Change Media' : 'Upload Media'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {isEditor && (
                    <div className="mt-12 flex justify-end">
                        <button
                            onClick={handleAddItem}
                            className="flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-white text-white hover:text-black font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300"
                        >
                            <span>+ Append Recognition</span>
                            <div className="w-12 h-[1px] bg-current"></div>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
