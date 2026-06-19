"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};
const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export const AbsoluteNoirAwardsBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const awardItems = data?.certificates || data?.user?.certificates || [];

    if (awardItems.length === 0) return null;

    const handleRowClick = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} id="awards" className="w-full bg-[#050505] text-white">
            <motion.div variants={wireframeReveal} className="w-full py-4 px-6 wire-border-b flex items-center bg-[#0a0a0a]">
                <span className="font-mono text-sm uppercase tracking-widest">
                    <EditableText value={theme?.customTexts?.noir_awards_title || '[ CERTIFICATIONS_LOG ]'} field="noir_awards_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" className="inline-block px-1" />
                </span>
            </motion.div>

            <motion.div variants={wireframeReveal} className="w-full overflow-x-auto">
                <table className="w-full text-left font-mono text-xs @md:text-sm whitespace-normal break-words table-fixed">
                    <thead className="bg-[#111]">
                        <tr>
                            <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 w-20 @md:w-28 align-top">
                                <EditableText value={theme?.customTexts?.noir_cert_year || 'YEAR'} field="noir_cert_year" entity="appearance" isEditor={isEditor} maxLength={10} as="span" className="inline-block px-1" />
                            </th>
                            <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 align-top w-2/5">
                                <EditableText value={theme?.customTexts?.noir_cert_designation || 'DESIGNATION'} field="noir_cert_designation" entity="appearance" isEditor={isEditor} maxLength={20} as="span" className="inline-block px-1" />
                            </th>
                            <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 align-top w-2/5">
                                <EditableText value={theme?.customTexts?.noir_cert_issuer || 'ISSUER'} field="noir_cert_issuer" entity="appearance" isEditor={isEditor} maxLength={20} as="span" className="inline-block px-1" />
                            </th>
                            <th className="p-4 wire-border-b font-normal text-white/50 text-right align-top w-28 @md:w-36">
                                <EditableText value={theme?.customTexts?.noir_cert_status || 'STATUS'} field="noir_cert_status" entity="appearance" isEditor={isEditor} maxLength={15} as="span" className="inline-block px-1" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {awardItems.map((award: any, i: number) => {
                            const isExpanded = expandedIndex === i;
                            const certYear = award.year || (award.createdAt ? new Date(award.createdAt).getFullYear() : 'N/A');
                            
                            return (
                                <React.Fragment key={i}>
                                    <tr 
                                        onClick={() => handleRowClick(i)}
                                        className={`transition-colors cursor-pointer group ${isExpanded ? 'bg-white text-black border-b-0' : 'hover:bg-white hover:text-black'}`}
                                    >
                                        <td className={`p-4 wire-border-b ${isExpanded ? 'border-black/20' : 'group-hover:border-black/20'} wire-border-r align-top`}>
                                            {certYear}
                                        </td>
                                        <td className={`p-4 wire-border-b ${isExpanded ? 'border-black/20' : 'group-hover:border-black/20'} wire-border-r font-bold font-sans text-sm @md:text-base uppercase align-top`}>
                                            {award.title}
                                        </td>
                                        <td className={`p-4 wire-border-b ${isExpanded ? 'border-black/20' : 'group-hover:border-black/20'} wire-border-r uppercase align-top`}>
                                            {award.issuer}
                                        </td>
                                        <td className={`p-4 wire-border-b ${isExpanded ? 'border-black/20' : 'group-hover:border-black/20'} text-right align-top select-none`}>
                                            <div className="flex items-center justify-end gap-2 mt-1">
                                                <span className={`border ${isExpanded ? 'border-black' : 'border-white/30 group-hover:border-black'} px-2 py-0.5 inline-block text-[10px]`}>
                                                    {award.status || 'VALID'}
                                                </span>
                                                <span className={`text-[10px] font-bold ${isExpanded ? 'text-black' : 'text-white/40 group-hover:text-black'}`}>
                                                    {isExpanded ? '[ - ]' : '[ + ]'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={4} className="p-0 bg-[#0a0a0a] wire-border-b">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: smoothEase }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
                                                            {award.mediaUrl ? (
                                                                <div className="w-full md:w-1/2 max-w-lg border border-white/20 p-1 bg-black/50">
                                                                    <img
                                                                        src={award.mediaUrl}
                                                                        alt={award.title}
                                                                        className="w-full h-auto object-contain max-h-[350px] grayscale hover:grayscale-0 transition-all duration-500"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-full md:w-1/2 p-8 text-center text-white/30 font-mono text-[10px] border border-dashed border-white/10 uppercase">
                                                                    [ NO_IMAGE_AVAILABLE ]
                                                                </div>
                                                            )}
                                                            <div className="flex-1 font-mono text-[11px] text-white/60 space-y-4 w-full">
                                                                <div className="border-b border-white/10 pb-3">
                                                                    <span className="text-white/30 text-[9px] block mb-1 uppercase tracking-wider">REGISTRY_ID</span>
                                                                    <span className="text-white font-bold">{award.id || `CERT-${i + 1000}`}</span>
                                                                </div>
                                                                <div className="border-b border-white/10 pb-3">
                                                                    <span className="text-white/30 text-[9px] block mb-1 uppercase tracking-wider">ISSUER_AUTHORITY</span>
                                                                    <span className="text-white uppercase">{award.issuer}</span>
                                                                </div>
                                                                {award.credentialUrl && (
                                                                    <div className="pt-2">
                                                                        <a
                                                                            href={award.credentialUrl}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="inline-flex items-center gap-2 border border-white/20 hover:border-white text-white hover:bg-white/5 px-4 py-2 transition-all uppercase tracking-widest text-[9px]"
                                                                        >
                                                                            Verify Credential ↗
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>
        </motion.section>
    );
};
