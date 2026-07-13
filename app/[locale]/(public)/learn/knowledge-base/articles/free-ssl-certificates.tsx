import React from 'react';

export default function FreeSslCertificates() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>Security is non-negotiable. Portfo.be automatically provisions and renews SSL/TLS certificates for every custom domain connected to our platform.</p>
            <p>Once your DNS records have propagated successfully, our system requests a certificate from Let's Encrypt. This process usually takes less than 30 seconds. You do not need to upload custom CRT or KEY files.</p>
            <p>If your domain shows a "Not Secure" warning after 24 hours of connecting it, please verify your DNS records and contact support.</p>
        </div>
    );
}
