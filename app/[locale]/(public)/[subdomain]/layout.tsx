// app/[subdomain]/layout.tsx
import React from 'react';
import { Metadata } from 'next';
import { Space_Grotesk, Ubuntu, Playfair_Display } from 'next/font/google';
import { getPortfolioData } from '@/features/portfolio/model/portfolioService';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const ubuntu = Ubuntu({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-ubuntu', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

function getOptimizedFavicon(url: string | null | undefined) {
  if (!url) return '/favicon.ico';
  // Jika URL berasal dari Cloudinary, tambahkan parameter crop & resize agar jadi lingkaran sempurna (r_max, f_png)
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/c_fill,g_face,w_128,h_128,r_max,f_png/');
  }
  // Jika URL dari Google, tambahkan parameter resize =s128-c
  if (url.includes('googleusercontent.com') && !url.includes('=s')) {
    return url + '=s128-c';
  }
  return url;
}

// 1. DYNAMIC SEO METADATA: Bintang utama untuk membuka mata Google dan WhatsApp
export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const subdomain = resolvedParams.subdomain.trim().toLowerCase();

  // JANGAN biarkan Intercepting Route galeri aktif jika kita sedang berada di dashboard
  const isDashboard = subdomain === 'dashboard' || subdomain === 'settings' || subdomain === 'api';
  if (isDashboard) {
    return { title: 'Portfobe' };
  }

  let user = null;
  try {
    user = await getPortfolioData(subdomain);
  } catch (error) {
    console.error("🔥 REDIS/DATABASE CONNECTION ERROR IN METADATA:", error);
  }

  if (!user || !user.profile) {
    return {
      title: 'Portfolio Not Found',
    };
  }

  // Parse customTexts from SiteAppearance to check for custom SEO settings
  let customSeo: any = {};
  if (user.siteAppearance?.customTexts) {
    try {
      customSeo = JSON.parse(user.siteAppearance.customTexts);
    } catch (e) {
      console.error('Failed to parse customTexts for SEO', e);
    }
  }

  const name = user.profile.fullName || subdomain;
  const profession = user.profile.profession || 'Creative Professional';
  
  // SEO Logic: Use custom SEO if available, otherwise fallback to Profile data
  const finalTitle = customSeo.seo_title || `${name} - ${profession}`;
  const finalDescription = customSeo.seo_description || user.profile.bio || `Welcome to the creative portfolio of ${name}, a ${profession}. Explore my latest works and experiences.`;
  const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://portfo.be';
  const canonicalUrl = `${domain}/${subdomain}`;
  
  const optimizedIcon = getOptimizedFavicon(user.profile.avatarUrl);
  const ogImage = user.profile.avatarUrl || `${domain}/default-og-image.jpg`;
  
  return {
    metadataBase: new URL(domain),
    title: {
      default: finalTitle,
      template: `%s | ${name}`,
    },
    description: finalDescription,
    keywords: [name, profession, 'Portfolio', 'Creative', 'Portfobe', subdomain],
    authors: [{ name }],
    creator: name,
    publisher: name,
    category: 'portfolio',
    other: user.profile.location ? {
      'geo.placename': user.profile.location,
    } : {},
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: optimizedIcon,
      shortcut: optimizedIcon,
      apple: optimizedIcon,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: `${name} Portfolio`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [ogImage],
      creator: `@${subdomain}`,
    },
  };
}

export default async function SubdomainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const resolvedParams = await params;
  const subdomain = resolvedParams.subdomain;

  // JANGAN biarkan Intercepting Route galeri aktif jika kita sedang berada di dashboard
  const isDashboard = subdomain === 'dashboard' || subdomain === 'settings' || subdomain === 'api';

  // Ambil data untuk injeksi JSON-LD Structured Data
  let user = null;
  if (!isDashboard) {
    try {
      user = await getPortfolioData(subdomain);
    } catch (error) {
      console.error("🔥 DATABASE CONNECTION ERROR IN SUBDOMAIN LAYOUT:", error);
      throw new Error("Failed to connect to database. Please check your internet connection, or make sure your current IP address is whitelisted in the database.");
    }
  }

  const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://portfo.be';

  let jsonLd = null;
  if (user && user.profile) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": user.profile.fullName || subdomain,
        "jobTitle": user.profile.profession || "Creative Professional",
        "description": user.profile.bio || `Portfolio of ${user.profile.fullName}`,
        "image": user.profile.avatarUrl || `${domain}/default-og-image.jpg`,
        "url": `${domain}/${subdomain}`,
        ...(user.profile.location && {
          "homeLocation": {
            "@type": "Place",
            "name": user.profile.location
          }
        })
      }
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className={`${spaceGrotesk.variable} ${ubuntu.variable} ${playfair.variable}`}>
        {children}
      </div>
    </>
  );
}
