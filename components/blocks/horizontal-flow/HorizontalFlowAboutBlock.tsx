import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function HorizontalFlowAboutBlock({ theme, isEditor }: any) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!isEditor) {
            gsap.from(".reveal-text", {
                scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
                y: 50, opacity: 0, duration: 1, ease: "power3.out"
            });
        }
    }, { scope: containerRef, dependencies: [isEditor] });

    return (
        <section ref={containerRef} id="about" className="py-24 px-6 md:px-10 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4">
                    <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4">
                      <EditableText value={theme?.customTexts?.hf_manifesto_label || '01 / The Manifesto'} field="hf_manifesto_label" entity="appearance" isEditor={isEditor} as="span" />
                    </h2>
                </div>
                <div className="md:col-span-8">
                    <h3 className={`font-display text-3xl md:text-5xl font-medium leading-[1.2] tracking-tight ${isEditor ? '' : 'reveal-text'}`}>
                        <EditableText value={theme?.customTexts?.hf_manifesto_text || "We don't believe in templates. We believe in bespoke digital architecture. Every project is an opportunity to push the boundaries of physics, interaction, and aesthetics on the web."} field="hf_manifesto_text" entity="appearance" isEditor={isEditor} as="span" />
                    </h3>
                </div>
            </div>
        </section>
    );
}
