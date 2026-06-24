"use client";
import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function HorizontalFlowStatsBlock({ data, theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    let stats: any[] = [];
    
    try {
        if (customTexts.hf_stats_items) {
            stats = JSON.parse(customTexts.hf_stats_items);
        } else {
            const allProjects = data?.projects || data?.user?.projects || [];
            const awards = data?.certificates || data?.user?.certificates || [];
            stats = [
                { value: allProjects.length > 0 ? allProjects.length.toString() : "45+", label: "Projects Completed" },
                { value: awards.length > 0 ? awards.length.toString() : "12", label: "Industry Awards" },
                { value: "8+", label: "Years Active" },
                { value: "100%", label: "Client Satisfaction" }
            ];
        }
    } catch (e) {
        stats = [];
    }

    const updateStats = (newStats: any[]) => {
        if (!isEditor) return;
        window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'hf_stats_items', value: JSON.stringify(newStats) }, window.location.origin);
    };

    const handleUpdateItem = (index: number, key: 'value' | 'label', val: string) => {
        const newStats = [...stats];
        newStats[index][key] = val;
        updateStats(newStats);
    };

    const handleAddItem = () => {
        const newStats = [...stats, { value: "00", label: "NEW STAT" }];
        updateStats(newStats);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newStats = stats.filter((_: any, i: number) => i !== index);
        updateStats(newStats);
    };

    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!isEditor) {
            gsap.fromTo('.hf-stat-item', 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out"
                }
            );
        }
    }, { scope: containerRef, dependencies: [stats.length, isEditor] });

    return (
        <section ref={containerRef} className="py-24 w-full relative z-20 bg-[#020202] border-y border-white/10">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-16 md:gap-y-24 gap-x-8">
                    {stats.map((stat: any, index: number) => (
                        <div 
                            key={index} 
                            className={`hf-stat-item group relative flex flex-col items-center xl:items-start text-center xl:text-left ${isEditor ? '' : 'opacity-0'}`}
                        >
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute -top-4 -right-4 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] z-50 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Stat"
                                >
                                    ✕
                                </button>
                            )}
                            
                            <div className="relative">
                                {/* Massive Number */}
                                <div className="font-display text-[6rem] md:text-[8rem] lg:text-[10rem] font-bold tracking-tighter text-transparent group-hover:text-white transition-all duration-700 ease-in-out leading-none" 
                                     style={{ WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}>
                                    <EditableText 
                                        value={stat.value} 
                                        onChange={(val) => handleUpdateItem(index, 'value', val)} 
                                        isEditor={isEditor} 
                                        maxLength={10} 
                                        as="span" 
                                    />
                                </div>
                                
                                {/* Overlay Label */}
                                <div className="absolute bottom-4 xl:bottom-8 left-1/2 xl:left-4 -translate-x-1/2 xl:translate-x-0 w-max max-w-[200px] font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-medium z-10 bg-[#020202]/80 backdrop-blur-sm px-4 py-2 border border-white/5 rounded-full group-hover:border-accent/30 transition-colors duration-500">
                                    <EditableText 
                                        value={stat.label} 
                                        onChange={(val) => handleUpdateItem(index, 'label', val)} 
                                        isEditor={isEditor} 
                                        maxLength={30} 
                                        as="span" 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {isEditor && (
                    <div className="mt-20 flex justify-center w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-8 py-4 border border-dashed border-white/20 hover:border-white text-white/40 hover:text-white font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300"
                        >
                            + ADD STATISTIC
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
