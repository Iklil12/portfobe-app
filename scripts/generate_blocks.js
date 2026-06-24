const fs = require('fs');
const path = require('path');

const THEMES = [
  {
    id: 'minimalist',
    folder: 'minimalist',
    prefix: 'Minimalist',
    containerClass: 'w-full py-24 md:py-32 px-4 md:px-8 border-t border-gray-200 bg-white',
    titleClass: 'text-2xl md:text-4xl font-light tracking-tight text-gray-900 mb-12',
    itemClass: 'flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-100',
    skillBarBg: 'bg-gray-100',
    skillBarFill: 'bg-gray-900',
    expTitleClass: 'text-xl font-medium text-gray-900',
    expMetaClass: 'text-sm text-gray-500 font-mono',
  },
  {
    id: 'spatial',
    folder: 'spatial',
    prefix: 'Spatial',
    containerClass: 'w-full py-24 md:py-32 px-4 md:px-8 bg-black/40 backdrop-blur-xl border-t border-white/10',
    titleClass: 'text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 mb-16',
    itemClass: 'p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all mb-4',
    skillBarBg: 'bg-white/10 rounded-full',
    skillBarFill: 'bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]',
    expTitleClass: 'text-2xl font-semibold text-white',
    expMetaClass: 'text-sm text-white/50 tracking-wider',
  },
  {
    id: 'obsidian-reel',
    folder: 'obsidian-reel',
    prefix: 'Obsidian',
    containerClass: 'w-full py-24 px-6 md:px-12 bg-[#050505]',
    titleClass: 'text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-12',
    itemClass: 'border-l-2 border-white/20 pl-6 py-4 mb-8 hover:border-white transition-colors',
    skillBarBg: 'bg-white/10',
    skillBarFill: 'bg-white',
    expTitleClass: 'text-2xl font-bold text-white uppercase',
    expMetaClass: 'text-xs text-white/40 tracking-widest uppercase',
  },
  {
    id: 'aura-kinetic',
    folder: 'aura-kinetic',
    prefix: 'AuraKinetic',
    containerClass: 'w-full py-32 px-4 md:px-16 overflow-hidden relative',
    titleClass: 'text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent mix-blend-difference mb-16 outline-text',
    itemClass: 'p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-md mb-6 hover:scale-[1.02] transition-transform',
    skillBarBg: 'bg-white/10 rounded-full',
    skillBarFill: 'bg-gradient-to-r from-purple-500 to-pink-500 rounded-full',
    expTitleClass: 'text-3xl font-bold text-white',
    expMetaClass: 'text-sm text-white/60 font-mono',
  },
  {
    id: 'editorial',
    folder: 'editorial',
    prefix: 'Editorial',
    containerClass: 'w-full py-24 md:py-32 px-6 md:px-12 bg-[#f4f4f0] border-t border-black',
    titleClass: 'text-4xl md:text-6xl font-serif text-black mb-16 italic',
    itemClass: 'grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b border-black/20',
    skillBarBg: 'bg-black/10',
    skillBarFill: 'bg-black',
    expTitleClass: 'text-3xl font-serif text-black md:col-span-8',
    expMetaClass: 'text-sm text-black/60 uppercase tracking-widest md:col-span-4',
  },
  {
    id: 'midnight-emulsion',
    folder: 'midnight-emulsion',
    prefix: 'MidnightEmulsion',
    containerClass: 'w-full py-24 px-6 md:px-12 bg-[#020202] border-t border-white/10',
    titleClass: 'text-3xl md:text-5xl font-mono text-white/90 mb-12 uppercase tracking-tight',
    itemClass: 'p-6 bg-white/[0.02] border border-white/10 mb-4 hover:bg-white/[0.05] transition-colors',
    skillBarBg: 'bg-white/10',
    skillBarFill: 'bg-white/80',
    expTitleClass: 'text-xl font-mono text-white',
    expMetaClass: 'text-xs text-white/50 font-mono uppercase tracking-widest mt-2 block',
  },
  {
    id: 'viewfinder',
    folder: 'viewfinder',
    prefix: 'Viewfinder',
    containerClass: 'w-full py-24 px-4 md:px-8',
    titleClass: 'text-2xl font-mono uppercase tracking-[0.2em] text-white/80 mb-12 flex items-center gap-4 before:w-8 before:h-[1px] before:bg-white/80',
    itemClass: 'relative pl-8 py-4 border-l border-white/20 mb-8 before:absolute before:left-[-4px] before:top-6 before:w-2 before:h-2 before:bg-white before:rounded-full',
    skillBarBg: 'bg-white/10 h-[1px]',
    skillBarFill: 'bg-white h-[1px]',
    expTitleClass: 'text-xl uppercase tracking-widest text-white',
    expMetaClass: 'text-xs font-mono text-white/40',
  },
  {
    id: 'monolith',
    folder: 'monolith',
    prefix: 'Monolith',
    containerClass: 'w-full py-32 px-6 md:px-16 bg-[#0a0a0a]',
    titleClass: 'text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-20',
    itemClass: 'flex flex-col py-8 border-b-2 border-white/10 hover:border-white/50 transition-colors',
    skillBarBg: 'bg-white/10 h-2',
    skillBarFill: 'bg-white h-2',
    expTitleClass: 'text-4xl font-bold uppercase text-white',
    expMetaClass: 'text-lg text-white/40 uppercase mt-2',
  },
  {
    id: 'layered-monolith',
    folder: 'layered-monolith',
    prefix: 'LayeredMonolith',
    containerClass: 'w-full min-h-[100vh] py-32 px-6 md:px-16 bg-[#111] text-white flex flex-col justify-center relative stack-card',
    titleClass: 'text-5xl md:text-7xl font-bold uppercase tracking-tight mb-16 relative z-10',
    itemClass: 'bg-black/40 p-8 border border-white/10 backdrop-blur-md mb-6 relative z-10 hover:bg-black/60 transition-all',
    skillBarBg: 'bg-white/20',
    skillBarFill: 'bg-white',
    expTitleClass: 'text-3xl font-bold',
    expMetaClass: 'text-sm text-white/60 tracking-widest uppercase mt-4 block',
  },
  {
    id: 'absolute-noir',
    folder: 'absolute-noir',
    prefix: 'AbsoluteNoir',
    containerClass: 'w-full py-32 px-4 md:px-12 bg-black',
    titleClass: 'text-4xl md:text-6xl font-black uppercase text-white tracking-widest mb-16 text-center',
    itemClass: 'border border-white/20 p-8 mb-8 hover:bg-white hover:text-black transition-all duration-500 group',
    skillBarBg: 'bg-white/20 group-hover:bg-black/20',
    skillBarFill: 'bg-white group-hover:bg-black',
    expTitleClass: 'text-3xl font-bold uppercase mb-2',
    expMetaClass: 'text-sm font-mono opacity-60',
  },
  {
    id: 'cinematic',
    folder: 'cinematic',
    prefix: 'Cinematic',
    containerClass: 'w-full py-32 px-6 md:px-16 bg-[#030303]',
    titleClass: 'text-5xl md:text-7xl font-serif text-white/90 mb-16 text-center italic',
    itemClass: 'flex flex-col items-center text-center mb-16',
    skillBarBg: 'bg-white/10 w-full max-w-md mt-6',
    skillBarFill: 'bg-white/80',
    expTitleClass: 'text-3xl font-serif text-white/90 mb-4',
    expMetaClass: 'text-sm text-white/40 tracking-[0.2em] uppercase',
  },
  {
    id: 'cinematic-gallery',
    folder: 'cinematic-gallery',
    prefix: 'CinematicGallery',
    containerClass: 'panel w-[100vw] h-[100vh] flex flex-col justify-center px-12 md:px-24 bg-[#0a0a0a] shrink-0 border-r border-white/10 relative',
    titleClass: 'text-6xl md:text-8xl font-black uppercase text-white/10 absolute top-12 left-12 whitespace-nowrap',
    itemClass: 'flex flex-col md:flex-row gap-8 items-center border border-white/10 p-8 bg-white/5 backdrop-blur-md mb-6 w-full max-w-4xl z-10',
    skillBarBg: 'bg-white/10 flex-1',
    skillBarFill: 'bg-white',
    expTitleClass: 'text-3xl font-bold text-white uppercase',
    expMetaClass: 'text-sm text-white/50 tracking-widest',
  },
  {
    id: 'acid-tech',
    folder: 'acid-tech',
    prefix: 'AcidTech',
    containerClass: 'w-full py-24 px-6 md:px-12 bg-black border-y border-[#00ff00]',
    titleClass: 'text-4xl md:text-5xl font-mono text-[#00ff00] mb-12 uppercase',
    itemClass: 'border border-[#00ff00]/30 p-6 mb-6 hover:bg-[#00ff00]/10 transition-colors',
    skillBarBg: 'bg-[#00ff00]/20',
    skillBarFill: 'bg-[#00ff00]',
    expTitleClass: 'text-2xl font-mono text-[#00ff00]',
    expMetaClass: 'text-xs font-mono text-[#00ff00]/60 mt-2 block',
  },
  {
    id: 'bentogrid',
    folder: 'bentogrid',
    prefix: 'BentoGrid',
    containerClass: 'w-full py-8',
    titleClass: 'text-3xl font-bold text-black mb-6 px-4',
    itemClass: 'bento-card p-6 mb-4',
    skillBarBg: 'bg-gray-200 rounded-full',
    skillBarFill: 'bg-black rounded-full',
    expTitleClass: 'text-xl font-bold text-black',
    expMetaClass: 'text-sm text-gray-500',
  },
  {
    id: 'brutalism',
    folder: 'brutalism',
    prefix: 'Brutalism',
    containerClass: 'w-full py-24 px-4 md:px-8 bg-[#ffff00] border-b-[6px] border-black',
    titleClass: 'text-5xl md:text-7xl font-black text-black uppercase mb-12 border-4 border-black p-4 inline-block bg-white shadow-[8px_8px_0_0_#000]',
    itemClass: 'border-4 border-black p-6 bg-white mb-8 shadow-[8px_8px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all',
    skillBarBg: 'bg-gray-200 border-2 border-black',
    skillBarFill: 'bg-[#ff00ff] border-r-2 border-black',
    expTitleClass: 'text-3xl font-black uppercase text-black mb-2',
    expMetaClass: 'text-sm font-bold bg-black text-white px-2 py-1 inline-block',
  },
  {
    id: 'nexus-split',
    folder: 'nexus-split',
    prefix: 'NexusSplit',
    containerClass: 'w-full py-24 md:py-32 px-8 border-b border-white/10 bg-black relative',
    titleClass: 'text-4xl md:text-5xl font-display font-bold uppercase text-white mb-16',
    itemClass: 'flex flex-col py-6 border-b border-white/10 hover:border-[var(--hl)] transition-colors group',
    skillBarBg: 'bg-white/10',
    skillBarFill: 'bg-[var(--hl)]',
    expTitleClass: 'text-2xl font-bold uppercase text-white group-hover:text-[var(--hl)] transition-colors',
    expMetaClass: 'text-xs text-white/50 tracking-widest font-sans mt-2',
  }
];

function generateSkillsBlock(theme) {
  return `"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { motion } from 'framer-motion';

export function ${theme.prefix}SkillsBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="${theme.containerClass}">
            <h2 className="${theme.titleClass}">
                <EditableText entity="appearance" field="${theme.prefix.toLowerCase()}_skills_title" value={getCustomText('${theme.prefix.toLowerCase()}_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((num) => {
                    const defaultName = num === 1 ? 'Frontend Development' : num === 2 ? 'UI/UX Design' : num === 3 ? 'Backend Systems' : 'Creative Direction';
                    const defaultProficiency = num === 1 ? '95' : num === 2 ? '90' : num === 3 ? '85' : '90';
                    const val = parseInt(getCustomText(\`${theme.prefix.toLowerCase()}_skill_prof_\${num}\`, defaultProficiency) || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    
                    return (
                        <div key={num} className="${theme.itemClass}">
                            <div className="flex justify-between items-center mb-4 ${theme.expTitleClass}">
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={\`${theme.prefix.toLowerCase()}_skill_name_\${num}\`} 
                                        value={getCustomText(\`${theme.prefix.toLowerCase()}_skill_name_\${num}\`, defaultName)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={\`${theme.prefix.toLowerCase()}_skill_prof_\${num}\`} 
                                        value={getCustomText(\`${theme.prefix.toLowerCase()}_skill_prof_\${num}\`, defaultProficiency)} 
                                        isEditor={isEditor} 
                                        maxLength={3} 
                                        as="span" 
                                    />%
                                </span>
                            </div>
                            <div className={\`w-full h-2 \${isEditor ? '' : 'overflow-hidden'} ${theme.skillBarBg}\`}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: \`\${safeVal}%\` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={\`h-full ${theme.skillBarFill}\`}
                                    style={isEditor ? { width: \`\${safeVal}%\` } : undefined}
                                ></motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
`;
}

function generateExperienceBlock(theme) {
  return `"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function ${theme.prefix}ExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="${theme.containerClass}">
            <h2 className="${theme.titleClass}">
                <EditableText entity="appearance" field="${theme.prefix.toLowerCase()}_exp_title" value={getCustomText('${theme.prefix.toLowerCase()}_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {[1, 2, 3].map((num) => {
                    const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                    const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                    const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                    
                    return (
                        <div key={num} className="${theme.itemClass}">
                            <div className="flex-1">
                                <h3 className="${theme.expTitleClass}">
                                    <EditableText 
                                        entity="appearance" 
                                        field={\`${theme.prefix.toLowerCase()}_exp_role_\${num}\`} 
                                        value={getCustomText(\`${theme.prefix.toLowerCase()}_exp_role_\${num}\`, defaultRole)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h3>
                                <div className={\`mt-2 flex flex-col md:flex-row md:items-center gap-2 ${theme.expMetaClass}\`}>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={\`${theme.prefix.toLowerCase()}_exp_company_\${num}\`} 
                                            value={getCustomText(\`${theme.prefix.toLowerCase()}_exp_company_\${num}\`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={\`${theme.prefix.toLowerCase()}_exp_duration_\${num}\`} 
                                            value={getCustomText(\`${theme.prefix.toLowerCase()}_exp_duration_\${num}\`, defaultDuration)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
`;
}

async function main() {
  for (const theme of THEMES) {
    const dir = path.join(__dirname, 'components/blocks', theme.folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const skillsPath = path.join(dir, `${theme.prefix}SkillsBlock.tsx`);
    const expPath = path.join(dir, `${theme.prefix}ExperienceBlock.tsx`);

    fs.writeFileSync(skillsPath, generateSkillsBlock(theme));
    fs.writeFileSync(expPath, generateExperienceBlock(theme));
    
    console.log(`Generated ${theme.prefix} blocks in ${theme.folder}`);
  }
}

main();
