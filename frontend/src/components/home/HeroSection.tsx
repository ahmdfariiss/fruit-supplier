import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';

const kpiData = [
  { value: '500+', label: 'Produk' },
  { value: '10K+', label: 'Pelanggan' },
  { value: '50+', label: 'Kota' },
];

export default function HeroSection() {
  return (
    <section
      className="min-h-screen bg-g6 grid grid-cols-1 md:grid-cols-2 px-[6%] pt-[130px] pb-20 gap-10 items-center relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Decorative gradient */}
      <div
        className="absolute -top-[200px] -right-[200px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(168,207,111,0.25) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <FadeIn direction="up" delay={0.1}>
          <h1
            id="hero-heading"
            className="font-lora text-[clamp(2.6rem,5.5vw,4.2rem)] font-semibold leading-[1.1] tracking-tight mb-6"
          >
            Buah Segar
            <br />
            <em className="italic bg-gradient-to-br from-g1 to-g3 bg-clip-text text-transparent">
              Langsung dari Kebun
            </em>
          </h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
          <p className="text-base text-muted leading-[1.75] max-w-[420px] mb-10">
            Platform buah segar terpercaya untuk konsumen dan reseller. Kualitas
            terjamin, harga bersaing, pengiriman cepat ke seluruh Indonesia.
          </p>
        </FadeIn>
        <FadeIn direction="up" delay={0.3}>
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
        </FadeIn>

        {/* KPI Strip */}
        <FadeIn direction="up" delay={0.4}>
          <div
            className="flex bg-white rounded-[20px] border border-faint overflow-hidden max-w-[380px] shadow-kpi"
            role="list"
            aria-label="Statistik BuahKita"
          >
            {kpiData.map((kpi, i) => (
              <div
                key={kpi.label}
                role="listitem"
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
        </FadeIn>
      </div>

      {/* Hero Right Collage — real images */}
      <div
        className="hidden md:grid grid-cols-2 grid-rows-2 gap-3.5 min-h-[480px]"
        aria-hidden="true"
      >
        <FadeIn direction="left" delay={0.2} className="row-span-2 rounded-[22px] overflow-hidden relative shadow-lg">
          <Image
            src="/images/hero/heroimage1.jpg"
            alt="Buah segar pilihan BuahKita"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </FadeIn>
        <FadeIn direction="left" delay={0.4} className="rounded-[22px] overflow-hidden relative shadow-lg">
          <Image
            src="/images/hero/HeroImage.png"
            alt="Aneka buah segar"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 20vw"
            priority
          />
        </FadeIn>
        <FadeIn direction="left" delay={0.6} className="rounded-[22px] overflow-hidden relative shadow-lg">
          <Image
            src="/images/hero/HeroImage2.png"
            alt="Buah tropis berkualitas"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        </FadeIn>
      </div>
    </section>
  );
}
