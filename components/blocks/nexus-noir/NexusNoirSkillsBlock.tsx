import React from 'react';

export function NexusNoirSkillsBlock({ data, theme, isEditor }: any) {
    const accentColor = theme?.themeColor || '#4F46E5'; 
    const skills = data?.skills || [];
    
    // Fallback if no skills
    const displaySkills = skills.length > 0 ? skills : [
        { name: 'Figma' }, { name: 'React' }, { name: 'TypeScript' }, 
        { name: 'Tailwind CSS' }, { name: 'Next.js' }, { name: 'Framer Motion' }
    ];

    return (
        <section className="py-20 px-6 relative z-20">
            <div className="max-w-7xl mx-auto w-full">
                <div className={`mb-12 ${isEditor ? '' : 'gs-reveal'}`}>
                    <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>[ Competencies ]</p>
                    <h2 className="font-nn-heading text-4xl md:text-5xl font-semibold">Technical<br/>Arsenal.</h2>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {displaySkills.map((skill: any, i: number) => (
                        <div key={i} className={`glass-panel px-6 py-4 rounded-full flex items-center gap-3 ${isEditor ? '' : 'gs-reveal hover:-translate-y-1 transition-transform duration-300'}`}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.8 }}></div>
                            <span className="font-nn-sans text-sm font-medium tracking-wide text-white">{skill.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
