import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mode Standalone: WAJIB untuk Coolify/Docker agar ukuran image susut drastis & efisien RAM
  output: 'standalone',
  reactStrictMode: false,

  // Dukungan kompilasi untuk package native (menghindari error serverless)
  serverExternalPackages: ['bcrypt', 'html-encoding-sniffer', 'jsdom', 'isomorphic-dompurify', '@exodus/bytes'],


  // Konfigurasi optimalisasi gambar untuk CDN eksternal
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'vumbnail.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Konfigurasi Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Mencegah Clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Mencegah kerentanan MIME-sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Privasi referer yang lebih aman
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload', // Memaksa HTTPS
          },
        ],
      },
    ];
  },
};

export default nextConfig;
