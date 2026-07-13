import React from 'react';

export default function UnderstandingTheDashboard() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>The Portfo.be dashboard is designed for speed and efficiency. We eliminated deep menus and hidden settings so you can manage your site faster.</p>
            <h3 className="text-2xl font-display uppercase text-white font-bold mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">The Overview Tab</h3>
            <p>Here you'll find your real-time analytics, recent form submissions, and a quick glance at your storage usage. This is your command center.</p>
            <h3 className="text-2xl font-display uppercase text-white font-bold mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">Keyboard Shortcuts</h3>
            <p>We built Portfo.be for power users. Try hitting <kbd className="bg-black border border-white/20 px-2 py-1 mx-1 font-mono text-sm text-white">CMD/CTRL + E</kbd> anywhere to instantly open the Theme Editor, or <kbd className="bg-black border border-white/20 px-2 py-1 mx-1 font-mono text-sm text-white">CMD/CTRL + P</kbd> to add a new project.</p>
        </div>
    );
}
