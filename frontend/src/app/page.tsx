import { Suspense } from 'react';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import Ticker from '@/components/home/Ticker';
import WhyUsSection from '@/components/home/WhyUsSection';
import HowToOrder from '@/components/home/HowToOrder';
import ImpactCounter from '@/components/home/ImpactCounter';
import ResellerBand from '@/components/home/ResellerBand';
import HomeContent from '@/components/home/HomeContent';
import HeroSection from '@/components/home/HeroSection';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <>
      {/* Navbar rendered eagerly — server-side */}
      <Navbar />

      {/* Hero section is a pure server component — rendered immediately */}
      <HeroSection />

      <main id="main-content">
        {/* Dynamic content (banners, featured products, testimonials) */}
        <Suspense
          fallback={
            <div className="py-10 px-[6%]">
              <div className="rounded-3xl bg-g5 aspect-[21/9] md:aspect-[3/1] animate-pulse mb-10" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-g5 rounded-[22px] h-[320px] animate-pulse" />
                ))}
              </div>
            </div>
          }
        >
          <HomeContent />
        </Suspense>

        {/* ═══ TICKER ═══ */}
        <Ticker />

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
