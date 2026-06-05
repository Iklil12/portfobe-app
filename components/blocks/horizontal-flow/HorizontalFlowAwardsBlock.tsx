import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function HorizontalFlowAwardsBlock({ data, theme, isEditor }: any) {
    const awards = data?.certificates || data?.user?.certificates || [];

    return (
        <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full mb-20" id="awards">
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
               <EditableText value={theme?.customTexts?.hf_recognition_label || '03 / Recognition'} field="hf_recognition_label" entity="appearance" isEditor={isEditor} as="span" />
            </h2>
            <div className="w-full text-sm font-mono uppercase tracking-widest text-textMuted border-b border-white/20 pb-4 flex justify-between">
                <span>Award</span>
                <span>Project</span>
                <span className="hidden md:block">Year</span>
            </div>
            
            {awards.length > 0 ? awards.map((award: any, i: number) => (
              <div key={i} className="w-full flex justify-between items-center py-6 border-b border-white/10 hover:bg-white/5 transition-colors px-4 -mx-4 rounded" data-cursor="AWARD">
                  <span className="font-display text-xl font-medium text-white tracking-wide w-1/3">{award.title}</span>
                  <span className="w-1/3 text-center text-white">{award.issuer}</span>
                  <span className="w-1/3 text-right hidden md:block text-white">{award.year || new Date(award.createdAt).getFullYear()}</span>
              </div>
            )) : (
              <>
                <div className="w-full flex justify-between items-center py-6 border-b border-white/10 hover:bg-white/5 transition-colors px-4 -mx-4 rounded" data-cursor="AWARD">
                    <span className="font-display text-xl font-medium text-white tracking-wide w-1/3">Site of the Day</span>
                    <span className="w-1/3 text-center text-white">Aether E-Com</span>
                    <span className="w-1/3 text-right hidden md:block text-white">2026</span>
                </div>
                <div className="w-full flex justify-between items-center py-6 border-b border-white/10 hover:bg-white/5 transition-colors px-4 -mx-4 rounded" data-cursor="AWARD">
                    <span className="font-display text-xl font-medium text-white tracking-wide w-1/3">Developer Award</span>
                    <span className="w-1/3 text-center text-white">Nexus Fin</span>
                    <span className="w-1/3 text-right hidden md:block text-white">2025</span>
                </div>
              </>
            )}
        </section>
    );
}
