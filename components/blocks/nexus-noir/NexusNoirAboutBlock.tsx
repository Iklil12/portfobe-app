import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function NexusNoirAboutBlock({ theme, isEditor }: any) {
    const accentColor = theme?.themeColor || '#4F46E5'; 

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section id="about" className="py-32 px-6 relative z-20">
            <div className="max-w-7xl mx-auto w-full">
                <div className={`mb-16 ${isEditor ? '' : 'gs-reveal'}`}>
                    <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>[ Core Arsenal ]</p>
                    <h2 className="font-nn-heading text-4xl md:text-5xl font-semibold">Bento Grid<br/>Expertise.</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
                    
                    {/* Cell 1 */}
                    <div className={`glass-panel rounded-3xl p-8 flex flex-col justify-between md:col-span-2 ${isEditor ? '' : 'gs-reveal hover:-translate-y-1 transition-transform duration-300'} cursor-default`}>
                        <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center mb-4 shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <div>
                            <h4 className="font-nn-heading text-xl font-medium mb-2 text-white">
                                <EditableText entity="appearance" field="nn_bento_t1" value={getCustomText('nn_bento_t1', 'System Architecture')} isEditor={isEditor} />
                            </h4>
                            <p className="text-[#888888] text-xs leading-relaxed">
                                <EditableText entity="appearance" field="nn_bento_d1" value={getCustomText('nn_bento_d1', 'Membangun design system yang terukur (scalable) dari komponen atomik hingga pola interaksi kompleks.')} isEditor={isEditor} />
                            </p>
                        </div>
                    </div>

                    {/* Cell 2 */}
                    <div className={`glass-panel rounded-3xl p-8 flex flex-col justify-end md:col-span-1 border-t-4 ${isEditor ? '' : 'gs-reveal hover:-translate-y-1 transition-transform duration-300'}`} style={{ borderTopColor: accentColor }}>
                        <h4 className="font-nn-heading text-6xl font-bold mb-1 text-white">
                            <EditableText entity="appearance" field="nn_bento_t2" value={getCustomText('nn_bento_t2', '100%')} isEditor={isEditor} />
                        </h4>
                        <p className="text-[#888888] text-xs uppercase tracking-wide">
                            <EditableText entity="appearance" field="nn_bento_d2" value={getCustomText('nn_bento_d2', 'Commitment.')} isEditor={isEditor} />
                        </p>
                    </div>

                    {/* Cell 3 */}
                    <div className={`glass-panel rounded-3xl p-8 flex flex-col justify-between md:col-span-1 ${isEditor ? '' : 'gs-reveal hover:-translate-y-1 transition-transform duration-300'}`}>
                        <h4 className="font-nn-heading text-xl font-medium mb-4 text-white">
                            <EditableText entity="appearance" field="nn_bento_t3" value={getCustomText('nn_bento_t3', 'Based in')} isEditor={isEditor} />
                        </h4>
                        <div>
                            <p className="text-white text-lg font-nn-heading mb-1">
                                <EditableText entity="appearance" field="nn_bento_d3" value={getCustomText('nn_bento_d3', 'Jakarta, ID')} isEditor={isEditor} />
                            </p>
                            <p className="text-[#888888] text-xs font-mono">GMT+7 / Remote</p>
                        </div>
                    </div>

                    {/* Cell 4 */}
                    <div className={`glass-panel rounded-3xl p-8 flex flex-col justify-between md:col-span-4 relative overflow-hidden group ${isEditor ? '' : 'gs-reveal hover:-translate-y-1 transition-transform duration-300'}`}>
                        <div className="absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700 opacity-20 pointer-events-none" style={{ background: `linear-gradient(to bottom right, ${accentColor}, transparent)` }}></div>
                        <div className="w-full md:w-2/3 relative z-10 flex flex-col h-full justify-center">
                            <h4 className="font-nn-heading text-2xl md:text-3xl font-medium mb-3 text-white">
                                <EditableText entity="appearance" field="nn_bento_t4" value={getCustomText('nn_bento_t4', 'Bridging Design & Engineering')} isEditor={isEditor} />
                           </h4>
                            <p className="text-[#888888] text-sm leading-relaxed">
                                <EditableText entity="appearance" field="nn_bento_d4" value={getCustomText('nn_bento_d4', 'Tidak hanya menggambar kotak-kotak di Figma. Saya menulis kode untuk memastikan animasi, transisi, dan interaksi yang saya desain terealisasi sempurna di browser.')} isEditor={isEditor} />
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
