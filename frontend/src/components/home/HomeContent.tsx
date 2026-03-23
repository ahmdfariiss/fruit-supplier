'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import api from '@/lib/api';

// Dynamically load below-fold heavy components
const BannerSlider = dynamic(() => import('@/components/home/BannerSlider'), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl bg-g5 aspect-[21/9] md:aspect-[3/1] animate-pulse" />
  ),
});

const FeaturedProducts = dynamic(() => import('@/components/home/FeaturedProducts'), {
  ssr: false,
  loading: () => (
    <div className="py-[90px] px-[6%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-g5 rounded-[22px] h-[320px] animate-pulse" />
        ))}
      </div>
    </div>
  ),
});

const TestimonialSection = dynamic(
  () => import('@/components/home/TestimonialSection'),
  { ssr: false }
);

export default function HomeContent() {
  const { data: banners } = useQuery({
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
      {banners && banners.length > 0 && (
        <section className="py-10 px-[6%]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
            <BannerSlider banners={banners} />
            {banners.length > 1 && (
              <div className="rounded-[22px] bg-ink border-2 border-dashed border-white/[0.18] flex items-center justify-center h-[150px] text-center cursor-pointer hover:border-g4 hover:shadow-card transition-all overflow-hidden">
                <div>
                  <span className="text-2xl block mb-1">📢</span>
                  <span className="text-white/80 text-[0.78rem] font-bold">
                    Banner Promo
                  </span>
                </div>
              </div>
            )}
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
