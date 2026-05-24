"use client";

import React, { useState, useEffect } from 'react';

interface Meme {
  id: number;
  title: string;
  truth: string;
  painLevel: string;
  metricLabel: string;
  metricValue: string;
  fileSymbol: string;
}

const MEMES: Meme[] = [
  {
    id: 1,
    title: "The WebGL Debacle",
    truth: "Spent 3 weeks building a custom three.js WebGL scene for my hero header. Recruiters on mobile just see a black screen and a 'WebGL context lost' error.",
    painLevel: "FATAL (10/10)",
    metricLabel: "Time Wasted",
    metricValue: "21 Days",
    fileSymbol: "threejs_failure.log"
  },
  {
    id: 2,
    title: "Safari's Revenge",
    truth: "Wrote a custom CSS layout system from scratch to prove I'm a senior engineer. Spent 4 hours yesterday fixing container alignment because it broke exclusively on Safari.",
    painLevel: "SEVERE (8.5/10)",
    metricLabel: "Safari CSS Fixes",
    metricValue: "4 Hours",
    fileSymbol: "safari_must_die.css"
  },
  {
    id: 3,
    title: "Over-engineered Static Page",
    truth: "Configured a Kubernetes cluster, Docker containers, AWS CloudFront, and a multi-stage GitHub Actions CI/CD pipeline... for a static 3-page HTML portfolio.",
    painLevel: "MAXIMUM OVER-ENGINEERING",
    metricLabel: "Monthly Cloud Bill",
    metricValue: "$48.50 /mo",
    fileSymbol: "k8s_deployment.yaml"
  },
  {
    id: 4,
    title: "The Irony of Detail",
    truth: "My portfolio page prominently claims I am a 'Detail-Oriented Frontend Engineer', but the links to my GitHub and LinkedIn projects return a 404 Not Found error.",
    painLevel: "CRITICAL (9.9/10)",
    metricLabel: "HR Reaction",
    metricValue: "Facepalm",
    fileSymbol: "broken_links.json"
  },
  {
    id: 5,
    title: "Ancient History",
    truth: "Designed a stunning custom template. Haven't updated my projects list since 2023 because editing the raw React components, re-bundling, and deploying takes too much effort.",
    painLevel: "LAZINESS LEVEL: 100%",
    metricLabel: "Content Freshness",
    metricValue: "Ancient (3 yrs old)",
    fileSymbol: "stale_data.ts"
  },
  {
    id: 6,
    title: "The Font Flash",
    truth: "Carefully curated custom premium typography files. Visitors open the page and get a 3-second blinding flash of unstyled Times New Roman text while fonts load.",
    painLevel: "AESTHETIC CRASH (7.5/10)",
    metricLabel: "First Impression",
    metricValue: "Unprofessional",
    fileSymbol: "font_flicker.css"
  },
  {
    id: 7,
    title: "Spotify Rate Limit",
    truth: "Added a real-time Spotify API tracker widget to show recruiters what I'm listening to. Got rate-limited by Spotify, and now the entire landing page takes 6 seconds to render.",
    painLevel: "PERFORMANCE DEATH",
    metricLabel: "Lighthouse Score",
    metricValue: "18 / 100",
    fileSymbol: "spotify_overflow.log"
  }
];

export function MemeGeneratorSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeMeme = MEMES[currentIndex];

  const handleNextMeme = () => {
    setIsCompiling(true);
    setProgress(0);
  };

  useEffect(() => {
    if (!isCompiling) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % MEMES.length);
            setIsCompiling(false);
          }, 150);
          return 100;
        }
        return prev + 25; // 4 steps to complete
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isCompiling]);

  return (
    <section className="relative py-24 md:py-32 bg-[#050507] overflow-hidden border-y border-white/5">
      
      {/* Background CAD Blueprint Grid Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] opacity-60 pointer-events-none z-0" />
      
      {/* Soft background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#ff9e00]/[0.03] blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        {/* Header */}
        <div className="mb-12">
          <span className="px-3 py-1 text-[9px] font-bold tracking-widest text-[#ff9e00] bg-[#ff9e00]/10 border border-[#ff9e00]/20 rounded-full uppercase">
            The Portfolio Paradox
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-4 mb-3">
            Why building portfolios is a nightmare.
          </h2>
          <p className="text-white/40 text-xs md:text-sm max-w-lg mx-auto font-mono">
            Let's be honest. We've all over-engineered, broken styles, or abandoned our sites. Click below to compile a developer truth.
          </p>
        </div>

        {/* Developer Console Terminal Card */}
        <div className="bg-[#0b0c10] border-2 border-white/10 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden text-left max-w-2xl mx-auto mb-12">
          
          {/* Terminal Window Header Bar */}
          <div className="h-10 bg-white/[0.03] border-b border-white/10 flex items-center justify-between px-4">
            <div className="flex gap-1.5 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
            </div>
            <span className="font-mono text-[9px] text-white/30 tracking-widest select-none">
              ~/{activeMeme.fileSymbol}
            </span>
            <div className="w-8"></div>
          </div>

          {/* Terminal Body Content */}
          <div className="p-6 md:p-8 font-mono min-h-[220px] flex flex-col justify-between">
            {isCompiling ? (
              // Compiling/Loading State
              <div className="flex-1 flex flex-col justify-center items-center py-8">
                <span className="text-[10px] text-[#ff9e00] font-bold tracking-wider mb-3 animate-pulse">
                  COMPILING PORTFOLIO_TRUTH.TS...
                </span>
                <div className="w-64 h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#ff9e00] to-[#ffb700] rounded-full transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[8px] text-white/30 mt-2">
                  {progress}% - loading compiler tokens
                </span>
              </div>
            ) : (
              // Active Meme State
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[8px] text-[#ff9e00] uppercase font-bold tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff9e00] animate-ping"></span>
                    <span>Issue Detected: {activeMeme.title}</span>
                  </div>
                  
                  {/* The Quote */}
                  <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed">
                    "{activeMeme.truth}"
                  </p>
                </div>

                {/* Severity Metric Footer */}
                <div className="pt-4 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-3 text-[10px]">
                  <div>
                    <span className="text-white/30 block text-[8px] uppercase tracking-wider mb-0.5">Pain Severity</span>
                    <span className="text-red-400 font-bold uppercase">{activeMeme.painLevel}</span>
                  </div>
                  <div>
                    <span className="text-white/30 block text-[8px] uppercase tracking-wider mb-0.5">{activeMeme.metricLabel}</span>
                    <span className="text-white font-bold">{activeMeme.metricValue}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleNextMeme}
            disabled={isCompiling}
            className="px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#ff9e00] hover:text-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <i className={`fas fa-sync ${isCompiling ? 'animate-spin' : ''}`}></i>
            Compile Next Truth
          </button>
          
          <p className="text-[10px] text-white/30 font-mono">
            Press to reload simulator database
          </p>
        </div>

        {/* The Portfobe Solution pitch card */}
        <div className="mt-20 max-w-2xl mx-auto p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-left font-mono">
          <h4 className="text-[#ff9e00] text-xs font-bold uppercase tracking-wider mb-2">
            The Portfobe Alternative:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[10px] leading-relaxed text-white/50">
            <div className="space-y-2 border-r border-white/5 pr-0 md:pr-6">
              <span className="text-red-400 font-bold block">🚨 MANUAL PORTFOLIO</span>
              <ul className="list-disc list-inside space-y-1.5">
                <li>30+ hours of custom frontend CSS tweaking.</li>
                <li>Manual updates every time you push to Git.</li>
                <li>Fragile layout breaks on recruiter's mobile.</li>
                <li>Complex backend configuration & API calls.</li>
              </ul>
            </div>
            <div className="space-y-2 pl-0 md:pl-6">
              <span className="text-[#ff9e00] font-bold block">✨ PORTFOBE AUTOPILOT</span>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Zero setup. AI builds and coordinates layout.</li>
                <li>Auto-syncs code contribution & social updates.</li>
                <li>100% fluid, responsive grids on all screens.</li>
                <li>Hosting, domain, & analytics ready in 3 seconds.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
