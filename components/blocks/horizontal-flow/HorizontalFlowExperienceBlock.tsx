import React from 'react';

export function HorizontalFlowExperienceBlock({ data, isEditor }: any) {
    const experiences = data?.experiences || data?.user?.experiences || [];
    
    if (experiences.length === 0 && !isEditor) return null;

    return (
        <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-20">
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
               <span className="text-white">0X / Career Timeline</span>
            </h2>
            
            <div className="flex flex-col gap-12">
                {experiences.length > 0 ? experiences.map((exp: any, i: number) => (
                    <div key={i} className="group flex flex-col md:flex-row gap-6 md:gap-12 pb-12 border-b border-white/10 relative">
                        <div className="md:w-1/4 font-mono text-xs uppercase tracking-widest text-accent pt-2">
                            {exp.startDate} — {exp.isCurrentRole ? 'Present' : exp.endDate}
                        </div>
                        <div className="md:w-3/4">
                            <h3 className="font-display text-3xl font-medium uppercase tracking-tight text-white mb-2">{exp.role}</h3>
                            <div className="font-mono text-sm text-textMuted uppercase tracking-widest mb-4">{exp.company}</div>
                            {exp.description && (
                                <p className="font-body text-textMuted text-sm leading-relaxed max-w-2xl">{exp.description}</p>
                            )}
                        </div>
                    </div>
                )) : (
                    <>
                        <div className="group flex flex-col md:flex-row gap-6 md:gap-12 pb-12 border-b border-white/10 relative">
                            <div className="md:w-1/4 font-mono text-xs uppercase tracking-widest text-accent pt-2">
                                2024 — Present
                            </div>
                            <div className="md:w-3/4">
                                <h3 className="font-display text-3xl font-medium uppercase tracking-tight text-white mb-2">Technical Art Director</h3>
                                <div className="font-mono text-sm text-textMuted uppercase tracking-widest mb-4">Elevate Studio</div>
                                <p className="font-body text-textMuted text-sm leading-relaxed max-w-2xl">Leading the creative engineering team to build award-winning digital experiences using WebGL and advanced physics simulations.</p>
                            </div>
                        </div>
                        <div className="group flex flex-col md:flex-row gap-6 md:gap-12 pb-12 border-b border-white/10 relative">
                            <div className="md:w-1/4 font-mono text-xs uppercase tracking-widest text-accent pt-2">
                                2021 — 2024
                            </div>
                            <div className="md:w-3/4">
                                <h3 className="font-display text-3xl font-medium uppercase tracking-tight text-white mb-2">Senior Creative Developer</h3>
                                <div className="font-mono text-sm text-textMuted uppercase tracking-widest mb-4">Aether Digital</div>
                                <p className="font-body text-textMuted text-sm leading-relaxed max-w-2xl">Architected frontend systems with focus on motion, interaction design, and high-performance WebGL rendering.</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
