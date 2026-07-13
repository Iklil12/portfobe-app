import type { Metadata } from "next";
import "./globals.css";
import './fonts.css';
import { Providers } from "./providers";
import { Inter, Space_Grotesk, Ubuntu, Space_Mono, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono', display: 'swap' });

export const metadata: Metadata = {
  title: "Portfo.be: Instant Visual & Creative Portfolio Builder",
  description: "Want a stunning portfolio? Build professional portfolio websites for photographers, videographers, 3D designers, web developers, and visual artists. Elegant templates, responsive, and SEO-friendly. Go live in minutes without coding!",
  keywords: [
    "photographer portfolio",
    "videographer portfolio",
    "3d designer portfolio",
    "online portfolio builder",
    "creative portofolio builder",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Portfo.be",
    "operatingSystem": "Web Browser",
    "applicationCategory": "DesignApplication",
    "description": "Portofolio builder specifically designed for the creative industry: Photographers, Videographers, 3D Designers, Visual Artists, & Web Developers.",
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
      lang={locale}
      className={`h-full antialiased font-sans ${inter.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script dangerouslySetInnerHTML={{__html: `
          try {
            var sub = window.location.hostname === 'localhost' 
              ? window.location.pathname.split('/')[1] 
              : window.location.hostname.split('.')[0];
            if (sessionStorage.getItem('_pfIntroPlayed_' + sub)) {
              var style = document.createElement('style');
              style.innerHTML = '.splash-screen { display: none !important; opacity: 0 !important; pointer-events: none !important; }';
              document.head.appendChild(style);
            }
          } catch(e) {}
        `}} />

      </head>
      <body className="min-h-full flex flex-col text-gray-900 bg-white transition-colors duration-300 overflow-x-clip w-full relative" suppressHydrationWarning>
        <Providers>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}