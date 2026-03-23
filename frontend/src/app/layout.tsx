import type { Metadata, Viewport } from 'next';
import { Lora, DM_Sans } from 'next/font/google';

import './globals.css';
import { Providers } from '@/components/Providers';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#2d5a00',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'BuahKita — Segar dari Kebun',
    template: '%s | BuahKita',
  },
  description:
    'Platform e-commerce buah segar yang menghubungkan supplier dengan konsumen dan reseller. Buah segar langsung dari kebun dengan harga terbaik.',
  keywords: [
    'buah segar',
    'supplier buah',
    'reseller buah',
    'buah online',
    'grosir buah',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${lora.variable} ${dmSans.variable}`}>
      <body className="font-cabinet bg-cream text-ink antialiased">
        <a href="#main-content" className="skip-link">
          Langsung ke konten utama
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}