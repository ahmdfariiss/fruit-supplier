<<<<<<< HEAD
import { Suspense } from 'react';
import Link from 'next/link';
=======
import Navbar from '@/components/layout/Navbar';
>>>>>>> origin/feature/fe-admin-panel
import Footer from '@/components/layout/Footer';
import Ticker from '@/components/home/Ticker';
import WhyUsSection from '@/components/home/WhyUsSection';
import HowToOrder from '@/components/home/HowToOrder';
import ImpactCounter from '@/components/home/ImpactCounter';
import ResellerBand from '@/components/home/ResellerBand';
import HomeContent from '@/components/home/HomeContent';

<<<<<<< HEAD
export default function HomePage() {
=======
export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function getBannersAndProducts() {
  try {
    const [bannersRes, productsRes] = await Promise.all([
      fetch(`${BASE_URL}/banners`, { next: { revalidate: 60 } }),
      fetch(`${BASE_URL}/products?featured=true`, { next: { revalidate: 60 } }),
    ]);
    const bannersData = bannersRes.ok ? await bannersRes.json() : { data: [] };
    const productsData = productsRes.ok ? await productsRes.json() : { data: [] };
    return {
      banners: bannersData.data || [],
      featuredProducts: productsData.data || [],
    };
  } catch {
    return { banners: [], featuredProducts: [] };
  }
}

export default async function HomePage() {
  const { banners, featuredProducts } = await getBannersAndProducts();

>>>>>>> origin/feature/fe-admin-panel
  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen bg-g6 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <span className="text-5xl block mb-4">🍊</span>
            <span className="text-muted font-semibold">Memuat...</span>
          </div>
        </div>
      }>
        <HomeContent />
      </Suspense>

<<<<<<< HEAD
      <main id="main-content">
        {/* ═══ TICKER ═══ */}
        <Ticker />

=======
          {/* Hero Right Collage */}
          <div className="grid grid-cols-2 grid-rows-2 gap-3.5 min-h-[480px]">
            <div className="row-span-2 rounded-[22px] bg-g5 border-2 border-dashed border-g4 flex items-center justify-center overflow-hidden hover:border-g2 hover:shadow-card transition-all cursor-pointer">
              <div className="text-center p-5">
                <span className="text-5xl block mb-2">🍊</span>
                <span className="text-[0.82rem] font-extrabold text-g1">
                  Hero Image
                </span>
                <p className="text-[0.72rem] text-muted mt-1 max-w-[160px] leading-[1.5]">
                  Ganti dengan foto buah segar hero
                </p>
              </div>
            </div>
            <div className="rounded-[22px] bg-g5 border-2 border-dashed border-g4 flex items-center justify-center overflow-hidden hover:border-g2 hover:shadow-card transition-all cursor-pointer">
              <span className="text-3xl">🍎</span>
            </div>
            <div className="rounded-[22px] bg-g5 border-2 border-dashed border-g4 flex items-center justify-center overflow-hidden hover:border-g2 hover:shadow-card transition-all cursor-pointer">
              <span className="text-3xl">🥭</span>
            </div>
          </div>
        </section>

        {/* ═══ BANNER STRIP ═══ */}
        {banners && banners.length > 0 && (
          <section className="py-10 px-[6%]">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
              <BannerSlider banners={banners} />
              {banners.length > 1 && (
                <div className="rounded-[22px] bg-ink border-2 border-dashed border-white/[0.18] flex items-center justify-center h-[150px] text-center cursor-pointer hover:border-g4 hover:shadow-card transition-all overflow-hidden">
                  <div>
                    <span className="text-2xl block mb-1">📢</span>
                    <span className="text-white/50 text-[0.78rem] font-bold">
                      Banner Promo
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ═══ TICKER ═══ */}
        <Ticker />

        {/* ═══ FEATURED PRODUCTS ═══ */}
        <FeaturedProducts products={featuredProducts} />

>>>>>>> origin/feature/fe-admin-panel
        {/* ═══ WHY US ═══ */}
        <WhyUsSection />

        {/* ═══ HOW TO ORDER ═══ */}
        <HowToOrder />

        {/* ═══ IMPACT COUNTER ═══ */}
        <ImpactCounter />

        {/* ═══ RESELLER BAND ═══ */}
        <ResellerBand />

        {/* ═══ CTA ═══ */}
        <section className="py-[90px] px-[6%] text-center bg-white">
          <div className="max-w-xl mx-auto">
            <div className="sec-ey justify-center">Mulai Sekarang</div>
            <h2 className="sec-title mb-4">
              Siap <em>Berbelanja?</em>
            </h2>
            <p className="text-muted mb-8 text-[0.9rem]">
              Bergabung dengan ribuan pelanggan yang sudah mempercayai BuahKita
              untuk kebutuhan buah segar mereka.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/auth/register"
                className="bg-g1 text-white py-3.5 px-8 rounded-pill font-extrabold text-[0.92rem] no-underline transition-all duration-200 shadow-btn hover:bg-g2 hover:-translate-y-0.5"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="/playground"
                className="bg-transparent text-ink py-3.5 px-8 rounded-pill font-bold text-[0.92rem] no-underline border-2 border-ink/10 transition-all duration-200 hover:border-g2 hover:text-g2 hover:bg-g6"
              >
                Coba Playground
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}