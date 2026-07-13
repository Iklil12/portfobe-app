import React from 'react';

export default function UnderstandingThemeEditor() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>Our Theme Editor separates design from content, ensuring your portfolio never breaks visually no matter what you upload.</p>
            <h3 className="text-2xl font-display uppercase text-white font-bold mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">The Brutalist Paradigm</h3>
            <p>Unlike traditional builders, our core themes lean into modern Brutalism—sharp edges, high contrast, and bold typography. Don't be afraid of empty whitespace; let your work breathe.</p>
            <div className="p-6 bg-white/5 border border-white/10 mt-8">
                <strong className="text-[#ff9e00] font-mono text-sm uppercase tracking-widest block mb-2">Live Preview Engine</strong>
                <p className="m-0 text-base">Any changes made in the Appearance tab are saved as a "Draft". They will not affect your live site until you explicitly hit the "Publish Theme" button.</p>
            </div>
        </div>
    );
}
