"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function SpatialStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const projectCount = (data?.projects || data?.user?.projects || []).length;
  const awardCount = (data?.certificates || data?.user?.certificates || []).length;

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
  const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

  const auraAnim = isCardPreview
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const staggerContainer = isCardPreview
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

  const stats = [
    { 
      label: theme?.customTexts?.spatial_stats_label1 || 'Projects', 
      value: projectCount, 
      suffix: theme?.customTexts?.spatial_stats_suffix1 || 'Total',
      code: 'DB_RECORD_COUNT',
      calcMax: 20
    },
    { 
      label: theme?.customTexts?.spatial_stats_label2 || 'Recognition', 
      value: awardCount, 
      suffix: theme?.customTexts?.spatial_stats_suffix2 || 'Awards',
      code: 'VERIFIED_ACCREDITATIONS',
      calcMax: 10
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    currentTarget.style.setProperty("--mouse-x", `${x}px`);
    currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const rawHighlightColor = theme?.themeColor || '#6366f1';

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      className="w-full px-8 py-16 max-w-[1360px] mx-auto"
    >
      <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
        {stats.map((stat, i) => {
          // Calculate dash offset for circle ring
          const maxValue = stat.calcMax;
          const displayPercentage = stat.value > 0 ? Math.min((stat.value / maxValue) * 100, 100) : 35;
          const strokeDashoffset = 251.2 - (251.2 * displayPercentage) / 100;

          return (
            <motion.div
              key={i}
              variants={auraAnim}
              onMouseMove={handleMouseMove}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className={`glass-panel ${cardRadiusClass} p-8 @md:p-10 border border-white/5 hover:border-white/15 transition-all duration-500 group relative overflow-hidden flex flex-col @sm:flex-row items-center gap-8`}
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                backgroundPosition: 'center'
              }}
            >
              {/* Mouse Spotlight Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${rawHighlightColor}12, transparent 75%)` } as React.CSSProperties}
              />

              {/* Tech Corners */}
              <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/20"></div>
              <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/20"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-white/20"></div>
              <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-white/20"></div>

              {/* Top Laser Accent */}
              <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[var(--hl, #6366f1)]/40 to-transparent"></div>

              {/* Left Side: Glowing SVG Radial Gauge Circle */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track Circle */}
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="5" fill="transparent" />
                  {/* Foreground Animated Gauge Circle */}
                  <motion.circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="var(--hl, #6366f1)" 
                    strokeWidth="5" 
                    fill="transparent" 
                    strokeDasharray="251.2"
                    variants={{
                      hidden: { strokeDashoffset: 251.2 },
                      visible: { strokeDashoffset, transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 5px var(--hl, #6366f1))' }}
                  />
                </svg>
                {/* Large center stat value display */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white font-mono tracking-tighter">
                    {stat.value}
                  </span>
                  <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
                    METRIC
                  </span>
                </div>
              </div>

              {/* Right Side: Stat Information Content */}
              <div className="flex-1 text-center @sm:text-left">
                {/* Technical System Code Tag */}
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-2 select-none">
                  SYS_QUERY // {stat.code}
                </span>

                {/* Stat Label */}
                <h3 className="text-lg font-mono text-slate-400 uppercase tracking-wider font-semibold mb-2">
                  <EditableText value={stat.label} field={`spatial_stats_label${i + 1}`} entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                </h3>

                {/* Suffix / Explanation Tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-xs font-mono text-[var(--hl, #6366f1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--hl, #6366f1)] animate-pulse"></span>
                  <EditableText value={stat.suffix} field={`spatial_stats_suffix${i + 1}`} entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
