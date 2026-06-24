import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function HorizontalFlowSkillsBlock({ data, theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    let displaySkills: any[] = [];
    try {
        if (customTexts.hf_skills_items) {
            displaySkills = JSON.parse(customTexts.hf_skills_items);
        } else if (data?.skills && data.skills.length > 0) {
            displaySkills = data.skills;
        } else {
            displaySkills = [
                { name: 'Figma' }, { name: 'React' }, { name: 'GSAP' }, 
                { name: 'WebGL' }, { name: 'Three.js' }
            ];
        }
    } catch (e) {
        displaySkills = [];
    }

    const updateSkills = (newSkills: any[]) => {
        if (!isEditor) return;
        window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'hf_skills_items', value: JSON.stringify(newSkills) }, window.location.origin);
    };

    const handleUpdateItem = (index: number, value: string) => {
        const newSkills = [...displaySkills];
        newSkills[index] = { ...newSkills[index], name: value };
        updateSkills(newSkills);
    };

    const handleAddItem = () => {
        const newSkills = [...displaySkills, { name: "NEW SKILL" }];
        updateSkills(newSkills);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSkills = displaySkills.filter((_: any, i: number) => i !== index);
        updateSkills(newSkills);
    };

    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!isEditor) {
            gsap.fromTo('.hf-skill-item', 
                { y: 20, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: "power2.out"
                }
            );
        }
    }, { scope: containerRef, dependencies: [displaySkills.length, isEditor] });

    return (
        <section ref={containerRef} className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-20">
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
               <span className="text-white">
                 <EditableText entity="appearance" field="hf_skills_title" value={customTexts.hf_skills_title || '0X / Tools & Stack'} isEditor={isEditor} />
               </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 relative">
                {displaySkills.map((skill: any, i: number) => (
                    <div 
                        key={i} 
                        className={`flex flex-col justify-between p-4 md:p-8 bg-[#0a0a0a] border border-white/5 hover:border-accent hover:-translate-y-2 transition-all duration-500 group relative ${isEditor ? '' : 'hf-skill-item opacity-0'}`} 
                        data-cursor="SKILL"
                    >
                        {isEditor && (
                            <button
                                onClick={(e) => handleRemoveItem(i, e)}
                                className="absolute top-2 right-2 md:top-4 md:right-4 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[8px] md:text-[10px] z-30 transition-colors opacity-0 group-hover:opacity-100"
                                title="Hapus Skill"
                            >
                                ✕
                            </button>
                        )}
                        
                        <span className="font-mono text-[10px] text-white/20 tracking-[0.2em] mb-6 md:mb-12 group-hover:text-accent transition-colors">
                            {(i + 1).toString().padStart(2, '0')} //
                        </span>
                        
                        <h3 className="font-display text-lg md:text-3xl font-medium uppercase tracking-wide text-white/60 group-hover:text-white transition-colors break-words">
                            <EditableText 
                                value={skill.name} 
                                onChange={(val) => handleUpdateItem(i, val)} 
                                isEditor={isEditor} 
                                as="span" 
                                className="outline-none"
                            />
                        </h3>
                    </div>
                ))}
                
                {isEditor && (
                    <button
                        onClick={handleAddItem}
                        className="flex flex-col justify-center items-center p-4 md:p-8 border border-dashed border-white/20 hover:border-white/50 hover:bg-white/5 transition-all duration-500 group"
                    >
                        <span className="font-display text-lg md:text-2xl font-medium uppercase tracking-wide text-white/30 group-hover:text-white/80 transition-colors">
                            + Add Skill
                        </span>
                    </button>
                )}
            </div>
        </section>
    );
}
