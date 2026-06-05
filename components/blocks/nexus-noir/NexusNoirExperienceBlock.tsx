import React from 'react';

export function NexusNoirExperienceBlock({ data, theme, isEditor }: any) {
    const experiences = data?.experiences || data?.user?.experiences || [];
    const accentColor = theme?.themeColor || '#4F46E5'; 

    return (
        <section id="experience" className="py-32 px-6 bg-[#030303] relative z-20">
            <div className="max-w-7xl mx-auto w-full">
                <div className={`text-center mb-24 ${isEditor ? '' : 'gs-reveal'}`}>
                    <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>[ The Journey ]</p>
                    <h2 className="font-nn-heading text-4xl md:text-5xl font-semibold">Professional<br/>Timeline.</h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 md:-translate-x-1/2"></div>

                    {experiences.map((exp: any, i: number) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <div key={exp.id} className={`relative flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} justify-between items-center w-full mb-16 group ${isEditor ? '' : 'gs-reveal'}`}>
                                {/* Marker */}
                                <div className="absolute left-[11px] md:left-1/2 w-[9px] h-[9px] bg-white/20 rounded-full md:-translate-x-1/2 group-hover:scale-150 group-hover:bg-white transition-all duration-300 z-10"></div>
                                
                                <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${isLeft ? 'md:text-right pr-0 md:pr-10' : 'md:text-left pr-0 md:pr-0 md:ml-10'} mb-4 md:mb-0`}>
                                    <h3 className="font-nn-heading text-2xl font-medium text-white">{exp.role}</h3>
                                    <p className="font-medium mt-1" style={{ color: accentColor }}>{exp.company}</p>
                                </div>
                                
                                <div className={`w-full md:w-[45%] pl-10 ${isLeft ? 'md:pl-10' : 'md:pl-0 md:text-right pr-0 md:pr-10'}`}>
                                    <span className={`text-xs font-mono text-[#888888] mb-2 block border border-white/10 w-max px-3 py-1 rounded-full ${!isLeft ? 'md:ml-auto' : ''}`}>
                                        {exp.startDate} — {exp.endDate || 'Present'}
                                    </span>
                                    <p className="text-sm text-[#888888] leading-relaxed">{exp.description}</p>
                                </div>
                            </div>
                        );
                    })}
                    {experiences.length === 0 && (
                        <div className="text-center text-white/50 text-sm">No experience data available.</div>
                    )}
                </div>
            </div>
        </section>
    );
}
