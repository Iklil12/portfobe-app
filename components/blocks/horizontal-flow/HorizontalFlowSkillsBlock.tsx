import React from 'react';

export function HorizontalFlowSkillsBlock({ data, isEditor }: any) {
    const skills = data?.skills || data?.user?.skills || [];
    
    if (skills.length === 0 && !isEditor) return null;

    return (
        <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-20">
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
               <span className="text-white">0X / Tools & Stack</span>
            </h2>
            
            <div className="flex flex-wrap gap-4">
                {skills.length > 0 ? skills.map((skill: any, i: number) => (
                    <div key={i} className="px-6 py-3 border border-white/10 rounded-full font-mono text-sm uppercase tracking-widest text-textMuted hover:text-white hover:border-accent transition-colors" data-cursor="SKILL">
                        {skill.name}
                    </div>
                )) : (
                    <>
                        {['Figma', 'React', 'GSAP', 'WebGL', 'Three.js'].map((s, i) => (
                            <div key={i} className="px-6 py-3 border border-white/10 rounded-full font-mono text-sm uppercase tracking-widest text-textMuted hover:text-white hover:border-accent transition-colors" data-cursor="SKILL">
                                {s}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}
