'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import api from '@/lib/api';

// Dynamically load below-fold heavy components
const BannerSlider = dynamic(() => import('@/components/home/BannerSlider'), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl bg-g5 aspect-[16/7] sm:aspect-[5/2] lg:aspect-[3/1] max-h-[420px] animate-pulse" />
  ),
});

const FeaturedProducts = dynamic(
  () => import('@/components/home/FeaturedProducts'),
  {
    ssr: false,
    loading: () => (
      <div className="py-[90px] px-[6%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-g5 rounded-[22px] h-[320px] animate-pulse"
            />
          ))}
        </div>
      </div>
    ),
  },
);

const TestimonialSection = dynamic(
  () => import('@/components/home/TestimonialSection'),
  { ssr: false },
);

export default function HomeContent() {
  const { data: banners, isLoading: isBannersLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data } = await api.get('/banners?active=true');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data } = await api.get('/products?featured=true&limit=8');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <>
      {/* ═══ BANNER STRIP ═══ */}
      {isBannersLoading && (
        <section className="py-6 px-[6%]">
          <div className="mx-auto w-full max-w-[1180px] rounded-3xl bg-g5 aspect-[16/7] sm:aspect-[5/2] lg:aspect-[3/1] max-h-[420px] animate-pulse" />
        </section>
      )}

      {banners && banners.length > 0 && (
        <section className="py-6 px-[6%]">
          <div className="mx-auto w-full max-w-[1180px]">
            <BannerSlider banners={banners} />
          </div>
        </section>
      )}

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <FeaturedProducts products={featuredProducts || []} />

      {/* ═══ TESTIMONIALS ═══ */}
      <TestimonialSection />
    </>
  );
}
