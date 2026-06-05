import React from 'react';

export function HorizontalFlowStatsBlock({ data }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const awards = data?.certificates || data?.user?.certificates || [];

    return (
        <section className="py-10 px-6 md:px-10 max-w-7xl mx-auto w-full mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/10 py-12">
                <div>
                    <p className="font-display text-3xl md:text-4xl font-bold">{allProjects.length || "45+"}</p>
                    <p className="font-mono text-[10px] text-textMuted mt-2 uppercase tracking-widest">Projects</p>
                </div>
                <div>
                    <p className="font-display text-3xl md:text-4xl font-bold">{awards.length || "12"}</p>
                    <p className="font-mono text-[10px] text-textMuted mt-2 uppercase tracking-widest">Awards</p>
                </div>
                <div>
                    <p className="font-display text-3xl md:text-4xl font-bold">8+</p>
                    <p className="font-mono text-[10px] text-textMuted mt-2 uppercase tracking-widest">Years Active</p>
                </div>
                <div>
                    <p className="font-display text-3xl md:text-4xl font-bold">∞</p>
                    <p className="font-mono text-[10px] text-textMuted mt-2 uppercase tracking-widest">Possibilities</p>
                </div>
            </div>
        </section>
    );
}
