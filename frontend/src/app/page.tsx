'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BannerSlider from '@/components/home/BannerSlider';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TestimonialSection from '@/components/home/TestimonialSection';
import Ticker from '@/components/home/Ticker';
import WhyUsSection from '@/components/home/WhyUsSection';
import HowToOrder from '@/components/home/HowToOrder';
import ImpactCounter from '@/components/home/ImpactCounter';
import ResellerBand from '@/components/home/ResellerBand';
import Link from 'next/link';

export default function HomePage() {
  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data } = await api.get('/banners?active=true');
      return data.data;
    },
  });

  return (
    <>
      <Navbar />
      <main>
        {/* ═══ HERO ═══ */}
        <section className="min-h-screen bg-g6 grid grid-cols-1 md:grid-cols-2 px-[6%] pt-[130px] pb-20 gap-10 items-center relative overflow-hidden">
          <div className="absolute -top-[200px] -right-[200px] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(168,207,111,0.25)_0%,transparent_65%)] pointer-events-none" />

          <div className="relative z-10">
            <h1 className="font-lora text-[clamp(2.6rem,5.5vw,4.2rem)] font-semibold leading-[1.1] tracking-tight mb-6">
              Buah Segar
              <br />
              <em className="italic bg-gradient-to-br from-g1 to-g3 bg-clip-text text-transparent">
                Langsung dari Kebun
              </em>
            </h1>
            <p className="text-base text-muted leading-[1.75] max-w-[420px] mb-10">
              Platform buah segar terpercaya untuk konsumen dan reseller.
              Kualitas terjamin, harga bersaing, pengiriman cepat ke seluruh
              Indonesia.
            </p>
            <div className="flex items-center gap-3.5 flex-wrap mb-12">
              <Link
                href="/products"
                className="bg-g1 text-white py-[15px] px-[30px] rounded-pill border-none text-[0.95rem] font-extrabold no-underline transition-all duration-300 shadow-[0_4px_24px_rgba(45,90,0,0.35)] hover:-translate-y-[3px] hover:scale-[1.02] hover:shadow-hero"
              >
                Mulai Belanja
              </Link>
              <Link
                href="/about"
                className="bg-transparent text-ink py-[15px] px-[30px] rounded-pill border-2 border-ink/[0.12] text-[0.95rem] font-bold no-underline transition-all duration-200 hover:border-g2 hover:text-g2 hover:bg-g6"
              >
                Tentang Kami
              </Link>
            </div>

            {/* KPI Strip */}
            <div className="flex bg-white rounded-[20px] border border-faint overflow-hidden max-w-[380px] shadow-kpi">
              {[
                { value: '500+', label: 'Produk' },
                { value: '10K+', label: 'Pelanggan' },
                { value: '50+', label: 'Kota' },
              ].map((kpi, i) => (
                <div
                  key={i}
                  className={`flex-1 py-4 px-5 text-center ${i < 2 ? 'border-r border-faint' : ''}`}
                >
                  <strong className="block text-[1.4rem] font-black text-g1 tracking-tight">
                    {kpi.value}
                  </strong>
                  <span className="text-[0.7rem] text-muted font-semibold tracking-[0.03em] uppercase">
                    {kpi.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right Collage */}
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-3.5 min-h-[480px]">
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
      

        {/* ═══ WHY US ═══ */}
        <WhyUsSection />

        {/* ═══ TESTIMONIALS ═══ */}
        <TestimonialSection />

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
