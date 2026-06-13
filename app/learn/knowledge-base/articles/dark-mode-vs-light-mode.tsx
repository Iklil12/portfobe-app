import React from 'react';

export default function DarkModeVsLightMode() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>By default, Portfo.be themes respect the visitor's operating system preferences (System Theme). However, you might want your portfolio to always display in Dark Mode for that premium hacker aesthetic.</p>
            <h3 className="text-2xl font-display uppercase text-white font-bold mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">How to Lock Your Theme</h3>
            <ol className="list-decimal pl-6 space-y-2 mt-4 font-mono text-sm">
                <li>Go to Dashboard {'>'} Appearance</li>
                <li>Scroll down to "Global Styling"</li>
                <li>Find the "Theme Mode" dropdown</li>
                <li>Change it from "System" to "Force Dark" or "Force Light"</li>
                <li>Save and Publish</li>
            </ol>
        </div>
    );
}
