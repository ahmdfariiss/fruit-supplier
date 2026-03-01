import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

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
    <html lang="id" className={lora.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cabinet bg-cream text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
