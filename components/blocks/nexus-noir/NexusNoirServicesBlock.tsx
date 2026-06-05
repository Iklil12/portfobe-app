import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function NexusNoirServicesBlock({ theme, isEditor }: any) {
    const accentColor = theme?.themeColor || '#4F46E5'; 
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="py-20 px-6 relative z-20">
            <div className="max-w-7xl mx-auto w-full">
                <div className={`mb-16 ${isEditor ? '' : 'gs-reveal'}`}>
                    <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>[ Capabilities ]</p>
                    <h2 className="font-nn-heading text-4xl md:text-5xl font-semibold">Service<br/>Offerings.</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className={`glass-panel rounded-3xl p-10 flex flex-col justify-between ${isEditor ? '' : 'gs-reveal hover:-translate-y-2 transition-transform duration-300'} group cursor-default`}>
                            <div className="mb-12">
                                <span className="font-mono text-xs text-[#888888] border border-white/10 rounded-full px-3 py-1 block w-max mb-6">0{num}</span>
                                <h4 className="font-nn-heading text-2xl font-medium mb-4 text-white group-hover:text-white transition-colors duration-300">
                                    <EditableText entity="appearance" field={`nn_svc_t${num}`} value={getCustomText(`nn_svc_t${num}`, `Service Title ${num}`)} isEditor={isEditor} />
                                </h4>
                                <p className="text-[#888888] text-sm leading-relaxed">
                                    <EditableText entity="appearance" field={`nn_svc_d${num}`} value={getCustomText(`nn_svc_d${num}`, 'Deskripsi layanan profesional yang diberikan dengan standar tinggi dan fokus pada hasil maksimal.')} isEditor={isEditor} />
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:bg-white group-hover:text-black transition-all duration-300 shrink-0">
                                <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
