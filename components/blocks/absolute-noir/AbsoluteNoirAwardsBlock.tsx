"use client";

import React from 'react';
import { motion } from 'framer-motion';
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
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const awardItems = data?.certificates || data?.user?.certificates || [];

    if (awardItems.length === 0) return null;

    return (
        <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} id="awards" className="w-full bg-[#050505] text-white">
            <motion.div variants={wireframeReveal} className="w-full py-4 px-6 wire-border-b flex items-center bg-[#0a0a0a]">
                <span className="font-mono text-sm uppercase tracking-widest">
                    <EditableText value={theme?.customTexts?.noir_awards_title || '[ CERTIFICATIONS_LOG ]'} field="noir_awards_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                </span>
            </motion.div>

            <motion.div variants={wireframeReveal} className="w-full overflow-x-auto">
                <table className="w-full text-left font-mono text-xs @md:text-sm whitespace-normal break-words">
                    <thead className="bg-[#111]">
                        <tr>
                            <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 w-16 @md:w-24 align-top">
                                <EditableText value={theme?.customTexts?.noir_cert_year || 'YEAR'} field="noir_cert_year" entity="appearance" isEditor={isEditor} maxLength={10} as="span" />
                            </th>
                            <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 align-top">
                                <EditableText value={theme?.customTexts?.noir_cert_designation || 'DESIGNATION'} field="noir_cert_designation" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                            </th>
                            <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 align-top">
                                <EditableText value={theme?.customTexts?.noir_cert_issuer || 'ISSUER'} field="noir_cert_issuer" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                            </th>
                            <th className="p-4 wire-border-b font-normal text-white/50 text-right align-top">
                                <EditableText value={theme?.customTexts?.noir_cert_status || 'STATUS'} field="noir_cert_status" entity="appearance" isEditor={isEditor} maxLength={15} as="span" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {awardItems.map((award: any, i: number) => (
                            <tr key={i} className="hover:bg-white hover:text-black transition-colors cursor-pointer group">
                                <td className="p-4 wire-border-b group-hover:border-black/20 wire-border-r align-top">
                                    {award.year || new Date(award.createdAt).getFullYear()}
                                </td>
                                <td className="p-4 wire-border-b group-hover:border-black/20 wire-border-r font-bold font-sans text-sm @md:text-base uppercase align-top">
                                    {award.title}
                                </td>
                                <td className="p-4 wire-border-b group-hover:border-black/20 wire-border-r uppercase align-top">
                                    {award.issuer}
                                </td>
                                <td className="p-4 wire-border-b group-hover:border-black/20 text-right align-top">
                                    <span className="border border-white/30 group-hover:border-black px-2 py-1 inline-block mt-1">
                                        {award.status || 'VALID'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </motion.section>
    );
};
