"use client";

import React from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicGalleryServicesBlock(props: any) {
    const { isEditor, theme } = useCinematicGallery();

    return (
        <section className="panel flex-col items-center justify-center">
            <h2 className="font-serif text-3xl md:text-5xl italic mb-12 reveal-on-scroll text-[#f5f5f0]">
                <EditableText value={theme?.customTexts?.cg_services_heading || 'Layanan'} field="cg_services_heading" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center flex-nowrap max-w-7xl px-4 w-[90vw] md:w-auto h-[60vh] md:h-auto overflow-y-auto md:overflow-visible hide-scrollbar pointer-events-auto">
                {/* Service 1 */}
                <div className="w-full md:w-[320px] border-t border-[#f5f5f0]/20 pt-6 reveal-on-scroll shrink-0 group hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8b8b8b] group-hover:text-white transition-colors duration-500">
                            01
                        </span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#f5f5f0] mb-4 italic group-hover:not-italic transition-all duration-500">
                        <EditableText value={theme?.customTexts?.cg_svc_1_title || 'Direksi Kreatif'} field="cg_svc_1_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h3>
                    <p className="font-sans text-xs md:text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                        <EditableText value={theme?.customTexts?.cg_svc_1_desc || 'Mengarahkan visi visual dan narasi untuk kampanye atau proyek artistik dengan estetika yang mendalam.'} field="cg_svc_1_desc" entity="appearance" isEditor={isEditor} as="span" />
                    </p>
                </div>

                {/* Service 2 */}
                <div className="w-full md:w-[320px] border-t border-[#f5f5f0]/20 pt-6 reveal-on-scroll shrink-0 group hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8b8b8b] group-hover:text-white transition-colors duration-500">
                            02
                        </span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#f5f5f0] mb-4 italic group-hover:not-italic transition-all duration-500">
                        <EditableText value={theme?.customTexts?.cg_svc_2_title || 'Eksplorasi Digital'} field="cg_svc_2_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h3>
                    <p className="font-sans text-xs md:text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                        <EditableText value={theme?.customTexts?.cg_svc_2_desc || 'Eksperimen dengan medium digital baru, interaksi 3D, dan penceritaan berbasis web modern.'} field="cg_svc_2_desc" entity="appearance" isEditor={isEditor} as="span" />
                    </p>
                </div>

                {/* Service 3 */}
                <div className="w-full md:w-[320px] border-t border-[#f5f5f0]/20 pt-6 reveal-on-scroll shrink-0 group hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8b8b8b] group-hover:text-white transition-colors duration-500">
                            03
                        </span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#f5f5f0] mb-4 italic group-hover:not-italic transition-all duration-500">
                        <EditableText value={theme?.customTexts?.cg_svc_3_title || 'Fotografi Visual'} field="cg_svc_3_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h3>
                    <p className="font-sans text-xs md:text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                        <EditableText value={theme?.customTexts?.cg_svc_3_desc || 'Menangkap momen, subjek, dan lanskap dalam komposisi yang bercerita dan menggugah emosi penonton.'} field="cg_svc_3_desc" entity="appearance" isEditor={isEditor} as="span" />
                    </p>
                </div>
            </div>
        </section>
    );
}
