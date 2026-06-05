import React from 'react';

export function NexusNoirAwardsBlock({ data }: any) {
    const certificates = data?.certificates || data?.user?.certificates || [];

    if (certificates.length === 0) return null;

    return (
        <section className="py-24 px-6 md:px-10 border-t border-[#333] relative bg-[#050505] z-20">
            <div className="max-w-7xl mx-auto">
                <h3 className="font-nn-heading text-4xl uppercase tracking-tighter mb-12 text-white">Honors</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {certificates.map((cert: any, i: number) => (
                        <div key={i} className="p-8 border border-[#222] bg-[#0A0A0A] rounded-xl">
                            <span className="font-nn-sans text-xs uppercase tracking-widest text-[#888888] block mb-2">{cert.year || new Date(cert.createdAt).getFullYear()}</span>
                            <h4 className="font-nn-heading text-xl font-bold uppercase mb-4 text-white">{cert.title}</h4>
                            <p className="font-nn-sans text-sm text-[#888888]">{cert.issuer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
