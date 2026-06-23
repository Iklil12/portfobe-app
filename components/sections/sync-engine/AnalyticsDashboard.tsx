"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

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
      setLiveVisitors(prev => {
        const diff = Math.floor(Math.random() * 7) - 3;
        return Math.max(1400, Math.min(1600, prev + diff));
      });
      setSessionsCount(prev => prev + Math.floor(Math.random() * 4));
      setVisitorsCount(prev => prev + Math.floor(Math.random() * 2));

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
