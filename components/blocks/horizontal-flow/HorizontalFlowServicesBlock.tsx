import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function HorizontalFlowServicesBlock({ theme, isEditor }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const customTexts = theme?.customTexts || {};

    const toggleVisibility = (id: string, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `hf_srv${id}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    useGSAP(() => {
        if (!isEditor && window.innerWidth > 768) {
            const bentoCards = document.querySelectorAll('.bento-card-tilt');
            bentoCards.forEach(card => {
                const htmlCard = card as HTMLElement;
                htmlCard.addEventListener('mousemove', (e) => {
                    const rect = htmlCard.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -10; 
                    const rotateY = ((x - centerX) / centerX) * 10;
                    
                    gsap.to(htmlCard, {
                        rotateX, rotateY, transformPerspective: 1000, duration: 0.5, ease: 'power2.out'
                    });
                });
                
                htmlCard.addEventListener('mouseleave', () => {
                    gsap.to(htmlCard, {
                        rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power2.out'
                    });
                });
            });
        }
    }, { scope: containerRef, dependencies: [isEditor] });

    const isVisible1 = customTexts.hf_srv1_visible !== 'false';
    const isVisible2 = customTexts.hf_srv2_visible !== 'false';
    const isVisible3 = customTexts.hf_srv3_visible !== 'false';
    const isVisible4 = customTexts.hf_srv4_visible !== 'false';

    return (
        <section ref={containerRef} className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full border-t border-white/10 relative z-20">
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
              <EditableText value={customTexts.hf_expertise_label || '02 / Expertise'} field="hf_expertise_label" entity="appearance" isEditor={isEditor} as="span" />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full" style={{ perspective: '1000px' }}>
                
                {/* Card 1: Wide */}
                {(isVisible1 || isEditor) && (
                    <div className={`bento-card-tilt group col-span-1 md:col-span-2 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative min-h-[300px] transition-all ${
                        isEditor ? '' : 'cursor-default'
                    } ${!isVisible1 ? 'opacity-40 bg-zinc-950/20' : ''}`} data-cursor="EXPLORE" style={{ transformStyle: 'preserve-3d' }}>
                        {isEditor && (
                            <button
                                onClick={() => toggleVisibility('1', isVisible1)}
                                className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all ${
                                    isVisible1 
                                        ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                        : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                }`}
                                title={isVisible1 ? "Sembunyikan" : "Tampilkan"}
                            >
                                {isVisible1 ? "✕ Hide" : "➕ Show"}
                            </button>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 pointer-events-auto" style={{ transform: isEditor ? 'none' : 'translateZ(30px)' }}>
                          <h3 className="font-display text-4xl md:text-5xl font-medium uppercase tracking-tight mb-4 text-white">
                            <EditableText value={customTexts.hf_srv1_title || 'Digital Strategy'} field="hf_srv1_title" entity="appearance" isEditor={isEditor} />
                          </h3>
                          <p className="font-body text-textMuted max-w-md text-sm md:text-base">
                            <EditableText value={customTexts.hf_srv1_desc || 'Brand positioning, architecture, and user journey mapping designed to elevate your digital presence and drive measurable impact.'} field="hf_srv1_desc" entity="appearance" isEditor={isEditor} />
                          </p>
                        </div>
                        <div className="relative z-10 mt-12 flex justify-end" style={{ transform: isEditor ? 'none' : 'translateZ(40px)' }}>
                           <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300 text-white">
                               <i className="ph ph-arrow-up-right text-xl"></i>
                           </div>
                        </div>
                    </div>
                )}

                {/* Card 2: Tall */}
                {(isVisible2 || isEditor) && (
                    <div className={`bento-card-tilt group col-span-1 md:row-span-2 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-end overflow-hidden relative min-h-[400px] md:min-h-full transition-all ${
                        isEditor ? '' : 'cursor-default'
                    } ${!isVisible2 ? 'opacity-40 bg-zinc-950/20' : ''}`} data-cursor="VIEW" style={{ transformStyle: 'preserve-3d' }}>
                        {isEditor && (
                            <button
                                onClick={() => toggleVisibility('2', isVisible2)}
                                className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all ${
                                    isVisible2 
                                        ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                        : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                }`}
                                title={isVisible2 ? "Sembunyikan" : "Tampilkan"}
                            >
                                {isVisible2 ? "✕ Hide" : "➕ Show"}
                            </button>
                        )}
                        <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
                            <div className="w-64 h-64 bg-accent/20 rounded-full blur-[80px] group-hover:bg-accent/40 group-hover:scale-150 transition-all duration-1000"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(250,250,250,0.1)_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
                        </div>
                        <div className="relative z-10 pointer-events-auto" style={{ transform: isEditor ? 'none' : 'translateZ(30px)' }}>
                            <span className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4 inline-block text-white">Focus</span>
                            <h3 className="font-display text-3xl md:text-4xl font-medium uppercase tracking-tight mb-2 text-white">
                              <EditableText value={customTexts.hf_srv2_title || 'Spatial UI/UX'} field="hf_srv2_title" entity="appearance" isEditor={isEditor} />
                            </h3>
                            <p className="font-body text-textMuted text-sm">
                              <EditableText value={customTexts.hf_srv2_desc || 'Designing interfaces that feel tactile, logical, and beautiful.'} field="hf_srv2_desc" entity="appearance" isEditor={isEditor} />
                            </p>
                        </div>
                    </div>
                )}

                {/* Card 3: Small Square */}
                {(isVisible3 || isEditor) && (
                    <div className={`bento-card-tilt group col-span-1 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative min-h-[250px] transition-all ${
                        !isVisible3 ? 'opacity-40 bg-zinc-950/20' : ''
                    }`} style={{ transformStyle: 'preserve-3d' }}>
                        {isEditor && (
                            <button
                                onClick={() => toggleVisibility('3', isVisible3)}
                                className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all ${
                                    isVisible3 
                                        ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                        : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                }`}
                                title={isVisible3 ? "Sembunyikan" : "Tampilkan"}
                            >
                                {isVisible3 ? "✕ Hide" : "➕ Show"}
                            </button>
                        )}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <i className="ph ph-code text-4xl text-textMuted group-hover:text-accent transition-colors duration-300" style={{ transform: isEditor ? 'none' : 'translateZ(20px)' }}></i>
                        <div className="mt-8 relative z-10 pointer-events-auto" style={{ transform: isEditor ? 'none' : 'translateZ(30px)' }}>
                           <h3 className="font-display text-2xl font-medium uppercase tracking-tight mb-2 text-white">
                             <EditableText value={customTexts.hf_srv3_title || 'Creative Eng'} field="hf_srv3_title" entity="appearance" isEditor={isEditor} />
                           </h3>
                           <p className="font-body text-textMuted text-xs">
                             <EditableText value={customTexts.hf_srv3_desc || 'WebGL, GSAP, and robust frontend architectures.'} field="hf_srv3_desc" entity="appearance" isEditor={isEditor} />
                           </p>
                        </div>
                    </div>
                )}

                {/* Card 4: Stats replacement */}
                {(isVisible4 || isEditor) && (
                    <div className={`bento-card-tilt group col-span-1 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-center items-center overflow-hidden relative min-h-[250px] transition-all ${
                        !isVisible4 ? 'opacity-40 bg-zinc-950/20' : ''
                    }`} style={{ transformStyle: 'preserve-3d' }}>
                        {isEditor && (
                            <button
                                onClick={() => toggleVisibility('4', isVisible4)}
                                className={`absolute top-4 right-4 z-30 px-3 py-1 text-[10px] font-mono border transition-all ${
                                    isVisible4 
                                        ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                        : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                }`}
                                title={isVisible4 ? "Sembunyikan" : "Tampilkan"}
                            >
                                {isVisible4 ? "✕ Hide" : "➕ Show"}
                            </button>
                        )}
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div style={{ transform: isEditor ? 'none' : 'translateZ(40px)' }} className="text-center relative z-10">
                          <h4 className="font-display text-6xl md:text-7xl font-bold text-transparent" style={{ WebkitTextStroke: '1px rgba(250,250,250,0.5)' }}>
                             <EditableText value={customTexts.hf_srv4_val || '100%'} field="hf_srv4_val" entity="appearance" isEditor={isEditor} />
                          </h4>
                          <p className="font-mono text-[10px] text-textMuted mt-4 uppercase tracking-widest text-center">
                             <EditableText value={customTexts.hf_srv4_label || 'Pixel Perfection'} field="hf_srv4_label" entity="appearance" isEditor={isEditor} />
                          </p>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
