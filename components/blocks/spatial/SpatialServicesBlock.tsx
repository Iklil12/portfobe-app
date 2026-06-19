"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function SpatialServicesBlock({ data, theme, isEditor, isCardPreview }: any) {
  const customTexts = theme?.customTexts || {};
  const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

  const services = [
    { id: '1', defaultTitle: 'UI/UX Design', defaultDesc: 'Intuitive interfaces that balance form and function, optimizing user journeys.', icon: 'fa-palette' },
    { id: '2', defaultTitle: 'Web Development', defaultDesc: 'Performant web applications built with clean code and cutting-edge frontend architecture.', icon: 'fa-code' },
    { id: '3', defaultTitle: 'Brand Strategy', defaultDesc: 'Cohesive branding systems and guidelines that elevate your message for global audiences.', icon: 'fa-layer-group' },
  ];

  const toggleVisibility = (id: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditor) return;
    window.parent.postMessage({
      type: 'INLINE_EDIT',
      entity: 'appearance',
      field: `spatial_svc_${id}_visible`,
      value: currentStatus ? 'false' : 'true'
    }, window.location.origin);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    currentTarget.style.setProperty("--mouse-x", `${x}px`);
    currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
  const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

  const auraAnim = isCardPreview
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 40, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const staggerContainer = isCardPreview
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

  const isVisible1 = customTexts[`spatial_svc_1_visible`] !== 'false';
  const isVisible2 = customTexts[`spatial_svc_2_visible`] !== 'false';
  const isVisible3 = customTexts[`spatial_svc_3_visible`] !== 'false';

  const rawHighlightColor = theme?.themeColor || '#6366f1';

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      id="services"
      className="w-full px-8 py-20 @md:py-32 max-w-[1360px] mx-auto"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.div variants={auraAnim} className={`inline-flex items-center gap-2 px-4 py-2 ${radiusClass} glass-panel mb-6`}>
          <span className="text-xs font-medium text-slate-300">
            <EditableText value={getCustomText('spatial_services_label', 'Services')} field="spatial_services_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </span>
        </motion.div>
        <motion.h2 variants={auraAnim} className="font-semibold tracking-[-0.03em] text-gradient leading-tight text-4xl @md:text-5xl">
          <EditableText value={getCustomText('spatial_services_title', 'What I bring to the table.')} field="spatial_services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
        </motion.h2>
      </div>

      {/* Bento Grid Services Layout */}
      <div className="grid grid-cols-1 @lg:grid-cols-4 gap-6 items-stretch">

        {/* Box 1: UI/UX Design (Span 2 columns) */}
        {(isVisible1 || isEditor) && (
          <motion.div
            variants={auraAnim}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className={`glass-panel ${cardRadiusClass} p-8 @md:p-10 border border-white/5 hover:border-white/15 transition-all duration-500 group relative overflow-hidden min-h-[240px] @lg:col-span-2 ${!isVisible1 ? 'opacity-40 bg-zinc-950/20' : ''
              }`}
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${rawHighlightColor}12, transparent 75%)` } as React.CSSProperties}
            />
            {/* Tech Corners */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/20"></div>
            <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/20"></div>

            {/* Glowing wireframe ring decoration */}
            <div className="absolute right-[-20px] top-[-20px] w-40 h-40 border border-white/5 rounded-full flex items-center justify-center pointer-events-none group-hover:border-[var(--hl, #6366f1)]/20 transition-colors duration-700">
              <div className="w-32 h-32 border border-dashed border-white/5 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="w-20 h-20 border border-white/5 rounded-full"></div>
              </div>
            </div>

            {isEditor && (
              <button onClick={(e) => toggleVisibility('1', isVisible1, e)} className="absolute top-4 right-4 z-30 px-2.5 py-1 text-[9px] font-mono border rounded-md border-white/10 text-white/50 hover:bg-white/10 hover:text-white">
                {isVisible1 ? "✕ Hide" : "➕ Show"}
              </button>
            )}

            <div className="relative z-10">
              <span className="text-[9px] font-mono text-slate-500 tracking-wider block mb-2">MODULE_01 // CREATIVE</span>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-3">
                <EditableText value={customTexts[`spatial_svc_1_title`] || services[0].defaultTitle} field="spatial_svc_1_title" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                <EditableText value={customTexts[`spatial_svc_1_desc`] || services[0].defaultDesc} field="spatial_svc_1_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={120} />
              </p>
            </div>
          </motion.div>
        )}

        {/* Box 2: Web Development (Span 2 columns) */}
        {(isVisible2 || isEditor) && (
          <motion.div
            variants={auraAnim}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className={`glass-panel ${cardRadiusClass} p-8 @md:p-10 border border-white/5 hover:border-white/15 transition-all duration-500 group relative overflow-hidden min-h-[240px] @lg:col-span-2 ${!isVisible2 ? 'opacity-40 bg-zinc-950/20' : ''
              }`}
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${rawHighlightColor}12, transparent 75%)` } as React.CSSProperties}
            />
            {/* Tech Corners */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/20"></div>
            <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/20"></div>

            {/* Simulated code matrix decoration */}
            <div className="absolute right-4 top-4 font-mono text-[8px] text-white/[0.02] group-hover:text-white/[0.04] transition-colors duration-500 select-none hidden @sm:block text-right pointer-events-none leading-normal">
              <div>{'const dev = {'}</div>
              <div>{'  engine: "Next.js",'}</div>
              <div>{'  styling: "Tailwind",'}</div>
              <div>{'  compiler: "SWC",'}</div>
              <div>{'  optimize: true'}</div>
              <div>{'};'}</div>
            </div>

            {isEditor && (
              <button onClick={(e) => toggleVisibility('2', isVisible2, e)} className="absolute top-4 right-4 z-30 px-2.5 py-1 text-[9px] font-mono border rounded-md border-white/10 text-white/50 hover:bg-white/10 hover:text-white">
                {isVisible2 ? "✕ Hide" : "➕ Show"}
              </button>
            )}

            <div className="relative z-10">
              <span className="text-[9px] font-mono text-slate-500 tracking-wider block mb-2">MODULE_02 // SYSTEM</span>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-3">
                <EditableText value={customTexts[`spatial_svc_2_title`] || services[1].defaultTitle} field="spatial_svc_2_title" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                <EditableText value={customTexts[`spatial_svc_2_desc`] || services[1].defaultDesc} field="spatial_svc_2_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={120} />
              </p>
            </div>
          </motion.div>
        )}

        {/* Box 3: Brand Strategy (Span 3 columns) */}
        {(isVisible3 || isEditor) && (
          <motion.div
            variants={auraAnim}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className={`glass-panel ${cardRadiusClass} p-8 @md:p-10 border border-white/5 hover:border-white/15 transition-all duration-500 group relative overflow-hidden flex flex-col @md:flex-row gap-8 justify-between items-start @md:items-center min-h-[220px] @lg:col-span-3 ${!isVisible3 ? 'opacity-40 bg-zinc-950/20' : ''
              }`}
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${rawHighlightColor}12, transparent 75%)` } as React.CSSProperties}
            />
            {/* Tech Corners */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/20"></div>
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-white/20"></div>

            {isEditor && (
              <button onClick={(e) => toggleVisibility('3', isVisible3, e)} className="absolute top-4 right-4 z-30 px-2.5 py-1 text-[9px] font-mono border rounded-md border-white/10 text-white/50 hover:bg-white/10 hover:text-white">
                {isVisible3 ? "✕ Hide" : "➕ Show"}
              </button>
            )}

            <div className="relative z-10 flex-1">
              <span className="text-[9px] font-mono text-slate-500 tracking-wider block mb-1">MODULE_03 // BRANDING</span>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-3">
                <EditableText value={customTexts[`spatial_svc_3_title`] || services[2].defaultTitle} field="spatial_svc_3_title" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                <EditableText value={customTexts[`spatial_svc_3_desc`] || services[2].defaultDesc} field="spatial_svc_3_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={120} />
              </p>
            </div>
          </motion.div>
        )}

        {/* Box 4: Interactive Status Monitor (Span 1 column) */}
        <motion.div
          variants={auraAnim}
          className={`glass-panel ${cardRadiusClass} p-8 border border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden flex flex-col justify-between items-center text-center min-h-[220px] @lg:col-span-1`}
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Tech Corners */}
          <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/20"></div>
          <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-white/20"></div>

          {/* Sonar Pulse Radar */}
          <div className="relative w-16 h-16 flex items-center justify-center mt-4">
            <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-[var(--hl, #6366f1)] opacity-20"></span>
            <span className="animate-[ping_3s_infinite] absolute inline-flex h-16 w-16 rounded-full bg-[var(--hl, #6366f1)] opacity-10"></span>
            <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-black shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            </div>
          </div>

          <div className="relative z-10 mt-4">
            <span className="text-[10px] font-mono text-slate-300 block uppercase tracking-widest font-semibold mb-1">
              STATUS: ACTIVE
            </span>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">
              OPERATIONAL // AVAILABILITY
            </span>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
