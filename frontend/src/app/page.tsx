import { Suspense } from 'react';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import Ticker from '@/components/home/Ticker';
import WhyUsSection from '@/components/home/WhyUsSection';
import HowToOrder from '@/components/home/HowToOrder';
import ImpactCounter from '@/components/home/ImpactCounter';
import ResellerBand from '@/components/home/ResellerBand';
import HomeContent from '@/components/home/HomeContent';

export default function HomePage() {
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

      <main id="main-content">
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