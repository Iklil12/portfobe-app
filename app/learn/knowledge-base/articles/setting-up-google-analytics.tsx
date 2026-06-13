import React from 'react';

export default function SettingUpGoogleAnalytics() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>Knowing who visits your portfolio and which case studies they read is vital for improving your pitch.</p>
            <ol className="list-decimal pl-6 space-y-2 mt-4 font-mono text-sm">
                <li>Create a property in your Google Analytics dashboard.</li>
                <li>Copy your Measurement ID (it starts with <code>G-</code>).</li>
                <li>Go to Portfo.be Dashboard {'>'} Settings {'>'} SEO & Analytics.</li>
                <li>Paste your Measurement ID and hit Save.</li>
            </ol>
            <p className="mt-4">Portfo.be will automatically inject the optimized tracking script across your entire portfolio, respecting user privacy settings.</p>
        </div>
    );
}
