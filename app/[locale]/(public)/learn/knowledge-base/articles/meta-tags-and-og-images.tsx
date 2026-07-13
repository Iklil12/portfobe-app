import React from 'react';

export default function MetaTagsAndOgImages() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>When you drop your portfolio link in a chat or on social media, you want it to look stunning. This is controlled by Open Graph (OG) meta tags.</p>
            <h3 className="text-2xl font-display uppercase text-white font-bold mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">Setting your OG Image</h3>
            <p>In your dashboard SEO settings, you can upload a specific "Social Share Image". We recommend a resolution of 1200x630 pixels. Make sure the most important visual elements are centered, as some platforms (like WhatsApp) crop the edges into a square.</p>
        </div>
    );
}
