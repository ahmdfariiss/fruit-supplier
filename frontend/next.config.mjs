/** @type {import('next').NextConfig} */
const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN;

const remotePatterns = [
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '5010',
    pathname: '/uploads/**',
  },
  {
    protocol: 'https',
    hostname: 'fruit-supplier.onrender.com',
    pathname: '/uploads/**',
  },
];

if (apiOrigin) {
  try {
    const parsed = new URL(apiOrigin);
    remotePatterns.push({
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      pathname: '/uploads/**',
    });
  } catch {
    // ignore invalid NEXT_PUBLIC_API_ORIGIN
  }
}

const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: [
      '@tanstack/react-query',
      'zustand',
      'zod',
      'axios',
      'react-hook-form',
      '@hookform/resolvers',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5010/uploads/:path*',
      },
    ];
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';

    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: isProd
              ? 'public, max-age=31536000, immutable'
              : 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isProd
              ? 'public, max-age=31536000, immutable'
              : 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
