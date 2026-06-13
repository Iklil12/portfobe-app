import type { Metadata } from "next";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Providers } from "./providers";


export const metadata: Metadata = {
  title: "Portfo.be: Instant Visual & Creative Portfolio Builder",
  description: "Want a stunning portfolio? Build professional portfolio websites for photographers, videographers, 3D designers, web developers, and visual artists. Elegant templates, responsive, and SEO-friendly. Go live in minutes without coding!",
  keywords: [
    "photographer portfolio",
    "videographer portfolio",
    "3d designer portfolio",
    "online portfolio builder",
    "creative website builder",
    "visual portfolio templates",
    "web developer portfolio"
  ],
  authors: [{ name: "Iklilul Uyun" }],
  openGraph: {
    title: "Portfo.be - The Portfolio Platform for Creatives & Visual Artists",
    description: "Build a stunning visual portfolio for Photographers, Designers, Videographers & Developers without coding.",
    type: "website",
    url: "https://portfo.be",
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Portfo.be",
    "operatingSystem": "Web Browser",
    "applicationCategory": "DesignApplication",
    "description": "Website builder specifically designed for the creative industry: Photographers, Videographers, 3D Designers, Visual Artists, & Web Developers.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "156"
    }
  };

  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,500,700,400,900&f[]=satoshi@900,700,500,300,400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col text-gray-900 bg-white transition-colors duration-300 overflow-x-clip w-full relative" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}