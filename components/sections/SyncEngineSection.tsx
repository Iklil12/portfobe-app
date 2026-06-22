"use client";

import React, { useRef, useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useInView } from 'framer-motion';

const Abstract3DShowcase = dynamic(() => import('../ui/Abstract3DShowcase').then(mod => mod.Abstract3DShowcase), { ssr: false });
const ThemeHoverShowcase = dynamic(() => import('../ui/ThemeHoverShowcase').then(mod => mod.ThemeHoverShowcase), { ssr: false });
import './sync-engine-integrations.css';

// ============================================================================
// ARTISTIC CONCEPT: THE INFINITE DATA SEA (PURE ABSTRACT EXHIBITION)
// Epic Cinematic Entrance Animations added for a breathtaking first impression.
// ============================================================================

interface Pillar {
  id: string;
  name: string;
  type: string;
  payloadStr: string;
  renderComponent: (instanceId?: string, isActive?: boolean) => React.ReactNode;
}

export function AnalyticsDashboard({ instanceId }: { instanceId?: string }) {
  const [liveVisitors, setLiveVisitors] = useState(1482);
  const [sessionsCount, setSessionsCount] = useState(1284592);
  const [visitorsCount, setVisitorsCount] = useState(384215);
  const [logs, setLogs] = useState([
    { id: 1, time: "12:45:10", type: "VIEW", msg: "Visited / (Desktop // Chrome)", latency: "14ms" },
    { id: 2, time: "12:45:18", type: "REFER", msg: "Referral from LinkedIn", latency: "2ms" },
    { id: 3, time: "12:45:25", type: "CLICK", msg: "Clicked link (GitHub)", latency: "10ms" },
    { id: 4, time: "12:45:32", type: "PROJECT", msg: "Opened project (Abstract-3D-Showcase)", latency: "28ms" },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "200px" });

  // Single merged interval for all live updates (was 2 separate intervals)
  useEffect(() => {
    if (!isInView) return;
    const logTemplates = [
      { type: "VIEW", msg: "Visited /projects (Mobile // Safari)", latency: "18ms" },
      { type: "REFER", msg: "Referral from Instagram", latency: "3ms" },
      { type: "CLICK", msg: "Clicked link (LinkedIn)", latency: "8ms" },
      { type: "PROJECT", msg: "Opened project (Canva-Integration)", latency: "42ms" },
      { type: "CLICK", msg: "Clicked CTA (Get Started)", latency: "12ms" },
      { type: "VIEW", msg: "Visited /pricing (Desktop // Firefox)", latency: "15ms" },
      { type: "REFER", msg: "Referral from Google Search", latency: "2ms" },
      { type: "PROJECT", msg: "Opened project (Theme-Morphic-Hover)", latency: "35ms" }
    ];

    const interval = setInterval(() => {
      // Update metrics
      setLiveVisitors(prev => {
        const diff = Math.floor(Math.random() * 7) - 3;
        return Math.max(1400, Math.min(1600, prev + diff));
      });
      setSessionsCount(prev => prev + Math.floor(Math.random() * 4));
      setVisitorsCount(prev => prev + Math.floor(Math.random() * 2));

      // Update log stream
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLogs(prev => [...prev.slice(1), { id: Date.now(), time: timeStr, ...template }]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isInView]);

  const formatSessions = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div ref={containerRef} className="relative p-4 sm:p-6 rounded-none w-full overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.85)] text-left font-sans group">
      {/* Subtle radial spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-b from-[#ff9e00]/5 to-transparent blur-2xl pointer-events-none"></div>

      {/* Grid Overlay with radial fade out */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)] opacity-80 pointer-events-none"></div>

      {/* Borderless Chart Area */}
      <div className="relative z-10 h-32 sm:h-40 w-full mb-4 sm:mb-6 bg-black/40 border border-white/10 rounded-none overflow-hidden p-2">
        {/* Clean Live Badge */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-black border border-[#ff9e00]/30 backdrop-blur-md px-3 py-1 rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9e00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff9e00]"></span>
          </span>
          <span className="text-[10px] font-mono text-[#ff9e00] font-bold uppercase tracking-wider">
            {liveVisitors} Live
          </span>
        </div>

        {/* Fine dashed grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
          <div className="w-full h-[1px] border-b border-white"></div>
          <div className="w-full h-[1px] border-b border-white"></div>
          <div className="w-full h-[1px] border-b border-white"></div>
        </div>

        <svg viewBox="0 0 100 35" className="absolute bottom-0 inset-x-0 w-full h-[120%] overflow-visible" preserveAspectRatio="none">
          {/* Static guide path */}
          <path
            d="M0,32 C10,22 18,34 30,24 C42,14 48,10 60,22 C72,34 80,12 90,26 C95,31.6 98,18 100,10"
            fill="none"
            stroke="white"
            strokeWidth="1.0"
            strokeOpacity="0.03"
          />

          {/* Main flow gradient path with drawing loop */}
          <motion.path
            d="M0,32 C10,22 18,34 30,24 C42,14 48,10 60,22 C72,34 80,12 90,26 C95,31.6 98,18 100,10"
            fill="none"
            stroke={`url(#em-gradient-${instanceId})`}
            strokeWidth="1.0"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0, 0],
              pathOffset: [0, 0, 0, 1, 1]
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
              times: [0, 0.45, 0.55, 0.95, 1]
            }}
          />
          <motion.path
            d="M0,32 C10,22 18,34 30,24 C42,14 48,10 60,22 C72,34 80,12 90,26 C95,31.6 98,18 100,10 L100,35 L0,35 Z"
            fill={`url(#em-fade-${instanceId})`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0, 0]
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
              times: [0, 0.45, 0.55, 0.95, 1]
            }}
          />
          <defs>
            <linearGradient id={`em-gradient-${instanceId}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff9e00" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ff5e00" />
            </linearGradient>
            <linearGradient id={`em-fade-${instanceId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9e00" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ff9e00" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Polished Tooltip Dot with synchronized loop */}
        <motion.div
          className="absolute top-1/2 left-[58%] -translate-y-1/2 flex items-center gap-1.5 z-20"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0, 1, 1, 0, 0]
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            times: [0, 0.25, 0.35, 0.75, 0.85, 1]
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9e00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff9e00]"></span>
          </span>
          <span className="bg-black border border-white/10 text-white font-mono text-[8px] font-bold px-2 py-0.5 rounded-none shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            Peak: {(liveVisitors * 1.4).toFixed(0)} r/s
          </span>
        </motion.div>
      </div>

      {/* Metrics Row with thin divider */}
      <div className="relative z-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-4 sm:pt-6 mb-4 sm:mb-6">
        {/* Metric 1 */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-0.5 sm:mb-1">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Total Views</span>
            <span className="text-[#ff9e00] bg-[#ff9e00]/10 border border-[#ff9e00]/20 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none">
              +14.8%
            </span>
          </div>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-white font-sans">{formatSessions(sessionsCount)}</span>
          </div>
          <span className="text-[8px] font-mono text-neutral-600 mt-1 sm:mt-1.5">Rolling 7 days</span>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col border-l border-white/10 pl-6">
          <div className="flex justify-between items-center mb-0.5 sm:mb-1">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Unique Visitors</span>
            <span className="text-neutral-400 bg-white/5 border border-white/10 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none">
              Est. IP
            </span>
          </div>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-white font-sans">{formatSessions(visitorsCount)}</span>
          </div>
          <span className="text-[8px] font-mono text-neutral-600 mt-1 sm:mt-1.5">Based on IP & UA</span>
        </div>
      </div>

      {/* Activity Log List */}
      <div className="relative z-10 flex flex-col gap-1.5 sm:gap-2.5">
        <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500 pb-2 border-b border-white/10">
          <span className="uppercase tracking-widest">Live Activity stream</span>
          <span className="animate-pulse flex items-center gap-1 text-[#ff9e00]">
            <span className="w-1 h-1 bg-[#ff9e00] rounded-full inline-block"></span>
            Streaming
          </span>
        </div>

        <div className="flex flex-col gap-2 pt-1.5 h-14 sm:h-20 overflow-hidden relative">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex justify-between items-center text-[9px] sm:text-[10px] transition-all"
              >
                <div className="flex gap-2.5 items-center min-w-0">
                  <span className="text-neutral-600 font-mono text-[9px] shrink-0">[{log.time}]</span>
                  <span className={`w-1 h-1 rounded-full shrink-0 ${log.type === 'CLICK' ? 'bg-[#ff9e00]' :
                    log.type === 'VIEW' ? 'bg-white' :
                      log.type === 'REFER' ? 'bg-neutral-400' :
                        'bg-neutral-600'
                    }`}></span>
                  <span className="text-neutral-300 font-mono truncate max-w-[150px] sm:max-w-[220px]">
                    {log.msg}
                  </span>
                </div>
                <span className="text-neutral-500 font-mono text-[9px]">{log.latency}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MEMOIZED SVG PATTERNS — Prevents recreation on every parent render
// ============================================================================
const GitHubPattern = memo(function GitHubPattern() {
  return (
    <svg className="absolute -bottom-2 -right-2 w-24 h-24 sm:w-32 sm:h-32 opacity-40 pointer-events-none" viewBox="0 0 100 100">
      {/* Contribution Grid */}
      <g>
        <rect x="52" y="15" width="4.5" height="4.5" rx="1" className="gh-empty" />
        <rect x="52" y="21" width="4.5" height="4.5" rx="1" className="gh-l1 gh-d1" />
        <rect x="52" y="27" width="4.5" height="4.5" rx="1" className="gh-empty" />
        <rect x="52" y="33" width="4.5" height="4.5" rx="1" className="gh-l2 gh-d2" />
        <rect x="58" y="15" width="4.5" height="4.5" rx="1" className="gh-l3 gh-d3" />
        <rect x="58" y="21" width="4.5" height="4.5" rx="1" className="gh-empty" />
        <rect x="58" y="27" width="4.5" height="4.5" rx="1" className="gh-l1 gh-d4" />
        <rect x="58" y="33" width="4.5" height="4.5" rx="1" className="gh-l4 gh-d1" />
        <rect x="64" y="15" width="4.5" height="4.5" rx="1" className="gh-empty" />
        <rect x="64" y="21" width="4.5" height="4.5" rx="1" className="gh-l2 gh-d2" />
        <rect x="64" y="27" width="4.5" height="4.5" rx="1" className="gh-l3 gh-d3" />
        <rect x="64" y="33" width="4.5" height="4.5" rx="1" className="gh-empty" />
        <rect x="70" y="15" width="4.5" height="4.5" rx="1" className="gh-l1 gh-d4" />
        <rect x="70" y="21" width="4.5" height="4.5" rx="1" className="gh-l4 gh-d1" />
        <rect x="70" y="27" width="4.5" height="4.5" rx="1" className="gh-empty" />
        <rect x="70" y="33" width="4.5" height="4.5" rx="1" className="gh-l2 gh-d2" />
        <rect x="76" y="15" width="4.5" height="4.5" rx="1" className="gh-l2 gh-d3" />
        <rect x="76" y="21" width="4.5" height="4.5" rx="1" className="gh-l1 gh-d4" />
        <rect x="76" y="27" width="4.5" height="4.5" rx="1" className="gh-l3 gh-d1" />
        <rect x="76" y="33" width="4.5" height="4.5" rx="1" className="gh-empty" />
        <rect x="82" y="15" width="4.5" height="4.5" rx="1" className="gh-empty" />
        <rect x="82" y="21" width="4.5" height="4.5" rx="1" className="gh-l3 gh-d2" />
        <rect x="82" y="27" width="4.5" height="4.5" rx="1" className="gh-l4 gh-d3" />
        <rect x="82" y="33" width="4.5" height="4.5" rx="1" className="gh-l1 gh-d4" />
        <rect x="88" y="15" width="4.5" height="4.5" rx="1" className="gh-l4 gh-d1" />
        <rect x="88" y="21" width="4.5" height="4.5" rx="1" className="gh-empty" />
        <rect x="88" y="27" width="4.5" height="4.5" rx="1" className="gh-l2 gh-d2" />
        <rect x="88" y="33" width="4.5" height="4.5" rx="1" className="gh-empty" />
      </g>
      {/* Git branch graph */}
      <g>
        <path d="M 10 75 L 90 75" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" fill="none" />
        <path d="M 25 75 C 35 55, 60 55, 70 75" stroke="#58a6ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" fill="none" />
        <circle cx="25" cy="75" r="2" fill="#ffffff" opacity="0.4" />
        <circle cx="70" cy="75" r="2" fill="#ffffff" opacity="0.4" />
        <circle cx="70" cy="75" r="5" fill="none" stroke="#58a6ff" strokeWidth="1" className="github-ripple" />
        <circle r="3" fill="#58a6ff" className="github-commit-dot" style={{ offsetPath: "path('M 25 75 C 35 55, 60 55, 70 75')" }} />
      </g>
    </svg>
  );
});

const PenpotPattern = memo(function PenpotPattern() {
  return (
    <svg className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-28 sm:h-28 opacity-40 pointer-events-none" viewBox="0 0 100 100">
      <path d="M0 100 Q 25 50 50 75 T 100 25" stroke="#10b981" strokeWidth="3" fill="none" className="penpot-path" />
      <path d="M0 120 Q 25 70 50 95 T 100 45" stroke="#10b981" strokeWidth="3" fill="none" className="penpot-path" />
      <path d="M0 140 Q 25 90 50 115 T 100 65" stroke="#10b981" strokeWidth="3" fill="none" className="penpot-path" />
    </svg>
  );
});

const CanvaPattern = memo(function CanvaPattern() {
  return (
    <svg className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 opacity-50 pointer-events-none" viewBox="0 0 100 100">
      <defs>
        <pattern id="canva-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="#0ea5e9" opacity="0.25" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#canva-grid)" />
      <rect x="10" y="10" width="80" height="80" rx="6" fill="none" stroke="rgba(14, 165, 233, 0.15)" strokeWidth="1" />
      <line x1="50" y1="0" x2="50" y2="100" stroke="#0ea5e9" strokeWidth="1" className="canva-snap-line canva-snap-x" />
      <line x1="0" y1="40" x2="100" y2="40" stroke="#0ea5e9" strokeWidth="1" className="canva-snap-line canva-snap-y" />
      <rect x="18" y="18" width="64" height="64" rx="4" fill="rgba(14, 165, 233, 0.03)" stroke="none" />
      <g className="canva-selected-layer">
        <rect x="25" y="25" width="50" height="30" rx="3" fill="rgba(14, 165, 233, 0.08)" stroke="#0ea5e9" strokeWidth="1.2" />
        <circle cx="50" cy="40" r="8" fill="#0ea5e9" opacity="0.35" />
        <rect x="23" y="23" width="54" height="34" rx="4" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="21" y="21" width="4" height="4" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
        <rect x="75" y="21" width="4" height="4" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
        <rect x="21" y="55" width="4" height="4" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
        <rect x="75" y="55" width="4" height="4" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
      </g>
      <rect x="25" y="68" width="35" height="3" rx="1.5" fill="rgba(14, 165, 233, 0.25)" />
      <rect x="25" y="75" width="50" height="3" rx="1.5" fill="rgba(14, 165, 233, 0.15)" />
      <g className="canva-cursor-group">
        <path d="M77 57 L85 65 L81 66 L86 71 L84 72 L79 67 L78 71 Z" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
        <circle cx="77" cy="57" r="2" fill="#0ea5e9" />
      </g>
    </svg>
  );
});

const AIPattern = memo(function AIPattern() {
  return (
    <svg className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 opacity-45 pointer-events-none" viewBox="0 0 100 100">
      <line x1="50" y1="50" x2="80" y2="20" stroke="#9333ea" className="ai-line ai-line-1" />
      <line x1="50" y1="50" x2="20" y2="80" stroke="#9333ea" className="ai-line ai-line-2" />
      <line x1="50" y1="50" x2="20" y2="20" stroke="#9333ea" className="ai-line ai-line-3" />
      <line x1="50" y1="50" x2="80" y2="80" stroke="#9333ea" className="ai-line ai-line-4" />
      <circle cx="50" cy="50" r="6" fill="#9333ea" stroke="#ffffff" strokeWidth="1" className="ai-node ai-node-center" />
      <circle cx="80" cy="20" r="4" fill="#9333ea" stroke="#ffffff" strokeWidth="1" className="ai-node ai-node-1" />
      <circle cx="20" cy="80" r="5" fill="#9333ea" stroke="#ffffff" strokeWidth="1" className="ai-node ai-node-2" />
      <circle cx="20" cy="20" r="4" fill="#9333ea" stroke="#ffffff" strokeWidth="1" className="ai-node ai-node-3" />
      <circle cx="80" cy="80" r="5" fill="#9333ea" stroke="#ffffff" strokeWidth="1" className="ai-node ai-node-4" />
    </svg>
  );
});

const PILLARS: Pillar[] = [
  {
    id: 'integrations',
    name: 'Integrations',
    type: 'External Data Sync',
    payloadStr: "{\n  \"action\": \"SYNC_ALL\",\n  \"targets\": [\"GitHub\", \"Penpot\", \"Canva\", \"AI Core\"]\n}",
    renderComponent: (instanceId, isActive) => (
      <div className="w-full h-[400px] lg:h-[450px] flex flex-col gap-4 sm:gap-6">

        {/* 2x2 Grid Layout with responsive gaps */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 flex-1">
          {[
            {
              id: 'github',
              icon: 'fab fa-github',
              iconBg: 'bg-neutral-800', // GitHub dark
              date: '28 Nov 2024',
              label: 'Code Repositories',
              title: 'GitHub',
              subtitle: 'Commits & PRs sync',
              location: 'Pipeline Active',
              pattern: <GitHubPattern />
            },
            {
              id: 'penpot',
              icon: 'fas fa-pen-nib',
              iconBg: 'bg-neutral-800',
              date: '12 Oct 2024',
              label: 'UI/UX Design',
              title: 'Penpot',
              subtitle: 'Design assets sync',
              location: 'Pipeline Active',
              pattern: <PenpotPattern />
            },
            {
              id: 'canva',
              icon: 'fas fa-layer-group',
              iconBg: 'bg-neutral-800',
              date: '30 Dec 2024',
              label: 'Presentations',
              title: 'Canva',
              subtitle: 'Slides & graphics sync',
              location: 'Pipeline Active',
              pattern: <CanvaPattern />
            },
            {
              id: 'ai',
              icon: 'fas fa-robot',
              iconBg: 'bg-neutral-800',
              date: '13 Aug 2024',
              label: 'Artificial Intelligence',
              title: 'AI Integration',
              subtitle: 'Automated content',
              location: 'Core Neural Active',
              pattern: <AIPattern />
            }
          ].map((item) => (
            <div key={item.id} className="bg-[#0a0a0a] rounded-none p-3 sm:p-4 relative overflow-hidden flex flex-col justify-between group hover:bg-[#111111] transition-colors border border-white/10">

              {/* Top Row: Logo */}
              <div className="flex justify-between items-start relative z-10">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-none ${item.iconBg} flex items-center justify-center border border-white/10 shadow-lg`}>
                  <i className={`${item.icon} text-white text-[10px] sm:text-sm`}></i>
                </div>
              </div>

              {/* Middle Row: Text Content */}
              <div className="mt-2.5 sm:mt-4 mb-1 sm:mb-2 relative z-10">
                <p className="text-white/50 text-[8px] sm:text-[10px] uppercase tracking-wider mb-0.5 sm:mb-1">{item.label}</p>
                <h4 className="text-white text-xs sm:text-sm font-bold tracking-tight leading-tight">{item.title}</h4>
                <p className="text-white/70 text-[9px] sm:text-xs mt-0.5 sm:mt-1 font-mono">{item.subtitle}</p>
              </div>

              {/* Bottom Row: Location */}
              <div className="relative z-10 mt-auto pt-1 sm:pt-2">
                <span className="text-white/40 text-[8px] sm:text-[9px] uppercase tracking-wider">{item.location}</span>
              </div>

              {/* Background Pattern */}
              {item.pattern}
            </div>
          ))}
        </div>

      </div>
    )
  },
  {
    id: '3d-showcase',
    name: '3D Showcase',
    type: 'Immersive WebGL',
    payloadStr: "{\n  \"renderer\": \"Bunny.net Edge\",\n  \"model\": \"architecture_v2.glb\",\n  \"polygons\": 142050,\n  \"materials\": \"PBR_Active\"\n}",
    renderComponent: (instanceId, isActive) => (
      <div className="w-full transition-all">
        <div className="w-full aspect-square rounded-none bg-gradient-to-tr from-neutral-950 to-neutral-900 border border-white/10 relative overflow-hidden group">

          <Abstract3DShowcase isActive={isActive} />

          <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/50 tracking-widest pointer-events-none">
            [ WEBGL ACCELERATED ]
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'themes',
    name: 'Theme Engine',
    type: 'Architectural Layouts',
    payloadStr: "{\n  \"activeId\": \"morphic_hover\",\n  \"cssVariables\": {\n    \"--bg\": \"#000000\",\n    \"--text\": \"#ffffff\",\n    \"--radius\": \"0px\"\n  }\n}",
    renderComponent: (instanceId, isActive) => (
      <div className="w-full h-[380px] md:h-[450px]">
        <ThemeHoverShowcase />
      </div>
    )
  },
  {
    id: 'analytics',
    name: 'Analytics',
    type: 'Visitor Intelligence',
    payloadStr: "{\n  \"event\": \"SESSION_START\",\n  \"visitorId\": \"v_9f82x\",\n  \"device\": \"Desktop\",\n  \"country\": \"ID\",\n  \"duration\": 245\n}",
    renderComponent: (instanceId, isActive) => (
      <AnalyticsDashboard instanceId={instanceId} />
    )
  }
];

// Apple-style cinematic easing curve
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ============================================================================
// LAZY MOBILE PILLAR — Only render heavy components when scrolled into view
// Uses IntersectionObserver with rootMargin for preloading.
// Once mounted, stays mounted to preserve state (no re-init cost).
// ============================================================================
function LazyMobilePillar({ children, height = '400px' }: { children: React.ReactNode; height?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect(); // Once visible, stop observing — component stays mounted
        }
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: hasEnteredView ? undefined : height }}>
      {hasEnteredView ? (
        children
      ) : (
        <div className="w-full flex items-center justify-center" style={{ height }}>
          <div className="flex flex-col items-center gap-3 opacity-30">
            <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
            <div className="w-24 h-1.5 rounded-full bg-white/5 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}

export function SyncEngineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalSections = PILLARS.length;
    let newIndex = Math.floor(latest * totalSections);
    if (newIndex >= totalSections) newIndex = totalSections - 1;
    if (newIndex < 0) newIndex = 0;

    // Use functional state update to completely avoid stale closure issues
    // React will bail out of the render if it returns the exact same value.
    setActiveIndex(prev => prev === newIndex ? prev : newIndex);
  });

  const activePillar = PILLARS[activeIndex];

  return (
    <div className="bg-[#050505]">
      {/* MOBILE LAYOUT (lg:hidden) */}
      <div className="lg:hidden w-full bg-[#050505] py-20 px-6 flex flex-col gap-16 relative z-20">
        <div className="flex flex-col gap-2">
          <span className="text-[#ff9e00] font-mono text-[10px] tracking-[0.4em] uppercase block border-l-2 border-[#ff9e00] pl-4">
            [ PLATFORM PILLARS ]
          </span>
          <h2 className="text-white text-3xl font-black tracking-tight mt-2 uppercase">
            Core Architecture
          </h2>
        </div>

        <div className="flex flex-col gap-14">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="flex flex-col gap-5 border-t border-white/5 pt-8 first:border-t-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[9px] tracking-widest uppercase text-neutral-500">
                    {pillar.type}
                  </span>
                  <h3 className="text-white text-2xl font-bold uppercase tracking-tight mt-1">
                    {pillar.name}
                  </h3>
                </div>


              </div>

              {/* Render visual component — lazy loaded on mobile */}
              <div className="w-full relative z-10">
                <LazyMobilePillar height={pillar.id === '3d-showcase' ? '450px' : '400px'}>
                  {pillar.renderComponent('mobile')}
                </LazyMobilePillar>
              </div>


            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP LAYOUT (hidden lg:block) */}
      <section ref={containerRef} className="relative w-full h-[320vh] bg-[#050505] font-sans hidden lg:block">

        <div
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
        >

          {/* Abstract Orbs (Epic Bloom Entrance) */}
          <div
            className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#ff9e00]/[0.02] rounded-full blur-[100px] pointer-events-none z-0 transform-gpu"
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] bg-[#ff9e00]/[0.01] rounded-full blur-[100px] pointer-events-none z-0 transform-gpu"
          ></div>

          {/* LAYER 1: RAW CODE WATERMARK (Matrix Fade In) */}
          <div
            className="absolute top-1/2 right-[10%] -translate-y-1/2 pointer-events-none z-0 select-none opacity-[0.03] w-[50vw] h-[30vh] overflow-hidden"
            translate="no"
          >
            {PILLARS.map((pillar, idx) => {
              const isActive = activeIndex === idx;
              return (
                <motion.pre
                  key={pillar.id}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : (activeIndex > idx ? -20 : 20),
                    visibility: isActive ? 'visible' : 'hidden'
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  style={{ willChange: "transform, opacity" }}
                  className="text-[4vw] font-mono text-[#ff9e00] font-bold leading-none tracking-tighter absolute inset-0 flex items-center justify-end text-right"
                >
                  {pillar.payloadStr}
                </motion.pre>
              );
            })}
          </div>

          {/* LAYER 2: VERTICAL LABEL (Slide in) */}
          <div
            className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center pointer-events-none z-30"
          >
            <span className="font-mono text-[8px] text-neutral-600 tracking-[0.5em] uppercase whitespace-nowrap">
              PORTFOBE CORE ENGINE // V2.0
            </span>
          </div>

          <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 h-full py-20">

            {/* ABSOLUTE HEADER TO PREVENT JIGGLE */}
            <div
              className="absolute top-12 md:top-24 left-6 md:left-12 z-30 hidden md:block"
            >
              <span className="text-[#ff9e00] font-mono text-[10px] tracking-[0.4em] uppercase block border-l-2 border-[#ff9e00] pl-4">
                [ PLATFORM PILLARS ]
              </span>
            </div>

            {/* ABSOLUTE FOOTER TO PREVENT JIGGLE */}
            <div
              className="absolute bottom-12 md:bottom-24 left-6 md:left-12 z-30 hidden md:flex items-center gap-3 text-neutral-600 font-mono text-[9px] tracking-widest uppercase animate-pulse"
            >
              <i className="fas fa-arrow-down"></i> KEEP SCROLLING
            </div>

            {/* LAYER 3: MASSIVE HOLLOW TYPOGRAPHY MENU WITH SCROLL TRACKER */}
            <div className="w-full lg:w-3/5 flex flex-col justify-center gap-2 relative z-20 mt-8 md:mt-0">
              {/* Mobile-only header (flow-based) */}
              <div className="md:hidden mb-6">
                <span className="text-[#ff9e00] font-mono text-[10px] tracking-[0.4em] uppercase block border-l-2 border-[#ff9e00] pl-4">
                  [ PLATFORM PILLARS ]
                </span>
              </div>

              <div className="flex gap-6 md:gap-8 items-stretch relative">
                {/* Scroll Timeline Tracker (Desktop Only) */}
                <div className="hidden md:flex flex-col items-center relative w-1 select-none">
                  {/* Background Track Line */}
                  <div className="absolute top-2 bottom-2 w-[2px] bg-white/10 rounded-full" />

                  {/* Active Progress Fill Line */}
                  <motion.div
                    className="absolute top-2 w-[2px] bg-gradient-to-b from-[#ff9e00] to-amber-500 rounded-full origin-top"
                    style={{ scaleY: scrollYProgress, originY: 0, height: 'calc(100% - 16px)' }}
                  />

                  {/* Floating Glowing Indicator Dot */}
                  <div
                    className="absolute w-3.5 h-3.5 rounded-full bg-[#ff9e00] border-2 border-neutral-950 shadow-[0_0_12px_rgba(255,158,0,0.6)] -left-[5px] -translate-y-1/2 transition-all duration-300 ease-out"
                    style={{
                      top: `calc(${activeIndex * (100 / (PILLARS.length - 1))}% + ${8 - activeIndex * 5.33}px)`,
                    }}
                  />
                </div>

                {/* Typography Menu */}
                <div className="flex flex-col gap-1 md:gap-3 flex-1">
                  {PILLARS.map((pillar, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <div key={pillar.id}>
                        <div
                          className={`flex flex-col justify-center relative origin-left transition-all duration-300 ease-out ${isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-90'
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <h1
                              className="text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] font-black uppercase leading-[0.9] select-none transition-colors duration-300"
                              style={{
                                WebkitTextStroke: isActive ? '0px' : '1.5px rgba(255,255,255,0.2)',
                                color: isActive ? '#ffffff' : 'transparent',
                              }}
                            >
                              {pillar.name}
                            </h1>
                          </div>

                          <div
                            className={`overflow-hidden transition-all duration-300 ease-out ${isActive ? 'h-8 md:h-12 opacity-100' : 'h-0 opacity-0'
                              }`}
                          >
                            <span className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-500 ml-1 block mt-1 md:mt-3">
                              ARCHITECTURE // {pillar.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LAYER 4: THE HOLOGRAPHIC RENDERED ARTIFACT */}
            <div
              className="w-full lg:w-2/5 flex items-center justify-end relative z-30 min-h-[400px]"
            >
              {/* CYBERPUNK VIEWPORT WINDOW FRAME */}
              <div className="w-full max-w-lg relative bg-[#070708] border border-white/10 p-1 sm:p-2 shadow-[0_0_50px_rgba(255,158,0,0.02)]">
                {/* Tech Corner Brackets */}
                <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-[#ff9e00]"></div>
                <div className="absolute -top-[2px] -right-[2px] w-4 h-4 border-t-2 border-r-2 border-[#ff9e00]"></div>
                <div className="absolute -bottom-[2px] -left-[2px] w-4 h-4 border-b-2 border-l-2 border-[#ff9e00]"></div>
                <div className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2 border-[#ff9e00]"></div>

                {/* Mock OS Header Bar */}
                <div className="w-full flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-black/40 font-mono text-[9px] text-neutral-500 mb-3 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                    <span className="ml-2 uppercase tracking-widest text-white/40">CORE_MONITOR.sys</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>BUFF: 99.4%</span>
                    <span className="animate-pulse text-[#ff9e00]">● LIVE</span>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full relative h-[400px] lg:h-[450px] overflow-hidden bg-black/30">
                  {PILLARS.map((pillar, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <motion.div
                        key={pillar.id}
                        translate="no"
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          y: isActive ? 0 : (activeIndex > idx ? -30 : 30),
                          scale: isActive ? 1 : 0.96,
                          pointerEvents: isActive ? 'auto' : 'none',
                          visibility: isActive ? 'visible' : 'hidden'
                        }}
                        transition={{ duration: 0.5, ease: EASE }}
                        style={{ willChange: "transform, opacity" }}
                        className="w-full absolute inset-0 flex flex-col justify-center p-3 sm:p-5"
                      >
                        {pillar.renderComponent('desktop', isActive)}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Viewport Footer */}
                <div className="w-full flex justify-between items-center px-3 py-1.5 border-t border-white/5 bg-black/40 font-mono text-[8px] text-neutral-500 select-none mt-2">
                  <span className="tracking-widest uppercase">SYS_REF: {activePillar.id.toUpperCase()}</span>
                  <span>OP_CODE: 0x8F92</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
