import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function NexusNoirSkillsBlock({ data, theme, isEditor }: any) {
    const accentColor = theme?.themeColor || '#4F46E5';
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;
    let displaySkills: any[] = [];
    try {
        if (customTexts.nn_skills_items) {
            displaySkills = JSON.parse(customTexts.nn_skills_items);
        } else if (data?.skills && data.skills.length > 0) {
            displaySkills = data.skills;
        } else {
            displaySkills = [
                { name: 'Figma' }, { name: 'React' }, { name: 'TypeScript' },
                { name: 'Tailwind CSS' }, { name: 'Next.js' }, { name: 'Framer Motion' }
            ];
        }
    } catch (e) {
        displaySkills = [];
    }

    const updateSkills = (newSkills: any[]) => {
        if (!isEditor) return;
        window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'nn_skills_items', value: JSON.stringify(newSkills) }, window.location.origin);
    };

    const handleUpdateItem = (index: number, value: string) => {
        const newSkills = [...displaySkills];
        newSkills[index] = { ...newSkills[index], name: value };
        updateSkills(newSkills);
    };

    const handleAddItem = () => {
        const newSkills = [...displaySkills, { name: "Skill Baru" }];
        updateSkills(newSkills);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSkills = displaySkills.filter((_: any, i: number) => i !== index);
        updateSkills(newSkills);
    };

    return (
        <section className="py-20 px-6 relative z-20">
            <div className="max-w-7xl mx-auto w-full">
                <div className={`mb-12 ${isEditor ? '' : 'gs-reveal'}`}>
                    <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>
                        <EditableText entity="appearance" field="nn_skills_subtitle" value={getCustomText('nn_skills_subtitle', '[ Competencies ]')} isEditor={isEditor} />
                    </p>
                    <h2 className="font-nn-heading text-4xl md:text-5xl font-semibold whitespace-pre-line">
                        <EditableText entity="appearance" field="nn_skills_title" value={getCustomText('nn_skills_title', 'Technical\nArsenal.')} isEditor={isEditor} />
                    </h2>
                </div>

                <div className="flex flex-wrap gap-3 md:gap-4 relative">
                    {displaySkills.map((skill: any, i: number) => (
                        <div
                            key={i}
                            className={`border border-white/10 bg-black px-6 py-4 md:px-8 md:py-5 rounded-full flex items-center gap-4 hover:bg-white transition-all duration-300 cursor-default group relative ${isEditor ? '' : 'gs-reveal hover:-translate-y-1'}`}
                        >
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(i, e)}
                                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] z-30 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                                    title="Hapus Skill"
                                >
                                    ✕
                                </button>
                            )}
                            <span className="font-mono text-[10px] md:text-xs text-[#666] group-hover:text-black/50 transition-colors">
                                {(i + 1).toString().padStart(2, '0')}
                            </span>
                            <span className="font-nn-heading text-lg md:text-xl font-medium tracking-tight text-white group-hover:text-black transition-colors">
                                <EditableText
                                    value={skill.name}
                                    onChange={(val) => handleUpdateItem(i, val)}
                                    isEditor={isEditor}
                                    as="span"
                                    className="outline-none"
                                />
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-black/20 ml-2 transition-colors"></div>
                        </div>
                    ))}
                    {isEditor && (
                        <button
                            onClick={handleAddItem}
                            className="border border-dashed border-white/20 px-6 py-4 md:px-8 md:py-5 rounded-full flex items-center gap-4 hover:border-white/50 transition-all duration-300 text-white/50 hover:text-white"
                        >
                            <span className="font-nn-heading text-lg md:text-xl font-medium tracking-tight">+ Tambah Skill</span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
