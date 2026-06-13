import React from 'react';

export default function HowToConnectCustomDomain() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>Ready to look professional? Ditch the <code>username.portfo.be</code> subdomain and connect your own top-level domain (e.g., <code>yourname.com</code>).</p>
            <h3 className="text-2xl font-display uppercase text-white font-bold mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">DNS Configuration</h3>
            <p>Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare) and add the following records:</p>
            <div className="bg-black border border-white/20 p-6 font-mono text-sm mt-4">
                <p className="mb-2"><span className="text-white/50">Type:</span> A Record</p>
                <p className="mb-2"><span className="text-white/50">Name:</span> @</p>
                <p className="mb-0"><span className="text-white/50">Value:</span> 76.76.21.21</p>
            </div>
            <p className="mt-4 text-sm text-white/60">Note: DNS propagation can take anywhere from 5 minutes to 24 hours depending on your registrar.</p>
        </div>
    );
}
