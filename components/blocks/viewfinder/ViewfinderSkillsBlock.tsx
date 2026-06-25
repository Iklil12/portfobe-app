"use client";

import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { motion } from 'framer-motion';

export function ViewfinderSkillsBlock({ theme, isEditor }: any) {
    

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-md';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const getCardShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-2xl';
  };
  const cardShape = getCardShapeClass(theme?.buttonShape);

  const getCardStyleClass = (style?: string) => {
      if (style === 'hard' || style === 'hard-shadow') return 'border border-white/20 bg-[#050505] shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]';
      if (style === 'flat') return 'border border-white/20 bg-transparent';
      if (style === 'soft-shadow' || style === 'soft') return 'border border-white/5 bg-[#0a0a0a] shadow-2xl';
      return 'border border-white/10 bg-[#050505]';
  };
  const cardStyleClass = getCardStyleClass(theme?.cardStyle);

const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    let skills = [];
    try {
        if (customTexts.skills_items) {
            skills = JSON.parse(customTexts.skills_items);
        } else {
            skills = [
                { name: 'Cinematography', level: 95 },
                { name: 'Video Editing & Grading', level: 90 },
                { name: 'Lighting Design', level: 85 },
                { name: 'Creative Direction', level: 90 }
            ];
        }
    } catch (e) {
        skills = [];
    }

    const updateSkills = (newSkills: any[]) => {
        if (!isEditor) return;
        window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'skills_items', value: JSON.stringify(newSkills) }, window.location.origin);
    };

    const handleUpdateItem = (index: number, key: 'name' | 'level', value: string) => {
        const newSkills = [...skills];
        if (key === 'level') {
            const parsed = parseInt(value, 10);
            newSkills[index][key] = isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed));
        } else {
            newSkills[index][key] = value;
        }
        updateSkills(newSkills);
    };

    const handleAddItem = () => {
        const newSkills = [...skills, { name: "New Skill", level: 80 }];
        updateSkills(newSkills);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSkills = skills.filter((_: any, i: number) => i !== index);
        updateSkills(newSkills);
    };

    return (
        <section id="skills" className="w-full py-24 px-6 @md:px-12 @lg:px-20 border-b border-white/10 bg-[#050505] relative @container overflow-hidden">
            {/* Background alignment overlay grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] z-0 pointer-events-none" />

            <div className="w-full relative z-10">
                
                {/* Header Title - Technical Calibration Brackets */}
                <div className="flex flex-col items-start mb-16 select-none">
                  <span className="font-mono text-[9px] text-[var(--primary)] uppercase tracking-[0.3em] font-bold mb-3">
                    <EditableText entity="appearance" field="viewfinder_skills_label" value={getCustomText('viewfinder_skills_label', 'SYS_CALIBRATION // 01')} isEditor={isEditor} maxLength={40} as="span" />
                  </span>
                  <div className="relative border border-white/20 px-6 py-4 rounded-sm bg-white/[0.01]">
                    {/* Hinge/calibration marks */}
                    <div className="absolute -top-[5px] -left-[5px] w-2 h-2 bg-[var(--primary)] shadow-[0_0_6px_var(--primary)]"></div>
                    <div className="absolute -bottom-[5px] -right-[5px] w-2 h-2 bg-[var(--primary)] shadow-[0_0_6px_var(--primary)]"></div>
                    <h2 className="font-cinema text-3xl @md:text-5xl text-white uppercase tracking-widest leading-none">
                      <EditableText entity="appearance" field="viewfinder_skills_title" value={getCustomText('viewfinder_skills_title', 'Subsystems')} isEditor={isEditor} maxLength={40} as="span" />
                    </h2>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
                    {skills.map((skill: any, index: number) => {
                        const defaultName = skill.name;
                        const defaultProficiency = String(skill.level);
                        const val = parseInt(defaultProficiency || '0', 10);
                        const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                        
                        // Calculate tick indicators (10 ticks scale)
                        const activeTicks = Math.round(safeVal / 10);

                        return (
                            <div 
                                key={index} 
                                className="relative border border-white/10 rounded p-5 bg-[#0b0b0b]/60 flex flex-col justify-between group overflow-hidden shadow-lg"
                            >
                                {/* Corner visual ticks for camera focus frame */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20"></div>

                                {/* Tech telemetry header */}
                                <div className="flex justify-between items-center font-mono text-[7px] text-slate-500 mb-3 uppercase tracking-widest select-none">
                                    <span>CAP_INDEX // 0{index + 1}</span>
                                    <span>PEAK // {safeVal}%</span>
                                </div>

                                {/* Skill Name & Value Display */}
                                <div className="flex justify-between items-baseline mb-4 text-white">
                                    <h3 className="font-cinema text-xl uppercase tracking-wider group-hover:text-[var(--primary)] transition-colors duration-300">
                                        <EditableText 
                                            value={defaultName} 
                                            onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </h3>
                                    <span className="font-mono text-xs text-slate-400 font-bold ml-2">
                                        <EditableText 
                                            value={defaultProficiency} 
                                            onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                            isEditor={isEditor} 
                                            maxLength={3} 
                                            as="span" 
                                        />%
                                    </span>
                                </div>

                                {/* Exposure Compensation / Battery-style Ticks Meter */}
                                <div className="flex gap-1.5 items-center select-none py-1.5 border-t border-white/5 mt-1">
                                    {[...Array(10)].map((_, tickIdx) => {
                                        const isActive = tickIdx < activeTicks;
                                        return (
                                            <div 
                                                key={tickIdx} 
                                                className={`h-2.5 w-1.5 rounded-[1px] transition-all duration-1000 ${
                                                    isActive 
                                                        ? 'bg-[var(--primary)] shadow-[0_0_6px_var(--primary)]' 
                                                        : 'bg-white/10'
                                                }`}
                                                style={{ transitionDelay: `${tickIdx * 50}ms` }}
                                            />
                                        );
                                    })}
                                </div>
                            
                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg cursor-pointer"
                                        title="Delete Skill"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isEditor && (
                    <div className="flex justify-center mt-12 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                            + Tambah Skill
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
