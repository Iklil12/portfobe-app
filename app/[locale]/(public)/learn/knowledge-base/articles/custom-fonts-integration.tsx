import React from 'react';

export default function CustomFontsIntegration() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>Typography is the foundation of great design. While we provide a curated list of premium Google Fonts, Pro users can upload their own typography.</p>
            <p>To ensure maximum compatibility and performance, we highly recommend uploading <code>.woff2</code> font files. They are significantly smaller than standard <code>.ttf</code> or <code>.otf</code> files, ensuring your portfolio remains blazing fast.</p>
            <p>If you have an Adobe Creative Cloud subscription, you can also paste your Adobe Fonts Web Project ID directly into the Theme Editor to sync your fonts instantly.</p>
        </div>
    );
}
