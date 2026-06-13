import React from 'react';

export default function UploadingHighResAssets() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>Your portfolio is only as good as the images you upload. While we compress assets for web delivery, starting with high-quality sources is essential.</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Images:</strong> We recommend WebP or JPG formats. Keep file sizes under 2MB for ultra-fast loading, but ensure a minimum width of 1920px for retina displays.</li>
                <li><strong>Videos:</strong> Upload MP4 files encoded with H.264. Avoid MOV files as they are not supported by all web browsers natively.</li>
            </ul>
            <p>Portfo.be uses an edge CDN to deliver your assets, ensuring they load instantly for visitors anywhere in the world.</p>
        </div>
    );
}
