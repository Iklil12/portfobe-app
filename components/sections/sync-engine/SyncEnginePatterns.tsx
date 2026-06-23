"use client";

import React, { memo } from 'react';

export const GitHubPattern = memo(function GitHubPattern() {
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

export const PenpotPattern = memo(function PenpotPattern() {
  return (
    <svg className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-28 sm:h-28 opacity-40 pointer-events-none" viewBox="0 0 100 100">
      <path d="M0 100 Q 25 50 50 75 T 100 25" stroke="#10b981" strokeWidth="3" fill="none" className="penpot-path" />
      <path d="M0 120 Q 25 70 50 95 T 100 45" stroke="#10b981" strokeWidth="3" fill="none" className="penpot-path" />
      <path d="M0 140 Q 25 90 50 115 T 100 65" stroke="#10b981" strokeWidth="3" fill="none" className="penpot-path" />
    </svg>
  );
});

export const CanvaPattern = memo(function CanvaPattern() {
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

export const AIPattern = memo(function AIPattern() {
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
