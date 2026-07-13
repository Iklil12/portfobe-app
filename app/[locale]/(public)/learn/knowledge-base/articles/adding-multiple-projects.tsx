import React from 'react';

export default function AddingMultipleProjects() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>When presenting your work, quality always trumps quantity. However, organizing multiple projects effectively is crucial for a professional portfolio.</p>
            <h3 className="text-2xl font-display uppercase text-white font-bold mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">1. The Rule of Three</h3>
            <p>Top agencies recommend showing your 3-6 best projects. Anything more, and you risk diluting your strongest work. Put your absolute best project first, and your second-best project last (the recency effect).</p>
            <h3 className="text-2xl font-display uppercase text-white font-bold mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">2. Categorization Strategy</h3>
            <p>Use tags effectively. Instead of vague tags like "Design", use specific niches like "Fintech UI", "Brand Identity", or "Motion Graphics". This helps recruiters find exactly what they are looking for.</p>
            <div className="p-6 bg-white/5 border border-white/10 mt-8">
                <strong className="text-[#ff9e00] font-mono text-sm uppercase tracking-widest block mb-2">Pro Tip</strong>
                <p className="m-0 text-base">You can easily reorder your projects in the dashboard by dragging and dropping them. The live preview will update instantly.</p>
            </div>
        </div>
    );
}
