﻿
import "@/styles/globals.css";
// @fitur ApolloProvider dan client dipindahkan ke Providers client component
import Providers from '@/components/Providers';

// @seo Metadata untuk SEO dan social sharing
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'SmoethieVibe - Fresh Smoothies & Healthy Food',
    template: '%s | SmoethieVibe',
  },
  description: 'SmoethieVibe offers fresh smoothies, healthy food, and a cozy cafe vibe in Kudus. Order online for delivery or visit us for a premium dining experience.',
  keywords: ['smoothie', 'healthy food', 'cafe', 'kudus', 'fresh juice', 'nongkrong', 'kuliner kudus'],
  authors: [{ name: 'SmoethieVibe Team' }],
  creator: 'SmoethieVibe',
  publisher: 'SmoethieVibe',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'SmoethieVibe - Fresh Smoothies & Healthy Food',
    description: 'Discover the best smoothies and healthy meals in Kudus at SmoethieVibe.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://smoethievibes.com',
    siteName: 'SmoethieVibe',
    
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmoethieVibe - Fresh Smoothies & Healthy Food',
    description: 'Fresh smoothies and healthy menu from SmoethieVibe. Visit us in Kudus!',
    images: ['/Landing/kasir1.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// @komponen Root layout: server component menyediakan metadata dan static content
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}