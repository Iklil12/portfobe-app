"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Typography List (using same fonts as other themes for consistency, but focusing on strict ones)
const FONT_OPTIONS = [
    { id: 'Instrument Sans', name: 'Instrument Sans', class: 'font-sans' },
    { id: 'Inter', name: 'Inter', class: 'font-sans' },
    { id: 'Space Grotesk', name: 'Space Grotesk', class: 'font-sans' },
    { id: 'Oswald', name: 'Oswald', class: 'font-sans' }, // Good for brutalism
    { id: 'Bebas Neue', name: 'Bebas Neue', class: 'font-sans' }, // Good for brutalism
];

export default function AbsoluteNoirControls({ theme, updateTheme }: { theme: any, updateTheme: (key: string, value: any) => void }) {
    const activeFont = theme?.fontHeading || 'Instrument Sans';

    return (
        <div className="space-y-8 animate-fade-in text-black">

            {/* STRICT MODE WARNING */}
            <div className="p-4 border-2 border-black bg-gray-100 flex items-start gap-3">
                <i className="fas fa-exclamation-triangle mt-1"></i>
                <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest mb-1">Strict Mode Active</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Absolute Noir enforces a pure grayscale, high-contrast brutalist design. Color palettes and rounded corners are strictly disabled to maintain its stark aesthetic.
                    </p>
                </div>
            </div>

            {/* TYPOGRAPHY CONTROL */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm">System Font</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Sans-Serif</span>
                </div>
                <div className="space-y-2">
                    {FONT_OPTIONS.map((font) => (
                        <button
                            key={font.id}
                            onClick={() => {
                                updateTheme('fontHeading', font.id);
                                updateTheme('fontBody', font.id);
                            }}
                            className={`w-full flex items-center justify-between p-4 border transition-all ${
                                activeFont === font.id
                                    ? 'border-black bg-black text-white shadow-sm'
                                    : 'border-gray-200 hover:border-black text-black'
                            }`}
                        >
                            <span className="font-medium text-sm">{font.name}</span>
                            {activeFont === font.id && (
                                <i className="fas fa-check text-xs"></i>
                            )}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
