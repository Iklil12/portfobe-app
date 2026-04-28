import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; 
import { Toaster } from 'react-hot-toast'; // <-- 1. Tambahkan import ini

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfo.be - Professional Portfolio",
  description: "Build your creative presence",
  icons: {
    icon: 'icon.svg', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col text-gray-900 bg-white">
        <Providers>
          {children}
          {/* 2. Pasang Toaster global di sini dengan z-index absolut dan margin top agar tidak tertutup Navbar */}
          <Toaster 
            position="top-center" 
            containerStyle={{ zIndex: 1000000 }}
            toastOptions={{ 
              className: 'z-[1000000]',
              style: { 
                zIndex: 1000000,
                marginTop: '20px'
              } 
            }} 
          />
        </Providers>
      </body>
    </html>
  );
}